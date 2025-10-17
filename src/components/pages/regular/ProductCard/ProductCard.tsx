import { Link } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { addToCart } from "../../../store/cartSlice";
import type { Product } from "../../../../types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="border rounded-lg shadow-md p-4 flex flex-col items-center bg-white hover:shadow-lg transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <p className="text-gray-600">${product.price.toFixed(2)}</p>
      <Link
        to={`/product/${product.id}`}
        className="mt-2 text-blue-600 hover:underline font-medium"
      >
        View Details
      </Link>
      <button
        onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
};
