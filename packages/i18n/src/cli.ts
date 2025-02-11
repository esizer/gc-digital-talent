#!/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const yargs = require("yargs");
const yaml = require("js-yaml");
const stringify = require("json-stable-stringify"); // provides sorted output

const { argv } = yargs(process.argv.slice(2))
  .option("dir", {
    demandOption: false,
    describe: "path to the current working directory",
    string: true,
  })
  .option("en", {
    demandOption: true,
    describe: "path to en.json file extracted by Format.js",
    string: true,
  })
  .option("fr", {
    demandOption: true,
    describe: "path to fr.json with same format as en.json",
    string: true,
  })
  .option("output-untranslated", {
    alias: "o",
    describe: "output all untranslated entries to a json file at this path",
    string: true,
  })
  .option("merge-fr", {
    alias: "m",
    describe:
      "a path to a json file of new translations which should be merged with fr.json before checking anything",
    string: true,
  })
  .option("rm-orphaned", {
    alias: "r",
    describe: "delete entries in fr.json file which don't appear in en.json",
    boolean: true,
  })
  .option("whitelist", {
    alias: "w",
    describe:
      "path to json file containing an array of keys which are expected to be identical in fr and en",
    string: true,
  })
  .help();

/**
 * Loads data from a json or yml file as a js object or array.
 * @param {*} filename
 * @param {*} defaultData
 * @returns Returns defaultData if filename is undefined or null or empty string.
 */
const readDataFile = (
  filename: string,
  defaultData: Record<string, unknown> | unknown[],
) => {
  if (!filename) {
    return defaultData;
  }
  const ext = path.extname(filename);
  if (ext === ".json") {
    return JSON.parse(fs.readFileSync(filename));
  }
  if (ext === ".yml" || ext === ".yaml") {
    return yaml.load(fs.readFileSync(filename));
  }
  // For unknown file types, throw error
  throw new Error(
    `Filename must be a .json, .yml or .yaml file. '${filename}' is not valid.`,
  );
};

// Change directory if it was passed
const { dir } = argv;
if (dir) {
  process.chdir(dir);
}

// First read all relevant files and convert to js objects.
const en = readDataFile(argv.en, {});
const frOriginal = readDataFile(argv.fr, {});
const whitelist = readDataFile(argv.whitelist, []);
const frNew = readDataFile(argv["merge-fr"], {});

// This variable is used to track changes that may need to be made to fr.json. That way, we only update the file once, at the end.
let outputFr = { ...frOriginal, ...frNew };

/**
 * T
 */

/**
 * This function takes a js object and a file path, and writes the object to the file as json.
 * @param {string} file - A file path.
 * @param {Record<string, unknown>} obj - A js object to be saved as a json.
 * @returns undefined
 */
const saveJson = (file: string, obj: Record<string, unknown>) =>
  fs.writeFile(file, `${stringify(obj, { space: "  " })}\n`, {}, () => {
    /** Do nothing */
  });

if (Object.keys(frNew).length > 0) {
  console.log(`Entries from ${argv["merge-fr"]} merged into ${argv.fr}`);
}

/**
 * Iterates through the keys of obj, creating a new object identical to the original,
 * but only with the keys for which predicate returns true.
 * @param {Record<string, unknown>} obj
 * @param {(key: string) => boolean} predicate
 * @returns {Record<string, unknown>}
 */
const transform = (
  obj: Record<string, unknown>,
  predicate: (v: unknown, k: string) => boolean,
) => {
  return Object.keys(obj).reduce((memo: Record<string, unknown>, key) => {
    if (predicate(obj[key], key)) {
      // eslint-disable-next-line no-param-reassign
      memo[key] = obj[key];
    }
    return memo;
  }, {});
};

/**
 * Return a copy of obj, excluding specified keys.
 * @param {Record<string, unknown>} obj
 * @param {string[]} keys
 * @returns {Record<string, unknown>}
 */
const omit = (obj: Record<string, unknown>, keys: string[]) =>
  transform(obj, (value, key) => !keys.includes(key));
/**
 * Return a copy of obj, excluding all keys not specified.
 * @param {Record<string, unknown>} obj
 * @param {string[]} keys
 * @returns {Record<string, unknown>}
 */
const pick = (obj: Record<string, unknown>, keys: string[]) =>
  transform(obj, (value, key) => keys.includes(key));

// All keys in the original en file.
const enKeys = Object.keys(en);

// Keys which appear in the en file, but not at all in the fr file.
const missingKeys = enKeys.filter((enKey) => {
  return outputFr[enKey] === undefined;
});

// Keys for whom the value is the same in en and fr (not including those whitelisted).
const untranslatedKeys = enKeys.filter(
  (enKey) =>
    outputFr[enKey]?.defaultMessage === en[enKey].defaultMessage &&
    !whitelist.includes(enKey),
);

if (missingKeys.length > 0) {
  const missing = pick(en, missingKeys);
  console.error("These values are missing translations:", missing);
}
if (untranslatedKeys.length > 0) {
  const untranslated = pick(en, untranslatedKeys);
  console.error("These values are identical in en and fr:", untranslated);
}

// Orphaned keys are those which appear in the fr file, but which no longer appear in the en file,
// which suggests they are no longer used in code.
const orphanedKeys = Object.keys(outputFr).filter(
  (frKey) => en[frKey] === undefined,
);
const orphaned = pick(outputFr, orphanedKeys);

if (
  argv["output-untranslated"] &&
  (untranslatedKeys.length > 0 || missingKeys.length > 0)
) {
  saveJson(
    argv["output-untranslated"],
    pick(en, [...missingKeys, ...untranslatedKeys]),
  );
  console.warn(`Output untranslated entries to ${argv["output-untranslated"]}`);
}

if (argv["rm-orphaned"] && orphanedKeys.length > 0) {
  outputFr = omit(outputFr, orphanedKeys);
  console.warn(
    "These values were removed from fr as they are not in en:",
    orphaned,
  );
} else if (orphanedKeys.length > 0) {
  console.error("These values are present in fr but not in en:", orphaned);
}

if (outputFr !== null) {
  // outputFr will not be null if either:
  //   - we have merged in entries from a merge-fr file
  //   - we have removed orphaned keys
  saveJson(argv.fr, outputFr);
}

if (
  missingKeys.length === 0 &&
  untranslatedKeys.length === 0 &&
  orphanedKeys.length === 0
) {
  console.log("Your translation files are ready to go!");
}
