const form = document.getElementById('restartPasswordForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    
    fetch('api/sessions/restartPassword', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.ok) {
            return result.json();
        } else {
            return result.json().then(error => Promise.reject(error));
        }
    }).then(data => {
        window.location.replace('/login');
    }).catch(error => {
        console.error(error);
    });
});
