import {
  decodeBase64Url,
  encodeBase64Url,
  fromEmoji,
  toEmoji,
} from "./encoder";

export { EMOJI_MAP } from "./consts";

export interface SignOptions {
  expiresIn?: string | number;
}

async function importKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function sign(
  payload: object,
  secret: string,
  _options: SignOptions = {}
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  
  const headerBase64 = encodeBase64Url(JSON.stringify(header));
  const payloadBase64 = encodeBase64Url(JSON.stringify(payload));
  
  const signatureInput = `${headerBase64}.${payloadBase64}`;
  
  const key = await importKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signatureInput)
  );
  
  // Convert ArrayBuffer to Base64Url
  const signatureBase64 = btoa(
    String.fromCharCode(...new Uint8Array(signatureBuffer))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
    
  const headerEmoji = toEmoji(headerBase64);
  const payloadEmoji = toEmoji(payloadBase64);
  const signatureEmoji = toEmoji(signatureBase64);
  
  return `${headerEmoji}.${payloadEmoji}.${signatureEmoji}`;
}

export async function verify(token: string, secret: string): Promise<object> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token structure");
  }
  
  const [headerEmoji, payloadEmoji, signatureEmoji] = parts;
  
  const headerBase64 = fromEmoji(headerEmoji);
  const payloadBase64 = fromEmoji(payloadEmoji);
  const signatureBase64 = fromEmoji(signatureEmoji);
  
  const signatureInput = `${headerBase64}.${payloadBase64}`;
  
  const key = await importKey(secret);
  const signatureBytes = new Uint8Array(
    atob(signatureBase64.replace(/-/g, "+").replace(/_/g, "/"))
      .split("")
      .map((c) => c.charCodeAt(0))
  );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    new TextEncoder().encode(signatureInput)
  );
    
  if (!isValid) {
    throw new Error("Invalid signature");
  }
  
  return JSON.parse(decodeBase64Url(payloadBase64));
}

export function decode(token: string): object {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token structure");
  }
  
  const payloadEmoji = parts[1];
  const payloadBase64 = fromEmoji(payloadEmoji);
  
  return JSON.parse(decodeBase64Url(payloadBase64));
}
