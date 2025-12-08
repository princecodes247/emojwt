import { createHmac } from "node:crypto";
import {
  decodeBase64Url,
  encodeBase64Url,
  fromEmoji,
  toEmoji,
} from "@emojwt/common";

export interface SignOptions {
  expiresIn?: string | number; // Not implemented for MVP, but good to have in interface
}

export function sign(
  payload: object,
  secret: string,
  _options: SignOptions = {},
): string {
  const header = { alg: "HS256", typ: "JWT" };

  const headerBase64 = encodeBase64Url(JSON.stringify(header));
  const payloadBase64 = encodeBase64Url(JSON.stringify(payload));

  const signatureInput = `${headerBase64}.${payloadBase64}`;
  const signature = createHmac("sha256", secret)
    .update(signatureInput)
    .digest("base64url");

  const headerEmoji = toEmoji(headerBase64);
  const payloadEmoji = toEmoji(payloadBase64);
  const signatureEmoji = toEmoji(signature);

  return `${headerEmoji}.${payloadEmoji}.${signatureEmoji}`;
}

export function verify(token: string, secret: string): object {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token structure");
  }

  const [headerEmoji, payloadEmoji, signatureEmoji] = parts;

  const headerBase64 = fromEmoji(headerEmoji);
  const payloadBase64 = fromEmoji(payloadEmoji);
  const signatureBase64 = fromEmoji(signatureEmoji);

  const signatureInput = `${headerBase64}.${payloadBase64}`;
  const expectedSignature = createHmac("sha256", secret)
    .update(signatureInput)
    .digest("base64url");

  if (signatureBase64 !== expectedSignature) {
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
