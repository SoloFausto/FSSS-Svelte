import { SHA3 } from 'sha3';
import seedrandom from "seedrandom";



const DEFAULT_CHARACTER_SET:string = "ABCDFGHIJKLMNOPQRSTUVWXYZabdfghijklmnopqrstuvwxyz1234567890";
const UPDATED_CHARACTER_SET:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890*!#$&_@%";
const DEFAULT_LENGTH:number = 32;

export function hash(masterPassword:string,servicePassword:string) {
    
    if (masterPassword === "" || servicePassword === "") {
        return "";
    }
    let generatedPassword:string = "";
    const hash = new SHA3(512);
    var hashValue = hash.update(masterPassword + hash.update(servicePassword)).digest('hex');
    var rng = seedrandom(hashValue);
    for (var i = 0; i < DEFAULT_LENGTH; i++) {
        generatedPassword += UPDATED_CHARACTER_SET[Math.floor(rng() * UPDATED_CHARACTER_SET.length)];
    }
    return generatedPassword;
}

export function processInputPassword(inputPassword:string) {
    if (inputPassword === "") {
        return "";
    }
    
}