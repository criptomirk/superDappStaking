#!/bin/bash

# Get the full path of the current directory
CURRENT_DIR=$(pwd)

# Define the absolute source and target directories
SOURCE_DIR="$CURRENT_DIR/scripts/mathTests/results"
TARGET_DIR="$CURRENT_DIR/charts-ui/public/results-json"

# Function to recursively create symlinks for JSON files
link_json_recursively() {
    local source_path=$1
    local target_path=$2

    # Create the target directory if it doesn't exist
    mkdir -p "$target_path"

    # Loop through all items in the source directory
    for item in "$source_path"/*; do
        if [ -d "$item" ]; then
            # It's a directory; recurse into it
            # Compute the relative path from SOURCE_DIR to this directory
            local relative_path="${item#$SOURCE_DIR/}"
            # Call the function recursively with updated paths
            link_json_recursively "$item" "$target_path/$relative_path"
        elif [ "${item: -5}" == ".json" ]; then
            # It's a JSON file; create a symlink in the target directory
            # Extract filename
            filename=$(basename "$item")
            # Create a symlink in the corresponding target directory
            ln -sf "$item" "$target_path/$filename"
        fi
    done
}

# Check if the source directory exists
if [ -d "$SOURCE_DIR" ]; then
    # Start the recursive linking process
    link_json_recursively "$SOURCE_DIR" "$TARGET_DIR"
    echo "Symlinks for JSON files created successfully."
else
    echo "Source directory $SOURCE_DIR does not exist."
fi
