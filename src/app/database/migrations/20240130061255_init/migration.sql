-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "logs";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "logs"."enum_SchedulerTasks_status" AS ENUM ('started', 'completed', 'failed');

-- CreateTable
CREATE TABLE "public"."Files" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    "updatedAt" TIMESTAMPTZ DEFAULT now(),
    "ext" VARCHAR(10) NOT NULL,
    "mime" VARCHAR(255) NOT NULL,
    "size" BIGINT NOT NULL,
    "storage" VARCHAR(255),
    "hash" VARCHAR(255) NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileUsers" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMPTZ DEFAULT now(),
    "updatedAt" TIMESTAMPTZ DEFAULT now(),
    "userId" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "public" BOOLEAN DEFAULT false,

    CONSTRAINT "FileUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Storage" (
    "id" UUID NOT NULL,
    "data" BYTEA,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GoogleDrive" (
    "fileId" UUID NOT NULL,
    "driveId" UUID,

    CONSTRAINT "GoogleDrive_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "logs"."SchedulerTasks" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "startedAt" TIMESTAMPTZ DEFAULT now(),
    "finishedAt" TIMESTAMPTZ,
    "status" "logs"."enum_SchedulerTasks_status" NOT NULL,
    "error" TEXT,

    CONSTRAINT "SchedulerTasks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FileUsers" ADD CONSTRAINT "FileUsers_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
