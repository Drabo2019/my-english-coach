#!/usr/bin/env bash
# Builds the release APK. Usage: ./build-apk.sh   (run from app/)
# Needs: JDK 17 (Android Studio JBR), Android SDK, ~/.english-coach/keystore.env (see docs/RELEASE.md)
set -euo pipefail
cd "$(dirname "$0")"
export JAVA_HOME="${JAVA_HOME_17:-/c/Program Files/Android/Android Studio/jbr}"
export ANDROID_HOME="${ANDROID_HOME:-$LOCALAPPDATA/Android/Sdk}"
export PATH="$JAVA_HOME/bin:$PATH"
KEYENV="${COACH_KEYSTORE_ENV:-$HOME/.english-coach/keystore.env}"
if [ -f "$KEYENV" ]; then set -a; . "$KEYENV"; set +a; else echo "WARN: no keystore env -> debug-signed APK (updates will NOT install over a release-signed one)"; fi
npx expo prebuild --platform android --no-install
printf 'sdk.dir=%s\n' "$(cygpath -m "$ANDROID_HOME" 2>/dev/null || echo "$ANDROID_HOME")" > android/local.properties
(cd android && ./gradlew.bat assembleRelease -PreactNativeArchitectures="${ARCHS:-arm64-v8a,x86_64}" --console=plain)
VER=$(node -p "require('./app.json').expo.version")
mkdir -p ../dist && cp android/app/build/outputs/apk/release/app-release.apk "../dist/my-english-coach-$VER.apk"
echo "APK: $(cd .. && pwd)/dist/my-english-coach-$VER.apk"
