import { Router } from 'express';
import { cartManager } from '../CartManager.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.addCart();

    return res.status(200).json({ message: 'Carta creada, agregue productos', cart: cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const products = await cartManager.getProductsInCart(+req.params.cid);
    if (products === -1) return res.status(400).json({ message: 'Cart not found' });
    
    if (products === 0) return res.status(200).json({ message: 'Cart is empty' });
    return res.status(200).json({ message: 'Products found', products: products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(+req.params.cid, +req.params.pid);
    if (cart === -1) return res.status(400).json({ message: 'Cart not found' });
    if (cart === 0) return res.status(400).json({ message: 'Product not found' });
    return res.status(200).json({ message: 'Product added to cart', cart: cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
