import { JsonController, Param, Body, Get, Post, Put, Delete, CurrentUser, Authorized } from "routing-controllers";
import { User } from '../models/entities/User'
import { IsEmail, IsInt, IsOptional, MinLength, MaxLength } from 'class-validator'
import { IsEmailAvailable } from './validators/IsEmailAvailable'

class Constants {
    static readonly PasswordMinLength = 8
    static readonly PasswordMaxLength = 32
    static readonly EmailTakenMessage = "Email address is already taken"
}

class CreateUserBody {

    @IsEmail()
    @IsEmailAvailable({ message: Constants.EmailTakenMessage })
    email: string

    @MinLength(Constants.PasswordMinLength)
    @MaxLength(Constants.PasswordMaxLength)
    password: string
}

class UpdateUserBody {

    @IsEmail()
    @IsEmailAvailable({ message: Constants.EmailTakenMessage })
    @IsOptional()
    email: string

    @MinLength(Constants.PasswordMinLength)
    @MaxLength(Constants.PasswordMaxLength)
    @IsOptional()
    password: string
}

@JsonController("/users")
export class UserController {

    @Get("/")
    async getAll() {
        return await User.find()
    }

    @Get("/:id")
    async getOne(@Param("id") id: number) {
        return await User.findOneById(id)
    }

    @Post("/")
    @Authorized()
    async post(@Body({ validate: true }) user: CreateUserBody) {
        let newUser = await User.create(user)
        return await newUser.save()
    }

    @Put("/:id")
    @Authorized()
    async put(
        @CurrentUser({ required: true }) currentUser: User,
        @Param("id") id: number,
        @Body({ validate: true }) userData: UpdateUserBody) {

        if (id != currentUser.id) {
            throw new Error("Can not edit other users")
        }

        return await User.updateById(id, userData)
    }

    @Delete("/:id")
    @Authorized("admin")
    async remove(@Param("id") id: number) {
        return await User.removeById(id)
    }

}
