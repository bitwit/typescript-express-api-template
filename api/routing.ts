import { RoutingControllersOptions, Action } from 'routing-controllers'
import { User } from './models/entities/User'
import { AuthToken } from './models/entities/AuthToken'

const routing: RoutingControllersOptions = {
  controllers: [__dirname + "/controllers/*.js"],
  authorizationChecker: async (action: Action, roles: string[]) => {
    const token = action.request.headers["authorization"];
    const authToken = await AuthToken.findOne({ where: { token: token } })
    return true
  },
  currentUserChecker: async (action: Action): Promise<User> => {
    const token = action.request.headers["authorization"];
    const authToken = await AuthToken.findOne({ where: { token: token }, relations: ["user"] })
    return authToken.user
  }
}

export { routing }