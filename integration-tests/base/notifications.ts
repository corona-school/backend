import assert from "assert";
import { adminClient } from ".";

interface MockNotification {
    id: number;
}

interface ConcreteNotification {
    contextID?: string;
    context: any;
    error?: string;
}

export async function createMockNotification(action: string, description: string): Promise<MockNotification> {
    const { notificationCreate: { id } } = await adminClient.request(`mutation Create${description} {
        notificationCreate(notification: { 
            description: "MOCK ${description}"
            active: false
            recipient: 0
            onActions: { set: ["${action}"]}
            cancelledOnAction: { set: []}
        }) { id }
    }`);

    await adminClient.request(`mutation Activate${description} { notificationActivate(notificationId: ${id}, active: true)}`);

    return { id };
}

export async function assertUserReceivedNotification(notification: MockNotification, userID: string): Promise<ConcreteNotification> {
    // Sending of concrete notifications happens concurrently to the main flow, so we might get a response back before a notification was sent
    await new Promise((res) => setTimeout(res, 500));

    const result = await adminClient.request(`query GetNotificationForUser { 
        concrete_notifications(where: { userId: { equals: "${userID}" } notificationID: { equals: ${notification.id} } state: { equals: 2 } }, take: 2) { 
           contextID
           context
           error
      }
    }`);

    assert.strictEqual(result.concrete_notifications.length, 1, "Expected user to receive exactly one concrete notification");

    return result.concrete_notifications[0];
}