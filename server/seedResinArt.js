const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');

const resinCategories = [
    { name: 'Ocean Resin Coasters', slug: 'ocean-resin-coasters', description: 'Beautiful coasters with ocean waves.', isActive: true },
    { name: 'Geode Wall Art', slug: 'geode-wall-art', description: 'Stunning crystal geode inspired wall art.', isActive: true },
    { name: 'Custom Trays', slug: 'custom-trays', description: 'Personalized resin serving trays.', isActive: true },
];

const resinProducts = [
    {
        name: 'Deep Blue Ocean Coaster Set (4 pcs)',
        slug: 'deep-blue-ocean-coaster-set',
        description: 'Set of 4 beautifully handcrafted resin coasters featuring realistic ocean waves and golden sand elements. Perfect for your coffee table or as a gift.',
        price: 45.00,
        stock: 15,
        isActive: true,
        isFeatured: true,
        rating: { average: 5.0, count: 12 },
        images: [{ url: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800' }],
    },
    {
        name: 'Amethyst Geode Resin Wall Clock',
        slug: 'amethyst-geode-resin-wall-clock',
        description: 'Large 18-inch wall clock created with amethyst crystals, gold leaf, and high-gloss epoxy resin. A true statement piece.',
        price: 180.00,
        stock: 5,
        isActive: true,
        isFeatured: true,
        rating: { average: 4.8, count: 5 },
        images: [{ url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800' }],
    },
    {
        name: 'Personalized Floral Keepsake Tray',
        slug: 'personalized-floral-keepsake-tray',
        description: 'Custom resin tray preserving real dried flowers. You can personalize this piece with a name or date.',
        price: 65.00,
        stock: 20,
        isActive: true,
        isFeatured: true,
        rating: { average: 4.9, count: 8 },
        images: [{ url: 'https://images.unsplash.com/photo-1531685250784-afb348726f59?w=800' }],
    }
];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connected for Seeding');

        // Optional: clear existing data
        // await Category.deleteMany();
        // await Product.deleteMany();

        console.log('Inserting Categories...');
        const createdCategories = await Category.insertMany(resinCategories);

        console.log('Inserting Products...');
        const productsWithCategory = resinProducts.map((p, index) => {
            return {
                ...p,
                category: createdCategories[index % createdCategories.length]._id
            }
        });
        await Product.insertMany(productsWithCategory);

        console.log('✅ Resin Art Seed Data inserted successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding Error:', err.message);
        process.exit(1);
    }
}

seedData();