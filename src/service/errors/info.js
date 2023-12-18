export const createProductErrorInfo = (product) => {
    return `One or more properties were imcomplete or not valid.\nList of required properties:\n* title: needs to be a String unique, received ${product.title}\n* description: needs to be a String, received ${product.description}\n* price: needs to be a Number more to 0, received ${product.price}\n* stock: needs to be a Number more to 0, received ${product.stock}\n* category: needs to be a String, received ${product.category}\n\nList of optionals properties:\n* status: needs to be a Boolean, received ${product.status}\n* thumbnail: needs to be a Array with String(s), received ${product.thumbnail}`    
}

export const getByMongooseIdErrorInfo = (id) => {
    return `Needs to be a Object Id from Mongoose in a String, received ${id}`
}

export const searchByMongooseIdErrorInfo = (id) => {
    return `A document has not been found in the database with the id ${id}`
}

export const upgrateProductErrorInfo = () => {
    return `No property has been submitted to update the product.\nList of required properties:\n* title: needs to be a String unique.\n* description: needs to be a String.\n* price: needs to be a Number more to 0.\n* stock: needs to be a Number more to 0.\n* category: needs to be a String.\n\nList of optionals properties:\n* status: needs to be a Boolean.\n* thumbnail: needs to be a Array with String(s).`
}

export const upgrateProductDBErrorInfo = (upgrate) => {
    return `There are no properties that match the required ones or an id corresponding to that of a product has not been provided.\nList of required properties:\n* title: needs to be a String unique, received ${upgrate.title}\n* description: needs to be a String, received ${upgrate.description}\n* price: needs to be a Number more to 0, received ${upgrate.price}\n* stock: needs to be a Number more to 0, received ${upgrate.stock}\n* category: needs to be a String, received ${upgrate.category}\n\nList of optionals properties:\n* status: needs to be a Boolean, received ${upgrate.status}\n* thumbnail: needs to be a Array with String(s), received ${upgrate.thumbnail}`    
}

export const cartWithoutProductsErrorInfo = () => {
    return 'The cart is empty, it does not contain products. You must add products with available stock before completing the purchase.'
}

export const createMessageErrorInfo = (message) => {
    return `One or more properties were imcomplete or not valid.\nList of required properties:\n* user: needs to be a email unique in a String, received ${message.user}\n* message: needs to be a String, received ${message.message}`
}