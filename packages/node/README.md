# @emojwt/node

A Node.js library for signing and verifying JWTs using Emoji encoding.

## Installation

```bash
npm install @emojwt/node
```

## Usage

### Sign a Token

```typescript
import { sign } from "@emojwt/node";

const payload = { sub: "user123", role: "admin" };
const secret = "my-secret-key";

const token = sign(payload, secret);
console.log(token); // 🦁.📦.✍️
```

### Verify a Token

```typescript
import { verify } from "@emojwt/node";

const token = "🦁.📦.✍️";
const secret = "my-secret-key";

try {
  const payload = verify(token, secret);
  console.log(payload);
} catch (error) {
  console.error("Invalid token");
}
```

### Decode a Token (without verification)

```typescript
import { decode } from "@emojwt/node";

const token = "🦁.📦.✍️";
const payload = decode(token);
console.log(payload);
```
