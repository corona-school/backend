const systemMessages = {
    de: {
        oneOnOne: `📎 Ihr könnt Bilder, Dateien und Dokumente über den Chat versenden.

📱 Wenn ihr die Lern-Fair App installiert, erhaltet ihr bei jeder neuen Chat-Nachricht eine Push-Benachrichtigung auf euer Smartphone.

🛡️ Idealerweise nutzt ihr nur unseren Chat und keine andere Messenger oder Email - so bleiben alle Nachrichten geschützt und an einem Ort.

😇 Bleibt respektvoll - bei problematischen oder respektlosen Nachrichten, schreib jederzeit an sorgen-eule@lern-fair.de`,
        groupChat: `📎 Ihr könnt Bilder, Dateien und Dokumente über den Chat versenden.

📱 Wenn ihr die Lern-Fair App installiert, erhaltet ihr bei jeder neuen Chat-Nachricht eine Push-Benachrichtigung auf euer Smartphone.

✍️ Kursleiter:innen können einstellen, ob auch Schüler:innen in den Gruppen-Chat schreiben dürfen. 

⛔ Der Chat wird 30 Tage nach Ende des Kurses inaktiv. 

😇 Bleibt respektvoll - bei problematischen oder respektlosen Nachrichten, schreib jederzeit an sorgen-eule@lern-fair.de`,
        toAnnouncementChat: 'Nur Kursleiter:innen können in den Chat schreiben.',
        toGroupChat: 'Es können nun auch Schüler:innen in den Chat schreiben.',
        deactivated: 'Es können keine Nachrichten mehr in den Chat geschrieben werden.',
        reactivated: 'Es können wieder Nachrichten in den Chat geschrieben werden.',
    },
    en: {
        oneOnOne:
            'By default, you will be notified about new chat messages via email. You can customize your notifications in the settings. We expect all chat messages to be respectful. If there are any insults or other problems, please contact us at sorgen-eule@lern-fair.de.',
        groupChat:
            'In this group chat, instructors can share important announcements and other information about their course with all students. Instructors can set whether or not students are allowed to post in the group chat. The chat will become inactive 30 days after the end of the course. We expect all chat messages to be respectful. If there are any insults or other problems, please contact us at sorgen-eule@lern-fair.de.',
    },
};

export default systemMessages;

// * ALL POSSIBLE SYSTEM MESSAGE
// * GROUP CHAT TYPE CHANGED
// await sendSystemMessage(systemMessages.de.toGroupChat, subcourse.conversationId, SystemMessage.GROUP_CHANGED);
// await sendSystemMessage(systemMessages.de.toAnnouncementChat, subcourse.conversationId, SystemMessage.GROUP_CHANGED);

// * OVER (one on one or group)
// await sendSystemMessage(systemMessages.de.deactivated, subcourse.conversationId, SystemMessage.GROUP_OVER);
// await sendSystemMessage(systemMessages.de.deactivated, subcourse.conversationId, SystemMessage.ONE_ON_ONE_OVER);

// * REACTIVATE
// await sendSystemMessage(systemMessages.de.reactivated, subcourse.conversationId, SystemMessage.GROUP_REACTIVATE);
// await sendSystemMessage(systemMessages.de.reactivated, subcourse.conversationId, SystemMessage.ONE_ON_ONE_REACTIVATE);
