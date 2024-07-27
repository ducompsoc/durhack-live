import { hashText, randomBytesAsync } from "@/auth/hashed-secrets"
import { Prisma, PrismaClient } from "@prisma/client"

const basePrisma = new PrismaClient()

export type User = Prisma.UserGetPayload<{ select: undefined }>
export type OAuthClient = Prisma.OAuthClientGetPayload<{ select: undefined }>
export type OAuthUser = Prisma.OAuthUserGetPayload<{ select: undefined }>

const extension = Prisma.defineExtension({
  name: "durhack-live",
  model: {
    oAuthClient: {
      async updateSecret({
        where,
        data,
      }: {
        where: Prisma.Args<typeof basePrisma.oAuthClient, "update">["where"]
        data: { secret: string }
      }): Promise<void> {
        const secretSalt = await randomBytesAsync(16)
        const hashedSecret = await hashText(data.secret, secretSalt)
        await basePrisma.oAuthClient.update({
          where: where,
          data: { hashedSecret, secretSalt },
        })
      },
    },
  },
})

const prisma = basePrisma.$extends(extension)

export { prisma }
