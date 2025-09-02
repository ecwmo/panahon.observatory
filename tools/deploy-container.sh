#!/bin/bash

set -euo pipefail

ENGINE="podman"
REGISTRY="ghcr.io"
PLATFORM="linux/amd64,linux/arm64"
TAG_SUFFIX=""
USERNAME=""
IMG_NAME=""
BUILD_MODE="production"
LOCAL_BUILD=false
PUSH_BUILD=false
SKIP_BUILD=false

if ! command -v jq &>/dev/null; then
  echo "Error: jq is required to parse package.json but not found."
  exit 1
fi

function usage() {
  cat <<EOF
Usage: $0 [options]

Options:
  -n, --image-name=IMAGE  Specify image name (default from package.json)
  -U, --user=USERNAME     Container registry username (required)
  -l, --local             Build locally only, no pushing or multi-arch manifest
  -m, --mode              Build mode (default: "production")
  -p, --push              Push built images and manifests to the registry
  -D, --docker            Use docker instead of podman
  --registry=REGISTRY     Container registry hostname (default: ghcr.io)
  --platform=PLATFORMS    Comma-separated list of target platforms (default: linux/amd64,linux/arm64)
  --suffix=SUFFIX         Tag suffix (appended as a suffix to the current date)
  -h, --help              Show this help message and exit

Examples:
  $0 --local --suffix=beta
  $0 --docker
EOF
  exit 1
}

while [[ $# -gt 0 ]]; do
  case $1 in
  -l | --local)
    LOCAL_BUILD=true
    shift
    ;;
  -m)
    if [[ -n "${2:-}" ]]; then
      BUILD_MODE="$2"
      shift 2
    else
      echo "Error: -m requires a valid build mode"
      usage
    fi
    ;;
  --mode=*)
    BUILD_MODE="${1#*=}"
    shift
    ;;
  -D | --docker)
    ENGINE="docker"
    shift
    ;;
  -p | --push)
    PUSH_BUILD=true
    shift
    ;;
  --registry=*)
    REGISTRY="${1#*=}"
    shift
    ;;
  -n | --image-name=*)
    IMG_NAME="${1#*=}"
    shift
    ;;
  -U)
    if [[ -n "${2:-}" ]]; then
      USERNAME="$2"
      shift 2
    else
      echo "Error: -U requires a username argument"
      usage
    fi
    ;;
  --user=*)
    USERNAME="${1#*=}"
    shift
    ;;
  --suffix=*)
    TAG_SUFFIX="${1#*=}"
    shift
    ;;
  --platform=*)
    PLATFORM="${1#*=}"
    shift
    ;;
  -h | --help) usage ;;
  *)
    echo "Unknown argument: $1"
    usage
    ;;
  esac
done

if [[ -z "${IMG_NAME}" ]]; then
  if [[ -f "package.json" ]]; then
    IMG_NAME=$(jq -r '.name' package.json)
    if [[ "${IMG_NAME}" == "null" || -z "${IMG_NAME}" ]]; then
      IMG_NAME=""
      echo "Error: Image name is not set. Provide --image-name or set 'name' in package.json."
      exit 1
    fi
  fi
fi

if [[ -f "package.json" ]]; then
  PKG_VER=$(jq -r '.version' package.json)
  if [[ "$PKG_VER" == "null" || -z "$PKG_VER" ]]; then
    PKG_VER=""
  fi
fi

if [[ -z "$USERNAME" ]]; then
  echo "Error: Username is required via -U or --user"
  exit 1
fi

BASE_TAG="${REGISTRY}/${USERNAME}/${IMG_NAME}"
DATE_STR="$(date +%Y%m%d)"

VER_TAG="${DATE_STR}"
if [[ -n "${PKG_VER}" ]]; then
  VER_TAG="${PKG_VER}-${VER_TAG}"
fi
if [[ -n "$TAG_SUFFIX" ]]; then
  VER_TAG="${VER_TAG}-${TAG_SUFFIX}"
fi

LATEST_TAG="${BASE_TAG}:latest"
if [[ -n "$TAG_SUFFIX" ]]; then
  LATEST_TAG="${BASE_TAG}:latest-${TAG_SUFFIX}"
fi

FULL_TAG="${BASE_TAG}:${VER_TAG}"

if [[ "$LOCAL_BUILD" == true ]]; then
  echo "Performing local build with ${ENGINE}..."
  "${ENGINE}" build -t "${LATEST_TAG}" -t "${FULL_TAG}" .
else
  if [[ "${ENGINE}" == "docker" ]]; then
    echo "Ensuring Docker buildx builder is ready..."
    if ! docker buildx inspect buildx-builder &>/dev/null; then
      docker buildx create --use --name buildx-builder
    else
      docker buildx use buildx-builder
    fi
    docker buildx inspect --bootstrap

    if [[ "${PUSH_BUILD}" == true ]]; then
      PUSH_FLAG="--push"
    else
      PUSH_FLAG=""
    fi

    echo "Running multi-arch build and push with Docker buildx..."
    docker buildx build --platform "${PLATFORM}" \
      "${PUSH_FLAG}" \
      -t "${LATEST_TAG}" \
      -t "${FULL_TAG}" \
      .
  else
    if podman images --filter "reference=${FULL_TAG}" --format "{{.Repository}}:{{.Tag}}" | grep -q "^${FULL_TAG}$"; then
      echo "Local manifest ${FULL_TAG} exists. Skipping build."
      SKIP_BUILD=true
    fi

    if [[ "${SKIP_BUILD}" == false ]]; then
      podman manifest rm "${FULL_TAG}" 2>/dev/null || true
      podman manifest create "${FULL_TAG}"

      podman build --platform "${PLATFORM}" \
        --manifest "${FULL_TAG}" \
        --build-arg MODE="${BUILD_MODE}" \
        .
    fi

    podman tag "${FULL_TAG}" "${LATEST_TAG}"

    if [[ "${PUSH_BUILD}" == true ]]; then
      echo "Pushing manifest and images to registry..."
      podman manifest push --all "${FULL_TAG}" "docker://${FULL_TAG}"
      podman manifest push --all "${LATEST_TAG}" "docker://${LATEST_TAG}"
    else
      echo "Build complete. Not pushing images to registry (use --push to enable)."
    fi
  fi
fi
