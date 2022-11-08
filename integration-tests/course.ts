import { adminClient, test } from "./base";
import { instructorOne } from "./user";
import * as assert from "assert";

test("Admin set subcourse meetingURL and join", async () => {
    await adminClient.request(`
        mutation SetURL {
            subcourseSetMeetingURL(subcourseId: 1, meetingURL: "https://example.com")
        }
    `);

    const meetingURL = await adminClient.request(`
        mutation GetURL {
            subcourseJoinMeeting(subcourseId: 1)
        }
    `);

    assert.strictEqual(meetingURL.subcourseJoinMeeting, "https://example.com");
});

test("Search further instructors", async() => {
    const { client } = await instructorOne;

    const emailSearch = await client.request(`query { otherInstructors(search: "@Lern-Fair.de", take: 100, skip: 0) { id }}`);
    assert.equal(emailSearch.otherInstructors.length, 2);

    const firstnameSearch = await client.request(`query { otherInstructors(search: "melanie", take: 100, skip: 0) { firstname }}`);
    assert.equal(firstnameSearch.otherInstructors.length, 1);
    assert.equal(firstnameSearch.otherInstructors[0].firstname, "Melanie");

    const lastnameSearch = await client.request(`query { otherInstructors(search: "meiers", take: 100, skip: 0) { lastname }}`);
    assert.equal(lastnameSearch.otherInstructors.length, 1);
    assert.equal(lastnameSearch.otherInstructors[0].lastname, "Meiers");

    const nameSearch = await client.request(`query { otherInstructors(search: "melanie meiers", take: 100, skip: 0) { firstname lastname }}`);
    assert.equal(nameSearch.otherInstructors.length, 1);
    assert.equal(nameSearch.otherInstructors[0].firstname, "Melanie");

});