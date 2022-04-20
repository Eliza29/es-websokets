const fs = require('fs')

class ContenedorArchivo {

    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    async listar(id) {
        try{
            const contenido = await fs.promises.readFile(`${this.nombreArchivo}`, 'utf-8')
            const info = await JSON.parse(contenido)

            if(info.length>0){
                const findById = info.find((elemento)=> elemento.id == id )
                return findById
            }else{
                return null
            }      
          
        } catch(error){
            console.log(error)
        }
    }

    async listarAll() {
        try{
            const contenido = await fs.promises.readFile(`${this.nombreArchivo}`, 'utf-8')
            const info = await JSON.parse(contenido)
            return info

        } catch(error){
            console.log(error)
        }
    }

    async guardar(obj) {
        try{
            const contenido = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
            const info = await JSON.parse(contenido)
         
            if(info.length>0){
                let id =  info.length + 1
                info.push({...obj, id: id})
                await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(info, null,2))
                return info
            }else{
                info.push({...obj, id: 1})
                await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(info, null,2))
                return info
            }
 
        } catch(error){
            console.log(error)
        }
    }

    async borrar(id) {
        try{
            const contenido = await fs.promises.readFile(`${this.nombreArchivo}`, 'utf-8')
            const info = await JSON.parse(contenido)

            if(info.length>0){
                const findById = info.filter((elemento)=> elemento.id !== id )
                await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(findById, null,2))
                return findById
            }else{
                console.log('no se encuentra el producto')
            }      
          
        } catch(error){
            console.log(error)
        }
    }

    async borrarAll() {
        try{

            const deleteAll = []
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(deleteAll, null,2))            
            return `Se borraron todos los objetos`

        } catch(error){
            console.log(error)
        }
    }
}

module.exports = ContenedorArchivo