import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import { store } from "./components/store";
import { StripeProvider } from "./stripe/StripeProvider";
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe("pk_test_51SI2GaPiXHYf1iLSrEdCdGoZYf0JrEFQfOmCIuKxxJXpchNv1sgndg49EBn2bgSnzPAOVKthUinI5Qus7iVlltFJ00gnB5H8Ou");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StripeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </StripeProvider>
  </React.StrictMode>
);
