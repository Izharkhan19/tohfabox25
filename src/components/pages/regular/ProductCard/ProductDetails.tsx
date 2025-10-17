import { useParams, Link } from "react-router-dom";
import type { Product } from "../../../../types";
import { useAppDispatch } from "../../../store/hooks";
import { addToCart } from "../../../store/cartSlice";

// Sample data (replace with API call in a real app)
const products: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 29.99,
    image: "https://via.placeholder.com/300",
    description: "A fantastic product for your needs.",
  },
  {
    id: 2,
    name: "Product 2",
    price: 49.99,
    image: "https://via.placeholder.com/300",
    description: "Another amazing product.",
  },
  {
    id: 3,
    name: "Product 3",
    price: 19.99,
    image: "https://via.placeholder.com/300",
    description: "High-quality product at a great price.",
  },
];

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Link
        to="/"
        className="text-blue-600 hover:underline mb-4 inline-block font-medium"
      >
        &larr; Back to Home
      </Link>
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-md">
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full md:w-1/2 object-cover rounded-md"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-gray-600 mt-2 text-lg">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <button
            onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
