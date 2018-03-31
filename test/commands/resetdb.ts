import {createConnection} from "typeorm";

createConnection({
    type: "postgres",
    url: process.env["DATABASE_URL"],
    username: process.env["DATABASE_USER"],
    entities: [
        "../../api/models/entities/*.js"
    ]
}).then(async connection => {
	connection.synchronize(true)
}).catch(error => console.log(error))