#!/bin/bash

TARGET_FILE="src/App.jsx"
BACKUP_FILE="${TARGET_FILE}.bak.test_skybox_only.$(date +%s)"

echo ">>> Backing up ${TARGET_FILE} to ${BACKUP_FILE}..."
cp "$TARGET_FILE" "$BACKUP_FILE"

echo ">>> Modifying ${TARGET_FILE} to render UI + ONLY Skybox..."

# Use sed to uncomment the Skybox rendering line
# This pattern looks for the specific commented line structure used previously
# It replaces the commented line with the uncommented version.
# Using a different delimiter '#' because paths contain '/'
sed -i 's#/\* <Suspense fallback={null}><Skybox /></Suspense> \*/#<Suspense fallback={null}><Skybox /></Suspense>#g' "$TARGET_FILE"
# Also handle single line comment version
sed -i 's#// <Suspense fallback={null}><Skybox /></Suspense>#<Suspense fallback={null}><Skybox /></Suspense>#g' "$TARGET_FILE"


# --- Ensure others remain commented (redundant check, but safe) ---
# Add '// ' prefix if line exists and doesn't start with '// '
sed -i '/<TwinklingStars count={200} \/>/ s|^\([^/]\)|// \1|' "$TARGET_FILE"
sed -i '/<AsteroidField count={60} \/>/ s|^\([^/]\)|// \1|' "$TARGET_FILE"
sed -i '/<FlyingObjects count={3} \/>/ s|^\([^/]\)|// \1|' "$TARGET_FILE"
sed -i '/<SolarSystemGroup/ s|^\([^/]\)|// \1|' "$TARGET_FILE"

echo ">>> ${TARGET_FILE} modified."
echo ">>> Backup created at ${BACKUP_FILE}"
echo ">>> Please run 'npm run dev', clear browser cache, and test."

exit 0