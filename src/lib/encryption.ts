// graph-crypto-browser.ts

interface EncryptedField {
    ciphertext: string;
    iv: string;
    tag: string; // AES-GCM tag is embedded in ciphertext in subtle crypto
}

export interface EncryptedGraph {
    salt: string; // Base64
    data: any;
}
function getCircularReplacer() {
    const seen = new WeakSet();
    return (key: any, value: any) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
}

function encodeBase64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes));
}

function decodeBase64(str: string): Uint8Array {
    return new Uint8Array([...atob(str)].map(c => c.charCodeAt(0)));
}

async function deriveKey(password: string, salt): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            hash: "SHA-256",
            salt,
            iterations: 200000
            
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

async function encryptField(plaintext: string, key: CryptoKey): Promise<EncryptedField> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(plaintext)
    );

    return {
        ciphertext: encodeBase64(new Uint8Array(ciphertext)),
        iv: encodeBase64(iv),
        tag: "" // AES-GCM tag is already in ciphertext for subtle crypto
    };
}

async function decryptField(field: EncryptedField, key: CryptoKey): Promise<string> {
    const iv = decodeBase64(field.iv);
    const ciphertext = decodeBase64(field.ciphertext);
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
    );

    return new TextDecoder().decode(decrypted);
}

async function walkAndEncrypt(obj: any, key: CryptoKey) {
    for (const [k, v] of Object.entries(obj)) {
        if (k === "label" || k === "value") {
            if (typeof v === "string") {
                obj[k] = await encryptField(v, key);
            }
        } else if (v && typeof v === "object") {
            await walkAndEncrypt(v, key);
        }
    }
}

async function walkAndDecrypt(obj: any, key: CryptoKey) {
    for (const [k, v] of Object.entries(obj)) {
        if ((k === "label" || k === "value") && v && typeof v === "object" && "ciphertext" in v) {
            obj[k] = await decryptField(v as EncryptedField, key);
        } else if (v && typeof v === "object") {
            await walkAndDecrypt(v, key);
        }
    }
}

export async function encryptGraph(graph: any, password: string): Promise<EncryptedGraph> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveKey(password, salt);

    const encryptedData = JSON.parse(JSON.stringify(graph, getCircularReplacer()));
    await walkAndEncrypt(encryptedData, key);

    return {
        salt: encodeBase64(salt),
        data: encryptedData
    };
}

export async function decryptGraph(encrypted: EncryptedGraph, password: string): Promise<any> {
    const salt = decodeBase64(encrypted.salt);
    const key = await deriveKey(password, salt);

    const decryptedData = JSON.parse(JSON.stringify(encrypted.data, getCircularReplacer()));
    await walkAndDecrypt(decryptedData, key);

    return decryptedData;
}
