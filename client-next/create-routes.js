const fs = require('fs');
const path = require('path');

function createRoute(routePath, componentPath) {
    const fullDir = path.join(__dirname, 'src', 'app', ...routePath.split('/'));
    if (!fs.existsSync(fullDir)) {
        fs.mkdirSync(fullDir, { recursive: true });
    }
    
    // Calculate relative path to the component
    // If routePath is "products", depth is 2 (app/products). Component is at src/Client/pages/Products
    // From app/products/page.jsx to src/Client/pages/Products.jsx:
    // depth of routePath + 1 (for app)
    const depth = routePath.split('/').filter(Boolean).length + 1;
    const up = Array(depth).fill('..').join('/');
    
    const content = `import PageComponent from "${up}/${componentPath}";\n\nexport default function Page(props) {\n  return <PageComponent {...props} />;\n}\n`;
    
    fs.writeFileSync(path.join(fullDir, 'page.jsx'), content, 'utf-8');
    console.log(`Created route /${routePath}`);
}

function createLayout(routePath, componentPath) {
    const fullDir = path.join(__dirname, 'src', 'app', ...routePath.split('/'));
    if (!fs.existsSync(fullDir)) {
        fs.mkdirSync(fullDir, { recursive: true });
    }
    
    const depth = routePath.split('/').filter(Boolean).length + 1;
    const up = Array(depth).fill('..').join('/');
    
    const content = `import LayoutComponent from "${up}/${componentPath}";\n\nexport default function Layout({ children }) {\n  return <LayoutComponent>{children}</LayoutComponent>;\n}\n`;
    
    fs.writeFileSync(path.join(fullDir, 'layout.jsx'), content, 'utf-8');
    console.log(`Created layout for /${routePath}`);
}

// Client routes (wrapped in (client) group)
createRoute('(client)/products', 'Client/pages/Products');
createRoute('(client)/products/[id]', 'Client/pages/ProductDetail');
createRoute('(client)/gallery', 'Client/pages/Gallery');
createRoute('(client)/privacy-policy', 'Client/pages/PrivacyPolicy');
createRoute('(client)/terms-of-service', 'Client/pages/TermsOfService');
createRoute('(client)/app-info', 'Client/pages/AppInfo');
createRoute('(client)/custom-orders', 'Client/pages/CustomRequest');
createRoute('(client)/cart', 'Client/pages/Cart');
createRoute('(client)/wishlist', 'Client/pages/Wishlist');
createRoute('(client)/checkout', 'Client/pages/Checkout');
createRoute('(client)/orders', 'Client/pages/OrderList');
createRoute('(client)/order-success', 'Client/pages/OrderSuccess');

// Auth routes (wrapped in (auth) group or just root)
createRoute('login', 'Client/pages/Login');
createRoute('register', 'Client/pages/Register');
createRoute('forgot-password', 'Client/pages/ForgotPassword');
createRoute('reset-password/[token]', 'Client/pages/ResetPassword');

// Admin routes
createLayout('admin', 'Admin/components/Layout');
createRoute('admin', 'Admin/pages/Dashboard');
createRoute('admin/clients', 'Admin/pages/Clients');
createRoute('admin/products', 'Admin/pages/Products');
createRoute('admin/products/add', 'Admin/pages/AddEditProduct');
createRoute('admin/products/edit/[id]', 'Admin/pages/AddEditProduct');
createRoute('admin/categories', 'Admin/pages/Categories');
createRoute('admin/orders', 'Admin/pages/Orders');
createRoute('admin/transactions', 'Admin/pages/Transactions');
createRoute('admin/promos', 'Admin/pages/Promos');
createRoute('admin/custom-requests', 'Admin/pages/CustomRequests');
createRoute('admin/gallery', 'Admin/pages/Gallery');
createRoute('admin/login', 'Admin/pages/Login');

