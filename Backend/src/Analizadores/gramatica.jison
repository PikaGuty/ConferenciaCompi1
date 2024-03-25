/* Definición Léxica */
%lex

%options case-insensitive

cescape                             [\'\"\\bfnrtv]
escape                              \\{cescape}

char_vario                          [^\"\\]+

string_vario                       {escape}|{char_vario}

cadena                              \"{string_vario}*\"

identificador                       ([a-zA-Z])[a-zA-Z0-9_]*

%%

[ \r\t\n\s]+         					    // se ignoran espacios en blanco
[/][/].*									// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

//********** Tipos de datos **********
"int"                       return 'R_INT'

//********** RESERVADAS **********
"if"                        return 'R_IF'
"else"                      return 'R_ELSE'
"print"			            return 'R_PRINT';
"println"			        return 'R_PRINTLN';



//********** Caracteres **********
";"					        return 'PTCOMA';
"{"					        return 'LLAVIZQ';
"}"					        return 'LLAVDER';
"("					        return 'PARIZQ';
")"					        return 'PARDER';


//********** Operadores Relacionales **********
"<"					        return 'MENORQ';
">"					        return 'MAYORQ';

//********** OPERANDOS **********
"+"					        return 'MAS';
"-"					        return 'MENOS';
"*"					        return 'POR';
"="					        return 'IGUAL';


//********** Expresiones **********
[0-9]+\b				    return 'ENTERO';
{identificador}	            return 'IDENTIFICADOR';
{cadena}                    return 'CADENA';


<<EOF>>				return 'EOF';
.					{errores.ListaErrores.getInstance().pushError(new errores.error("Léxico","Simbolo no permitido en el lenguaje: " + yytext,yylloc.first_line,yylloc.first_column)); }

/lex

%{
    var errores = require("../Errores")
    
    function nodo(etiqueta, valor, fila, columna){
        this.etiqueta=etiqueta;
        this.valor=valor;
        this.fila=fila;
        this.columna=columna;
        this.hijos=[];
        this.addHijos=addHijos;
        this.getHijos=getHijos;

        function addHijos(){
            for(var i=0; i<arguments.length;i++){
                this.hijos.push(arguments[i]);
                if(arguments[i]!=null){
                    arguments[i].padre=this;
                }
            }
        }
        function getHijos(pos){
            if (pos >(this.hijos.length-1)) return null;
            return this.hijos[pos]
        }
    }
%}

//PRECEDENCIA
%left 'MENORQ' 'MAYORQ'
%left 'MAS' 'MENOS'
%left 'POR'
%right UMINUS
%left 'PARIZQ' 'PARDER'

%start ini

%% 
/* Definición de la gramática */
ini
    : instrucciones EOF {$$=new nodo("Raiz","Raiz",this.$first_line,@1.last_column); $$.addHijos($1); return $$;} 
    | EOF 
;
instrucciones
    : instrucciones instruccion {$1.addHijos($2); $$=$1;}
    | instruccion {$$= new nodo("Instrucciones","Instrucciones",this._$.first_line,@1.last_column); $$.addHijos($1);}
    | error {errores.ListaErrores.getInstance().pushError(new errores.error("Sintáctico","Este es un error sintáctico:" + yytext,this._$.first_line,this._$.first_column)); }  
;
//############### INSTRUCCIONES ###############
instruccion
    : declaracion PTCOMA {$$=$1}
    | sen_if {$$=$1}
    | asig_solo PTCOMA {$$=$1}
    | fprint PTCOMA {$$=$1}
    | fprintln PTCOMA {$$=$1}
    | error {errores.ListaErrores.getInstance().pushError(new errores.error("Sintáctico","Este es un error sintáctico:" + yytext,this._$.first_line,this._$.first_column)); }  
;
//#############################################
//TIPOS DE DATOS
tipo 
    : R_INT  {$$= new nodo("Tipo","Int",this._$.first_line,@1.last_column);}
;

//POSIBLES VALORES PARA LOS TIPOS
expresion
    //Expresiones 
    : expresion MAS expresion {$$= new nodo("Expresion","Expresion",this._$.first_line,@2.last_column);$$.addHijos($1,new nodo("op",$2,this._$.first_line,@2.last_column),$3);}
    | expresion MENOS expresion {$$= new nodo("Expresion","Expresion",this._$.first_line,@2.last_column);$$.addHijos($1,new nodo("op",$2,this._$.first_line,@2.last_column),$3);}
    | expresion POR expresion {$$= new nodo("Expresion","Expresion",this._$.first_line,@2.last_column);$$.addHijos($1,new nodo("op",$2,this._$.first_line,@2.last_column),$3);}
    | MENOS expresion %prec UMINUS {$$= new nodo("Expresion","Expresion",this._$.first_line,@2.last_column);$$.addHijos(new nodo("op",$1,this._$.first_line,@2.last_column),$2);}
    | PARIZQ expresion PARDER {$$=$2}
    | expresion MENORQ expresion {$$= new nodo("Expresion","Expresion",this._$.first_line,@2.last_column);$$.addHijos($1,new nodo("op_rel",$2,this._$.first_line,@2.last_column),$3);}
    | expresion MAYORQ expresion {$$= new nodo("Expresion","Expresion",this._$.first_line,@2.last_column);$$.addHijos($1,new nodo("op_rel",$2,this._$.first_line,@2.last_column),$3);}
    
    | ENTERO {$$= new nodo("Expresion","Expresion",this._$.first_line,@1.last_column);$$.addHijos(new nodo("entero",$1,this._$.first_line,@1.last_column));}
    | IDENTIFICADOR {$$= new nodo("Expresion","Expresion",this._$.first_line,@1.last_column);$$.addHijos(new nodo("id",$1,this._$.first_line,@1.last_column));}
    
    | CADENA {$$= new nodo("Expresion","Expresion",this._$.first_line,@1.last_column);
    var cad= $1.substr(0,$1.length);
    cad=cad.replace(/\\n/g,"\n");
    cad=cad.replace(/\\t/g,"\t");
    cad=cad.replace(/\\r/g,"\r");
    cad=cad.replace(/\\\\/g,"\\");
    cad=cad.replace(/\\\"/g,"\"");
    cad=cad.replace(/\\\'/g,"\'");
    $$.addHijos(new nodo("cadena",cad,this._$.first_line,@1.last_column));}

;


//***************** Declaración y asignación de variables *****************
declaracion
    : tipo dec {$$= new nodo("Var","Var",this._$.first_line,@1.last_column); $$.addHijos($1,$2);}
;
dec
    : dec COMA asig {$1.addHijos($3); $$=$1;}
    | asig {$$= new nodo("Dec","Dec"); $$.addHijos($1)}
;
asig
    : IDENTIFICADOR IGUAL expresion {$$= new nodo("Asig","Asig"); $$.addHijos(new nodo("id",$1,this._$.first_line,@1.last_column),$3)}
    | IDENTIFICADOR {$$=new nodo("id",$1,this._$.first_line,@1.last_column)}
;
asig_solo
    : IDENTIFICADOR IGUAL expresion  {$$= new nodo("Asig","Asig"); $$.addHijos(new nodo("id",$1,this._$.first_line,@1.last_column),$3)}
;
//********************************* CASTEO ********************************
casteo
    : PARIZQ tipo PARDER expresion {$$= new nodo("Cast","Cast"); $$.addHijos($2,$4)}
;
//************************ INCREMENTO Y DECREMENTO ************************
inc_dec
    : expresion INCRE {$$= new nodo("Incr","Incr"); $$.addHijos($1)}
    | expresion DECRE {$$= new nodo("Decr","Decr"); $$.addHijos($1)}
;


//************************* SENTENCIA DE CONTRO IF ************************
sen_if
    : R_IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER {$$= new nodo("CIf","CIf"); $$.addHijos($3,$6)}
    | R_IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER R_ELSE LLAVIZQ instrucciones LLAVDER {$$= new nodo("CIf","CIf"); $8=new nodo("CElse","CElse"); $$.addHijos($3,$6,$8); $8.addHijos($10);}
    | R_IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER R_ELSE sen_if {$$= new nodo("CIf","CIf"); $8=new nodo("CElse","CElse"); $$.addHijos($3,$6,$8); $8.addHijos($9);}
;

//************************* PRINT ************************
fprint
    : R_PRINT PARIZQ expresion PARDER  {$$= new nodo("FPrint","FPrint",this._$.first_line,@1.last_column); $$.addHijos($3)}
;
//************************* PRINT LN ************************
fprintln
    : R_PRINTLN PARIZQ expresion PARDER {$$= new nodo("FPrintln","FPrintln",this._$.first_line,@1.last_column); $$.addHijos($3)}
;
//*************************************************************************