const express = require("express");
const router = express.Router();
const { getAllJoyas, getHATEOAS, getProduct, productsXfiltro} = require("../consultas/consultas.js");
const mostrarConsulta = require("../middleware/middleware.js");

router.get("/", mostrarConsulta, (req, res) => {
 res.send("Hola mundo cruel")
 
})

router.get("/products", mostrarConsulta, async (req, res) => {
    try{
        const consultas = req.query;
        page = +req.query.page || 1;
        const products = await getAllJoyas(consultas);
        const HATEOAS = getHATEOAS(products, page)
        res.json(HATEOAS);
    }catch (error){
        res.status(500).send(error)
    }
   
  });

  router.get("/products/product/:id", mostrarConsulta, async (req, res) => {
    try {
      const id = req.params.id;
      const producto = await getProduct(id);
      res.json(producto);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  router.get("/products/filtros", mostrarConsulta, async (req, res) => {
    try {
      const consultas = req.query;
      const productos = await productsXfiltro(consultas);
      res.json(productos);
      console.log(productos);
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = router;