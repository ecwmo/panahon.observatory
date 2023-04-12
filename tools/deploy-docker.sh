#!/bin/bash

BASE_TAG="emiliogozo/panahon.observatory"
DATE_STR="$(date +%Y%m%d)"

# yarn build

docker build -t ${BASE_TAG} -t ${BASE_TAG}:${DATE_STR} .
