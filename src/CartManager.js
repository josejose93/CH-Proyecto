import fs from 'fs';
import { productManager } from './ProductManager.js';

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      if (!fs.existsSync(this.path)) return [];
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data.length ? data : '[]');
    } catch (error) {
      return error;
    }
  }

  async getCartById(cid) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id === cid);
      if (!cart) return -1;
      return cart;
    } catch (error) {
      return error;
    }
  }

  async addCart() {
    try {
      const carts = await this.getCarts();
      const newCart = {
        id: carts.length == 0 ? 1 : carts.sort((a, b) => b.id - a.id)[0].id + 1,
        products: [],
      }
      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return newCart;
    } catch (error) {
      return error;
    }
  }

  async getProductsInCart(cid) {
    try {
      const cart = await this.getCartById(cid);
      if (cart === -1) return -1;
      let products = cart.products;
      if (products.length === 0) return 0;
      const idsProducts = products.map((product) => product.id);
      products = await productManager.getProductsByIds(idsProducts);
      return products;
    } catch (error) {
      return error;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts();
      console.log(carts);
      const cart = await this.getCartById(cid);
      if (cart === -1) return -1;
      const product = await productManager.getProductById(pid);
      if (product === 'Not found') return 0;
      if (cart.products.find((product) => product.id === pid)) {
        const pos = cart.products.findIndex((product) => product.id === pid);
        cart.products[pos].quantity += 1;
        carts[carts.findIndex((cart) => cart.id === cid)] = cart;
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return cart;
      }
      cart.products.push({ id: product.id, quantity: 1 });
      console.log(cart);
      carts[carts.findIndex((cart) => cart.id === cid)] = cart;
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return cart;
    } catch (error) {
      return error;
    }
  }
}

export const cartManager = new CartManager('carrito.json');
