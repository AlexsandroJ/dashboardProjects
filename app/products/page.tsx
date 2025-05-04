// app/page.tsx (Next.js 14)

import ProductList from "@/components/productList";
import { Card, CardContent } from "@/components/ui/card"; // Supondo que você usa shadcn/ui
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Card>
      <CardContent>
       
          <ProductList />
        
      </CardContent>
    </Card>
  );
}