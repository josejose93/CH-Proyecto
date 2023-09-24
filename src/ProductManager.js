import fs from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data.length ? data : '[]');
    } catch (error) {
      return error;
    }
  }

  async addProduct(title, description, code, price, status, stock, category, thumbnails) {
    try {
      if (!title || !description || !code || !price || !status || !stock || !category) return -1;

      const products = await this.getProducts();
      if (products.find((product) => product.code === code)) return 0;
        
      const newProduct = {
        id: products.length == 0 ? 1 : products.sort((a, b) => b.id - a.id)[0].id + 1,
        title: title,
        description: description,
        code: code,
        price: +price,
        status: (status === 'true' || status === true) ? true : false,
        thumbnails: !thumbnails ? [] : thumbnails,
        stock: +stock,
        category: category,
      }
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return newProduct;
    } catch (error) {
      return error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product.id === id);
      if (!product) {
        return 'Not found';
      }
      return product;
    } catch (error) {
      return error;
    }
  }

  async getProductsByIds(ids) {
    try {
      const products = ids.map((product) => this.getProductById(product));
      return Promise.all(products);
    } catch (error) {
      return error;
    }
  }

  async updateProduct(id, obj) {
    try {
      const products = await this.getProducts();
      let product = products.find((product) => product.id === id);
      if (!product) return 'Not found';
      product = { ...product, ...obj };
      products[products.findIndex((product) => product.id === id)] = product;
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return product;
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(id) {
    try {
      let products = await this.getProducts();
      const productsInitialSize = products.length;
      products = products.filter((product) => product.id !== id);
      if (productsInitialSize === products.length) return -1;
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return products;
    } catch (error) {
      return error;
    }
  }
}

export const productManager = new ProductManager('productos.json');
