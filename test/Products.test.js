import chai from "chai";
import supertest from "supertest";
import config from "../src/config/config.js";

const expect = chai.expect;
const port = config.environment.PORT || 3000;
const requester = supertest(`http://localhost:${port}`);
let idUser;
let id;
let cookie;
const productMock = {
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
}
const updateMock = { description: 'Bicicleta para adultos con cambios' };

describe('Testing Products', () => {
    before(async function () {
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
    beforeEach(function () {
        this.timeout(5000);
    })
    it('El metodo POST "/api/products" debe denegar el crear un producto porque no se ha recibido un body', async function () {
        const { statusCode } = await requester.post('/api/products').set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eqls(422);
    })
    it('El metodo POST "/api/products" debe denegar el crear un producto porque no se han recibido todas las propiedades', async function () {
        const { statusCode } = await requester.post('/api/products').send([{ title: 'Bicicleta' }]).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eqls(422);
    })
    it('El metodo POST "/api/products" debe denegar el crear un producto porque se han recibo dos productos con el mismo title', async function () {
        const { body } = await requester.post('/api/products').send([productMock, productMock]).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.cause).to.be.eqls(`The title ${productMock.title} has been entered on two or more different products. Titles must be unique.`);
    })
    it('El metodo POST "/api/products" debe crear un producto correctamente', async function () {
        const { body } = await requester.post('/api/products').send([productMock]).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.payload[0]).to.have.property('_id');
        const product = body.payload[0];
        id = product._id;
    })
    it('El metodo POST "/api/products" debe denegar el crear un producto porque ya existe un producto con el mismo title', async function () {
        const { body } = await requester.post('/api/products').send([productMock]).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.error).to.be.eqls({
            index: 0,
            code: 11000,
            keyPattern: { title: 1 },
            keyValue: { title: productMock.title }
        });
    })

    it('El metodo GET "/api/products/" debe obtener los productos paginados con un limite de diez por página', async function () {
        const { body } = await requester.get(`/api/products`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.payload).to.have.lengthOf(10);
        expect(body).to.have.property('hasPrevPage');
        expect(body).to.have.property('hasNextPage');
        expect(body).to.have.property('nextPage');
        expect(body).to.have.property('prevPage');
    })

    it('El metodo GET "/api/products/:pid" debe denegar el producto mediante su ID porque se a pasado un ID con un parametro incorrecto', async function () {
        const { statusCode } = await requester.get(`/api/products/bb2bdbc16da6a5c3cea8dbd8`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eqls(500);
    })
    it('El metodo GET "/api/products/:pid" debe obtener el producto correctamente mediante su ID', async function () {
        const { body } = await requester.get(`/api/products/${id}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.payload.title).to.be.eqls(productMock.title);
    })

    it('El metodo PUT "/api/products/:pid" debe denegar el producto mediante su ID porque se ha pasado un id incorrecto', async function () {
        const { statusCode } = await requester.put(`/api/products/bb2bdbc16da6a5c3cea8dbd8`).send(updateMock).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eqls(500);
    })
    it('El metodo PUT "/api/products/:pid" debe denegar el producto mediante su ID porque no se ha pasado un body con las propiedades a actualizar', async function () {
        const { statusCode } = await requester.put(`/api/products/${id}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eqls(422);
    })
    it('El metodo PUT "/api/products/:pid" debe actualizar el producto correctamente mediante su ID', async function () {
        const { body } = await requester.put(`/api/products/${id}`).send(updateMock).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.payload.acknowledged).to.be.eqls(true);
        expect(body.payload.modifiedCount).to.be.eqls(1);
    })

    it('El metodo DELETE "/api/products/:pid" debe denegar el producto mediante su ID porque se a pasado un ID incorrecto', async function () {
        const { statusCode } = await requester.delete(`/api/products/bb2bdbc16da6a5c3cea8dbd8`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).to.be.eqls(500);
    })
    it('El metodo DELETE "/api/products/:pid" debe eliminar un producto correctamente mediante su ID', async function () {
        const { body } = await requester.delete(`/api/products/${id}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(body.status).to.be.eqls('success');
    })
    after(async function () {
        await requester.delete(`/api/users/${idUser}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
    })
})