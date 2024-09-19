-- CreateTable
CREATE TABLE "User" (
    "keycloak_user_id" UUID NOT NULL,
    "keycloak_access_token" TEXT,
    "keycloak_refresh_token" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("keycloak_user_id")
);

-- CreateTable
CREATE TABLE "OAuthClient" (
    "client_id" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "grants" JSONB NOT NULL DEFAULT '[]',
    "allowed_scopes" JSONB NOT NULL DEFAULT '[]',
    "redirect_uris" JSONB NOT NULL DEFAULT '[]',
    "access_token_lifetime" INTEGER,
    "refresh_token_lifetime" INTEGER,
    "hashed_secret" BYTEA,
    "secret_salt" BYTEA,

    CONSTRAINT "OAuthClient_pkey" PRIMARY KEY ("client_id")
);

-- CreateTable
CREATE TABLE "OAuthUser" (
    "user_id" UUID NOT NULL,
    "client_id" VARCHAR(256) NOT NULL,
    "minimum_token_issue_time" TIMESTAMP(3),
    "minimum_auth_code_issue_time" TIMESTAMP(3),

    CONSTRAINT "OAuthUser_pkey" PRIMARY KEY ("user_id","client_id")
);

-- AddForeignKey
ALTER TABLE "OAuthUser" ADD CONSTRAINT "OAuthUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("keycloak_user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthUser" ADD CONSTRAINT "OAuthUser_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "OAuthClient"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

