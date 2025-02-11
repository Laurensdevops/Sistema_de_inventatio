import { roleAccess } from "@/utils/permissions";
import { CollectionConfig } from "payload";

const Invoices: CollectionConfig = {
  slug: "invoices",
  admin: {
    useAsTitle: "invoiceNumber", // Se usará el campo invoiceNumber para mostrar el título en el admin
  },
  timestamps: true,
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      label: 'Número de Factura',
    },
    {
      name: 'Client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      label: 'Cliente',
    },
    {
      name: 'invoiceDate',
      type: 'date',
      required: true,
      label: 'Fecha de Factura',
    },
    {
      name: 'issuedBy',
      type: 'text',
      required: true,
      label: 'Emitido Por',
    },
    {
      name: 'creationDate',
      type: 'date',
      required: true,
      label: 'Fecha de Creación',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Estado',
      options: [
        { label: 'Tomada', value: 'tomada' },
        { label: 'En Empaquetado', value: 'en_empaquetado' },
        { label: 'Enviada', value: 'enviada' },
        { label: 'Completada', value: 'completada' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Productos Comprados',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'productName',
          type: 'text',
          required: true,
          label: 'Nombre del Producto',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          label: 'Cantidad',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas',
    },
  ],
  access: {
    read: roleAccess(["admin", "manager", "seller"]),
    create: roleAccess(["admin", "manager"]),
    update: roleAccess(["admin", "manager", "seller"]),
    delete: roleAccess(["admin"]),
  },
};

export default Invoices;
