const PromoCode = require('../models/PromoCode');

const getDiscount = (promo, subtotal) => {
    const value = promo.discountType === 'percentage'
        ? subtotal * (promo.discountValue / 100)
        : promo.discountValue;
    return Math.min(Math.max(value, 0), subtotal);
};

const findValidPromo = async (code, subtotal) => {
    const promo = await PromoCode.findOne({ code: code.trim().toUpperCase() });
    if (!promo || !promo.isActive) throw new Error('Promo code is invalid');

    const now = new Date();
    if (now < promo.startsAt || now > promo.expiresAt) throw new Error('Promo code has expired or is not active yet');
    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) throw new Error('Promo code usage limit reached');
    if (subtotal < promo.minimumOrderValue) throw new Error(`Minimum order value is ₹${promo.minimumOrderValue.toFixed(2)}`);

    return { promo, discount: getDiscount(promo, subtotal) };
};

exports.validatePromo = async (req, res) => {
    try {
        const subtotal = Number(req.body.subtotal);
        if (!req.body.code || !Number.isFinite(subtotal) || subtotal < 0) {
            return res.status(400).json({ success: false, message: 'Promo code and valid subtotal are required' });
        }
        const { promo, discount } = await findValidPromo(req.body.code, subtotal);
        res.json({ success: true, message: 'Promo code applied', data: {
            code: promo.code,
            discount,
            discountType: promo.discountType,
            discountValue: promo.discountValue
        } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.listPromos = async (req, res) => {
    const promos = await PromoCode.find().sort('-createdAt');
    res.json({ success: true, data: promos });
};

exports.createPromo = async (req, res) => {
    try {
        const promo = await PromoCode.create({ ...req.body, code: req.body.code?.toUpperCase() });
        res.status(201).json({ success: true, message: 'Promo code created', data: promo });
    } catch (error) {
        res.status(400).json({ success: false, message: error.code === 11000 ? 'Promo code already exists' : error.message });
    }
};

exports.updatePromo = async (req, res) => {
    try {
        const promo = await PromoCode.findByIdAndUpdate(req.params.id, {
            ...req.body,
            ...(req.body.code ? { code: req.body.code.toUpperCase() } : {})
        }, { new: true, runValidators: true });
        if (!promo) return res.status(404).json({ success: false, message: 'Promo code not found' });
        res.json({ success: true, message: 'Promo code updated', data: promo });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deletePromo = async (req, res) => {
    const promo = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promo) return res.status(404).json({ success: false, message: 'Promo code not found' });
    res.json({ success: true, message: 'Promo code deleted' });
};

exports.findValidPromo = findValidPromo;

exports.incrementPromoUsage = async (code) => {
    if (!code) return;
    await PromoCode.findOneAndUpdate(
        { code: code.trim().toUpperCase(), $or: [{ usageLimit: null }, { $expr: { $lt: ['$usedCount', '$usageLimit'] } }] },
        { $inc: { usedCount: 1 } }
    );
};
