const express = require("express");
const morgan = require("morgan")
const cors = require("cors")
const body_parser = require("body-parser")
const ClienteRouter = require("./Routes/cliente_routes")

//creamos el servidor
const app = express();

app.set("port", process.env.PORT || 4000)
app.use(morgan("dev"))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({limit:'50mb'}))
app.use(cors())
app.use(body_parser.urlencoded({extended:true}))

app.listen(app.get('port'), ()=>{
    console.log("Server on Port ", app.get('port'))
});

app.use("/", ClienteRouter)

// Definiendo ruta principal
/*app.get("/", (req, res) => {
    res.send({"Saludo":"Funciona la API :3"})
});*/

