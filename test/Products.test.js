import chai from "chai";
import supertest from "supertest";
import config from "../src/config/config.js";

const expect = chai.expect;
const port = config.port || 3000;
const requester = supertest(`http://localhost:${port}`);
let idUser;
let id;
let cookie;
const productMock = [{
    title: "Bicicleta",
    description: "Increible Plástico Silla",
    price: 170,
    status: false,
    stock: 109,
    category: "Cine",
    thumbnail: [
        "https://loremflickr.com/640/480?lock=2156534886825984",
        "https://picsum.photos/seed/y3gBjr2/640/480",
        "https://loremflickr.com/640/480?lock=1404954986151936"
    ]
}]

describe('Testing Products', () => {
    before(async function(){
        const userMock = {
            first_name: 'Usuario',
            last_name: 'de Prueba',
            email: 'prueba@testing.com',
            age: '25',
            password: '1234',
            role: 'user_premium'
        }
        await requester.post('/api/sessions/register').send(userMock);
        const { body, headers } = await requester.post('/api/sessions/login').send(userMock);
        idUser = body.user._id;
        const cookieResult = headers['set-cookie'][0];
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }

    })
    beforeEach(function(){
        this.timeout(5000);
    })
    it('El metodo POST "/api/products" debe crear un producto correctamente', async function(){
        const { body } = await requester.post('/api/products').send(productMock).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.payload[0]).to.have.property('_id');
        const product = body.payload[0];
        id = product._id;
    })
    it('El metodo GET "/api/products/:pid" debe obtener el producto correctamente mediante su ID', async function(){
        const { body } = await requester.get(`/api/products/${id}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.payload.title).to.be.eqls(productMock[0].title);
    })
    it('El metodo PUT "/api/products/:pid" debe actualizar el producto correctamente mediante su ID', async function(){
        const updateMock = { description: 'Bicicleta para adultos con cambios' };
        const { body } = await requester.put(`/api/products/${id}`).send(updateMock).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.payload.acknowledged).to.be.eqls(true);
        expect(body.payload.modifiedCount).to.be.eqls(1);
    })
    it('El metodo DELETE "/api/products/:pid" debe eliminar un producto correctamente mediante su ID', async function(){
        const { body } = await requester.delete(`/api/products/${id}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.status).to.be.eqls('success');
    })
    after(async function(){
        await requester.delete(`/api/users/${idUser}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
    })
})