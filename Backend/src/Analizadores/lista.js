var errores = require("../Errores")
class nodo{
    constructor(tipo,dato){
        this.tipo = tipo;
        this.dato = dato;
        this.siguiente = null;
        this.pos = null;
    }
}

class nodo2{
    constructor(dato){
        this.dato=dato;
        this.siguiente;
        this.pos=null;
    }
}

class listaVec2{
    constructor(tipo,dimension1,dimension2){
        this.tip = "Lista2"
        this.dimension1= dimension1;
        this.dimension2= dimension2;
        this.primero=null;
        this.tipo=tipo;
        let x = 0;
        while(x<dimension1){
            this.crearLista(tipo,dimension2)
            x++;
        }
    }
    crearLista(tipo,dimension){
        let nuevo = new nodo(tipo, new listaVec(tipo,dimension)); 

        if(this.primero == null){ 
            this.primero = nuevo;
            this.primero.pos=0;
        }else{
            let aux = this.primero;
            let p = 0;
            while(aux.siguiente != null){
                p++;
                aux = aux.siguiente;
            }
            aux.siguiente = nuevo;
            aux.siguiente.pos=p+1;
        }
    }

    mostrar(){
        let aux = this.primero;
        console.log("********** Mostar Lista **********")
        let list=""
        let l = true
        while(aux != null){
            if (l){
                list+="["+aux.dato.mostrars()+"],"+aux.pos
                l=false
            }else{
                list+="<->["+aux.dato.mostrars()+"],"+aux.pos
            }
            
            aux = aux.siguiente;
        }
        console.log(list)
    }

    insertar(dato,posicion1,posicion2,fila,columna){
        let aux = this.primero;
        let existe = false;
        while(aux != null){
            if (posicion1==aux.pos){
                aux.dato.insertars(dato,posicion1,posicion2,fila,columna)
                existe=true;
                break;
            }
            aux = aux.siguiente;
        }
        if(!existe){
            errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","La posicion "+posicion1+", "+posicion2+" no existe",fila,columna));
        }
        
    }

    obtener(posicion1,posicion2,fila,columna){
        let aux = this.primero;
        let existe = false;
        while(aux != null){
            if (posicion1==aux.pos){
                existe=true;
                return aux.dato.obteners(posicion1,posicion2,fila,columna);
            }
            aux = aux.siguiente;
        }
        if(!existe){
            errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","La posicion "+posicion1+", "+posicion2+" no existe",fila,columna));
            return null;
        }
    }

    reg(){
        let aux = this.primero;
        let list="["
        let l = true
        while(aux != null){
            if (l){
                list+=aux.dato.reg()
                l=false
            }else{
                list+=","+aux.dato.reg()
            }
            
            aux = aux.siguiente;
        }
        list+="]"
        return list
    }
}

class listaVec{
    constructor(tipo,dimension){
        this.tip = "Lista"
        this.dimension= dimension;
        this.primero=null;
        this.tipo=tipo;
        let x = 0;
        while(x<dimension){
            this.crearLista(tipo)
            x++;
        }
    }

    crearLista(tipo){
        let nuevo;
        switch (tipo){
            case "Int":
                nuevo = new nodo(tipo,0); 
                break;
            case "Double":
                nuevo = new nodo(tipo,0.0); 
                break;
            case "Boolean":
                nuevo = new nodo(tipo,true); 
                break;
            case "Char":
                nuevo = new nodo(tipo,"\'0\'"); 
                break;
            case "String":
                nuevo = new nodo(tipo,"\"\""); 
                break;
            default:
                break;
        }
        if(this.primero == null){ 
            this.primero = nuevo;
            this.primero.pos=0;
        }else{
            let aux = this.primero;
            let p = 0;
            while(aux.siguiente != null){
                p++;
                aux = aux.siguiente;
            }
            aux.siguiente = nuevo;
            aux.siguiente.pos=p+1;
        }
    }

    recuperar(valor){
        console.log(valor)
    }

    insertar(dato,posicion,fila,columna){
        let aux = this.primero;
        let existe = false;
        while(aux != null){
            if (posicion==aux.pos){
                aux.dato=dato;
                existe=true;
                break;
            }
            aux = aux.siguiente;
        }
        if(!existe){
            errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","La posicion "+posicion+" no existe",fila,columna));
            console.log("La posicion "+posicion+" no existe")
        }
        
    }

    insertars(dato,posicion1,posicion2,fila,columna){
        let aux = this.primero;
        let existe = false;
        while(aux != null){
            if (posicion2==aux.pos){
                aux.dato=dato;
                existe=true;
                break;
            }
            aux = aux.siguiente;
        }
        if(!existe){
            errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","La posicion "+posicion1+", "+posicion2+" no existe",fila,columna));
        }
        
    }

    obtener(posicion,fila,columna){
        let aux = this.primero;
        let existe = false;
        while(aux != null){
            if (posicion==aux.pos){
                existe=true;
                return aux;
            }
            aux = aux.siguiente;
        }
        if(!existe){
            errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","La posicion "+posicion+" no existe",fila,columna));
            return null;
        }
    }

    obteners(posicion1,posicion2,fila,columna){
        let aux = this.primero;
        let existe = false;
        while(aux != null){
            if (posicion2==aux.pos){
                existe=true;
                return aux;
            }
            aux = aux.siguiente;
        }
        if(!existe){
            errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","La posicion "+posicion1+", "+posicion2+" no existe",fila,columna));
            return null;
        }
    }

    mostrar(){
        let aux = this.primero;
        console.log("********** Mostar Lista **********")
        let list=""
        let l = true
        while(aux != null){
            if (l){
                list+=aux.dato+","+aux.pos
                l=false
            }else{
                list+="<->"+aux.dato+","+aux.pos
            }
            
            aux = aux.siguiente;
        }
        console.log(list)
    }

    reg(){
        let aux = this.primero;
        let list="["
        let l = true
        while(aux != null){
            if (l){
                list+=aux.dato
                l=false
            }else{
                list+=","+aux.dato
            }
            
            aux = aux.siguiente;
        }
        list+="]"
        return list
    }

    mostrars(){
        let aux = this.primero;
        let list=""
        let l = true
        while(aux != null){
            if (l){
                list+=aux.dato+","+aux.pos
                l=false
            }else{
                list+="<->"+aux.dato+","+aux.pos
            }
            
            aux = aux.siguiente;
        }
        return list
    }

}

/*let lista = new listaVec2("Int",4,3);
lista.mostrar();
lista.insertar(12,1,1)
lista.insertar(12,1,2)
lista.mostrar();
console.log(lista.obtener(1,2))

let lista = new listaVec("Int",4);
lista.mostrar();

lista.insertar(10,1);
lista.insertar(10,5);
lista.mostrar();
console.log(lista.obtener(2));
console.log(lista.obtener(5))
*/
module.exports={listaVec,listaVec2}