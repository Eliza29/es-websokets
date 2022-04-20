const socket = io.connect();

//------------------------------------------------------------------------------------

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {

    const newProduct = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        foto: document.getElementById('foto').value
    } 
    socket.emit('datosDelForm', newProduct)
    return false
})

socket.on('productos', productos => {
    makeHtmlTable(productos)
});

const makeHtmlTable= function(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            document.getElementById('productos').innerHTML=html

        })
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')

formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    let date = new Date();
    let dateString = date.toLocaleDateString()
    let time= date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    const newMessage = {
        username: document.getElementById('inputUsername').value,
        mensaje: document.getElementById('inputMensaje').value,
        dateString:dateString,
        time:time        
    } 
    socket.emit('newMessage', newMessage)

    document.getElementById('inputUsername').value=""
    document.getElementById('inputMensaje').value=""

    return false
})

socket.on('mensajes', mensajes => {
    makeHtmlList(mensajes)
})


 function makeHtmlList(mensajes) {
    const messages= mensajes
    const html = messages.map((mensaje) => {
        return (`<div class="message-css"><strong>${mensaje.username}</strong><span>[${mensaje.dateString} ${mensaje.time}]</span>:<em>${mensaje.mensaje}</em></div>`)
    }).join(" ");
    
    document.getElementById('mensajes').innerHTML = html;
}