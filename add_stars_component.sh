#!/bin/bash

# Define the target file relative to the script's execution directory
TARGET_FILE="src/components/SpaceScene/SpaceScene.jsx"
# Create a backup file with a timestamp
BACKUP_FILE="${TARGET_FILE}.bak.$(date +%s)"
# Temporary file to hold the JSX block for Stars
TEMP_STARS_FILE="temp_stars_jsx.txt"

echo ">>> Preparing to modify ${TARGET_FILE}..."

# --- Safety Check: Ensure target file exists ---
if [ ! -f "$TARGET_FILE" ]; then
  echo ">>> ERROR: Target file not found: ${TARGET_FILE}"
  echo ">>> Please ensure you are running this script from the project root directory:"
  echo ">>> /home/tao/projects/online-resume/raj-manghani-odyssey-resume"
  exit 1
fi

echo ">>> Creating backup: ${BACKUP_FILE}..."
cp "$TARGET_FILE" "$BACKUP_FILE"

# --- Prepare the JSX block for the Stars component ---
cat > "$TEMP_STARS_FILE" << 'EOF'
                    {/* Add the Starfield */}
                    <Stars
                        radius={150} // Distance plane of stars from center
                        depth={50}  // Depth of the star distribution
                        count={5000} // Number of stars
                        factor={6}  // <<< SIZE FACTOR FOR STARS (Increase this value)
                        saturation={0} // Color saturation (0=white)
                        fade        // Stars fade near the edge
                        speed={1}   // Animation speed
                    />
EOF

echo ">>> Modifying import statement in ${TARGET_FILE}..."
# Use sed to find the drei import line and add ", Stars" before the closing brace '}'
# This is slightly safer than matching the whole content inside the braces
sed -i "/^import {.*useGLTF.*} from '@react-three\/drei';/s/}/, Stars }/" "$TARGET_FILE"

# Check if sed command succeeded (basic check: file modified or command exit status)
if [ $? -ne 0 ]; then
    echo ">>> ERROR: Failed to modify the import statement. Restoring from backup."
    cp "$BACKUP_FILE" "$TARGET_FILE"
    rm "$TEMP_STARS_FILE" # Clean up temp file
    exit 1
fi

echo ">>> Inserting <Stars /> component JSX into ${TARGET_FILE}..."
# Use sed to find the line containing '<SpaceScene />' and insert the content
# of the temporary file *before* that line using the 'r' command combined with line addressing.
# The pattern `/<SpaceScene \/>/` identifies the line. `e cat ...` could work but `r` is safer.
# Let's use awk for a slightly more robust insertion before the target line.
awk -v stars_file="$TEMP_STARS_FILE" '
/<SpaceScene \/>/ {
    # Read and print the stars file content BEFORE printing the matched line
    while ((getline line < stars_file) > 0) {
        print line
    }
    close(stars_file) # Close the file after reading
}
{ print } # Print the current line (including the <SpaceScene /> line after insertion)
' "$BACKUP_FILE" > "$TARGET_FILE" # Read from backup, write to target

# Check if awk produced output and replaced the file
if [ $? -ne 0 ] || [ ! -s "$TARGET_FILE" ]; then
    echo ">>> ERROR: Failed to insert the <Stars /> component using awk. Restoring from backup."
    # Attempt to restore cleanly, even if awk partially wrote the file
    cp "$BACKUP_FILE" "$TARGET_FILE"
    rm "$TEMP_STARS_FILE" # Clean up temp file
    exit 1
fi

echo ">>> Cleaning up temporary file..."
rm "$TEMP_STARS_FILE"

echo ">>> Script finished successfully."
echo ">>> ${TARGET_FILE} has been modified."
echo ">>> Backup of the original file is available at: ${BACKUP_FILE}"

exit 0