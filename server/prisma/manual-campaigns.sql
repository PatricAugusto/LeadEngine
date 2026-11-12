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
