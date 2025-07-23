#!/bin/bash

set -euo pipefail

# Allow overriding the container engine, default to podman
ENGINE=${ENGINE:-podman}

BASE_TAG="emiliogozo/panahon.observatory"
DATE_STR="$(date +%Y%m%d)"

"$ENGINE" build --network=host -t "${BASE_TAG}" -t "${BASE_TAG}:${DATE_STR}" .
