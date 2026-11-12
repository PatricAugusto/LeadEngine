CREATE TABLE "Prospect" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "cnpj" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "tradeName" TEXT,
  "cnaePrimary" TEXT NOT NULL,
  "cnaeDescription" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "companySize" TEXT,
  "openedAt" DATETIME,
  "sourceActive" BOOLEAN NOT NULL DEFAULT true,
  "score" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'new',
  "sourceVersion" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "Prospect_cnpj_key" ON "Prospect"("cnpj");
CREATE INDEX "Prospect_state_status_idx" ON "Prospect"("state", "status");
CREATE INDEX "Prospect_state_cnaePrimary_idx" ON "Prospect"("state", "cnaePrimary");
CREATE INDEX "Prospect_companyName_idx" ON "Prospect"("companyName");

CREATE TABLE "SearchRun" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "statesJson" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'queued',
  "currentStep" TEXT NOT NULL DEFAULT 'queued',
  "progress" INTEGER NOT NULL DEFAULT 0,
  "processedRows" INTEGER NOT NULL DEFAULT 0,
  "foundRows" INTEGER NOT NULL DEFAULT 0,
  "sourceVersion" TEXT,
  "error" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" DATETIME,
  "finishedAt" DATETIME
);
CREATE INDEX "SearchRun_status_createdAt_idx" ON "SearchRun"("status", "createdAt");

CREATE TABLE "SearchSchedule" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "cronExpression" TEXT NOT NULL DEFAULT '0 3 1 * *',
  "statesJson" TEXT NOT NULL DEFAULT '[]',
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "Campaign" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "Campaign_status_updatedAt_idx" ON "Campaign"("status", "updatedAt");

CREATE TABLE "CampaignProspect" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "campaignId" TEXT NOT NULL,
  "prospectId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "CampaignProspect_campaignId_fkey"
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CampaignProspect_prospectId_fkey"
    FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CampaignProspect_campaignId_prospectId_key"
  ON "CampaignProspect"("campaignId", "prospectId");
CREATE INDEX "CampaignProspect_prospectId_idx" ON "CampaignProspect"("prospectId");
CREATE INDEX "CampaignProspect_campaignId_status_idx"
  ON "CampaignProspect"("campaignId", "status");
