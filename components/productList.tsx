// components/ProductList.tsx
import Products from "@/components/products";
import React from "react";
import { Product } from "../src/interfaces/interfaces";


async function fetchProducts(): Promise<Product[]> {
    const uri = process.env.API;
    const response = await fetch("http://localhost:3001/api/product");
    if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
    }
    const data: Product[] = await response.json();

    for (let index = 0; index < data.length; index++) {

        for (let x = 0; x < data[index].products.length ; x++) {
            console.log(data[index].products[x].intens.length);
        }
    }
    return data;
}

export default async function ProductList() {
    const productsData = await fetchProducts();

    return <Products data={productsData} />;
}