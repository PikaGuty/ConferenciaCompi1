class error{
    constructor(tipo, descripcion, fila, columna){
        this.tipo=tipo;
        this.descripcion=descripcion;
        this.fila=fila;
        this.columna=columna;
        this.siguiente=null;
        this.anterior=null;
    }
}

var ListaErrores = (function(){
    var instancia;

    class Lista{
        constructor(){
            this.inicial=null;
            this.final=null;
        }
    
        pushError(error){
            if(this.inicial==null){
                this.inicial=error;
                this.final=error;
                return;
            }
            this.final.siguiente=error;
            error.anterior=this.final;
            this.final=error;
        }
    
        getError(){
    
        }

        getErrores(){
            var texto="";
            var muestra=this.inicial;
            while(muestra!=null){
                texto+="ERROR: Tipo:"+muestra.tipo
                +" Descripcion: "+muestra.descripcion
                +" Fila: "+muestra.fila
                +" Columna: "+muestra.columna+" \n";
                muestra=muestra.siguiente;
            }
            return texto;
        }

        getTabErrores(){
            var texto={};
            var simb=[]

            var err=this.inicial;
            while(err!=null){
                simb.push({
                    tipo:err.tipo,
                    descripcion:err.descripcion,
                    linea:err.fila,
                    columna:err.columna
                })
                err=err.siguiente;
            }
            console.log(simb)
            texto.errores=simb
            
            return (texto);
        }
    
        borrarErrores(){
            this.inicial=null;
            this.final=null;
        }
    }

    function CrearInstancia(){
        return new Lista();
    }

    return{
        getInstance:function(){
            if(!instancia){
                instancia=CrearInstancia();
            }
            return instancia;
        }
    }
}());

module.exports={ error,ListaErrores };
