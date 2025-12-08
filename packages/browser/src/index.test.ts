import { describe, expect, it } from "vitest";
import { decode, sign, verify } from "./index";
import { fromEmoji, toEmoji } from "./encoder";

describe("emojwt browser", () => {
  const secret = "supersecret";
  const payload = { sub: "1234567890", name: "John Doe", iat: 1516239022 };

  it("should sign and verify a token", async () => {
    const token = await sign(payload, secret);
    console.log("Token:", token);
    
    expect(token).toMatch(/[\u{1F600}-\u{1F64F}]/u);
    
    const decoded = await verify(token, secret);
    expect(decoded).toEqual(payload);
  });

  it("should fail verification with wrong secret", async () => {
    const token = await sign(payload, secret);
    await expect(verify(token, "wrongsecret")).rejects.toThrow("Invalid signature");
  });

  it("should fail verification if token is tampered", async () => {
    const token = await sign(payload, secret);
    const parts = token.split(".");
    parts[1] = parts[1].substring(0, parts[1].length - 2) + "😀😀"; 
    const tamperedToken = parts.join(".");
    
    await expect(verify(tamperedToken, secret)).rejects.toThrow();
  });

  it("should decode without verification", async () => {
    const token = await sign(payload, secret);
    const decoded = decode(token);
    expect(decoded).toEqual(payload);
  });
});
