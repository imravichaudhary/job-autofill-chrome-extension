#!/bin/bash

compiler='./closure-compiler-v20250706.jar'

# Create combined background file
echo "Creating combined background script..."
cat config.js background.js > combined_background.js

echo "Compiling content scripts..."
java -jar $compiler \
--js content.js main.js workday.js taleo.js greenhouse.js lever.js \
--js_output_file contentc.js \
--language_in ECMASCRIPT_2020 \
--language_out ECMASCRIPT_2020

echo "Compiling popup script..."
java -jar $compiler \
--js resumepopup.js \
--js_output_file resumepopupc.js \
--language_in ECMASCRIPT_2020 \
--language_out ECMASCRIPT_2020

# Check if compilation was successful for content and popup scripts
for file in contentc.js resumepopupc.js; do
    if [ ! -f "$file" ]; then
        echo "Error: Compilation failed to create $file"
        exit 1
    fi
done

# No need to remove temporary files anymore

echo "Renaming compiled files..."
# Rename output files by removing the "c" from their names
mv -f contentc.js content.js 2>/dev/null
mv -f resumepopupc.js resumepopup.js 2>/dev/null

# Create a ZIP file with the required files
./zip.exe a extension.zip \
    content.js main.js workday.js taleo.js greenhouse.js lever.js \
    resumepopup.js combined_background.js popup.js schema.json \
    index.html popup.html manifest.json style.css *.png

