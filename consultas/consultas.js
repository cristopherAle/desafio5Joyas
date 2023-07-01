const pool = require('../db/conexion.js');
const format = require('pg-format');


const getAllJoyas = async ({limits = 10, page =1, order_by = "id_asc"}) => {
    const [campos, direccion] = order_by.split('_');
    const offset = limits * (page - 1);
    const { rows: productos } = await pool.query(
        format(
            "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s", campos, direccion, limits, offset
        )
    )
    return productos
}
const getHATEOAS  = (productos) =>{
    const results = productos.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        categoria: productos.categoria,
        metal: producto.metal,
        precio: producto.precio,
        stock: producto.stock,
        url: `/products/product/${producto.id}`,
    }));
    const totalProducts=6;
    const totalProductoxMetal = results.length;

    const paginacion = `${page} de ${Math.ceil(
        totalProducts / totalProductoxMetal
      )}`;
    const HATEOAS = {
        totalProducts,
        totalProductoxMetal,
        page,
        paginacion,
        results
    }
    return HATEOAS;
}

const getProduct = async (id) => {
    const { rows } = await pool.query("SELECT * FROM inventario WHERE id = $1", [
      id,
    ]);
    return rows[0];
  };

//Obtener productos por filtro
const productsXfiltro = async (querystring) => {
    let filtros = [];
    let values = [];
  
    //agregamos el filtro para validar los campos
    const agregarFiltro = (campo, comparador, valor) => {
      values.push(valor);
      const { length } = filtros;
      filtros.push(`${campo} ${comparador} $${length + 1}`);
    };
  //desestructuramos el querystring
  const { category, price_max, price_min, tipometal, name } =
    querystring;

  //verificamos que los campos existan
  if (category) agregarFiltro("categoria", "ilike", `%${category}%`);
  if (price_max) agregarFiltro("precio", "<=", price_max);
  if (price_min) agregarFiltro("precio", ">=", price_min);
  if (tipometal) agregarFiltro("metal", "ilike", `%${tipometal}%`);
   if (name) agregarFiltro("nombre", "ilike", `%${name}%`);

  let consulta = "SELECT * FROM inventario";
  if (filtros.length > 0) {
    consulta += " WHERE " + filtros.join(" AND ");
  }
  console.log(consulta)
  const { rows: productos } = await pool.query(consulta, values);
  return productos;
};

//module.exports = {getAllJoyas, getHATEOAS, getProduct, productsXfiltro}

module.exports = {getAllJoyas, getHATEOAS, getProduct, productsXfiltro}