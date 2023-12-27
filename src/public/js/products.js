const addToCartButtons = document.getElementsByClassName("addToCart");

for (const button of addToCartButtons) {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        
        const url = button.getAttribute("data-url");

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar el producto al carrito');
            }
            alert('Producto agregado al carrito exitosamente');
        })
        .catch(error => {
            console.error(error.message);
        });
    });
}
