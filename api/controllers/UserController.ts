import { Constants } from "../constants";
import { JsonController, Param, Body, Get, Post, Put, Delete, CurrentUser, Authorized, HttpError, UnauthorizedError } from "routing-controllers";
import { User } from '../models/entities/User'
import { IsEmail, IsInt, IsOptional, MinLength, MaxLength } from 'class-validator'
import { IsEmailAvailable } from './validators/IsEmailAvailable'
import * as bcrypt from 'bcrypt'

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

        var salt = await bcrypt.genSalt(Constants.HashDifficulty)
		var hashPassword = await bcrypt.hash(user.password, salt);
        user.password = hashPassword

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
            throw new UnauthorizedError("Can not edit other users")
        }

        Object.assign(currentUser, userData)
        return currentUser.save()
    }

    @Delete("/:id")
    @Authorized("admin")
    async remove(@Param("id") id: number) {
        return await User.removeById(id)
    }

}
