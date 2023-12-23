import chai from "chai";
import supertest from "supertest";
import config from "../src/config/config.js";

const expect = chai.expect;
const port = config.port || 3000;
const requester = supertest(`http://localhost:${port}`);
let cookie;
let id;

describe('Testing Sessions', () => {
    beforeEach(function () {
        this.timeout(5000);
    })
    it('El metodo POST de "/api/sessions/register" debe crear un usuario correctamente', async function () {
        const userMock = {
            first_name: 'Usuario',
            last_name: 'de Prueba',
            email: 'prueba@testing.com',
            age: '25',
            password: '1234',
        }
        const { body } = await requester.post('/api/sessions/register').send(userMock);
        expect(body.message).to.be.equals('User registered');
    })
    it('El metodo POST de "/api/sessions/login" debe generar el token del usuario con todos sus datos correctamente', async function () {
        const userMock = {
            email: 'prueba@testing.com',
            password: '1234'
        }
        const { body, headers } = await requester.post('/api/sessions/login').send(userMock);
        expect(body).to.have.property('user');
        const cookieResult = headers['set-cookie'][0];
        expect(cookieResult).to.be.ok;
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }
        expect(cookie.name).to.be.ok.and.eql('token');
        expect(cookie.value).to.be.ok;
    })
    it('El metodo GET de "/api/sessions/current" debe devolver los datos del usuario que tiene la session iniciada correctamente', async function () {
        const { body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.user.email).to.be.eqls('prueba@testing.com');
        id = body.user._id;
    })
    it('El metodo DELETE de "/api/sessions/:uid" debe eliminar el usuario correctamente con el id del usuario', async function () {
        const { body } = await requester.delete(`/api/sessions/${id}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body).to.have.property('payload');
    })
    it('El metodo GET de "/api/sessions/logout" debe eliminar la session y dirigir a /login correctamente', async function () {
        const { statusCode, headers } = await requester.get('/api/sessions/logout').set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eql(302);
        const cookieResult = headers['set-cookie'][0]
        expect(cookieResult.split('; ')[2]).to.be.eql('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    })
})