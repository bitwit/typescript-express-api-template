import {JsonController, Param, Body, Get, Post, Put, Delete} from "routing-controllers";
import { User } from '../models/entities/User'
import { AuthToken } from '../models/entities/AuthToken'

class LoginBody {
    email: string
    password: string
}

@JsonController()
export class MainController {

    @Get("/")
    main() {
        return { success: true }
    }

    @Post("/login")
    async login(@Body() credentials: LoginBody) {
        const user = await User.findOne({ where: { email: credentials.email }})
        if (user.password != credentials.password) {
            return false
        }
        let authToken = new AuthToken()
        authToken.user = user
        await authToken.save()
        return AuthToken.findOne({token: authToken.token})
    }
}