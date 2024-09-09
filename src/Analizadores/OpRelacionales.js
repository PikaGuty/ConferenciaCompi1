var errores = require("../Errores")

module.exports = {
    mayque: function(v1,v2,fila,columna){
        let res = new ResultadoOp();
        switch(v1.tipo){
            case "Int":
                switch(v2.tipo){
                    case "Int":
                        res.tipo="Boolean";
                        if(parseInt(v1.valor)>parseInt(v2.valor)){
                            res.valor="true"
                        }else{
                            res.valor="false"
                        }
                        res.anterior=v2.valor
                        return res;
                    default:
                        errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible comparar entre: "+v1.tipo +' y '+v2.tipo,fila,columna));
                        res.tipo="error";
                        res.valor="error";
                        return res;
                }
            default:
                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible comparar entre: "+v1.tipo +' y '+v2.tipo,fila,columna));
                res.tipo="error";
                res.valor="error";
                return res;
        }
    },
    menque: function(v1,v2,fila,columna){
        let res = new ResultadoOp();
        switch(v1.tipo){
            case "Int":
                switch(v2.tipo){
                    case "Int":
                        res.tipo="Boolean";
                        if(parseInt(v1.valor)<parseInt(v2.valor)){
                            res.valor="true"
                        }else{
                            res.valor="false"
                        }
                        res.anterior=v2.valor
                        return res;
                    default:
                        errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible comparar entre: "+v1.tipo +' y '+v2.tipo,fila,columna));
                        res.tipo="error";
                        res.valor="error";
                        return res;
                }   
            default:
                errores.ListaErrores.getInstance().pushError(new errores.error("Semantico","No es posible comparar entre: "+v1.tipo +' y '+v2.tipo,fila,columna));
                res.tipo="error";
                res.valor="error";
                return res;
        }
    }
}

class ResultadoOp{
    constructor(tipo,valor,anterior){
        this.tipo=tipo;
        this.valor=valor;
        this.anterior=anterior
    }
}