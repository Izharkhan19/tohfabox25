const Product = require('../models/Product');
const Category = require('../models/Category');
const { uploadToGoogleDrive, deleteFromGoogleDrive } = require('../config/googleDrive');

// @desc    Get all products with filters, search, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            inStock,
            isFeatured,
            isActive,
            occasion,
            relationship,
            sort = '-createdAt',
            page = 1,
            limit = 12
        } = req.query;

        // Build filter object
        const filter = {};

        // Search by name, description, or tags
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (occasion) {
            filter.occasions = occasion;
        }

        if (relationship) {
            filter.relationships = relationship;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (inStock === 'true') {
            filter.stock = { $gt: 0 };
        }

        if (isFeatured !== undefined) {
            filter.isFeatured = isFeatured === 'true';
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        } else {
            // By default, only show active products for public
            filter.isActive = true;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query
        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .sort(sort)
            .limit(Number(limit))
            .skip(skip);

        // Get total count
        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:identifier
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const { identifier } = req.params;

        // Try to find by ID first, then by slug
        let product = await Product.findById(identifier).populate('category', 'name slug');

        if (!product) {
            product = await Product.findOne({ slug: identifier }).populate('category', 'name slug');
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Increment views
        product.views += 1;
        await product.save();

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            shortDescription,
            price,
            comparePrice,
            cost,
            category,
            occasions,
            relationships,
            stock,
            sku,
            barcode,
            weight,
            dimensions,
            tags,
            isFeatured,
            isActive,
            metaTitle,
            metaDescription,
            metaKeywords
        } = req.body;

        // Validation
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide required fields: name, description, price, category'
            });
        }

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const productData = {
            name,
            description,
            shortDescription,
            price,
            comparePrice,
            cost,
            category,
            occasions: occasions ? (Array.isArray(occasions) ? occasions : [occasions]) : [],
            relationships: relationships ? (Array.isArray(relationships) ? relationships : [relationships]) : [],
            stock: stock || 0,
            sku,
            barcode,
            weight: typeof weight === 'string' ? JSON.parse(weight) : weight,
            dimensions: typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions,
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
            isFeatured,
            isActive,
            metaTitle,
            metaDescription,
            metaKeywords: metaKeywords ? (Array.isArray(metaKeywords) ? metaKeywords : metaKeywords.split(',').map(k => k.trim())) : []
        };

        // Handle distinct mainImage and subImages uploads
        productData.images = [];
        if (req.files) {
            // Upload main image
            if (req.files.mainImage && req.files.mainImage.length > 0) {
                const mainImageUpload = await uploadToGoogleDrive(req.files.mainImage[0].path);
                productData.images.push({
                    url: mainImageUpload.url,
                    publicId: mainImageUpload.publicId,
                    isPrimary: true
                });
            }

            // Upload sub images
            if (req.files.subImages && req.files.subImages.length > 0) {
                const subImageUploads = req.files.subImages.map(file => uploadToGoogleDrive(file.path));
                const uploadedSubImages = await Promise.all(subImageUploads);

                const subImagesData = uploadedSubImages.map(result => ({
                    url: result.url,
                    publicId: result.publicId,
                    isPrimary: false
                }));
                productData.images.push(...subImagesData);
            }
        }
        const product = await Product.create(productData);
        await product.populate('category', 'name slug');

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const {
            name,
            description,
            shortDescription,
            price,
            comparePrice,
            cost,
            category,
            occasions,
            relationships,
            stock,
            sku,
            barcode,
            weight,
            dimensions,
            tags,
            isFeatured,
            isActive,
            metaTitle,
            metaDescription,
            metaKeywords,
            retainedImages
        } = req.body;

        // Update fields
        if (name) product.name = name;
        if (description) product.description = description;
        if (shortDescription !== undefined) product.shortDescription = shortDescription;
        if (price !== undefined) product.price = price;
        if (comparePrice !== undefined) product.comparePrice = comparePrice;
        if (cost !== undefined) product.cost = cost;
        if (stock !== undefined) product.stock = stock;
        if (sku) product.sku = sku;
        if (barcode !== undefined) product.barcode = barcode;
        if (weight) product.weight = typeof weight === 'string' ? JSON.parse(weight) : weight;
        if (dimensions) product.dimensions = typeof dimensions === 'string' ? JSON.parse(dimensions) : dimensions;
        if (isFeatured !== undefined) product.isFeatured = isFeatured;
        if (isActive !== undefined) product.isActive = isActive;
        if (metaTitle !== undefined) product.metaTitle = metaTitle;
        if (metaDescription !== undefined) product.metaDescription = metaDescription;

        if (tags) {
            product.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
        }

        if (metaKeywords) {
            product.metaKeywords = Array.isArray(metaKeywords) ? metaKeywords : metaKeywords.split(',').map(k => k.trim());
        }

        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
            product.category = category;
        }

        if (occasions !== undefined) {
            product.occasions = Array.isArray(occasions) ? occasions : (occasions ? [occasions] : []);
        }

        if (relationships !== undefined) {
            product.relationships = Array.isArray(relationships) ? relationships : (relationships ? [relationships] : []);
        }

        // Handle deletion of removed images
        let retainedImageIds = [];
        if (retainedImages) {
            retainedImageIds = Array.isArray(retainedImages) ? retainedImages : [retainedImages];
        }

        const imagesToDelete = product.images.filter(img => 
            !retainedImageIds.includes(img.publicId) && 
            !retainedImageIds.includes(img._id.toString())
        );

        if (imagesToDelete.length > 0) {
            const deletePromises = imagesToDelete.map(img => deleteFromGoogleDrive(img.publicId));
            await Promise.allSettled(deletePromises);
            
            // Remove deleted images from array
            imagesToDelete.forEach(img => product.images.pull(img._id));
        }

        const hasRetainedPrimary = product.images.some(img => img.isPrimary);

        // Handle new distinct mainImage and subImages uploads
        if (req.files) {
            // Main image
            if (req.files.mainImage && req.files.mainImage.length > 0) {
                // Unmark existing primary
                product.images.forEach(img => img.isPrimary = false);

                const mainImageUpload = await uploadToGoogleDrive(req.files.mainImage[0].path);
                product.images.push({
                    url: mainImageUpload.url,
                    publicId: mainImageUpload.publicId,
                    isPrimary: true
                });
            } else if (!hasRetainedPrimary && product.images.length > 0) {
                // Fallback: If no new main image, and old main was deleted, make first retained one primary
                product.images[0].isPrimary = true;
            }

            // Sub images
            if (req.files.subImages && req.files.subImages.length > 0) {
                const subImageUploads = req.files.subImages.map(file => uploadToGoogleDrive(file.path));
                const uploadedSubImages = await Promise.all(subImageUploads);

                const newSubImages = uploadedSubImages.map(result => ({
                    url: result.url,
                    publicId: result.publicId,
                    isPrimary: false
                }));

                product.images.push(...newSubImages);
            }
        }
        console.log("productData product", product)

        await product.save();
        await product.populate('category', 'name slug');

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private/Admin
exports.deleteProductImage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const image = product.images.id(req.params.imageId);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        // Delete from Google Drive
        await deleteFromGoogleDrive(image.publicId);

        // Remove from product
        product.images.pull(req.params.imageId);
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting image',
            error: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete all images from Google Drive
        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map(img => deleteFromGoogleDrive(img.publicId));
            await Promise.all(deletePromises);
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
    try {
        const limit = req.query.limit || 8;

        const products = await Product.find({ isFeatured: true, isActive: true })
            .populate('category', 'name slug')
            .sort('-createdAt')
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        });
    }
};

// @desc    Delete multiple products
// @route   POST /api/products/bulk-delete
// @access  Private/Admin
exports.deleteMultipleProducts = async (req, res) => {
    try {
        const { productIds } = req.body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No product IDs provided for deletion'
            });
        }

        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No matching products found'
            });
        }

        // Delete all images from Google Drive for these products
        const deleteImagePromises = [];
        products.forEach(product => {
            if (product.images && product.images.length > 0) {
                product.images.forEach(img => {
                    deleteImagePromises.push(deleteFromGoogleDrive(img.publicId));
                });
            }
        });
        
        if (deleteImagePromises.length > 0) {
            await Promise.allSettled(deleteImagePromises); // Use allSettled so if one fails, others still delete
        }

        // Delete products from database
        await Product.deleteMany({ _id: { $in: productIds } });

        res.status(200).json({
            success: true,
            message: `${products.length} products deleted successfully`
        });
    } catch (error) {
        console.error('Bulk delete products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting products',
            error: error.message
        });
    }
}; 