import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import type { Product } from "../../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCategory, setSearch } from "../store/filtersSlice";

export const SearchFilter = ({ products }: { products: Product[] }) => {
  const dispatch = useAppDispatch();
  const { search, category } = useAppSelector((state) => state.filters);

  // ✅ Memoized debounced function
  const debouncedSearch = useMemo(
    () => debounce((value: string) => dispatch(setSearch(value)), 300),
    [dispatch]
  );

  // 🧹 Optional: clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <input
        type="text"
        placeholder="Search products..."
        defaultValue={search} // ⬅️ use defaultValue for uncontrolled input
        onChange={(e) => debouncedSearch(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <select
        value={category}
        onChange={(e) => dispatch(setCategory(e.target.value))}
        className="p-2 border rounded w-full"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};
