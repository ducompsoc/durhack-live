/*
  Warnings:

  - You are about to drop the column `keycloak_access_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `keycloak_refresh_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "keycloak_access_token",
DROP COLUMN "keycloak_refresh_token";

-- CreateTable
CREATE TABLE "TokenSet" (
    "user_id" UUID NOT NULL,
    "token_type" TEXT,
    "access_token" TEXT,
    "id_token" TEXT,
    "refresh_token" TEXT,
    "scope" TEXT,
    "accessExpiry" TIMESTAMP(0),
    "sessionState" TEXT,

    CONSTRAINT "TokenSet_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "TokenSet" ADD CONSTRAINT "TokenSet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("keycloak_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
