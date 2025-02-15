import { CollectionConfig } from "payload";
import { roleAccess } from "@/utils/permissions";
import { updateProductStock } from "../services/productService";

const Invoices: CollectionConfig = {
  slug: "invoices",
  admin: {
    useAsTitle: "invoiceNumber",
  },
  timestamps: true,
  fields: [
    {
      name: "invoiceNumber",
      type: "text",
      required: true,
      label: "Número de Factura",
    },
    {
      name: "Client",
      type: "relationship",
      relationTo: "clients",
      required: true,
      label: "Cliente",
    },
    {
      name: "invoiceDate",
      type: "date",
      required: true,
      label: "Fecha de Factura",
    },
    {
      name: "creationDate",
      type: "date",
      required: true,
      label: "Fecha de Creación",
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users", 
      required: true,
      label: "Creado Por",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      label: "Estado",
      options: [
        { label: "Pendiente", value: "pendiente" },
        { label: "En Empaquetado", value: "en_empaquetado" },
        { label: "Enviada", value: "enviada" },
        { label: "Confirmada", value: "confirmada" },
        { label: "Pagada", value: "completada" },
        { label: "Cancelada", value: "cancelada" },
      ],
      defaultValue: "pendiente",
    },
    {
      name: "items",
      type: "array",
      label: "Productos Comprados",
      minRows: 1,
      required: true,
      fields: [
        {
          name: "productName",
          type: "text",
          required: true,
          label: "Nombre del Producto",
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          label: "Cantidad",
        },
        {
          name: "price",
          type: "number",
          required: true,
          label: "Precio Unitario",
        },
      ],
    },
    {
      name: "total",
      type: "number",
      required: true,
      label: "Total",
    },
    {
      name: "notes",
      type: "textarea",
      label: "Notas",
    },
    {
      name: "region",
      type: "text",
      required: true,
      label: "Región",
    },
    {
      name: "province",
      type: "text",
      label: "Provincia",
    },
    {
      name: "paymentMethod",
      type: "select",
      required: true,
      label: "Método de Pago",
      options: [
        { label: "Efectivo", value: "efectivo" },
        { label: "Tarjeta", value: "tarjeta" },
      ],
    },
    {
      name: "tariff",
      type: "number",
      required: true,
      label: "Tarifa",
    },
    {
      name: "assignedCourier",
      type: "relationship",
      relationTo: "users",
      label: "Mensajero Asignado",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "stockDeducted",
      type: "checkbox",
      label: "Stock descontado",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, req }) => {
        if (!data.createdBy && req.user) {
          data.createdBy = req.user.id;
        }

        if (originalDoc && originalDoc.status === "pendiente" && data.status) {
          if (!["pendiente", "confirmada", "cancelada"].includes(data.status)) {
            throw new Error(
              "Solo se puede cambiar el estado de una factura pendiente a 'confirmada' o 'cancelada'."
            );
          }
        }

        if (
          originalDoc &&
          originalDoc.status === "en_empaquetado" &&
          data.status === "confirmada" &&
          !originalDoc.stockDeducted
        ) {
          for (const item of originalDoc.items) {
            try {
              await updateProductStock(item.productId, -Number(item.quantity));
            } catch (err: any) {
              throw new Error(`Error al descontar stock del producto ${item.productName}: ${err.message}`);
            }
          }
          data.stockDeducted = true;
        }

        if (
          originalDoc &&
          data.status === "cancelada" &&
          originalDoc.status !== "cancelada" &&
          originalDoc.stockDeducted
        ) {
          for (const item of originalDoc.items) {
            try {
              await updateProductStock(item.productId, Number(item.quantity));
            } catch (err: any) {
              throw new Error(`Error al devolver stock del producto ${item.productName}: ${err.message}`);
            }
          }
          data.stockDeducted = false;
        }

        if (data.items && Array.isArray(data.items)) {
          data.total = data.items.reduce((sum, item) => {
            const qty = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            return sum + qty * price;
          }, 0);
        }

        return data;
      },
    ],
  },
  access: {
    read: roleAccess(["admin", "manager", "seller", "courier"]),
    create: roleAccess(["admin", "manager", "seller"]),
    update: roleAccess(["admin", "manager", "seller"]),
    delete: roleAccess(["admin"]),
  },
};

export default Invoices;
