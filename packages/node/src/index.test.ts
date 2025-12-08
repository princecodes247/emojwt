import { describe, expect, it } from "vitest";
import { decode, sign, verify } from "./index";
import { fromEmoji, toEmoji } from "@emojwt/common";

describe("emojwt node", () => {
  const secret = "supersecret";
  const payload = { sub: "1234567890", name: "John Doe", iat: 1516239022 };

  it("should sign and verify a token", () => {
    const token = sign(payload, secret);
    console.log("Token:", token);
    
    expect(token).toMatch(/[\u{1F600}-\u{1F64F}]/u);
    
    const decoded = verify(token, secret);
    expect(decoded).toEqual(payload);
  });

  it("should fail verification with wrong secret", () => {
    const token = sign(payload, secret);
    expect(() => verify(token, "wrongsecret")).toThrow("Invalid signature");
  });

  it("should fail verification if token is tampered", () => {
    const token = sign(payload, secret);
    const parts = token.split(".");
    parts[1] = parts[1].substring(0, parts[1].length - 2) + "😀😀"; 
    const tamperedToken = parts.join(".");
    
    expect(() => verify(tamperedToken, secret)).toThrow();
  });

  it("should decode without verification", () => {
    const token = sign(payload, secret);
    const decoded = decode(token);
    expect(decoded).toEqual(payload);
  });
});
