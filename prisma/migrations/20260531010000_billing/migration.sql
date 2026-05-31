-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'FAILED');

-- CreateTable
CREATE TABLE "SubscriptionPayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "amountUsd" INTEGER NOT NULL,
    "days" INTEGER NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'crypto_bot',
    "providerInvoiceId" TEXT,
    "invoiceUrl" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionPayment_providerInvoiceId_key" ON "SubscriptionPayment"("providerInvoiceId");

-- CreateIndex
CREATE INDEX "SubscriptionPayment_userId_status_idx" ON "SubscriptionPayment"("userId", "status");

-- CreateIndex
CREATE INDEX "SubscriptionPayment_createdAt_idx" ON "SubscriptionPayment"("createdAt");

-- AddForeignKey
ALTER TABLE "SubscriptionPayment" ADD CONSTRAINT "SubscriptionPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
