-- AddForeignKey
ALTER TABLE "concrete_notification" ADD CONSTRAINT "concrete_notification_notificationID_fkey" FOREIGN KEY ("notificationID") REFERENCES "notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
