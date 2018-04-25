import { Constants } from "../constants";
import { JsonController, Param, Body, Get, Post, Put, Delete, CurrentUser, Authorized, HttpError, UnauthorizedError } from "routing-controllers";
import { User } from '../models/entities/User'
import { PasswordResetRequest } from '../models/entities/PasswordResetRequest'
import { IsEmail, IsInt, IsOptional, MinLength, MaxLength } from 'class-validator'
import { IsEmailAvailable } from './validators/IsEmailAvailable'
import * as bcrypt from 'bcrypt'

class ResetPasswordRequestBody {
    @IsEmail()
    email: string
}

class ResetPasswordBody {

    token: string

    @MinLength(Constants.PasswordMinLength)
    @MaxLength(Constants.PasswordMaxLength)
    password: string
}

@JsonController("/password")
export class PasswordController {

    @Post("/requestReset")
    @Authorized()
    async postReset(@Body({ validate: true }) body: ResetPasswordRequestBody) {
        try {
            const userRecord = await User.findOne({ where: { email: body.email } })
            const resetRequest = PasswordResetRequest.create({ user: userRecord })
            await resetRequest.save()
        } catch (err) { }

        // always succeed to not reveal whether the email exists (for security reasons)
        return Constants.DefaultSuccessBody
    }

    @Post("/reset")
    @Authorized()
    async post(@Body({ validate: true }) body: ResetPasswordBody) {
        const resetRequest = await PasswordResetRequest.findOne({ where: { token: body.token }, relations: ["user"] })
        await resetRequest.user.setNewPasswordSecurely(body.password)
        await resetRequest.user.save()
        return Constants.DefaultSuccessBody
    }

}
