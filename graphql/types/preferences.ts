import { Field, InputType, ObjectType } from 'type-graphql';

@InputType('ChannelInput')
@ObjectType()
class Channel {
    @Field()
    email: boolean;
    @Field()
    chat: boolean;
    @Field()
    whatsapp: boolean;
}

@InputType('PreferencesInput')
@ObjectType()
export class Preferences {
    @Field()
    chat: Channel;
    @Field()
    match: Channel;
    @Field()
    course: Channel;
    @Field()
    appointment: Channel;
    @Field()
    survey: Channel;
    @Field()
    news: Channel;
}
