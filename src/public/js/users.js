const updateRoleButtons = document.getElementsByClassName("updateRole");
const deleteUserButtons = document.getElementsByClassName("deleteUser");
const deleteUsers = document.getElementById("deleteUsers");

for (const button of updateRoleButtons) {
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
                    alert('Error al actualizar el rol del usuario');
                    throw new Error('Error al actualizar el rol del usuario');
                }
                window.location.reload();
            })
            .catch(error => {
                console.error(error.message);
            });
    });
}

for (const button of deleteUserButtons) {
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
                    alert('Error eliminar el usuario');
                    throw new Error('Error eliminar el usuario');
                }
                window.location.reload();
            })
            .catch(error => {
                console.error(error.message);
            });
    });
}

deleteUsers.addEventListener("click", function (event) {
    event.preventDefault();
    fetch("/api/users", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (!response.ok) {
            alert('Error al actualizar el rol del usuario');
            throw new Error('Error al actualizar el rol del usuario');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        window.location.reload();
    })
    .catch(error => {
        console.error(error.message);
    });
});