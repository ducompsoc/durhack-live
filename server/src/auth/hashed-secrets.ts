import { pbkdf2, randomBytes, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

export const pbkdf2Async = promisify(pbkdf2)
export const randomBytesAsync = promisify(randomBytes)

interface Hashed {
  hashed_secret: Buffer
  salt: Buffer
}

export async function hashText(password: string, salt: Buffer): Promise<Buffer> {
  /**
   * Returns hashed text for password storage/comparison.
   *
   * @param password - the text to hash
   * @param salt - the salt to hash with
   * @returns the hashed password bytes
   */
  const normalized_password = password.normalize()
  // hash the text, for 310,000 iterations, using the SHA256 algorithm with an output key (hash) length of 32 bytes
  return await pbkdf2Async(normalized_password, salt, 310000, 32, "sha256")
}

export async function checkTextAgainstHash(hash: Hashed, password_attempt: string): Promise<boolean> {
  /**
   * Returns whether the password attempt is correct for the provided user.
   *
   * @param user - the user to compare against
   * @param password_attempt - the password attempt to check
   * @returns whether the password attempt matches the user's password hash
   */
  const hashed_password_attempt = await hashText(password_attempt, hash.salt)
  return timingSafeEqual(hashed_password_attempt, hash.hashed_secret)
}
