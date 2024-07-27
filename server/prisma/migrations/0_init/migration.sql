-- CreateTable
CREATE TABLE "User" (
    "keycloakUserId" UUID NOT NULL,
    "keycloakAccessToken" TEXT,
    "keycloakRefreshToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("keycloakUserId")
);

-- CreateTable
CREATE TABLE "OAuthClient" (
    "clientId" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "grants" JSONB NOT NULL DEFAULT '[]',
    "allowedScopes" JSONB NOT NULL DEFAULT '[]',
    "redirectUris" JSONB NOT NULL DEFAULT '[]',
    "accessTokenLifetime" INTEGER,
    "refreshTokenLifetime" INTEGER,
    "hashedSecret" BYTEA,
    "secretSalt" BYTEA,

    CONSTRAINT "OAuthClient_pkey" PRIMARY KEY ("clientId")
);

-- CreateTable
CREATE TABLE "OAuthUser" (
    "userId" UUID NOT NULL,
    "clientId" VARCHAR(256) NOT NULL,
    "minimumTokenIssueTime" TIMESTAMP(3),
    "minimumAuthCodeIssueTime" TIMESTAMP(3),

    CONSTRAINT "OAuthUser_pkey" PRIMARY KEY ("userId","clientId")
);

-- AddForeignKey
ALTER TABLE "OAuthUser" ADD CONSTRAINT "OAuthUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("keycloakUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthUser" ADD CONSTRAINT "OAuthUser_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "OAuthClient"("clientId") ON DELETE CASCADE ON UPDATE CASCADE;

