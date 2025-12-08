import { sign } from "./src/index";

const secret = "supersecret";
const payload = { sub: "1234567890", name: "John Doe", iat: 1516239022 };
const token = sign(payload, secret);
console.log(token);
