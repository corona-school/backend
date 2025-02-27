import { Field, InputType, ObjectType } from 'type-graphql';

@InputType('ChannelInput')
@ObjectType()
export class Channels {
    @Field()
    email: boolean;
    @Field({ nullable: true })
    push?: boolean;

    [otherChannel: string]: boolean;
}
@InputType('PreferencesInput')
@ObjectType()
export class NotificationPreferences {
    @Field({ nullable: true })
    chat?: Channels;
    @Field({ nullable: true })
    survey?: Channels;
    @Field({ nullable: true })
    appointment?: Channels;
    @Field({ nullable: true })
    advice?: Channels;
    @Field({ nullable: true })
    suggestion?: Channels;
    @Field({ nullable: true })
    announcement?: Channels;
    @Field({ nullable: true })
    call?: Channels;
    @Field({ nullable: true })
    news?: Channels;
    @Field({ nullable: true })
    event?: Channels;
    @Field({ nullable: true })
    request?: Channels;
    @Field({ nullable: true })
    alternative?: Channels;

    [otherType: string]: Channels;
}
