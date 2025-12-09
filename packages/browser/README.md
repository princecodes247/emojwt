# @emojwt/browser

A browser-compatible library for signing and verifying JWTs using Emoji encoding.

## Installation

```bash
npm install @emojwt/browser
```

## Usage

### Sign a Token

```typescript
import { sign } from "@emojwt/browser";

const payload = { sub: "user123", role: "admin" };
const secret = "my-secret-key";

const token = await sign(payload, secret);
console.log(token); // 🦁.📦.✍️
```

### Verify a Token

```typescript
import { verify } from "@emojwt/browser";

const token = "🦁.📦.✍️";
const secret = "my-secret-key";

try {
  const payload = await verify(token, secret);
  console.log(payload);
} catch (error) {
  console.error("Invalid token");
}
```

### Decode a Token (without verification)

```typescript
import { decode } from "@emojwt/browser";

const token = "🦁.📦.✍️";
const payload = decode(token);
console.log(payload);
```
