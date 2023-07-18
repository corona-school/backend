// Slack Formatting as described in https://slack.com/intl/de-de/help/articles/202288908-Nachrichten-formatieren

export const bold = (text: string) => `*${text}*`;
export const italic = (text: string) => `_${text}_`;
export const strikethrough = (text: string) => `~${text}~`;
export const code = (text: string) => `\`${text}\``;
export const list = (items: string[]) => `\n` + items.map((it) => ` - ${it}`).join(`\n`);
