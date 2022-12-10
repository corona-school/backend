import { UserInputError } from 'apollo-server-express';
import { isEmail } from 'class-validator';

// ---------- Metadata Storage ----------------------
type GraphQLTypeClass = Function;

interface Validator<Options, Value> {
    field: string;
    options: Options;
    validate: (value: Value, options: Options) => Value;
}

const validatorRegistry = new Map<GraphQLTypeClass, Validator<any, any>[]>();

// --------- Buildtime - Store Decorators in Metadata ----------------------

// Creates custom validators for GraphQL Arguments
// Options - the options that can be passed into the decorator
// Value - the type of the field to be validated
//
// validate - the actual validator function which maps the value to a new value,
//             and might throw errors if validation fails
const CreateValidate = <Options, Value>(validate: Validator<Options, Value>['validate']) =>
    function Validate(options?: Options) {
        return function validatePropertyDecorator(value: object, field: string) {
            const typeClass = value.constructor as GraphQLTypeClass;
            if (!validatorRegistry.has(typeClass)) {
                validatorRegistry.set(typeClass, []);
            }

            validatorRegistry.get(typeClass).push({
                field,
                validate,
                options,
            });
        };
    };

// Usage:
//   @Field(type => String)
//   @ValidateEmail()
//   email: string;

export const ValidateEmail = CreateValidate<undefined, string>((email: string) => {
    // Validate E-Mail

    if (!isEmail(email)) {
        throw new UserInputError(`Invalid value: '${email}' is not a valid email`);
    }

    // Normalize E-Mail (this simplifies comparisons later on)

    // According to RFC 5322 (https://www.rfc-editor.org/rfc/rfc5322#section-3.4.1),
    // only the domain part is actually case insensitive, the local part can be case sensitive
    // As the majority of implementations treats this differently though we also do so
    // Some implementations also remove dots and plus from the local part (jonas.wilms+test -> jonaswilms),
    // we're rather conservative in that regard and stay closer to the spec

    email = email.toLowerCase();

    return email;
});

// --------- Runtime - Validate incoming arguments against Metadata --------
export function validate(argValue: any, argType: Function) {
    if (!validatorRegistry.has(argType)) {
        return;
    }

    const validators = validatorRegistry.get(argType);
    for (const validator of validators) {
        argValue[validator.field] = validator.validate(argValue[validator.field], validator.options);
    }
}
