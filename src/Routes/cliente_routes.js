const express = require ('express')
const router = express.Router()
const control = require("../Controllers/cliente_controller")

router.get("/cliente", control.index)

router.get("/tsim", control.TSimbolos)
router.post("/analizar", control.Analizar)
router.get("/ast", control.Ast)
router.get("/err", control.TErrores)

module.exports = router