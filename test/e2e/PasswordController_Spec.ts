import * as request from 'supertest'
import * as mocha from 'mocha'
import * as chai from 'chai'
import { app, startServer, stopServer } from '../../api/server'
import { loadFixtures } from '../fixtures/loader'

const Input = {
    user1: { email: 't@t1.com', password: 'newtestpassword' },
    resetToken: '8ede5821-4e70-4e4e-e700-60e83e547e9e'
}

describe("Password Controller '/password' ", () => {

    before(async () => {
        let dbConnection = await startServer()
        await dbConnection.synchronize(true)
        await loadFixtures("users", dbConnection)
        await dbConnection.synchronize()
    })

    after(() => {
        return stopServer()
    })

    it('should create a password reset request', () => {
        return request(app)
            .post('/password/requestReset')
            .send({
                email: Input.user1.email
            })
            .expect(200)
    })

    it('should reset the users password sucessfully', () => {
        return request(app)
            .post('/password/reset')
            .send({
                token: Input.resetToken,
                password: Input.user1.password
            })
            .expect(200)
    })

    it('should log the user in after a sucessful reset', () => {
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