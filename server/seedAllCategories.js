const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Product = require('./models/Product');
const Category = require('./models/Category');

const dummyImages = [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
    'https://images.unsplash.com/photo-1583095315570-58479e0004dc?w=800'
];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected for Seeding');

        const categories = await Category.find();
        if (categories.length === 0) {
            console.log('⚠️ No categories found in the database. Please add some categories first.');
            process.exit();
        }

        console.log(`Found ${categories.length} categories. Adding dummy products...`);

        const productsToInsert = [];

        categories.forEach(category => {
            for (let i = 1; i <= 3; i++) {
                const randomImage = dummyImages[Math.floor(Math.random() * dummyImages.length)];
                productsToInsert.push({
                    name: `${category.name} Sample Product ${i}`,
                    description: `This is a beautiful sample product for the ${category.name} category. It features premium quality materials and exquisite craftsmanship.`,
                    shortDescription: `A premium sample product for ${category.name}`,
                    price: Math.floor(Math.random() * 500) + 50,
                    stock: Math.floor(Math.random() * 50) + 10,
                    category: category._id,
                    isActive: true,
                    isFeatured: i === 1, // Make the first one featured
                    rating: { average: (Math.random() * 2 + 3).toFixed(1), count: Math.floor(Math.random() * 50) },
                    images: [{ url: randomImage, publicId: `dummy_${Date.now()}_${i}` }],
                });
            }
        });

        for (const product of productsToInsert) {
            await Product.create(product);
        }

        console.log(`✅ Successfully inserted ${productsToInsert.length} products across ${categories.length} categories!`);
        process.exit();
    } catch (err) {
        console.error('❌ Seeding Error:', err.message);
        process.exit(1);
    }
}

seedData();
