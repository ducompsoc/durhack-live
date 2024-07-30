import path from "node:path"
import { getTokenVault } from "@durhack/token-vault"

import { dirname } from "@/dirname";
import { jwtConfig } from "@/config";
import { prisma, type User } from "@/database";

function resolveFilePathFromProjectRoot(path_to_resolve: string): string {
  return path.resolve(path.join(dirname, "..", path_to_resolve))
}

export default await getTokenVault<User>({
  getUserIdentifier: (user: User) => user.keycloakUserId,
  findUniqueUser: async (userId: unknown) => {
    if (typeof userId !== "string") return null
    return await prisma.user.findUnique({
      where: {
        keycloakUserId: userId,
      },
    })
  },
  filePathResolver: resolveFilePathFromProjectRoot,
  ...jwtConfig
})
