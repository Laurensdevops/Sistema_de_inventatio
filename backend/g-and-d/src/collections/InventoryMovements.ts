import { CollectionConfig } from 'payload/types';
import { roleAccess } from '../utils/permissions';

const InventoryMovements: CollectionConfig = {
  slug: 'inventory-movements',
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: ['entrada', 'salida'],
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
  ],
  access: {
    read: roleAccess(['admin', 'manager', 'seller']),
    create: roleAccess(['admin', 'manager', 'seller']), 
    update: roleAccess(['admin', 'manager']),
    delete: roleAccess(['admin']),
  },
};

export default InventoryMovements;
