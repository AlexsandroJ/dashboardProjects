'use client'; // Marca o componente como Client Component

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const MyComponent = () => {
  const [category, setCategory] = useState({
    category: "Example Category",
    intens: [
      { type: "Type 1", value: "100", description: "Desc 1", available: true, image: "favicon.ico" },
      { type: "Type 2", value: "200", description: "Desc 2", available: false, image: null },
    ],
  });

  // Estado para controlar qual item está sendo editado
  const [editingIndex, setEditingIndex] = useState(null);

  // Função para iniciar a edição
  const startEditing = (index) => {
    setEditingIndex(index);
  };

  // Função para salvar as alterações
  const saveChanges = async (index) => {
    setEditingIndex(null); // Sai do modo de edição

    // Envie os dados atualizados para o backend (opcional)
    try {
      const updatedItem = category.intens[index];
      console.log("Enviando dados para o backend:", updatedItem);

      // Exemplo de chamada à API
      // await fetch('/api/update-item', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedItem),
      // });
    } catch (error) {
      console.error("Erro ao salvar no backend:", error);
    }
  };

  // Função para remover um item
  const handleRemoveItem = (index) => {
    const updatedItems = category.intens.filter((_, i) => i !== index);
    setCategory({ ...category, intens: updatedItems });
  };

  // Função para atualizar os dados no estado
  const handleChange = (e, field, index) => {
    const updatedItems = [...category.intens];
    updatedItems[index][field] = e.target.value;
    setCategory({ ...category, intens: updatedItems });
  };

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
              <TableHead style={{ width: '150px', textAlign: 'left' }}>Type</TableHead>
              <TableHead style={{ width: '100px', textAlign: 'center' }}>Value</TableHead>
              <TableHead style={{ width: '200px', textAlign: 'left' }}>Description</TableHead>
              <TableHead style={{ width: '100px', textAlign: 'center' }}>Status</TableHead>
              <TableHead style={{ width: '100px', alignContent: 'center' }}>Image</TableHead>
              <TableHead style={{ width: '150px', textAlign: 'center' }}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {category.intens.map((item, index) => (
              <TableRow key={index}>
                {/* Campo Editável: Type */}
                <TableCell style={{ textAlign: 'left' }}>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={item.type}
                      onChange={(e) => handleChange(e, "type", index)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    item.type
                  )}
                </TableCell>

                {/* Campo Editável: Value */}
                <TableCell style={{ textAlign: 'center' }}>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(e, "value", index)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    item.value
                  )}
                </TableCell>

                {/* Campo Editável: Description */}
                <TableCell style={{ textAlign: 'left' }}>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleChange(e, "description", index)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    item.description
                  )}
                </TableCell>

                {/* Status (não editável neste exemplo) */}
                <TableCell style={{ textAlign: 'center' }}>
                  <Badge
                    className="text-xs"
                    variant={item.available ? "default" : "destructive"}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>

                {/* Imagem (não editável neste exemplo) */}
                <TableCell style={{ alignItems: 'center' }}>
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

                {/* Ações */}
                <TableCell style={{ textAlign: 'center' }}>
                  {editingIndex === index ? (
                    <Button
                      onClick={() => saveChanges(index)}
                      variant="default"
                      size="sm"
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      onClick={() => startEditing(index)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => handleRemoveItem(index)}
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MyComponent;