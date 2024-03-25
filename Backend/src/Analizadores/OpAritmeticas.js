var errores = require("../Errores")

module.exports = {
    suma: function(v1,v2,fila,columna){
        let res = new ResultadoOp();
        let cad,cadr;
        switch(v1.tipo){
            case "Int":
                switch(v2.tipo){
                    case "Int":
                        res.tipo="Int";
                        res.valor=parseInt(v1.valor)+parseInt(v2.valor);
                        return res;
                    default:
                        errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible sumar entre: "+v1.tipo +' y '+v2.tipo,fila,columna));
                        res.tipo="error";
                        res.valor="error";
                        return res;
                }
            default:
                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible sumar entre: "+v1.tipo +' y '+v2.tipo,fila,columna));
                res.tipo="error";
                res.valor="error";
                return res;
        }
    },

    resta: function(v1,v2,fila,columna){
        let res = new ResultadoOp();
        let cad,cadr;
        switch(v1.tipo){
            case "Int":
                switch(v2.tipo){
                    case "Int":
                        res.tipo="Int";
                        res.valor=parseInt(v1.valor)-parseInt(v2.valor);
                        return res;
                    default:
                        errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible restar entre: "+v1.tipo +' y '+v2.tipo,fila,columna));
                        res.tipo="error";
                        res.valor="error";
                        return res;
                }
            default:
                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible restar entre: "+v1.tipo +' y '+v2.tipo,fila,columna));
                res.tipo="error";
                res.valor="error";
                return res;
        }
    },
    multiplicacion: function(v1,v2,fila,columna){
        let res = new ResultadoOp();
        let cad,cadr;
        switch(v1.tipo){
            case "Int":
                switch(v2.tipo){
                    case "Int":
                        res.tipo="Int";
                        res.valor=parseInt(v1.valor)*parseInt(v2.valor);
                        return res;
                    default:
                        errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible multiplicar entre: "+v1.tipo +' y '+v2.tipo,fila,columna));
                        res.tipo="error";
                        res.valor="error";
                        return res;
                }

            default:
                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible multiplicar entre: "+v1.tipo +' y '+v2.tipo,fila,columna));
                res.tipo="error";
                res.valor="error";
                return res;
        }
    },

    negacion: function(v1,fila,columna){
        let res = new ResultadoOp();
        let cad,cadr;
        switch(v1.tipo){
            case "Int":
                res.tipo="Int";
                res.valor=0-parseInt(v1.valor);
                return res;
            default:
                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible la negacion para: "+v1.valor,fila,columna));
                res.tipo="error";
                res.valor="error";
                return res;
            }
        }
}

class ResultadoOp{
    constructor(tipo,valor){
        this.tipo=tipo;
        this.valor=valor;
    }
}
