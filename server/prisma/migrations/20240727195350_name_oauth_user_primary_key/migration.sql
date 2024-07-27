-- DropForeignKey
ALTER TABLE "OAuthUser" DROP CONSTRAINT "OAuthUser_client_id_fkey";

-- DropForeignKey
ALTER TABLE "OAuthUser" DROP CONSTRAINT "OAuthUser_user_id_fkey";

-- AlterTable
ALTER TABLE "OAuthUser" RENAME CONSTRAINT "OAuthUser_pkey" TO "user_and_client_id";

-- AddForeignKey
ALTER TABLE "OAuthUser" ADD CONSTRAINT "OAuthUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("keycloak_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthUser" ADD CONSTRAINT "OAuthUser_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "OAuthClient"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;
