import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";

import { User } from '../../models/entities/User'

@ValidatorConstraint({ name: 'isEmailAvailable', async: true })
export class IsEmailAvailableConstraint implements ValidatorConstraintInterface {

    validate(email: any, args: ValidationArguments) {
        return User.findOne({
            where: {email: email} 
        }).then((user) => {
            if (!user) {
                return true
            }
            return false
        })
        .catch((error) => {
            return Promise.resolve(true)
        })
    }

}

export function IsEmailAvailable(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAvailableConstraint
        });
   };
}