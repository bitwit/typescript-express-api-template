import { createConnection, Connection, ConnectionOptions } from "typeorm"
import { createExpressServer } from "routing-controllers"
import "reflect-metadata" // this shim is required
import { routing } from './routing'
import * as express from 'express'
import * as http from 'http'

const swaggerJson = require('../swagger.json')

export const app = createExpressServer(routing)
const httpServer = http.createServer(app)

app.use('/swagger', express.static('swagger'))
app.get('/docs', (req: any, res: any) => {
    res.send(swaggerJson)
})

const postGresConfig: ConnectionOptions = {
    type: "postgres",
    url: process.env["DATABASE_URL"],
    username: process.env["DATABASE_USER"],
    entities: [__dirname + "/models/entities/**.js"],
    logging: true
}

let connection: Connection = null

export async function startServer(): Promise<Connection> {
    try {
        connection = await createConnection(postGresConfig)
        console.log("db connection established")
    }
    catch (err) { console.log("connection error", err) }
    httpServer.listen(3000, () => console.log('Example app listening on port 3000!'))

    return connection
}

export async function stopServer() {
    if (connection) {
        await connection.close()
        await httpServer.close()
    }
    return Promise.resolve(undefined)
}
