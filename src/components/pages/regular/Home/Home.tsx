import type { Product } from "../../../../types";
import { useAppSelector } from "../../../store/hooks";
import { SearchFilter } from "../../SearchFilter";
import { ProductCard } from "../ProductCard/ProductCard";

export const products1: Product[] = [
  {
    id: 1,
    name: "Product 1 - Headphones",
    price: 49.99,
    image: "https://picsum.photos/300/300?random==1",
    description: "A high-quality item for everyday use.",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Product 2 - Sneakers",
    price: 79.99,
    image: "https://picsum.photos/300/300?random==2",
    description: "Built for performance and comfort.",
    category: "Fashion",
  },
  {
    id: 3,
    name: "Product 3 - Gaming Mouse",
    price: 34.99,
    image: "https://picsum.photos/300/300?random==3",
    description: "Enjoy top-tier performance.",
    category: "Electronics",
  },
  {
    id: 4,
    name: "Product 4 - Coffee Maker",
    price: 59.49,
    image: "https://picsum.photos/300/300?random==4",
    description: "Compact and convenient for travel.",
    category: "Home",
  },
  {
    id: 5,
    name: "Product 5 - Winter Coat",
    price: 99.99,
    image: "https://picsum.photos/300/300?random==5",
    description: "Made from premium materials.",
    category: "Woolen",
  },
  {
    id: 6,
    name: "Product 6 - Office Chair",
    price: 89.95,
    image: "https://picsum.photos/300/300?random==6",
    description: "Reliable and stylish product.",
    category: "Office",
  },
  {
    id: 7,
    name: "Product 7 - Yoga Mat",
    price: 24.99,
    image: "https://picsum.photos/300/300?random==7",
    description: "Perfect for your lifestyle and needs.",
    category: "Fitness",
  },
  {
    id: 8,
    name: "Product 8 - LED Lamp",
    price: 19.95,
    image: "https://picsum.photos/300/300?random==8",
    description: "Engineered to deliver great value.",
    category: "Home",
  },
  {
    id: 9,
    name: "Product 9 - T-Shirt",
    price: 14.99,
    image: "https://picsum.photos/300/300?random==9",
    description: "A favorite among our customers.",
    category: "Fashion",
  },
  {
    id: 10,
    name: "Product 10 - Action Camera",
    price: 89.99,
    image: "https://picsum.photos/300/300?random=10",
    description: "A high-quality item for everyday use.",
    category: "Electronics",
  },
  {
    id: 11,
    name: "Product 11 - Bluetooth Speaker",
    price: 39.99,
    image: "https://picsum.photos/300/300?random=11",
    description: "Enjoy top-tier performance.",
    category: "Electronics",
  },
  {
    id: 12,
    name: "Product 12 - Backpack",
    price: 29.99,
    image: "https://picsum.photos/300/300?random=12",
    description: "Engineered to deliver great value.",
    category: "Outdoor",
  },
  {
    id: 13,
    name: "Product 13 - Smartwatch",
    price: 64.99,
    image: "https://picsum.photos/300/300?random=13",
    description: "Reliable and stylish product.",
    category: "Electronics",
  },
  {
    id: 14,
    name: "Product 14 - Water Bottle",
    price: 12.49,
    image: "https://picsum.photos/300/300?random=14",
    description: "An essential addition to your collection.",
    category: "Fitness",
  },
  {
    id: 15,
    name: "Product 15 - Sunglasses",
    price: 22.99,
    image: "https://picsum.photos/300/300?random=15",
    description: "Perfect for your lifestyle and needs.",
    category: "Fashion",
  },
  {
    id: 16,
    name: "Product 16 - Notebook",
    price: 9.99,
    image: "https://picsum.photos/300/300?random=16",
    description: "Compact and convenient for travel.",
    category: "Office",
  },
  {
    id: 17,
    name: "Product 17 - Wireless Charger",
    price: 27.99,
    image: "https://picsum.photos/300/300?random=17",
    description: "Engineered to deliver great value.",
    category: "Electronics",
  },
  {
    id: 18,
    name: "Product 18 - Fitness Tracker",
    price: 59.99,
    image: "https://picsum.photos/300/300?random=18",
    description: "Built for performance and comfort.",
    category: "Fitness",
  },
  {
    id: 19,
    name: "Product 19 - Wool Scarf",
    price: 18.49,
    image: "https://picsum.photos/300/300?random=19",
    description: "Made from premium materials.",
    category: "Woolen",
  },
  {
    id: 20,
    name: "Product 20 - Lip Balm",
    price: 4.99,
    image: "https://picsum.photos/300/300?random=20",
    description: "A favorite among our customers.",
    category: "Beauty",
  },
];

export const Home = () => {
  const { search, category } = useAppSelector((state) => state.filters);

  // Filter products based on search and category
  const filteredProducts = products1.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || product.category === category)
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Featured Products
      </h2>
      <SearchFilter products={products1} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length ? (
          filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center">
            No products match your search.
          </p>
        )}
      </div>
    </div>
  );
};
