import { existsSync, readFileSync } from "fs";
import { version, build as buildNumber } from "./.version.json";

// HIGH-07: EAS Update code signing. If the public cert is present at the
// well-known path, every build automatically picks it up and the runtime
// rejects any update bundle whose signature doesn't match. If the file
// isn't there yet, the build continues without signing — same behaviour
// as today, so this is safe to land before the cert is generated.
//
// To generate (one-time, from a trusted machine):
//   npx expo-updates codesigning:generate \
//     --key-output-directory ./keys \
//     --certificate-output-directory ./certs \
//     --certificate-validity-duration-years 10 \
//     --certificate-common-name "Custodian Investment App"
//   mv ./certs/certificate.pem ./certs/codesigning.pem
//   mv ./keys/private-key.pem ./keys/codesigning-private-key.pem
// Commit ./certs/codesigning.pem. The /keys/ directory is .gitignored
// and must be uploaded to EAS Secrets / 1Password — never to git.
//
// Path resolves from cwd — expo always evaluates this file with the
// project root as cwd (both `expo prebuild` and EAS Build).

// Ridwan commented this out
// const codeSigningEnabled = fs.existsSync("./certs/codesigning.pem");

export default ({ config }) => {
  // Google Sign-In on iOS redirects back to a URL scheme equal to the reversed
  // iOS client ID (e.g. "1234567890-abc.apps.googleusercontent.com" ->
  // "com.googleusercontent.apps.1234567890-abc"). The Firebase config plugin
  // adds it automatically when the plist contains REVERSED_CLIENT_ID; we also
  // register it manually below so iOS keeps working even with an incomplete
  // plist.
  // const googleIosUrlScheme = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
  //   ? process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID.split(".")
  //       .reverse()
  //       .join(".")
  //   : undefined;

  // The google-sign-in plugin is used WITHOUT options (full mode). That is the
  // only configuration that wires up Android: it copies android.googleServicesFile
  // into the native project and applies the com.google.gms.google-services
  // Gradle plugin, which is what resolves the OAuth client on Android. The
  // "light" mode (iosUrlScheme option) only configures iOS and leaves Android
  // unconfigured, which is exactly what produces DEVELOPER_ERROR at sign-in.
  // The per-flavor files below are only set when they exist, so flavors without
  // a Firebase file still prebuild cleanly.

  const flavorMap = {
    development: {
      androidBundleId: "com.mychurchapp.dev",
      iosBundleId: "com.mychurchapp.dev",
      bundleName: "My Church App (dev)",
      icon: "./assets/logo.png",
      adaptiveIcon: "./assets/logo.png",
      scheme: "mychurchapp-dev",
      // androidFirebaseFile: "./assets/firebase/android/google-services-dev.json",
      // iosFirebaseFile: "./assets/firebase/ios/GoogleService-Info-dev.plist",
    },
    uat: {
      androidBundleId: "com.mychurchapp.uat",
      iosBundleId: "com.mychurchapp.uat",
      bundleName: "My Church App (uat)",
      icon: "./assets/logo.png",
      adaptiveIcon: "./assets/logo.png",
      scheme: "mychurchapp-uat",
      // androidFirebaseFile: "./assets/firebase/android/google-services-uat.json",
      // iosFirebaseFile: "./assets/firebase/ios/GoogleService-Info-uat.plist",
    },
    production: {
      androidBundleId: "com.mychurchapp.live",
      iosBundleId: "com.mychurchapp.live",
      bundleName: "My Church App",
      icon: "./assets/logo.png",
      adaptiveIcon: "./assets/logo.png",
      scheme: "mychurchapp",
      // androidFirebaseFile:
      //   "./assets/firebase/android/google-services-prod.json",
      // iosFirebaseFile: "./assets/firebase/ios/GoogleService-Info-prod.plist",
    },
  };

  const env = process.env.APP_ENV || "production";
  const flavor = flavorMap[env] || flavorMap.production;
  // Only wire a Firebase file when it actually exists on disk. Pointing
  // googleServicesFile at a missing path makes `expo prebuild`/EAS fail.
  // The flavor map may not include firebase file paths (they're commented
  // out for some flavors). Guard against undefined properties so this
  // file can be evaluated safely during `expo config`.
  const androidFirebaseFile =
    flavor.androidFirebaseFile && existsSync(flavor.androidFirebaseFile)
      ? flavor.androidFirebaseFile
      : undefined;
  const iosFirebaseFile =
    flavor.iosFirebaseFile && existsSync(flavor.iosFirebaseFile)
      ? flavor.iosFirebaseFile
      : undefined;

  // Android Google Sign-In needs the google-services.json to contain a web
  // (client_type 3) oauth_client — the "default_web_client_id" the SDK uses
  // for the ID token. Firebase only adds it after Google Sign-In is enabled
  // and the app's SHA-1 signing certificate is registered, so this catches a
  // stale file at build time instead of a confusing runtime DEVELOPER_ERROR.
  // if (androidFirebaseFile) {
  //   try {
  //     const googleServices = JSON.parse(
  //       readFileSync(androidFirebaseFile, "utf8"),
  //     );
  //     const hasWebOAuthClient = googleServices.client?.some((client) =>
  //       client.oauth_client?.some((oauth) => oauth.client_type === 3),
  //     );
  //     if (!hasWebOAuthClient) {
  //       console.warn(
  //         `[google-sign-in] ${androidFirebaseFile} has no web (client_type 3) ` +
  //           "oauth_client. Enable Google Sign-In in Firebase Console > " +
  //           "Authentication > Sign-in method, register this app's SHA-1 " +
  //           "certificate under Project settings > Your apps, then re-download " +
  //           "the file. Until then Android sign-in fails with DEVELOPER_ERROR.",
  //       );
  //     }
  //   } catch {
  //     // Leave unreadable JSON alone; prebuild will surface any real problem.
  //   }
  // }

  return {
    ...config,
    owner: "techiao",
    version: version,
    name: flavor.bundleName,
    icon: flavor.icon,
    scheme: flavor.scheme,

    // iOS configuration
    ios: {
      bundleIdentifier: flavor.iosBundleId,
      buildNumber: `${buildNumber}`,
      usesAppleSignIn: true,
      googleServicesFile: iosFirebaseFile,
      // jsEngine: "hermes",
      infoPlist: {
        // Privacy usage descriptions (user-facing)
        // LOW-03: app bundles CryptoJS (AES/DES/SHA) — declare encryption use
        // and obtain an ERN if App Store flags it. Standard HTTPS alone is
        // ERN-exempt, but additional payload encryption tips us over.
        ITSAppUsesNonExemptEncryption: true,
        NSCameraUsageDescription:
          "My Church App uses the camera to allow you take and upload documents or profile images.",
        NSMicrophoneUsageDescription:
          "My Church App uses the microphone to record voice notes when you choose to record audio.",
        NSPhotoLibraryUsageDescription:
          "My Church App accesses your photo library to let you select images and documents to upload.",
        NSPhotoLibraryAddUsageDescription:
          "My Church App can save exported documents or receipts to your photo library when requested.",
        NSLocationWhenInUseUsageDescription:
          "This app uses your location to find and show the nearest offices.",
        NSLocationAlwaysUsageDescription:
          "This app requires access to your location in the background to provide continuous location-based services when explicitly enabled.",
        LSApplicationQueriesSchemes: ["file"],
        // App Transport Security: NEVER set NSAllowsArbitraryLoads. All API
        // hosts are HTTPS — if a specific third-party host needs an exception,
        // add it via NSExceptionDomains here. Do NOT re-introduce the global
        // allow-list (CRIT-01).
        // Google Sign-In redirects back via a URL scheme equal to the reversed
        // iOS client ID. The config plugin derives this from REVERSED_CLIENT_ID
        // in GoogleService-Info.plist when present; registering it here too
        // keeps iOS working even with an incomplete plist. Duplicates are
        // de-duplicated at prebuild.
        // ...(googleIosUrlScheme && {
        //   CFBundleURLTypes: [{ CFBundleURLSchemes: [googleIosUrlScheme] }],
        // }),
      },
    },

    // Android configuration
    android: {
      ...config.android,
      package: flavor.androidBundleId,
      versionCode: buildNumber,
      googleServicesFile: androidFirebaseFile,
      //newArchEnabled: true,
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        foregroundImage: flavor.adaptiveIcon,
      },
      permissions: ["INTERNET", "ACCESS_NETWORK_STATE", "WAKE_LOCK", "VIBRATE"],
      // jsEngine: "hermes",
    },

    // Plugins
    plugins: [
      "@react-native-community/datetimepicker",
      // "@react-native-firebase/app",
      // Full mode (no options): wires up the Android google-services.json and
      // copies the iOS GoogleService-Info.plist. Do NOT pass { iosUrlScheme }
      // here — that switches the plugin into iOS-only mode and leaves Android
      // without any Google Sign-In configuration (DEVELOPER_ERROR at runtime).
      // "@react-native-google-signin/google-signin",
      // "expo-apple-authentication",
      "expo-font",
      ["expo-build-properties"],
      "expo-web-browser",
      "expo-secure-store",
      [
        "expo-document-picker",
        {
          iCloudContainerEnvironment: "Production",
        },
      ],
      [
        "expo-media-library",
        {
          photosPermission:
            "Allow My Church App access to your photos to enable you to upload documents.",
          savePhotosPermission:
            "Allow My Church App access to save documents to your device.",
          isAccessMediaLocationEnabled: true,
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "My Church App accesses your photos to enable you to upload your photos and documents",
          cameraPermission:
            "My Church App uses your camera to enable you to upload your photos and documents",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission:
            "My Church App uses your camera to enable you to upload your photos",
          microphonePermission:
            "Allow My Church App to access your microphone to upload videos",
          recordAudioAndroid: true,
          barcodeScannerEnabled: true,
        },
      ],
      [
        "expo-local-authentication",
        {
          faceIDPermission:
            "Allow My Church APP to use Face ID to authenticate.",
        },
      ],
    ].filter(Boolean),

    extra: {
      eas: {
        projectId: "62639d09-e4d1-4dad-b8c4-66dc7717b1b5",
      },
      APP_ENV: env,
    },

    updates: {
      url: "https://u.expo.dev/62639d09-e4d1-4dad-b8c4-66dc7717b1b5",
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0,
      // Ridwan commented this out
      // ...(codeSigningEnabled && {
      //   codeSigningCertificate: "./certs/codesigning.pem",
      //   codeSigningMetadata: {
      //     keyid: "main",
      //     alg: "rsa-v1_5-sha256",
      //   },
      // }),
    },
    // runtimeVersion: {
    //   //policy: "nativeVersion",
    //   policy: "1.0.0",
    // },
    runtimeVersion: "1.0.0",
  };
};
