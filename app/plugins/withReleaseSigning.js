// Config plugin: sign release builds with YOUR keystore (env vars), so every APK shares the same
// signature and Android accepts updates installed over the previous version.
// Env: COACH_KEYSTORE_PATH, COACH_KEYSTORE_PASSWORD, COACH_KEY_ALIAS, COACH_KEY_PASSWORD
// Without them the build falls back to the debug key (fine for tests, NOT for updates).
const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = (config) =>
  withAppBuildGradle(config, (cfg) => {
    let g = cfg.modResults.contents;
    if (g.includes('COACH_KEYSTORE_PATH')) return cfg;

    g = g.replace(
      /signingConfigs \{\s*debug \{/,
      `signingConfigs {
        release {
            if (System.getenv('COACH_KEYSTORE_PATH')) {
                storeFile file(System.getenv('COACH_KEYSTORE_PATH'))
                storePassword System.getenv('COACH_KEYSTORE_PASSWORD')
                keyAlias System.getenv('COACH_KEY_ALIAS')
                keyPassword System.getenv('COACH_KEY_PASSWORD')
            }
        }
        debug {`,
    );
    g = g.replace(
      /(release \{\s*\/\/ Caution![^\n]*\n[^\n]*\n\s*)signingConfig signingConfigs\.debug/,
      `$1signingConfig System.getenv('COACH_KEYSTORE_PATH') ? signingConfigs.release : signingConfigs.debug`,
    );
    cfg.modResults.contents = g;
    return cfg;
  });
