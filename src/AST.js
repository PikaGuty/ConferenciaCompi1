module.exports = {
    imprimir: function(raiz){
        var texto ="";
        var contador=1;
        texto+="digraph G{";
        texto+="Node0[label=\"" + escapar(raiz.etiqueta +" | "+raiz.valor) + "\"];\n";
        
        recorrido("Node0",raiz);
        
        texto+= "}";
        
        return texto;
        
        function recorrido(padre,hijs){
            if(hijs === undefined || hijs === null) return;
        
            //console.log(typeof hijs);
        
            if(typeof hijs=="string")return;
            hijs.hijos.forEach(nodo=> {
                try{
                    if(typeof nodo.etiqueta=="undefined")return;
                }catch(e){
                    return
                }
                
                let nombrehijo="Node"+contador;
                texto+=nombrehijo+"[label=\"" + escapar(nodo.etiqueta) +" | "+escapar(nodo.valor) + "\"];\n";
                texto+=padre+"->"+nombrehijo+";\n";
                contador++;
                recorrido(nombrehijo,nodo);
            })
        
        }
        
        function escapar(cadena) {
            cadena = cadena.replace(/\\/g, "\\\\");
            cadena = cadena.replace(/\"/g, "\\\"");
            return cadena;
        }
    }
}

