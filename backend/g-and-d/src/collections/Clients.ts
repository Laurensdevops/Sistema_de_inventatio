import { roleAccess } from "@/utils/permissions";
import { CollectionConfig } from "payload";

const Clients: CollectionConfig = {
  slug: "clients",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nombre del Cliente",
    },
    {
      name: "phone",
      type: "text",
      required: true,
      label: "Teléfono",
    },
    {
      name: "email",
      type: "text",
      required: true,
      label: "Email",
      index: true, // Para poder consultarlo fácilmente
    },
    {
      name: "address",
      type: "textarea",
      required: true,
      label: "Dirección",
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
  ],
  access: {
    read: roleAccess(["admin", "manager", "seller", "courier"]),
    create: roleAccess(["admin", "manager"]),
    update: roleAccess(["admin", "manager", "seller"]),
    delete: roleAccess(["admin"]),
  },
};

export default Clients;
