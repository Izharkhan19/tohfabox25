// import { useAppSelector, useAppDispatch } from "../store/hooks";
// import { removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../../../store/cartSlice";

export const Cart = () => {
  const cart = useAppSelector((state) => state.cart.cart);
  const dispatch = useAppDispatch();

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center border-b py-4 bg-white p-4 rounded-lg shadow-sm"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-20 w-20 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.product.name}
                </h3>
                <p className="text-gray-600">
                  ${item.product.price.toFixed(2)}
                </p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.product.id,
                          quantity: item.quantity - 1,
                        })
                      )
                    }
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.product.id,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                    className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.product.id))}
                className="text-red-600 hover:underline font-medium"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold text-gray-800">
              Total: ${total.toFixed(2)}
            </p>
            <div>
              <button
                onClick={() => dispatch(clearCart())}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Clear Cart
              </button>
              <Link
                to="/checkout"
                className="ml-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
