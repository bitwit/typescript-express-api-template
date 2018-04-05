import { Constants } from "../constants";
import { JsonController, Param, Body, Get, Post, Put, Delete, HttpError } from "routing-controllers";
import { User } from '../models/entities/User'
import { AuthToken } from '../models/entities/AuthToken'
import * as bcrypt from 'bcrypt'

class LoginBody {
    email: string
    password: string
}

@JsonController()
export class MainController {

    @Get("/")
    main() {
        return Constants.DefaultSuccessBody
    }

    @Post("/login")
    async login(@Body() credentials: LoginBody) {
        const user = await User.findOne({ where: { email: credentials.email } })

        let matches = await bcrypt.compare(credentials.password, user.password)
        if (!matches) {
            throw new HttpError(400, "Credentials do not match")
        }
        let authToken = new AuthToken()
        authToken.user = user
        await authToken.save()
        return AuthToken.findOne({ token: authToken.token })
    }
}