import { Router } from 'express';
import { productManager } from '../ProductManager.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    let products = await productManager.getProducts();
    
    if (req.query.limit) products = products.slice(0, req.query.limit);
    if (!products.length) return res.status(200).json({ message: 'No products' });
    return res.status(200).json({ message: 'Products found', products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(+req.params.pid);
    if (product === 'Not found') return res.status(400).json({ message: 'Product not found' });
    return res.status(200).json({ message: 'Product found', product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
    const product = await productManager.addProduct(title, description, code, price, status, stock, category, thumbnails);
    if (product === -1) return res.status(400).json({ message: 'Faltan datos' });
    if (product === 0) return res.status(400).json({ message: 'Ya existe un producto con ese código' });
    return res.status(200).json({ message: 'Producto creado', product: product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const product = await productManager.updateProduct(+req.params.pid, req.body);
    if (product === 'Not found') return res.status(400).json({ message: 'Product not found' });
    return res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const products = await productManager.deleteProduct(+req.params.pid);
    if (products === 'Not found') return res.status(400).json({ message: 'Product not found' });
    return res.status(200).json({ message: 'Product deleted', products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
