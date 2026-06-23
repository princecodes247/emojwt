# 🦁 emojwt 📦.✍️

A fun, colorful, and fully spec-compliant implementation of JSON Web Tokens (JWT) encoded entirely in Emojis. Why look at boring Base64Url characters when you can verify your authentication tokens with a sequence of expressive emojis?

`emojwt` maps the 64 Base64Url characters plus the `=` padding character directly to 65 carefully curated emojis. It is a 1-to-1 mapping, meaning any standard JWT can be converted to an `emojwt` and vice versa.

---

## 🚀 Repository Structure

This project is a monorepo managed with npm workspaces:

*   **[`packages/node`](file:///Users/codes/Developer/emojwt/packages/node)**: Node.js compatible library for signing, verifying, and decoding emoji JWTs. Powered by Node's native `crypto` module.
*   **[`packages/browser`](file:///Users/codes/Developer/emojwt/packages/browser)**: Lightweight browser-compatible library for signing, verifying, and decoding emoji JWTs using the Web Crypto API.
*   **[`apps/web`](file:///Users/codes/Developer/emojwt/apps/web)**: An interactive web-based playground (React + Vite) similar to [jwt.io](https://jwt.io), allowing you to paste, edit, and decode/sign `emojwt`s live in the browser.

---

## 🎨 How it Works

Standard JWTs consist of three parts separated by dots (`.`):
```
[Header].[Payload].[Signature]
```
Each part is standard Base64Url encoded. `emojwt` translates each character of these Base64Url strings into a corresponding emoji using a lookup table:

*   `A` ➔ `😀`
*   `B` ➔ `🥳`
*   ...and so on.

The final token looks something like this:
```
🦁.📦.✍️
```
*(where each section is a sequence of emojis separated by literal dots)*

---

## 📦 Installation

To install the appropriate package for your environment:

### Node.js
```bash
npm install @emojwt/node
```

### Browser / Frontend
```bash
npm install @emojwt/browser
```

---

## 💻 Usage Quickstart

### Node.js

```typescript
import { sign, verify, decode } from "@emojwt/node";

const secret = "my-super-secret-key";
const payload = { sub: "1234567890", name: "Alice", admin: true };

// 1. Sign a token
const token = sign(payload, secret);
console.log("Your Emoji JWT:", token);
// Output: 🦁.📦.✍️ (a string of emojis separated by dots)

// 2. Verify and decode a token
try {
  const verifiedPayload = verify(token, secret);
  console.log("Verified Payload:", verifiedPayload);
} catch (err) {
  console.error("Signature verification failed!", err);
}

// 3. Decode without verification
const decoded = decode(token);
console.log("Decoded Payload:", decoded);
```

### Browser (Web Crypto API)

The `@emojwt/browser` package uses async functions since Web Crypto operations are asynchronous:

```typescript
import { sign, verify } from "@emojwt/browser";

const secret = "my-super-secret-key";
const payload = { sub: "1234567890", name: "Alice" };

// 1. Sign a token
const token = await sign(payload, secret);

// 2. Verify a token
const verifiedPayload = await verify(token, secret);
```

---

## 🛠️ Development

To get started with local development, clone the repository and install dependencies:

```bash
# Install dependencies for all workspaces
npm install

# Run the lint rules
npm run lint

# Format the codebase
npm run format

# Run tests
npm run test
```

### Running the Web Playground Locally

To run the interactive playground:

```bash
npm run dev -w apps/web
```

---

## 📜 License

MIT
