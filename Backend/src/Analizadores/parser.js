var fs = require('fs'); 
var parser = require('./gramatica');
var AST = require("../AST");
var semantico = require("./Interprete");
var ts = require("../tabla_simbolos")


fs.readFile('./entrada.txt', (err, data) => {
    if (err) throw err;
    resultado=parser.parse(data.toString());

    console.log(AST.imprimir(resultado));

    codigo = semantico.interpretar(resultado)
    
    semantico.tabla();
    console.log(ts.tabla.getInstancia().getTablaSimbolos())
    console.log("\nSALIDA\n")
    console.log(codigo)
}); 

