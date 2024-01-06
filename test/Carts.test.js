import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import config from "../src/config/config.js";

const expect = chai.expect;
const port = config.environment.PORT || 3000;
const requester = supertest(`http://localhost:${port}`);
let idUser;
let idProduct;
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

describe('Testing Carts', () => {
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
        const cookieResult = headers['set-cookie'][0];
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }
        const requestProduct = await requester.post('/api/products').send(productMock).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        const productBody = requestProduct.body;
        const product = productBody.payload[0];
        idProduct = product._id;
        idUser = body.user._id;
        id = body.user.cart._id;
    })
    beforeEach(function(){
        this.timeout(5000);
    })
    it('El metodo POST de "/api/carts" debe crear un carrito correctamente', async function(){
        expect(mongoose.isValidObjectId(id)).to.be.eqls(true);
    })
    it('El metodo GET de "/api/carts" debe obtener el carrito correctamente mediante su ID', async function(){
        const { body } = await requester.get(`/api/carts/${id}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.payload).to.have.property('_id');
    })
    it('El metodo PUT de "/api/carts" debe denegar el añadir un producto al carrito mediante sus IDs porque el usuario es dueño del producto', async function(){
        const { body } = await requester.put(`/api/carts/${id}/product/${idProduct}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.cause).to.be.eqls('You cannot add products you have created to the cart');
    })
    it('El metodo DELETE de "/api/carts" debe eliminar un carrito correctamente', async function(){
        const { body } = await requester.delete(`/api/carts/${id}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.status).to.be.eqls('success');
    })
    after(async function(){
        await requester.delete(`/api/products/${idProduct}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        await requester.delete(`/api/users/${idUser}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
    })
})