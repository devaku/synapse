-- CreateTable
CREATE TABLE "synapse"."Socket" (
    "keycloakId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Socket_keycloakId_key" ON "synapse"."Socket"("keycloakId");

-- CreateIndex
CREATE UNIQUE INDEX "Socket_sessionId_key" ON "synapse"."Socket"("sessionId");
