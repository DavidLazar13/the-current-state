import { Source } from "./Source";
import getConfig from 'next/config';
// Source: https://github.com/MorphCast/mph-sdk-integration-react/tree/master/src/helpers/ai-sdk

/*Prevents globalThis being reported as an error by eslint*/
/*global globalThis*/

// Singleton pattern to ensure only one instance of the SDK and its source
let aiSdkInstance;
let source;

// Retrieve public runtime configuration settings from Next.js config
const { publicRuntimeConfig } = getConfig();

/**
 * Function to ensure the AI SDK is only downloaded once.
 * Throws an error if attempted to download again when already present.
 */
async function downloadAiSdk() {
  if (globalThis.CY) {
    throw new Error("AI-SDK has already been downloaded.");
  }
}

/**
 * Initializes the AI SDK with modules and settings, assuming it has not been initialized.
 * Throws an error if an instance already exists to prevent reinitialization.
 */
async function initAiSdk() {
  if (aiSdkInstance) {
    throw new Error("An instance of the AI-SDK is already running.");
  }

  // Creating a new source instance
  source = new Source();

  // Setting up the SDK instance with required modules and configurations
  aiSdkInstance = await globalThis.CY.loader()
    .licenseKey(publicRuntimeConfig.AI_LICENSE_KEY) // License key from runtime config
    .source(source)
    .addModule(globalThis.CY.modules().FACE_DETECTOR.name)
    .addModule(globalThis.CY.modules().FACE_EMOTION.name, {
      enableBalancer: false, // Custom setting example
      smoothness: 0.5,
    })
    .addModule(globalThis.CY.modules().FACE_GENDER.name)
    .addModule(globalThis.CY.modules().FACE_AGE.name, {
      windowSizeMs: 4000, // Custom setting example
      maxVarianceCutoff: Math.pow(7, 2),
      numericalStability: 1,
    })
    .addModule(globalThis.CY.modules().FACE_FEATURES.name)
    .addModule(globalThis.CY.modules().FACE_POSITIVITY.name)
    .addModule(globalThis.CY.modules().FACE_POSE.name)
    .addModule(globalThis.CY.modules().FACE_AROUSAL_VALENCE.name, {
      smoothness: 0.9, // Custom setting example
    })
    .addModule(globalThis.CY.modules().FACE_ATTENTION.name)
    .addModule(globalThis.CY.modules().DATA_AGGREGATOR.name)
    .load(); // Load all modules
}

/**
 * Exports a function to get AI SDK controls.
 * Ensures the SDK is downloaded and initialized before returning controls.
 * Returns a singleton pattern ensuring one-time initialization and reuse.
 *
 * @returns {Promise<{getModule: function, stop: function, CY: object, start: function, source: Source}>}
 */
export async function getAiSdkControls() {
  if (globalThis.CY === undefined) {
    await downloadAiSdk();
  }
  if (aiSdkInstance === undefined) {
    await initAiSdk();
  }

  const { start, stop, getModule } = aiSdkInstance;
  return { start, stop, getModule, source, CY: globalThis.CY };
}
