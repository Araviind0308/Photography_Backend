const SubCategoryESM = require('../../models/Admin/SubCategory')
const SubCategory = SubCategoryESM && SubCategoryESM.default ? SubCategoryESM.default : SubCategoryESM
const ProductESM = require('../../models/Admin/Product')
const Product = ProductESM && ProductESM.default ? ProductESM.default : ProductESM

async function createSubCategory(req, res, next) {
  try {
    const { category, name } = req.body
    if (!category || !name) return res.status(400).json({ message: 'category and name are required' })
    const sub = await SubCategory.create({ category, name: name.trim() })
    res.status(201).json({ subCategory: sub })
  } catch (err) {
    next(err)
  }
}

async function listSubCategories(req, res, next) {
  try {
    const { category } = req.query
    const filter = {}
    if (category) filter.category = category
    const subs = await SubCategory.find(filter).populate('category').sort({ createdAt: -1 })
    res.json({ subCategories: subs })
  } catch (err) {
    next(err)
  }
}

async function getSubCategory(req, res, next) {
  try {
    const sub = await SubCategory.findById(req.params.id).populate('category')
    if (!sub) return res.status(404).json({ message: 'SubCategory not found' })
    res.json({ subCategory: sub })
  } catch (err) {
    next(err)
  }
}

async function updateSubCategory(req, res, next) {
  try {
    const { name, category } = req.body
    const sub = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { name, category },
      { new: true, runValidators: true }
    )
    if (!sub) return res.status(404).json({ message: 'SubCategory not found' })
    res.json({ subCategory: sub })
  } catch (err) {
    next(err)
  }
}

async function deleteSubCategory(req, res, next) {
  try {
    const { id } = req.params
    const productCount = await Product.countDocuments({ subCategory: id })
    if (productCount > 0) return res.status(400).json({ message: 'Cannot delete: subcategory has products' })
    const deleted = await SubCategory.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ message: 'SubCategory not found' })
    res.json({ message: 'SubCategory deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createSubCategory,
  listSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
}


