-- CreateTable
CREATE TABLE "synapse"."TaskUserSubscribeTo" (
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TaskUserSubscribeTo_pkey" PRIMARY KEY ("userId","taskId")
);

-- AddForeignKey
ALTER TABLE "synapse"."TaskUserSubscribeTo" ADD CONSTRAINT "TaskUserSubscribeTo_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "synapse"."Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synapse"."TaskUserSubscribeTo" ADD CONSTRAINT "TaskUserSubscribeTo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "synapse"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
