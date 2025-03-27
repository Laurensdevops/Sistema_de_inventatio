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
        { label: "Canceladas y no entregado", value: "cancelada" },
        { label: "Canceladas y entragado", value: "cancelada_entregado" },
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
          name: "productId",
          type: "relationship", 
          relationTo: "products",
          required: true,
          label: "ID del Producto",
        },
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
        {
          name: "prices",
          type: "json",
          label: "Precios del Producto",
        }
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
    {
      name: "commissionPaidToCourier",
      type: "checkbox",
      label: "Comisión pagada al mensajero",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "commissionPaidToSeller",
      type: "checkbox",
      label: "Comisión pagada al vendedor",
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
              "Solo se puede cambiar el estado de una factura pendiente a 'completada' o 'cancelada'."
            );
          }
        }
        if (
          originalDoc &&
          data.status === "completada" &&
          originalDoc.status !== "completada" &&
          !originalDoc.stockDeducted
        ) {
          console.log("Factura confirmada, iniciando descuento de stock...");
          for (const item of originalDoc.items) {
            if (!item.productId) {
              console.warn("El producto no tiene productId, no se puede descontar stock:", item);
              continue;
            }
            console.log(`Descontando stock para ${item.productName}: cantidad ${item.quantity}`);
            try {
              await updateProductStock(req, item.productId, -Number(item.quantity));
            } catch (err: any) {
              throw new Error(
                `Error al descontar stock del producto ${item.productName}: ${err.message}`
              );
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
          console.log("Factura cancelada, devolviendo stock...");
          for (const item of originalDoc.items) {
            if (!item.productId) {
              console.warn("El producto no tiene productId, no se puede devolver stock:", item);
              continue;
            }
            console.log(`Devolviendo stock para ${item.productName}: cantidad ${item.quantity}`);
            try {
              await updateProductStock(req, item.productId, Number(item.quantity));
            } catch (err: any) {
              throw new Error(
                `Error al devolver stock del producto ${item.productName}: ${err.message}`
              );
            }
          }
          data.stockDeducted = false;
        }
  
        // Calcular el total de la factura
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
    read: roleAccess(["admin", "manager", "seller", "courier", "warehouse"]),
    create: roleAccess(["admin", "manager", "seller"]),
    update: roleAccess(["admin", "manager", "seller", "courier", "warehouse"]),
    delete: roleAccess(["admin"]),
  },
};

export default Invoices;
