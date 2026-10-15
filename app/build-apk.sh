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
# a Gradle daemon from the previous build can lock android/ and make prebuild's clean fail (EBUSY)
[ -x android/gradlew.bat ] && (cd android && ./gradlew.bat --stop >/dev/null 2>&1 || true)
# Idle Gradle / Kotlin daemons from the previous build keep files in android/ open, which makes the clean fail (EBUSY).
# `gradlew --stop` does not stop the Kotlin compile daemon, so stop both by command line.
powershell.exe -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { \$_.Name -match '^java' -and \$_.CommandLine -match 'gradle|kotlin' } | ForEach-Object { Stop-Process -Id \$_.ProcessId -Force }" >/dev/null 2>&1 || true
sleep 3
# Remove the generated native folder up front: Windows long paths / locked files make prebuild's own clean fail.
if [ -d android ]; then
  MSYS2_ARG_CONV_EXCL='*' cmd.exe /c rd /s /q "\\\\?\\$(cygpath -w "$PWD/android")" >/dev/null 2>&1 || true
  rm -rf android 2>/dev/null || true
fi
npx expo prebuild --platform android --no-install
printf 'sdk.dir=%s\n' "$(cygpath -m "$ANDROID_HOME" 2>/dev/null || echo "$ANDROID_HOME")" > android/local.properties
(cd android && ./gradlew.bat assembleRelease -PreactNativeArchitectures="${ARCHS:-arm64-v8a,x86_64}" --console=plain)
VER=$(node -p "require('./app.json').expo.version")
mkdir -p ../dist && cp android/app/build/outputs/apk/release/app-release.apk "../dist/my-english-coach-$VER.apk"
echo "APK: $(cd .. && pwd)/dist/my-english-coach-$VER.apk"
