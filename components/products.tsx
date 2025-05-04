// components/Products.tsx
import ProductTable from "@/components/productsTable";
import React from "react";
import { Product } from "../src/interfaces/interfaces";

interface ProductsProps {
  data: Product[];
}

export default function Products({ data }: ProductsProps) {
  return (
    <div>
      {data.map((product, productIndex) => (
        <div key={productIndex}>
          <h1 className="text-2xl font-bold mb-4">Produtos: {product.userId}</h1>
          {product.products.map((category, categoryIndex) => (
            <ProductTable key={categoryIndex} category={category} />
          ))}
        </div>
      ))}
    </div>
  );
}