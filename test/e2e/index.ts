import * as request from 'supertest'
import * as mocha from 'mocha'
import * as chai from 'chai'
import { app, startServer, stopServer } from '../../api/server'

interface Credentials {
    email: string
    password: string
}

const Input = {
    badUser: { email: 't', password: 'p' },
    user1: { email: 't@t1.com', password: '12345678' },
    user2: { email: 't@t2.com', password: '12345678' }
}

describe("http test", () => {

    before(async () => {
        let dbConnection = await startServer()
        return await dbConnection.synchronize(true)
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
            .send(Input.user1)
            .expect(200)
    })

    it('should NOT create a user if the email exists in the database', () => {
        return request(app)
            .post('/users')
            .send(Input.user1)
            .expect((res: any) => {
                chai.expect(res.body.name).to.equal('BadRequestError')

                chai.expect(res.body.errors.length).to.equal(1)

                chai.expect(res.body.errors[0].property).to.equal('email')
                chai.expect(Object.keys(res.body.errors[0].constraints).length).to.equal(1)
                chai.expect(res.body.errors[0].constraints.isEmailAvailable).to.exist
            })
            .expect(400)
    })

    it('should create a second user', () => {
        return request(app)
            .post('/users')
            .send(Input.user2)
            .expect(200)
    })

    it('should NOT let the user update their email to another email that exists in the database', () => {
        return request(app)
            .put('/users/1')
            .send({
                email: Input.user2.email
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
})