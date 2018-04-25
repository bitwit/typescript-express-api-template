import * as request from 'supertest'
import * as mocha from 'mocha'
import * as chai from 'chai'
import { app, startServer, stopServer } from '../../api/server'
import { loadFixtures } from '../fixtures/loader'

const Input = {
    badUser: { email: 't', password: 'p' },
    user1: { email: 't@t1.com', password: '12345678' },
    newUser1: { email: 'hi@cool.com', password: '12345678' },
    user1AuthToken: "5cea5821-4e70-4f4b-b700-60f83d547e9c"
}

describe("http test", () => {

    before(async () => {
        let dbConnection = await startServer()
        await dbConnection.synchronize(true)
        await loadFixtures("users", dbConnection)
        await dbConnection.synchronize()
    })

    after(() => {
        return stopServer()
    })

    it('respond success json', () => {
        return request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect({ success: true })
            .expect(200);
    });

    it('should NOT create a user, due to email and password input issues', () => {
        return request(app)
            .post('/users')
            .send(Input.badUser)
            .expect((res: any) => {
                chai.expect(res.body.name).to.equal('BadRequestError')

                chai.expect(res.body.errors.length).to.equal(2)

                chai.expect(res.body.errors[0].property).to.equal('email')
                chai.expect(Object.keys(res.body.errors[0].constraints).length).to.equal(1)
                chai.expect(res.body.errors[0].constraints.isEmail).to.exist
                
                chai.expect(res.body.errors[1].property).to.equal('password')
                chai.expect(Object.keys(res.body.errors[1].constraints).length).to.equal(1)
                chai.expect(res.body.errors[1].constraints.minLength).to.exist
            })
            .expect(400)
    })

    it('should create a user', () => {
        return request(app)
            .post('/users')
            .send(Input.newUser1)
            .expect((res: any) => {
                console.log('new user body', res.body)
            })
            .expect(200)
    })

    it('should NOT create a user if the email exists in the database', () => {
        return request(app)
            .post('/users')
            .send(Input.newUser1)
            .expect((res: any) => {
                chai.expect(res.body.name).to.equal('BadRequestError')

                chai.expect(res.body.errors.length).to.equal(1)

                chai.expect(res.body.errors[0].property).to.equal('email')
                chai.expect(Object.keys(res.body.errors[0].constraints).length).to.equal(1)
                chai.expect(res.body.errors[0].constraints.isEmailAvailable).to.exist
            })
            .expect(400)
    })

    it('should NOT log the user in when credentials are wrong', () => {
        return request(app)
            .post('/login')
            .send({
                email: Input.user1.email,
                password: '4321'
            })
            .expect(400)
    })

    it('should NOT let the user update their email to another email that exists in the database', () => {
        return request(app)
            .put('/users/1')
            .set('Authorization', Input.user1AuthToken)
            .send({
                email: Input.user1.email
            })
            .expect((res: any) => {
                chai.expect(res.body.name).to.equal('BadRequestError')
                
                chai.expect(res.body.errors.length).to.equal(1)

                chai.expect(res.body.errors[0].property).to.equal('email')
                chai.expect(Object.keys(res.body.errors[0].constraints).length).to.equal(1)
                chai.expect(res.body.errors[0].constraints.isEmailAvailable).to.exist
            })
            .expect(400)
    })

    it('should let the user update their data', () => {
        return request(app)
            .put('/users/1')
            .set('Authorization', Input.user1AuthToken)
            .send({
                email: Math.random() + "@email.com"
            })
            .expect(200)
    })

    it('should NOT let the user update their email to another email that exists in the database', () => {
        return request(app)
            .put('/users/1')
            .set('Authorization', Input.user1AuthToken)
            .send({
                email: Input.newUser1.email
            })
            .expect((res: any) => {
                chai.expect(res.body.name).to.equal('BadRequestError')
                
                chai.expect(res.body.errors.length).to.equal(1)

                chai.expect(res.body.errors[0].property).to.equal('email')
                chai.expect(Object.keys(res.body.errors[0].constraints).length).to.equal(1)
                chai.expect(res.body.errors[0].constraints.isEmailAvailable).to.exist
            })
            .expect(400)
    })

    it('should NOT let the user update another user', () => {
        return request(app)
            .put('/users/2')
            .set('Authorization', Input.user1AuthToken)
            .send({
                password: 'hellothere'
            })
            .expect((res: any) => {
                chai.expect(res.body.name).to.equal('UnauthorizedError')
                chai.expect(res.body.message).to.equal("Can not edit other users")
            })
            .expect(401)
    })

})