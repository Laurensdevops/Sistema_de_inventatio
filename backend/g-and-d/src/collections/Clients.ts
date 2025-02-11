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
      index: true, // Agrega este atributo para que el campo sea consultable
    },
    {
      name: "address",
      type: "textarea",
      required: true,
      label: "Dirección",
    },
  ],

  access: {
    read: roleAccess(["admin", "manager", "seller"]),
    create: roleAccess(["admin", "manager"]),
    update: roleAccess(["admin", "manager", "seller"]),
    delete: roleAccess(["admin"]),
  },
};

export default Clients;
