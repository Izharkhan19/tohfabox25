const Category = require('../models/Category');
const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
// exports.getCategories = async (req, res) => {
//     try {
//         const { parent, isActive } = req.query;

//         const filter = {};
//         if (parent !== undefined) {
//             filter.parent = parent === 'null' ? null : parent;
//         }
//         if (isActive !== undefined) {
//             filter.isActive = isActive === 'true';
//         }

//         const categories = await Category.find(filter)
//             .populate('parent', 'name slug')
//             .sort({ order: 1, name: 1 });

//         res.status(200).json({
//             success: true,
//             count: categories.length,
//             data: categories
//         });
//     } catch (error) {
//         console.error('Get categories error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error fetching categories',
//             error: error.message
//         });
//     }
// };
exports.getCategories = async (req, res) => {
    try {
        const filter = { isActive: true };
        if (req.query.parent !== undefined) {
            filter.parent = req.query.parent === 'null' ? null : req.query.parent;
        }

        const categories = await Category.find(filter)
            .populate('parent', 'name slug')  // This fixes parent = null
            .sort({ name: 1 });               // Alphabetical order

        // Add product count
        const result = await Promise.all(
            categories.map(async (cat) => {
                const count = await Product.countDocuments({
                    category: cat._id,
                    isActive: true
                });
                return {
                    ...cat.toObject(),
                    productCount: count
                };
            })
        );

        res.json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parent', 'name slug')
            .populate('subcategories');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
    try {
        const { name, description, parent, isActive, order } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const categoryData = {
            name,
            description,
            parent: parent || null,
            isActive,
            order
        };

        // Handle image upload
        if (req.file) {
            const result = await uploadToCloudinary(req.file.path, 'categories');
            categoryData.image = {
                url: result.url,
                publicId: result.publicId
            };
        }

        const category = await Category.create(categoryData);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const { name, description, parent, isActive, order } = req.body;

        if (name) category.name = name;
        if (description !== undefined) category.description = description;
        if (parent !== undefined) category.parent = parent || null;
        if (isActive !== undefined) category.isActive = isActive;
        if (order !== undefined) category.order = order;

        // Handle image upload
        if (req.file) {
            // Delete old image if exists
            if (category.image && category.image.publicId) {
                await deleteFromCloudinary(category.image.publicId);
            }

            const result = await uploadToCloudinary(req.file.path, 'categories');
            category.image = {
                url: result.url,
                publicId: result.publicId
            };
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if category has products
        const productCount = await Product.countDocuments({ category: category._id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. ${productCount} products are using this category.`
            });
        }

        // Check if category has subcategories
        const subcategoryCount = await Category.countDocuments({ parent: category._id });
        if (subcategoryCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${subcategoryCount} subcategories.`
            });
        }

        // Delete image from cloudinary
        if (category.image && category.image.publicId) {
            await deleteFromCloudinary(category.image.publicId);
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
};