const mongoose = require('mongoose');

const uri = 'mongodb+srv://Izhar01:Izhar01mongodb@cluster0.lribs3p.mongodb.net/my-store-db?retryWrites=true&w=majority';

async function fixProductUrls() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Minimal Product schema
    const ProductSchema = new mongoose.Schema({}, { strict: false });
    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      if (product.images && product.images.length > 0) {
        let changed = false;
        const newImages = product.images.map(img => {
          if (img.url && img.url.includes('uc?id=')) {
            const fileId = img.publicId || img.url.split('id=')[1];
            if (fileId) {
                img.url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                changed = true;
            }
          }
          return img;
        });

        if (changed) {
          await Product.updateOne({ _id: product._id }, { $set: { images: newImages } });
          updatedCount++;
        }
      }
    }
    
    console.log(`Successfully updated URLs for ${updatedCount} products.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

fixProductUrls();
