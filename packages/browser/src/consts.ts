export const BASE64_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";

// 65 Emojis corresponding to the 64 Base64Url chars + padding '='
export const EMOJI_MAP = [
  "😀",
  "🥳",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇", // 0-9
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "🍳",
  "😚", // 10-19
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩", // 20-29
  "⭐",
  "😏",
  "😒",
  "🚀",
  "😔",
  "😟",
  "😕",
  "🙁",
  "😮",
  "😣", // 30-39
  "😖",
  "😫",
  "😩",
  "🥺",
  "🥑",
  "😭",
  "😤",
  "😠",
  "🍆",
  "🤬", // 40-49
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "❤️",
  "🤗", // 50-59
  "🤔",
  "🤭",
  "🤫",
  "🤥",
  "😶", // 60-64
];

export const CHAR_TO_EMOJI: Record<string, string> = {};
export const EMOJI_TO_CHAR: Record<string, string> = {};

for (let i = 0; i < BASE64_CHARS.length; i++) {
  const char = BASE64_CHARS[i];
  const emoji = EMOJI_MAP[i];
  CHAR_TO_EMOJI[char] = emoji;
  EMOJI_TO_CHAR[emoji] = char;
}
