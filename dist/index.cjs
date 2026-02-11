"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  normalize: () => normalize
});
module.exports = __toCommonJS(index_exports);
var DIACRITICS = /[\u064B-\u065F]/g;
var ALIF_MADDA = /\u0622/g;
var ALIF_WASLA = /\u0671/g;
var ALIF_VARIANTS = /[\u0672\u0673]/g;
var SUPERSCRIPT_ALIF = /\u0670/g;
var FARSI_YEH = /[\u06CC\u06D2]/g;
var FARSI_KAF = /\u06A9/g;
var QURANIC_ANNOTATIONS = /[\u06D6-\u06ED]/g;
var TATWEEL = /\u0640/g;
var ORNATE_PARENS = /[\uFD3E\uFD3F]/g;
var ARABIC_DIGITS = /[\u0660-\u0669\u06F0-\u06F9]/g;
var PUNCTUATION = /[.,;:!?…\u060C\u061B\u061F]/g;
var MULTI_WHITESPACE = /\s+/g;
var HAMZA_TO_STRIP = /[\u0621\u0623\u0625\u0626]/g;
var ALEF_MAQSURA = /\u0649/g;
var UTHMANI_WAW_TA = /وا?ة/g;
var DOUBLE_YA = /يي/g;
var DEFAULT_OPTIONS = {
  diacritics: true,
  markers: true,
  verseNumbers: true,
  tatweel: true,
  smallLetters: true,
  punctuation: true,
  collapseWhitespace: true,
  stripHamza: false
};
function normalize(text, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let result = text;
  if (opts.diacritics) {
    result = result.replace(DIACRITICS, "");
    result = result.replace(ALIF_MADDA, "\u0627");
    result = result.replace(ALIF_WASLA, "\u0627");
    result = result.replace(ALIF_VARIANTS, "\u0627");
    result = result.replace(/\u0627\u0670/g, "\u0627");
    result = result.replace(SUPERSCRIPT_ALIF, "\u0627");
    result = result.replace(FARSI_YEH, "\u064A");
    result = result.replace(FARSI_KAF, "\u0643");
  }
  if (opts.markers || opts.smallLetters) {
    result = result.replace(QURANIC_ANNOTATIONS, "");
  }
  if (opts.verseNumbers) {
    result = result.replace(ORNATE_PARENS, "");
    result = result.replace(ARABIC_DIGITS, "");
  }
  if (opts.tatweel) {
    result = result.replace(TATWEEL, "");
  }
  if (opts.punctuation) {
    result = result.replace(PUNCTUATION, "");
  }
  if (opts.stripHamza) {
    result = result.replace(HAMZA_TO_STRIP, "");
    result = result.replace(ALEF_MAQSURA, "\u064A");
    result = result.replace(UTHMANI_WAW_TA, "\u0627\u0629");
    result = result.replace(DOUBLE_YA, "\u064A");
    result = result.replace(/([ا])لل/g, "$1\u0644");
  }
  if (opts.collapseWhitespace) {
    result = result.replace(MULTI_WHITESPACE, " ").trim();
  }
  return result;
}
var index_default = normalize;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  normalize
});
//# sourceMappingURL=index.cjs.map