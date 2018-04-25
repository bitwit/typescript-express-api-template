import * as request from 'supertest'
import * as mocha from 'mocha'
import * as chai from 'chai'
import { app, startServer, stopServer } from '../../api/server'
import { loadFixtures } from '../fixtures/loader'

const Input = {
    user1: { email: 't@t1.com', password: '12345678' }
}

describe("Main Controller '/' ", () => {

    before(async () => {
        let dbConnection = await startServer()
        await dbConnection.synchronize(true)
        await loadFixtures("users", dbConnection)
        await dbConnection.synchronize()
    })

    after(() => {
        return stopServer()
    })

    it('should log the user in', () => {
        return request(app)
            .post('/login')
            .send(Input.user1)
            .expect((res: any) => {
                const expectedKeys = [
                    'token',
                    'expiry',
                    'refreshToken',
                    'refreshExpiry'
                ]
                chai.expect(res.body).contains.all.keys(expectedKeys)
                chai.expect(Object.keys(expectedKeys).length).to.equal(expectedKeys.length)
            })
            .expect(200)
    })

})