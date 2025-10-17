import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./components/store";
import { Header } from "./components/pages/default/Header";
import { useAuth } from "./hooks/useAuth";
import { Home } from "./components/pages/regular/Home/Home";
import { ProductDetails } from "./components/pages/regular/ProductCard/ProductDetails";
import { CartPage } from "./components/pages/regular/Cart/CartPage";
import { About } from "./components/pages/About/About";
import { Login } from "./components/pages/Auth/Login";
import { Signup } from "./components/pages/Auth/Signup";
import { StripeProvider } from "./stripe/StripeProvider";
import { Checkout } from "./components/pages/Checkout/Checkout";
import { Footer } from "./components/pages/default/Footer";
import { Success } from "./components/pages/Checkout/Success";
// import { store } from './store';
// import { Header } from './components/Header';
// import { Footer } from './components/Footer';
// import { Home } from './pages/Home';
// import { ProductDetails } from './pages/ProductDetails';
// import { CartPage } from './pages/CartPage';
// import { About } from './pages/About';
// import { Login } from './components/Auth/Login';
// import { Signup } from './components/Auth/Signup';
// import { Checkout } from './pages/Checkout';
// import { Success } from './pages/Success';
// import { StripeProvider } from './components/StripeProvider';
// import { useAuth } from './hooks/useAuth';

function App() {
  useAuth(); // Initialize Firebase auth listener

  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/checkout"
                element={
                  <StripeProvider>
                    <Checkout />
                  </StripeProvider>
                }
              />
              <Route path="/success" element={<Success />} />

              <Route
                path="*"
                element={
                  <div className="container mx-auto p-6">
                    404 - Page Not Found
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
