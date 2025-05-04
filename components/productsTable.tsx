// components/ProductTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Supondo que você usa shadcn/ui
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Category } from "../src/interfaces/interfaces";
import { Button } from "@/components/ui/button";

interface ProductTableProps {
  category: Category;
}

export default function ProductTable({ category }: ProductTableProps) {

  return (
    <div>
      {/* Título da Categoria */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        {category.category || "Uncategorized"}
      </h2>

      {/* Tabela Dinâmica */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] text-left">Type</TableHead>
              <TableHead className="w-[10px] text-center">Price</TableHead>
              <TableHead className="w-[200px] text-center">Description</TableHead>
              <TableHead className="w-[100px] text-center">Status</TableHead>
              <TableHead className="w-[100px] text-center">Image</TableHead>
              <TableHead className="w-[100px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.intens.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-left">{item.type}</TableCell>
                <TableCell className="text-center">{item.value}</TableCell>
                <TableCell className="text-center">{item.description}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    className="text-xs"
                    variant={item.available ? "default" : "destructive"}
                  >
                    {item.available ? "Disponivel" : "Indisponivel"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.type}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <div className="space-x-4 flex justify-between items-center ">
                    <Button>Editar</Button>


                    <Button style={{ background: 'red' }}>Remover</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}