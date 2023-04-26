export interface GetResponse {
    readonly Count: number;
    readonly Data: ReadonlyArray<object>;
    readonly Total: number;
}

export interface SendParams {
    Messages: SendParamsMessage[];
    SandboxMode?: boolean;
}

export interface SendParamsMessage {
    From: {
        Email: string;
        Name?: string;
    };
    Sender?: {
        Email: string;
        Name?: string;
    };
    To: SendParamsRecipient[];
    Cc?: SendParamsRecipient[];
    Bcc?: SendParamsRecipient[];
    ReplyTo?: SendParamsRecipient;
    Variables?: object;
    TemplateID?: number;
    TemplateLanguage?: boolean;
    Subject: string;
    TextPart?: string;
    HTMLPart?: string;
    MonitoringCategory?: string;
    URLTags?: string;
    CustomCampaign?: string;
    DeduplicateCampaign?: boolean;
    EventPayload?: string;
    CustomID?: string;
    Headers?: object;
    Attachments?: Attachment[];
    InlinedAttachments?: InlinedAttachment[];
}

interface SendParamsRecipient {
    Email: string;
    Name?: string;
}

interface Attachment {
    ContentType: string;
    Filename: string;
    Base64Content: string;
}

interface InlinedAttachment extends Attachment {
    ContentID: string;
}
