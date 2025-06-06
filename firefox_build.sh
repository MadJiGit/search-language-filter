#!/bin/bash

OUTPUT="firefox_pack_extension.xpi"
TMP_DIR="tmp_firefox_build"

echo "🔧 Creating temporary build directory..."
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

# Copy Firefox core files
cp firefox/manifest.json "$TMP_DIR/"
cp firefox/background.js "$TMP_DIR/"
cp firefox/content.js "$TMP_DIR/"
cp firefox/popup.html "$TMP_DIR/"
cp firefox/popup.js "$TMP_DIR/"

# Copy shared and icons
cp -R icons "$TMP_DIR/"
cp -R shared "$TMP_DIR/"

echo "📦 Creating $OUTPUT..."
cd "$TMP_DIR" || exit 1
zip -r "../$OUTPUT" . -x '*.DS_Store' '*.git*' '*node_modules*' > /dev/null
cd ..

echo "🧹 Cleaning up..."
rm -rf "$TMP_DIR"

echo "✅ Done: $OUTPUT"