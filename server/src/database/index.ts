import { type Prisma, PrismaClient } from "@prisma/client"

const basePrisma = new PrismaClient()

export type User = Prisma.UserGetPayload<{ include: { tokenSet: true } }>
export type TokenSet = Prisma.TokenSetGetPayload<{ select: undefined }>

const prisma = basePrisma

export { prisma }
