// ========================= RENDERING =============================

const renderAdminPage = async (req, res) => {
  res.render(
    'layout/adminLayout',
     { user: req.user, page: 'dashboard', lowStocks : req.lowStock });
};

const renderSalesPage = async (req, res) => {
  res.render('admins/totalSales', { user: req.user, page: 'sales', delivered : req.totalSales, err: req.flash('err') });
};

const renderExpensesPage = async (req, res) => {
  res.render('admins/totalExpenses', { user: req.user, page: 'expenses' });
};

const renderAddEmployess = async (req, res) => {
  res.render('admins/addEmployee', {
    user: req.user,
    message: req.flash('addmessage'),
    page: 'employees',
  });
};
const renderEditEmployeePage = async (req, res) => {
  res.render('admins/profile', {
    user: req.user,
    page: 'employees',
  });
};
const renderOrdersPage = async (req, res) => {
  res.render('admins/orders', {
    user: req.user,
    ordersList: req.totalOrders,
    page: 'orders',
    success: req.flash('success'),
  });
};
const renderViewOrder = async (req, res) => {
  res.render('admins/vieworder', {
    user: req.user,
    order : req.order,
    page: 'orders',
  });
};
const renderEditOrder = async (req, res) => {
  res.render('admins/order-edit', {
    user: req.user,
    order : req.order,
    page: 'orders',
    err: req.flash('err')
  });
};
const renderAdminProducts = async (req, res) => {
  res.render('managers/products', {
    user: req.user,
    page: 'products',
    products: req.products,
    categoryList: req.categoryList,
    success: req.flash('success'),
  });
};
const renderAddProduct = async (req, res) => {
  res.render('managers/addproduct', {
    user: req.user,
    page: '',
    categoryList: req.categoryList,
    err: req.flash('err'),
  });
};
const renderMesssagePage = async (req, res) => {
  res.render('admins/message', {
    user: req.user,
    page: 'message',
  });
};

const renderEditProduct = async (req, res) => {
  res.render('managers/edit-product', {
    user: req.user,
    product: req.product,
    categoryList: req.categoryList,
    page: 'product',
    err: req.flash('err'),
  });
};

const renderMangerDashboard = async (req, res) => {
  res.render('managers/index', { user: req.user, page: 'dashboard'});
};

const renderSupportDashboard = async (req, res) => {
    
    res.render('supportive/index', { user: req.user, page: 'dashboard',usersList: req.usersList,  });
};

const renderUsermanagement = async (req, res) => {
  res.render('supportive/users', {
    user: req.user,
    page: 'users',
    usersList: req.usersList,
  });
};

module.exports = {
  renderAdminPage,
  renderSalesPage,
  renderExpensesPage,
  renderOrdersPage,
  renderViewOrder,
  renderEditOrder,
  renderAddEmployess,
  renderEditEmployeePage,
  renderMesssagePage,
  renderAddProduct,
  renderAdminProducts,
  renderEditProduct,
  renderMangerDashboard,
  renderUsermanagement,
  renderSupportDashboard,
};
