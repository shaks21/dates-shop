/*
  Warnings:

  - A unique constraint covering the columns `[metadata]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "stripe_session_idx" ON "public"."Order"("metadata");

-- CreateIndex
CREATE UNIQUE INDEX "Order_metadata_key" ON "public"."Order"("metadata");
