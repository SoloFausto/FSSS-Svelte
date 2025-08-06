import { SHA3 } from "sha3";
import seedrandom from "seedrandom";

export interface CharacterSetOption {
		label: string;
		value: string;
}
export const characterSetChoices: CharacterSetOption[] = [
  { label: "Letters", value: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" },
  { label: "Numbers", value: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890" },
  { label: "Special Characters", value: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890@#%*()_+:;?/,." },
];

export function hash(masterPassword: string, servicePassword: string, characterSet: CharacterSetOption, length: number, seed: number): string {
  if (masterPassword === "" || servicePassword === "") {
    return "";
  }
  let generatedPassword: string = "";
  const hash = new SHA3(512);
  var hashValue = hash
    .update(masterPassword + hash.update(servicePassword) + seed)
    .digest("hex");
  var rng = seedrandom(hashValue);
  var charsetlen = characterSet.value.length;
  for (var i = 0; i < length; i++) {
    generatedPassword +=
      characterSet.value[Math.floor(rng() * charsetlen)];
  }
  return generatedPassword;
}

