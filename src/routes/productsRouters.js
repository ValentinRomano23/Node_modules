import { Router } from "express";
import { ProductManager } from "../services/productManager.js";

const productsRouter = Router();

const productManager = new ProductManager();

productsRouter.get("/api/products", async (req, res) => {
  const limit = parseInt(req.query.limit);

  try {
    const products = await productManager.getProducts();

    if (!isNaN(limit)) {
      res.status(200).json(products.slice(0, limit));
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json(`Error al obtener productos`, error);
  }
});

productsRouter.get("/api/products/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  try {
    const product = await productManager.getProductId(id);
    if (!product)
      return res
        .status(404)
        .json(`El id: ${id} no pertenece a ningún producto`);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(`Error al obtener el producto por ID`, error);
  }
}),
  productsRouter.post("/api/products", async (req, res) => {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    const product = req.body;
    try {
      if (!(title && description && price && code && stock && category)) {
        return res.status(400).json({
          error:
            "Las siguientes key son obligatorios: title, description, code, price, status, stock, category",
        });
      }
      if (!thumbnail) product.thumbnail = [];

      if (
        product.status !== true &&
        product.status !== false &&
        product.status !== undefined
      ) {
        return res.status(400).json({
          error:
            "Status solo puede ser true o false, si no se carga, por defecto es true",
        });
      }

      const codeRegistered = await productManager.checkProductCode(code);

      if (codeRegistered) {
        return res.status(400).json({ error: "El código ya está registrado" });
      }

      const addProduct = await productManager.addProduct(product);

      res
        .status(200)
        .json({ Producto: product, message: `Producto cargado correctamente` });
    } catch (error) {
      res.status(500).json(`Error al generar producto`, error);
    }
  }),
  productsRouter.put("/api/products/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    const product = req.body;
    try {
      const checkId = await productManager.checkProductId(id);
      if (!checkId) {
        return res
          .status(400)
          .json({ message: `El ID no corresponde a ningún producto` });
      }
      if (product.id) {
        return res.status(400).json({
          message: `El ID no se puede cambiar, las keys son: title, description, code, price, status, stock, category y thumbnail`,
        });
      }

      const codeRegistered = await productManager.checkProductCode(code);

      if (codeRegistered) {
        return res.status(400).json({ error: "El código ya está registrado" });
      }

      const updateProduct = productManager.updateProduct(id, product);

      res.status(201).json({
        ProductoID: `${id}`,
        message: `Producto actualizado correctamente`,
      });
    } catch (error) {
      res.status(500).json(`Error al obtener el producto por ID`, error);
    }
  }),
  productsRouter.delete("/api/products/:pid", async (req, res) => {
    const productId = parseInt(req.params.pid);

    try {
      const checkId = await productManager.checkProductId(productId);
      if (!checkId) {
        return res
          .status(400)
          .json({ message: `El ID no corresponde a ningún producto` });
      }

      const deleteProduct = productManager.deleteProduct(productId);

      res
        .status(200)
        .json(`El producto id: ${productId} ha sido eliminado correctamente`);
    } catch (error) {
      res.status(500).json(`Error al borrar el producto`, error);
    }
  });

export default productsRouter;
