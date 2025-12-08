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

export function encodeBase64Url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

export function decodeBase64Url(base64Str: string): string {
  return Buffer.from(base64Str, "base64url").toString("utf-8");
}
