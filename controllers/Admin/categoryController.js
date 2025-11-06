const CategoryESM = require('../../models/Admin/Category')
const Category = CategoryESM && CategoryESM.default ? CategoryESM.default : CategoryESM
const SubCategoryESM = require('../../models/Admin/SubCategory')
const SubCategory = SubCategoryESM && SubCategoryESM.default ? SubCategoryESM.default : SubCategoryESM

async function createCategory(req, res, next) {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: 'name is required' })
    const exists = await Category.findOne({ name: name.trim() })
    if (exists) return res.status(409).json({ message: 'Category already exists' })
    const category = await Category.create({ name: name.trim() })
    res.status(201).json({ category })
  } catch (err) {
    next(err)
  }
}

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })
    res.json({ categories })
  } catch (err) {
    next(err)
  }
}

async function getCategory(req, res, next) {
  try {
    const { id } = req.params
    const category = await Category.findById(id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json({ category })
  } catch (err) {
    next(err)
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params
    const { name } = req.body
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    )
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json({ category })
  } catch (err) {
    next(err)
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params
    const subCount = await SubCategory.countDocuments({ category: id })
    if (subCount > 0) {
      return res.status(400).json({ message: 'Cannot delete: category has subcategories' })
    }
    const deleted = await Category.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ message: 'Category not found' })
    res.json({ message: 'Category deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createCategory,
  listCategories,
  getCategory,
  updateCategory,
  deleteCategory,
}


