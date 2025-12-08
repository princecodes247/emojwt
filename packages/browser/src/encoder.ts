import { CHAR_TO_EMOJI, EMOJI_TO_CHAR } from "./consts";

export function toEmoji(base64Str: string): string {
  let result = "";
  for (const char of base64Str) {
    const emoji = CHAR_TO_EMOJI[char];
    if (!emoji) {
      throw new Error(`Invalid Base64 character: ${char}`);
    }
    result += emoji;
  }
  return result;
}

export function fromEmoji(emojiStr: string): string {
  let result = "";
  // Use iterator to handle surrogate pairs correctly
  for (const emoji of emojiStr) {
    const char = EMOJI_TO_CHAR[emoji];
    if (!char) {
      throw new Error(`Invalid Emoji: ${emoji}`);
    }
    result += char;
  }
  return result;
}

export function encodeBase64Url(input: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBase64Url(base64Str: string): string {
  let base64 = base64Str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}
