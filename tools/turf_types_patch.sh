#!/bin/bash

directory="node_modules/@turf"
for subdir in $directory/*; do
    package="$subdir/package.json"
    if [[ -f "$package" ]]; then
        types_value=$(jq -r .types $package)
        if [[ "$types_value" != "null" ]]; then
            types_value="./$types_value"
            new_content=$(jq --arg types "$types_value" '.exports["."].types = $types' $package)
            echo "$new_content" > $package
        fi
    fi
done