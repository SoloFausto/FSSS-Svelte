import { SHA3 } from "sha3";
import seedrandom from "seedrandom";
export enum characterSet{
  LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  LETTERS_AND_NUMBERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
  LETTERS_NUMBERS_AND_SPECIAL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890@#%*()_+:;?/,.",
}
export function hash(masterPassword: string, servicePassword: string, characterSet: characterSet, length: number, seed: number): string {
  if (masterPassword === "" || servicePassword === "") {
    return "";
  }
  let generatedPassword: string = "";
  const hash = new SHA3(512);
  var hashValue = hash
    .update(masterPassword + hash.update(servicePassword) + seed)
    .digest("hex");
  var rng = seedrandom(hashValue);
  for (var i = 0; i < length; i++) {
    generatedPassword +=
      characterSet[Math.floor(rng() * characterSet.length)];
  }
  return generatedPassword;
}

