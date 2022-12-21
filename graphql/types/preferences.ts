import { Field, InputType, ObjectType } from 'type-graphql';

@InputType('ChannelInput')
@ObjectType()
export class Channels {
    @Field()
    email: boolean;
}
@InputType('PreferencesInput')
@ObjectType()
export class NotificationPreferences {
    @Field({ nullable: true })
    chat?: Channels;
    @Field({ nullable: true })
    match?: Channels;
    @Field({ nullable: true })
    course?: Channels;
    @Field({ nullable: true })
    appointment?: Channels;
    @Field({ nullable: true })
    survey?: Channels;
    @Field({ nullable: true })
    news?: Channels;
    @Field({ nullable: true })
    newsletter?: Channels;
    @Field({ nullable: true })
    training?: Channels;
    @Field({ nullable: true })
    events?: Channels;
    @Field({ nullable: true })
    newsoffer?: Channels;
    @Field({ nullable: true })
    request?: Channels;
    @Field({ nullable: true })
    learnoffer?: Channels;
    @Field({ nullable: true })
    alternativeoffer?: Channels;
    @Field({ nullable: true })
    feedback?: Channels;
}
