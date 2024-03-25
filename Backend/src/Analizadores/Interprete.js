
var aritmetica = require("./OpAritmeticas")
var relacionales = require("./OpRelacionales")
var tabsim = require("../tabla_simbolos")
var errores = require("../Errores")


let codFun="";
let unicoRun=true;
let habilitarLlamada=false;

let ambito = "Global"

function interpretar (raiz){   
    let res;
    let codigo=""
    let sim;
    let simbolo;
    let condicion;
    
    if(raiz===undefined || raiz===null)return;
    switch(raiz.etiqueta){
        case "Raiz":
            raiz.hijos.forEach(hijo=> codigo+=interpretar(hijo))
            return codigo;
        case "Instrucciones":
            raiz.hijos.forEach(hijo=>{ 
                codigo+=interpretar(hijo)
            })
            return codigo;
        case "Var":
            let t = raiz.hijos[0];
            raiz.hijos.forEach(hijo=> variable(t.valor,hijo))
            return codigo;
        case "FParametros":
            raiz.hijos.forEach(hijo=> interpretar(hijo))
            return codigo;

        case "Asig":
            res=evaluarExpresion(raiz.hijos[1]);

            simbolo = tabsim.tabla.getInstancia().getSimboloP(raiz.hijos[0].valor, ambito);

            if(simbolo!=null){

                if(res.otro!="Lista"){
                    let tipo = simbolo.tipo2;
                    if (tipo==res.tipo){
                        sim = new tabsim.simbolo(raiz.hijos[0].valor,"Asignacion",tipo,ambito,res.valor,raiz.hijos[0].fila,raiz.hijos[0].columna)
                    }else{
                        errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","Error semantico, el dato \""+res.valor+"\" no es de tipo \""+tipo+"\"",raiz.hijos[0].fila,raiz.hijos[0].columna));
                    }

                    if(sim!=null){
                        tabsim.tabla.getInstancia().modificarSimboloP(sim)
                    }
                }else{
                    errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible asignar un vectror",raiz.hijos[0].fila,raiz.hijos[0].columna));
                }
            }else{
                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No existe una variable con el identificador: \""+raiz.hijos[0].valor+"\"",raiz.hijos[0].fila,raiz.hijos[0].columna));
            }

            return codigo;
        case "FPrint":
            res = evaluarExpresion(raiz.hijos[0]);
            codigo+=res.valor            
            return codigo;
        case "FPrintln":
            res = evaluarExpresion(raiz.hijos[0]);
            codigo+=res.valor+"\n"            
            return codigo;
        case "CIf":
            condicion = evaluarExpresion(raiz.hijos[0]);
            if (condicion.tipo=="Boolean"){
                if (condicion.valor.toLowerCase()=="true"){
                    codigo+=interpretar(raiz.hijos[1])
                    return codigo;
                }else{
                    if(raiz.hijos[2]!=null){
                        codigo+=interpretar(raiz.hijos[2].hijos[0])
                        return codigo;
                    }
                    return codigo;
                }
            }else{
                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","La condición debe devolver un valor Booleano (true o false)",raiz.fila,raiz.columna));
                return null;
            }
            break;
    }
    return codigo;
}

function tabla (){
    console.log("\nTabla de simbolos")
    console.log(tabsim.tabla.getInstancia().getsimbolos());
    console.log("Tabla de errores\n")
    console.log(errores.ListaErrores.getInstance().getErrores())
}

function variable(tipo,raiz){
    let sim;
    let valo;
    
    switch(raiz.etiqueta){
        case "Dec":
            raiz.hijos.forEach(hijo=> variable(tipo,hijo))
            break;
        case "id":
            //(nombre,tipo1,tipo2,valor,linea,columna)
            switch(tipo){
                case "Int":
                    sim= new tabsim.simbolo(raiz.valor,"Declaracion",tipo,ambito,0,raiz.fila,raiz.columna)
                    break;
                case "Double":
                    sim= new tabsim.simbolo(raiz.valor,"Declaracion",tipo,ambito,0.0,raiz.fila,raiz.columna)
                    break;
                case "Boolean":
                    sim= new tabsim.simbolo(raiz.valor,"Declaracion",tipo,ambito,true,raiz.fila,raiz.columna)
                    break;
                case "Char":
                    sim= new tabsim.simbolo(raiz.valor,"Declaracion",tipo,ambito,'0',raiz.fila,raiz.columna)
                    break;
                case "String":
                    sim= new tabsim.simbolo(raiz.valor,"Declaracion",tipo,ambito,"\"\"",raiz.fila,raiz.columna)
                    break;
            }
            if(sim!=null){
                let simbolo = tabsim.tabla.getInstancia().getSimboloP(sim.nombre,ambito);
                if(simbolo!=null){
                    if(simbolo.entorno==ambito){
                        if(!permitir){
                            if(simbolo.tipo1=="Asignacion"||simbolo.tipo1=="Declaracion"||simbolo.tipo1=="Incremento"||simbolo.tipo1=="Decremento"||simbolo.tipo1=="AsignacionV"||simbolo.tipo1=="AsignacionV2"){
                                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","Ya existe una varible con el nombre \""+sim.nombre+"\"",raiz.fila,raiz.columna));
                            }else if(simbolo.tipo1=="Funcion"||simbolo.tipo1=="Metodo"){
                                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","Ya existe una función o método con el nombre "+sim.nombre,raiz.fila,raiz.columna));
                            }
                        }else if(lugar=="SFor"){
                            tabsim.tabla.getInstancia().modificarSimboloP(sim,ambito)
                        }else{
                            tabsim.tabla.getInstancia().modificarSimboloP(sim,ambito)
                        }
                    }else{
                        tabsim.tabla.getInstancia().pushSimbolo(sim)
                    }
                }else{
                    tabsim.tabla.getInstancia().pushSimbolo(sim)
                }
                
            }
            break;
        case "Asig":
            res=evaluarExpresion(raiz.hijos[1],ambito);

            if (tipo==res.tipo){
                if(tipo=="Int"){
                    if(-2147483648 <= res.valor && res.valor <= 2147483647){
                        sim = new tabsim.simbolo(raiz.hijos[0].valor,"Asignacion",tipo,ambito,res.valor,raiz.hijos[1].fila,raiz.hijos[1].columna)
                    }else{
                        errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","Los valores permitidos para variables de tipo entero son entre -2147483648 y 2147483647",raiz.hijos[1].fila,raiz.hijos[1].columna));
                    }
                }else{
                    sim = new tabsim.simbolo(raiz.hijos[0].valor,"Asignacion",tipo,ambito,res.valor,raiz.hijos[1].fila,raiz.hijos[1].columna)
                }
                
            }else if(tipo=="Double"&&res.tipo=="Int"){
                sim = new tabsim.simbolo(raiz.hijos[0].valor,"Asignacion",tipo,ambito,res.valor,raiz.hijos[1].fila,raiz.hijos[1].columna)
            }else if(tipo=="Int"&&res.tipo=="Boolean"){
                if(res.valor.toString().toLowerCase()=="true"){
                    sim = new tabsim.simbolo(raiz.hijos[0].valor,"Asignacion",tipo,ambito,1,raiz.hijos[1].fila,raiz.hijos[1].columna)
                }else{
                    sim = new tabsim.simbolo(raiz.hijos[0].valor,"Asignacion",tipo,ambito,0,raiz.hijos[1].fila,raiz.hijos[1].columna)
                }
                
            }else{
                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","Error semantico, el dato \""+res.valor+"\" no es de tipo \""+tipo+"\"",raiz.hijos[1].fila,raiz.hijos[1].columna));
            }

            if(sim!=null){
                if(res.otro!="Lista"){
                    let simbolo = tabsim.tabla.getInstancia().getSimboloP(sim.nombre,ambito);
                    if(simbolo!=null){
                        if(simbolo.entorno==ambito){
                            if(!permitir){
                                if(simbolo.tipo1=="Asignacion"||simbolo.tipo1=="Declaracion"||simbolo.tipo1=="Incremento"||simbolo.tipo1=="Decremento"||simbolo.tipo1=="AsignacionV"||simbolo.tipo1=="AsignacionV2"){
                                    errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","Ya existe una varible con el nombre \""+sim.nombre+"\"",raiz.hijos[0].fila,raiz.hijos[0].columna));
                                }else if(simbolo.tipo1=="Funcion"||simbolo.tipo1=="Metodo"){
                                    errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","Ya existe una función o método con el nombre \""+sim.nombre+"\"",raiz.hijos[0].fila,raiz.hijos[0].columna));
                                }
                            }else if(lugar=="SFor"){
                                tabsim.tabla.getInstancia().modificarSimboloP(sim,ambito)
                            }else{
                                tabsim.tabla.getInstancia().modificarSimboloP(sim,ambito)
                            }
                            
                        }else{
                            tabsim.tabla.getInstancia().pushSimbolo(sim)
                        }
                    }else{
                        tabsim.tabla.getInstancia().pushSimbolo(sim)
                    }
                }else{
                    errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible asignar un vector",raiz.hijos[0].fila,raiz.hijos[0].columna));
                }
            }
            break;
    }
}

function evaluarExpresion(raiz){
    let res1 = null;
    let res2 = null;
    let res = null;
    let simbolo=null;

    switch (raiz.etiqueta) {
        case "Expresion":
            if (raiz.hijos.length==3) {
                res1 = evaluarExpresion(raiz.hijos[0]);
                res2 = evaluarExpresion(raiz.hijos[2]);

                let operador = raiz.hijos[1].valor;
                switch(operador){
                    case "+":
                        return aritmetica.suma(res1,res2,raiz.hijos[1].fila,raiz.hijos[1].columna)
                    case "-": 
                        return aritmetica.resta(res1,res2,raiz.hijos[1].fila,raiz.hijos[1].columna)
                    case "*":
                        return aritmetica.multiplicacion(res1,res2,raiz.hijos[1].fila,raiz.hijos[1].columna)
                    
                    case ">":
                        return relacionales.mayque(res1,res2,raiz.hijos[1].fila,raiz.hijos[1].columna)
                    case "<":
                        return relacionales.menque(res1,res2,raiz.hijos[1].fila,raiz.hijos[1].columna)
                    
                    default:
                        break;
                }
            }else if (raiz.hijos.length==2) {
                res1 = evaluarExpresion(raiz.hijos[1]);

                let operador = raiz.hijos[0].valor;
                switch(operador){
                    case "-":
                        return aritmetica.negacion(res1,raiz.hijos[0].fila,raiz.hijos[0].columna)
                    default:
                        break;
                }
            }else if (raiz.hijos.length==1) {
                return evaluarExpresion(raiz.hijos[0]);
            }
        case "entero":
            res = new ResultadoOp();
            res.tipo="Int";
            res.valor=raiz.valor;
            return res;
        case "true":
            res = new ResultadoOp();
            res.tipo="Boolean"
            res.valor=raiz.valor;
            return res;
        case "false":
            res = new ResultadoOp();
            res.tipo="Boolean"
            res.valor=raiz.valor;
            return res;
        case "cadena":
            res = new ResultadoOp();
            res.tipo="String"
            res.valor=raiz.valor;
            return res;
        case "id":
            res = new ResultadoOp();
            simbolo = tabsim.tabla.getInstancia().getSimboloP(raiz.valor, ambito);

            if(simbolo!=null){
                res.tipo=simbolo.tipo2;
                res.valor=simbolo.valor;
                res.otro=simbolo.tipo1;

                return res;
            }else{
                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No existe una variable con el identificador: \""+raiz.valor+"\"",raiz.fila,raiz.columna));
                res.tipo="Error";
                res.valor="Error";
                return res;
            }
    }
}

class ResultadoOp{
    constructor(tipo,valor,otro){
        this.tipo=tipo;
        this.valor=valor;
        this.otro=otro;
    }
}


module.exports={interpretar,tabla}