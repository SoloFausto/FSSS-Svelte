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
  const sets: [boolean, string][] = [
    [characterSet.upperAlphanumeric, CharacterSet.UpperAlphanumeric],
    [characterSet.lowerAlphanumeric, CharacterSet.LowerAlphanumeric],
    [characterSet.numbers, CharacterSet.Numbers],
    [characterSet.simpleSpecialCharacters, CharacterSet.SimpleSpecialCharacters],
    [characterSet.punctuationCharacters, CharacterSet.PunctuationCharacters],
    [characterSet.quotations, CharacterSet.Quotations],
    [characterSet.dashes, CharacterSet.Dashes],
    [characterSet.mathSymbols, CharacterSet.MathSymbols],
    [characterSet.braces, CharacterSet.Braces],
    [characterSet.extendedASCII, CharacterSet.ExtendedASCII],
  ];
  for (const [enabled, chars] of sets) {
    if (enabled) result += chars;
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

