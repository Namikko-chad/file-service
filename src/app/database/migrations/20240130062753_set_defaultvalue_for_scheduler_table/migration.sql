-- AlterTable
ALTER TABLE "logs"."SchedulerTasks" ALTER COLUMN "startedAt" SET DEFAULT now(),
ALTER COLUMN "status" SET DEFAULT 'started';

-- AlterTable
ALTER TABLE "public"."FileUsers" ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();

-- AlterTable
ALTER TABLE "public"."Files" ALTER COLUMN "createdAt" SET DEFAULT now(),
ALTER COLUMN "updatedAt" SET DEFAULT now();
