import { Faker, es } from "@faker-js/faker";
import ProductDTO from '../dto/product.js';

const faker = new Faker({ locale: [es] })

export const mockingProducts = async (number) => {
    let products = [];
    let images = [];
    
    for (let i = 0; i <= number; i++) {
        const numberRandom = Math.floor(Math.random() * 6);
        for (let i = 0; i < numberRandom; i++) {
            images.push(faker.image.url());
        }
        const product = {
            _id: faker.database.mongodbObjectId(),
            title: faker.commerce.product(),
            description: faker.commerce.productName(),
            price: faker.commerce.price(),
            status: faker.datatype.boolean(0.75),
            stock: faker.number.int({ min: 0, max: 500 }),
            category: faker.commerce.department(),
            thumbnail: images,
            owner: faker.internet.email()
        }
        products.push(new ProductDTO(product));
        images = [];
    }
    return products;
}