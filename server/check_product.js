const mongoose = require('mongoose');

const uri = 'mongodb+srv://Izhar01:Izhar01mongodb@cluster0.lribs3p.mongodb.net/my-store-db?retryWrites=true&w=majority';

async function checkProduct() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Minimal Product schema to just fetch images
    const ProductSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    const product = await Product.findOne({ name: 'Izhar' });
    if (product) {
      console.log('Found Product:', product.name);
      console.log('Images:', JSON.stringify(product.images, null, 2));
    } else {
      console.log('Product "Izhar" not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

checkProduct();
