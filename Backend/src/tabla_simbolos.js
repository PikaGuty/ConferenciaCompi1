var lista = require("./Analizadores/lista")
class simbolo {
    constructor(nombre,tipo1,tipo2,entorno,valor,linea,columna){
        this.nombre = nombre;
        this.tipo1 = tipo1;
        this.tipo2 = tipo2;
        this.entorno = entorno;
        this.valor = valor;
        this.linea = linea;
        this.columna =  columna;
        this.parametros = null;
    }
}

var tabla = (function(){
    var instancia;

    class tabla{
        constructor(){
            this.simbolos=Array();
        }

        pushSimbolo(simbolos){
            this.simbolos.push(simbolos);
        }

        borrarTabla(){
            this.simbolos=[];
        }

        getSimbolo(nombre){
            let res=null;
            this.simbolos.forEach(simbolo=>{
                if(simbolo.nombre==nombre){
                    res=simbolo;
                }
            })
            return res;
        }

        getSimboloP(nombre,ambito){
            let res = null;
            let flag=false

            this.simbolos.forEach(simbolo=>{
                if(simbolo.nombre==nombre&&simbolo.entorno==ambito){
                    res=simbolo;
                    flag=true;
                }
            })
            if(!flag){
                this.simbolos.forEach(simbolo=>{
                    if(simbolo.nombre==nombre&&simbolo.entorno=="General"){
                        //console.log("ENCONTRE EN EL GENERAL")
                        res=simbolo;
                    }
                })
            }
            
            return res;
        }

        getsimbolos(){
            var texto="";

            var cuenta=1;
            this.simbolos.forEach(simbolo =>{
                try{
                    texto+=" -- "+cuenta
                    texto+=" -- "+simbolo.nombre
                    texto+=" -- "+simbolo.tipo1
                    texto+=" -- "+simbolo.tipo2
                    texto+=" -- "+simbolo.entorno
                    if(simbolo.tipo1=="AsignacionV"){
                        texto+=" -- "+simbolo.valor+"\n";
                    }else{
                        if(simbolo.parametros!=null){
                            texto+=" -- "+simbolo.parametros+"\n";
                        }else{
                            texto+=" -- "+simbolo.valor+"\n";
                        }
                    }
                    
                    cuenta++;
                }catch(e){

                }
                
            })
             return texto;
        } 

        getTablaSimbolos(){
            var texto={};
            var simb=[]
            var cuenta=1;
            this.simbolos.forEach(simbolo =>{
                try{
                    let valor=""
                    if(simbolo.tipo1=="AsignacionV"){
                        valor=simbolo.valor
                    }else{
                        if(simbolo.parametros!=null){
                            valor=simbolo.parametros;
                        }else{
                            valor=simbolo.valor;
                        }
                    }
                    let lin,col
                
                    simb.push({
                        cuenta:cuenta,
                        nombre:simbolo.nombre,
                        tipo1:simbolo.tipo1,
                        tipo2:simbolo.tipo2,
                        entorno:simbolo.entorno,
                        valor:valor,
                        linea:simbolo.linea,
                        columna:simbolo.columna
                    })
                    
                    cuenta++;
                }catch(e){

                }
                
            })
            
            texto.simbolos=simb
            
            return (texto);
        } 

        modificarSimbolo(simb){
            this.simbolos.forEach(simbolo=>{
                if(simb.nombre==simbolo.nombre){
                    simbolo.nombre = simb.nombre;
                    simbolo.tipo1 = simb.tipo1;
                    simbolo.tipo2 = simb.tipo2;
                    simbolo.valor = simb.valor;
                    simbolo.linea = simb.linea;
                    simbolo.columna =  simb.columna;
                }
            })
        }

        modificarSimboloP(simb,am){
            
            this.simbolos.forEach(simbolo=>{
                //console.log(simb.nombre)
                if(simb.nombre==simbolo.nombre&&simbolo.entorno==am){
                    simbolo.nombre = simb.nombre;
                    simbolo.tipo1 = simb.tipo1;
                    simbolo.tipo2 = simb.tipo2;
                    simbolo.valor = simb.valor;
                    simbolo.linea = simb.linea;
                    simbolo.columna =  simb.columna;
                }else if(simb.nombre==simbolo.nombre&&simbolo.entorno=="General"){
                    simbolo.nombre = simb.nombre;
                    simbolo.tipo1 = simb.tipo1;
                    simbolo.tipo2 = simb.tipo2;
                    simbolo.valor = simb.valor;
                    simbolo.linea = simb.linea;
                    simbolo.columna =  simb.columna;
                }
            })
        }
    }

    function CrearInstancia(){
        return new tabla();
    }

    return {
        getInstancia:function(){
            if(!instancia){
                instancia=CrearInstancia();
            }
            return instancia;
        }
    }
}());

module.exports={tabla,simbolo}

