import { SHA3 } from "sha3";
import seedrandom from "seedrandom";

export interface CharacterSetOption {
		// label: string;
		// value: string;
    upperAlphanumeric: boolean;
    lowerAlphanumeric: boolean;
    numbers: boolean;
    simpleSpecialCharacters: boolean;
    punctuationCharacters: boolean;
    quotations: boolean;
    dashes: boolean;
    mathSymbols: boolean;
    braces: boolean;
    extendedASCII: boolean;
}
enum CharacterSet {
  UpperAlphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  LowerAlphanumeric = "abcdefghijklmnopqrstuvwxyz",
  Numbers = "0123456789",
  SimpleSpecialCharacters = "#$%&@^~`",
  PunctuationCharacters = ".,;:",
  Quotations = "'\"",
  Dashes = "-_|/\\",
  MathSymbols = "<>*+!?=",
  Braces = "[{()}]",
  ExtendedASCII = "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´≡±‗¾¶§÷¸°¨·¹³²■"
}

function getCharacterSet(characterSet: CharacterSetOption): string {
  let result = "";
  if (characterSet.upperAlphanumeric) {
    result += CharacterSet.UpperAlphanumeric;
  }
  if (characterSet.lowerAlphanumeric) {
    result += CharacterSet.LowerAlphanumeric;
  }
  if (characterSet.numbers) {
    result += CharacterSet.Numbers;
  }
  if (characterSet.simpleSpecialCharacters) {
    result += CharacterSet.SimpleSpecialCharacters;
  }
  if (characterSet.punctuationCharacters) {
    result += CharacterSet.PunctuationCharacters;
  }
  if (characterSet.quotations) {
    result += CharacterSet.Quotations;
  }
  if (characterSet.dashes) {
    result += CharacterSet.Dashes;
  }
  if (characterSet.mathSymbols) {
    result += CharacterSet.MathSymbols;
  }
  if (characterSet.braces) {
    result += CharacterSet.Braces;
  }
  if (characterSet.extendedASCII) {
    result += CharacterSet.ExtendedASCII;
  }
  if (result === "") {
    console.warn("No character set selected");
    result += CharacterSet.UpperAlphanumeric;
  }
  return result;
}

export function hash(masterPassword: string, servicePassword: string, characterSet: CharacterSetOption, length: number, seed: number): string {
  if (masterPassword === "" || servicePassword === "") {
    return "";
  }
  let generatedCharacterSet = getCharacterSet(characterSet);
  let generatedPassword: string = "";
  const hash = new SHA3(512);
  var hashValue = hash
    .update(masterPassword + hash.update(servicePassword) + seed)
    .digest("hex");
  var rng = seedrandom(hashValue);
  var charsetlen = generatedCharacterSet.length;
  for (var i = 0; i < length; i++) {
    generatedPassword +=
      generatedCharacterSet[Math.floor(rng() * charsetlen)];
  }
  return generatedPassword;
}

