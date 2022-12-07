import { Field, InputType, ObjectType } from 'type-graphql';

@InputType('ChannelInput')
@ObjectType()
class Channels {
    @Field()
    email: boolean;
}
@InputType('PreferencesInput')
@ObjectType()
export class NotificationPreferences {
    @Field()
    chat: Channels;
    @Field()
    match: Channels;
    @Field()
    course: Channels;
    @Field()
    appointment: Channels;
    @Field()
    survey: Channels;
    @Field()
    news: Channels;
}
