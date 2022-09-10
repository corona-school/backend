import { adminClient, defaultClient, test } from "./base";
import { pupilOne } from "./user";
import * as assert from "assert";

test("Admin set subcourse meetingURL and join", async () => {
    await adminClient.request(`
        mutation SetURL {
            subcourseSetMeetingURL(subcourseId: 1, meetingURL: 'https://example.com')
        }
    `);

    const meetingURL = await adminClient.request(`
        mutation GetURL {
            subcourseJoinMeeting(subcourseId: 1)
        }
    `);

    assert.strictEqual(meetingURL, "https://example.com");
});