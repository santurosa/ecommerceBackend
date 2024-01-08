const socket = io();
socket.on("new-product", (product) => {
    const products = `<div id="${product._id}>
                        <h3>${product.title}</h3>
                        <p>Categoría: ${product.category}</p>
                        <p>${product.description}</p>
                        <p>$ ${product.price}</p>
                        <p>${product.stock} disponible(s)</p>
                        <p>Vendido por ${product.owner}</p>
                        <br>
                    </div>`
    document.getElementById("products").appendChild(products);
});

socket.on("delete-product", (productId) => {
    const div = document.getElementById(productId);
    if (div) div.parentNode.removeChild(div);
});
