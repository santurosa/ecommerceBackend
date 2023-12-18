const socket = io();

let user;
let chatBox = document.getElementById('chatBox');
let log = document.getElementById('messageLogs');

Swal.fire({
  title: "Identifícate",
  input: "email",
  text: "Ingresa tu correo electrónico para identificarte",
  inputValidator: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value) || !value) {
      return 'Debes ingresar un correo electrónico válido';
    }
  },
  allowOutsideClick: false,
})
  .then((result) => {
    if (result.isConfirmed) {
      user = result.value;
      socket.emit('authenticated', user);
    }
  });

chatBox.addEventListener('keyup', evt => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit('message', { user: user, message: chatBox.value })
      const newMessage = {
        user,
        message: chatBox.value
      }
      fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(newMessage),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => response.json())
        .then(json => {
          if (json.status === "success") {
            console.log(newMessage);
          }
        })
      chatBox.value = "";
    }
  }
})

socket.on('messageLogs', data => {
  if (!user) return;
  let messages = "";
  data.forEach(message => {
    messages = messages + `<li>${message.user} dice: ${message.message}</li>`
  })
  log.innerHTML = messages;
});

socket.on('newUserConnected', user => {
  if (!user) return
  Swal.fire({
    toast: true,
    position: "top-right",
    text: "Nuevo usuario conectado",
    title: `${user} se ha unido al chat`,
    timer: 3000,
    showConfirmButton: false
  })
})