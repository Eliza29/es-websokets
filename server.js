const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorMemoria = require('./contenedores/ContenedorMemoria.js')
const ContenedorArchivo = require('./contenedores/ContenedorArchivo.js')

//--------------------------------------------
// instancio servidor, socket y api

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorMemoria()
const mensajesApi = new ContenedorArchivo('./mensajes.json')

//--------------------------------------------

const productos = productosApi.productos;

// configuro el socket

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de productos
    socket.emit('productos', productos);
    // actualizacion de productos
    socket.on('datosDelForm', newProduct=>{
        productos.push(newProduct);
        io.sockets.emit('productos', productos);
    })
    
    // carga inicial de mensajes

    const mensajes = await mensajesApi.listarAll()
    socket.emit('mensajes', mensajes);

    // actualizacion de mensajes
    socket.on('newMessage', newMessage=>{
        mensajesApi.guardar(newMessage).then(mensajes=>{
            io.sockets.emit('mensajes', mensajes);
        });

    })
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))