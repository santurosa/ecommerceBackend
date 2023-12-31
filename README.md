# Backend de una aplicación ecommerce

Este proyecto es una API para una aplicación de comercio electrónico realizada para el proyecto final del curso de Programación Backend de Coderhouse (comisión #55.535) ha cargo del profesor Matias Camusso. Permite crear, leer, actualizar y eliminar productos, carritos y usuarios de una base de datos MongoDB. También trabaja con websocket para la utilización de un chat.

## Tecnologias utilizadas

- Node.js como entorno de trabajo.
- Faker para crear mocks.
- Bcrypt para hashear contraseñas.
- Cookie Parser para gestionar cookies.
- Dotenv para gestionar variables de entorno.
- Express para la infraestructura de la API.
- Handlebars para server side rendering.
- Json Web Token y Passport para autenticación.
- Mongoose para gestionar la base de datos.
- Multer para cargar documentos.
- Node Mailer para el envío de emails.
- Passport para autenticación.
- Socket.io para el chat.
- Swagger para la documentación de la API.
- Winston para los logs.
- Chai, Mocha y Supertest para testing.

## Instalación

1. Clona este repositorio en tu máquina local.
2. Ejecuta `npm install` para instalar las dependencias.
3. Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables de entorno:
- `PORT`: El puerto en el que se ejecutará el servidor. Por defecto es 3000.
- `MONGO_URL`: La URL de conexión a la base de datos MongoDB. Debes reemplazar los valores de usuario, contraseña y nombre de la base de datos por los tuyos.
- `ADMIN_NAME`: El correo electrónico del administrador de la aplicación. Se usará para crear un usuario con rol de administrador en la base de datos.
- `ADMIN_PASSWORD`: La contraseña del administrador de la aplicación. Se usará para crear un usuario con rol de administrador en la base de datos.
- `CLIENT_ID`: El identificador de cliente de GitHub OAuth. Se usará para permitir el inicio de sesión con GitHub.
- `CLIENT_SECRET`: El secreto de cliente de GitHub OAuth. Se usará para permitir el inicio de sesión con GitHub.
- `CALLBACK_URL`: La URL de retorno de llamada de GitHub OAuth. Se usará para permitir el inicio de sesión con GitHub.
- `JWT_SECRET`: El secreto para firmar los tokens JWT. Se usará para autenticar a los usuarios.
- `MALING_SERVICE`: El servicio de correo electrónico que se usará para enviar correos electrónicos a los usuarios. Por ejemplo, gmail, outlook, etc.
- `MAILING_USER`: El usuario del servicio de correo electrónico que se usará para enviar correos electrónicos a los usuarios. Debe ser una dirección de correo electrónico válida.
- `MAILING_PASSWORD`: La contraseña del servicio de correo electrónico que se usará para enviar correos electrónicos a los usuarios.
- `PERSISTENCE`: El tipo de persistencia que se usará para almacenar los datos de la aplicación. Por defecto es MONGO, pero también se puede usar FILE.
- `ENV`: El entorno en el que se ejecutará el proyecto. Se puede usar DEV o PROD.
6. Ejecuta `npm start` para iniciar el servidor.

## Uso

Podes usar Postman o la documentación alojada en '/api/docs' para probar las rutas de la API. Las rutas disponibles son:

### Carts
- `POST /api/carts/` Crea un carrito vacío y devuelve su Id. No requiere autenticación.
- `GET /api/carts/{cid}` Obtiene un solo carrito a partir de su Id. Devuelve los productos y el total del carrito. No requiere autenticación.
- `PUT /api/carts/{cid}` Agrega productos a un solo carrito a partir de su Id y de productos que se pasen en el body. El body debe tener el formato { products: [{ pid: String, quantity: Number }] }. Requiere autenticación y rol de usuario premium o usuario normal.
- `DELETE /api/carts/{cid}` Vacia un solo carrito a partir de su Id. No requiere autenticación.
- `PUT /api/carts/{cid}/product/{pid}` Agrega un producto a un solo carrito a partir de su Id y el Id del producto. El producto se agrega con una cantidad de 1. Requiere autenticación y rol de usuario premium o usuario normal.
- `DELETE /api/carts/{cid}/product/{pid}` Elimina un solo producto de un carrito a partir de sus Ids. No requiere autenticación.
- `PUT /api/carts/{cid}/products/{pid}` Modifica la cantidad de unidades pedidas de un producto a partir del Id del carrito y del producto. El body debe tener el formato { quantity: Number }. Requiere autenticación y rol de usuario premium o usuario normal.

### Tickets
- `POST /api/carts/{cid}/purchase` Cierra una orden vaciando el carrito y generando un ticket en la base de datos a partir del Id del carrito. El ticket contiene los productos, el total, la fecha y el usuario que realizó la compra. Requiere autenticación y rol de usuario premium o usuario normal.
- `GET /api/carts/tickets` Obtiene todos los tickets paginados con un límite por defecto de 10 tickets. Se puede pasar un parámetro page para obtener una página específica. Requiere autenticación y rol de usuario premium o usuario normal.

### Messages
- `GET /api/messages/` Obtiene todos los mensajes desde la base de datos. No requiere autenticación.
- `POST /api/messages/` Crea un mensaje. El body debe tener el formato { name: String, email: String, subject: String, message: String }. Requiere autenticación y rol de administrador, usuario premium o usuario normal.

### Products
- `GET /api/products/` Obtiene todos los productos paginados con un límite por defecto de 10 productos. Se puede pasar un parámetro page para obtener una página específica. No requiere autenticación.
- `POST /api/products/` Crea un producto. El body debe tener el formato { name: String, description: String, price: Number, stock: Number, image: String }. Requiere autenticación y rol de usuario premium o usuario normal.
- `GET /api/products/{pid}` Obtiene un solo producto a partir de su Id. No requiere autenticación.
- `PUT /api/products/{pid}` Actualiza un solo producto a partir de su Id. El body debe tener el mismo formato que para crear un producto. Requiere autenticación y rol de usuario premium o usuario normal.
- `DELETE /api/products/{pid}` Elimina un solo producto a partir de su Id. Requiere autenticación y rol de usuario premium o usuario normal.
- `GET /api/products/mockingproducts` Obtiene 100 productos autogenerados aleatoriamente. No requiere autenticación.

## Sugerencias o comentarios

Cualquier sugerencia o comentario pueder ser enviado a santu_rosa@outlook.com.