const express = require('express')

const { adminProtect } = require('../../middleware/adminAuth');

const createUploader = require('../../middleware/multer')

const router = express.Router()


//////////////////////// Admin Routes ////////////////////////
const { loginAdmin, getAdminMe } = require('../../controllers/Admin/adminController')
// public
router.post('/login', loginAdmin)

// private
router.get('/me', adminProtect, getAdminMe)


//////////////////////// Category Routes ////////////////////////

const {
  createCategory,
  listCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/Admin/categoryController')

// Categories
router.post('/categories', adminProtect, createCategory)
router.get('/categories', adminProtect, listCategories)
router.get('/categories/:id', adminProtect,  getCategory)
router.put('/categories/:id', adminProtect, updateCategory)
router.delete('/categories/:id', adminProtect, deleteCategory)


//////////////////////// SubCategory Routes ////////////////////////

const {
  createSubCategory,
  listSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require('../../controllers/Admin/subCategoryController')

// SubCategories
router.post('/subcategories', adminProtect, createSubCategory)
router.get('/subcategories',  listSubCategories)
router.get('/subcategories/:id', getSubCategory)
router.put('/subcategories/:id', adminProtect, updateSubCategory)
router.delete('/subcategories/:id', adminProtect, deleteSubCategory)


//////////////////////// Product Routes ////////////////////////

const {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../../controllers/Admin/productController')

const productUpload = createUploader('products')

// Products with images
router.post(
  '/products',
  adminProtect,
  productUpload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
  ]),
  createProduct
)
router.get('/products', adminProtect,  listProducts)
router.get('/products/:id', adminProtect,  getProduct)
router.put(
  '/products/:id',
  adminProtect,
  productUpload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
  ]),
  updateProduct
)
router.delete('/products/:id', adminProtect, deleteProduct);


//////////////////////// Banner Routes ////////////////////////

const {
  createBanner,
  listBanners,
  getBanner,
  updateBanner,
  deleteBanner,
} = require('../../controllers/Admin/bannerController')

const bannerUpload = createUploader('banners')

// Banners with images
router.post(
  '/banners',
  adminProtect,
  bannerUpload.single('image'),
  createBanner
)
router.get('/banners', adminProtect, listBanners)
router.get('/banners/:id', adminProtect, getBanner)
router.put(
  '/banners/:id',
  adminProtect,
  bannerUpload.single('image'),
  updateBanner
)
router.delete('/banners/:id', adminProtect, deleteBanner)


//////////////////////// Testimonial Routes ////////////////////////

const {
  createTestimonial,
  listTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../../controllers/Admin/testimonialController')

const testimonialUpload = createUploader('testimonials')

// Testimonials with images
router.post(
  '/testimonials',
  adminProtect,
  testimonialUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
  ]),
  createTestimonial
)
router.get('/testimonials', adminProtect, listTestimonials)
router.get('/testimonials/:id', adminProtect, getTestimonial)
router.put(
  '/testimonials/:id',
  adminProtect,
  testimonialUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
  ]),
  updateTestimonial
)
router.delete('/testimonials/:id', adminProtect, deleteTestimonial)


//////////////////////// Order Routes ////////////////////////

const {
  listOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
} = require('../../controllers/Admin/orderController')

// Orders
router.get('/orders', adminProtect, listOrders)
router.get('/orders/stats', adminProtect, getOrderStats)
router.get('/orders/:id', adminProtect, getOrder)
router.put('/orders/:id/status', adminProtect, updateOrderStatus)


//////////////////////// Customer Routes ////////////////////////

const {
  listCustomers,
  getCustomer,
  getCustomerStats,
} = require('../../controllers/Admin/customerController')

// Customers
router.get('/customers', adminProtect, listCustomers)
router.get('/customers/stats', adminProtect, getCustomerStats)
router.get('/customers/:id', adminProtect, getCustomer)


//////////////////////// Analytics Routes ////////////////////////

const {
  getDashboardStats,
} = require('../../controllers/Admin/analyticsController')

// Analytics
router.get('/analytics/dashboard', adminProtect, getDashboardStats)


module.exports = router


