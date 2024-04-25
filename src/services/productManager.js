import fs from "fs/promises";
import path from "path";

export class ProductManager {
  constructor(filePath = path.resolve("./src/data/Products.json")) {
    this.products = [];
    this.path = filePath;
  }

  async writeProduct() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.path, data);
    } catch (error) {
      console.error(`Problemas al crear el producto`, error);
    }
  }

  async readProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = data ? JSON.parse(data) : [];
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      this.products = [];
    }
  }
  async addProduct(newProduct) {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail = [],
    } = newProduct;
    try {
      await this.readProducts();
      if (status === undefined) newProduct.status = true;
      const lastId =
        this.products.length > 0
          ? this.products[this.products.length - 1].id
          : 0;
      const newId = lastId + 1;
      newProduct.id = newId;
      this.products.push(newProduct);
      this.writeProduct();
      console.log(`El producto ha sido agregado correctamente`);
    } catch (error) {
      console.error(`Problemas al crear el producto`, error);
    }
  }

  async getProducts() {
    try {
      await this.readProducts();
      return this.products.length === 0 ? `No hay productos` : this.products;
    } catch (error) {
      console.error(`Error al consultar productos`, error);
      return [];
    }
  }
  async getProductId(productId) {
    try {
      await this.readProducts();
      const encontrarProductoId = this.products.find(
        (product) => product.id === productId
      );
      return !encontrarProductoId
        ? console.log(`NOT FOUND: El producto con ID: ${productId} no existe`)
        : encontrarProductoId;
    } catch (error) {
      console.error(`Error al consultar productos`, error);
      return [];
    }
  }
  async updateProduct(productId, updatedFields) {
    try {
      await this.readProducts();

      const consultarIndexPorId = this.products.findIndex(
        (product) => product.id === productId
      );

      if (consultarIndexPorId !== -1) {
        const keys = Object.keys(this.products[consultarIndexPorId]);
        const updatedKeys = Object.keys(updatedFields);

        const allKeysExist = updatedKeys.every((key) => keys.includes(key));
        if (updatedFields.id) {
          console.log(
            `El ID no se puede cambiar, las keys son: title, description, price, thumbnail, code y stock`
          );
        } else if (!allKeysExist) {
          console.log(
            `Para actualizar productos las keys son: title, description, price, thumbnail, code y stock`
          );
        } else {
          this.products[consultarIndexPorId] = {
            ...this.products[consultarIndexPorId],
            ...updatedFields,
          };
          this.writeProduct();
          console.log("Producto actualizado correctamente");
        }
      } else {
        console.log(`El producto buscado no existe.`);
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  }
  async deleteProduct(productId) {
    try {
      await this.readProducts();
      const index = this.products.findIndex(
        (product) => product.id === productId
      );
      if (index !== -1) {
        this.products.splice(index, 1);
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        console.log("Producto eliminado correctamente");
        return { success: true, message: "Producto eliminado correctamente" };
      } else {
        console.log("Producto no encontrado");
        return { success: false, message: "Producto no encontrado" };
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return { success: false, message: "Error al eliminar el producto" };
    }
  }

  async checkProductCode(code) {
    await this.readProducts();
    return this.products.some((product) => product.code === code);
  }

  async checkProductId(id) {
    await this.readProducts();
    return this.products.some((product) => product.id === id);
  }
}
