const deleteProduct = document.getElementsByClassName("deleteProduct");
const purchaseCart = document.getElementById("purchaseCart");

purchaseCart.addEventListener("click", function (event) {
    event.preventDefault();
    const url = purchaseCart.getAttribute("data-url");
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                alert('Error al finalizar la compra');
                throw new Error('Error al finalizar la compra');
            }
            window.location.href = '/tickets';
        })
        .catch(error => {
            console.error(error.message);
        });
});

for (const button of deleteProduct) {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        const url = button.getAttribute("data-url");
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (!response.ok) {
                    alert('Error al finalizar la compra');
                    throw new Error('Error al finalizar la compra');
                }
                window.location.reload();
            })
            .catch(error => {
                console.error(error.message);
            });
    });
}