import { randomInt } from 'crypto';

export function random(len: number) {
  // Using crypto.randomInt for a cryptographically secure random number is safer than Math.random()
  const options = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += options.charAt(randomInt(0, options.length));
  }
  return result;
}