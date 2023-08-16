import { promisify } from "util";
import { randomBytes, pbkdf2, timingSafeEqual } from "crypto";

import User from "@/database/user";
import { NullError } from "@/common/errors";


export const pbkdf2Async = promisify(pbkdf2);
export const randomBytesAsync = promisify(randomBytes);

export async function hashPasswordText(password: string, salt: Buffer): Promise<Buffer> {
  /**
   * Returns hashed text for password storage/comparison.
   *
   * @param password - the text to hash
   * @param salt - the salt to hash with
   * @returns the hashed password bytes
   */
  const normalized_password = password.normalize();
  // hash the text, for 310,000 iterations, using the SHA256 algorithm with an output key (hash) length of 32 bytes
  return await pbkdf2Async(normalized_password, salt, 310000, 32, "sha256");
}

export async function checkPassword(user: User, password_attempt: string): Promise<boolean> {
  /**
   * Returns whether the password attempt is correct for the provided user.
   *
   * @param user - the user to compare against
   * @param password_attempt - the password attempt to check
   * @returns whether the password attempt matches the user's password hash
   */
  if (!(user.password_salt instanceof Buffer && user.hashed_password instanceof Buffer)) {
    throw new NullError("Password has not been set");
  }

  const hashed_password_attempt = await hashPasswordText(password_attempt, user.password_salt);
  return timingSafeEqual(hashed_password_attempt, user.hashed_password);
}
