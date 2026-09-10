// const fs = require("fs");
// const path = require("path");

// const APP_ENV = process.env.APP_ENV || "development";
// const platform = process.env.EAS_BUILD_PLATFORM;

// console.log(`[pre-install] APP_ENV=${APP_ENV} platform=${platform}`);

// // app.config.js flavorMap values are ignored by EAS when native android/ios
// // directories exist. This script patches the native files directly so the
// // correct applicationId and app name are used for each environment.
// const envMap = {
//   development: {
//     applicationId: "com.artisan.dev",
//     appName: "Artisan App (dev)",
//   },
//   uat: {
//     applicationId: "com.artisan.uat",
//     appName: "Artisan App (uat)",
//   },
//   production: {
//     applicationId: "com.artisan.live",
//     appName: "Artisan App",
//   },
// };

// const config = envMap[APP_ENV] || envMap.development;
// const envKey =
//   APP_ENV === "production" ? "prod" : APP_ENV === "uat" ? "uat" : "dev";

// if (platform === "ios") {
//   // Copy the environment-specific GoogleService-Info.plist so Firebase native
//   // SDK uses the correct project/bundle-id for each environment.

//   const srcPlist = path.join(
//     __dirname,
//     `../assets/firebase/ios/GoogleService-Info-${envKey}.plist`,
//   );
//   console.log("File path", srcPlist);
//   const destPlist = path.join(
//     __dirname,
//     // Ridwan commented this
//     // "../ios/CustodianInvestmentAppdev/GoogleService-Info.plist"
//     "../ios/CustodianInvestment/GoogleService-Info.plist",
//   );

//   console.log("be like destination path no exist", fs.existsSync(destPlist));
//   console.log("check that destinationpath", destPlist);
//   console.log("Check if file exist here", fs.existsSync(srcPlist));

//   if (fs.existsSync(srcPlist)) {
//     console.log("e enter here, before the path copy ans paste");
//     console.log("File path", srcPlist);

//     fs.copyFileSync(srcPlist, destPlist);

//     console.log("e enter here, after the path copy and paste");
//     console.log(
//       `[pre-install] GoogleService-Info.plist → copied from GoogleService-Info-${envKey}.plist`,
//     );
//   } else {
//     console.warn(
//       `[pre-install] WARNING: ${srcPlist} not found, leaving GoogleService-Info.plist unchanged`,
//     );
//   }

//   // Patch Info.plist CFBundleDisplayName so the icon label matches the env.
//   // Bundle id stays dev — only the user-facing app name changes.
//   const infoPlistPath = path.join(
//     __dirname,
//     // Ridwan commented this
//     // "../ios/CustodianInvestmentAppdev/Info.plist"
//     "../ios/CustodianInvestment/Info.plist",
//   );
//   let infoPlist = fs.readFileSync(infoPlistPath, "utf8");
//   infoPlist = infoPlist.replace(
//     /(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/,
//     `$1${config.appName}$2`,
//   );
//   fs.writeFileSync(infoPlistPath, infoPlist);
//   console.log(
//     `[pre-install] Info.plist → CFBundleDisplayName="${config.appName}"`,
//   );
// }

// if (platform === "android") {
//   // Patch build.gradle — applicationId only (not namespace)
//   const buildGradlePath = path.join(__dirname, "../android/app/build.gradle");
//   let gradle = fs.readFileSync(buildGradlePath, "utf8");

//   // Only applicationId is patched — namespace must stay as the source-package
//   // (com.custodian.investment.dev) because it governs R/BuildConfig generation.
//   // Changing namespace would break "unresolved reference: R" in MainActivity.kt.
//   gradle = gradle.replace(
//     /applicationId\s+'com\.custodian\.investment\.\w+'/,
//     `applicationId '${config.applicationId}'`,
//   );

//   fs.writeFileSync(buildGradlePath, gradle);
//   console.log(
//     `[pre-install] build.gradle → applicationId=${config.applicationId}`,
//   );

//   // Patch strings.xml — app_name
//   const stringsPath = path.join(
//     __dirname,
//     "../android/app/src/main/res/values/strings.xml",
//   );
//   let strings = fs.readFileSync(stringsPath, "utf8");

//   strings = strings.replace(
//     /<string name="app_name">.*?<\/string>/,
//     `<string name="app_name">${config.appName}</string>`,
//   );

//   fs.writeFileSync(stringsPath, strings);
//   console.log(`[pre-install] strings.xml → app_name="${config.appName}"`);

//   // Copy the environment-specific google-services.json so the Google Services
//   // Gradle plugin can find a client entry matching the patched applicationId.
//   const srcGoogleServices = path.join(
//     __dirname,
//     `../assets/firebase/android/google-services-${envKey}.json`,
//   );
//   const destGoogleServices = path.join(
//     __dirname,
//     "../android/app/google-services.json",
//   );
//   if (fs.existsSync(srcGoogleServices)) {
//     fs.copyFileSync(srcGoogleServices, destGoogleServices);
//     console.log(
//       `[pre-install] google-services.json → copied from google-services-${envKey}.json`,
//     );
//   } else {
//     console.warn(
//       `[pre-install] WARNING: ${srcGoogleServices} not found, leaving google-services.json unchanged`,
//     );
//   }
// }
