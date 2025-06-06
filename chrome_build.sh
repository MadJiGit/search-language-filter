#!/bin/bash

# Output directory
OUTPUT_DIR="chrome_pack"

# Clean previous build
rm -rf "$OUTPUT_DIR"
mkdir "$OUTPUT_DIR"

# Copy necessary files and folders
cp chrome/background.js "$OUTPUT_DIR/"
cp chrome/content.js "$OUTPUT_DIR/"
cp chrome/manifest.json "$OUTPUT_DIR/"
cp chrome/popup.html "$OUTPUT_DIR/"
cp chrome/popup.js "$OUTPUT_DIR/"

mkdir -p "$OUTPUT_DIR/icons"
cp icons/icon.png "$OUTPUT_DIR/icons/"

mkdir -p "$OUTPUT_DIR/shared"
cp shared/README.md "$OUTPUT_DIR/shared/"

echo "✅ Chrome extension prepared in $OUTPUT_DIR"