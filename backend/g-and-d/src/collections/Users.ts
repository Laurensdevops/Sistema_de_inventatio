import { CollectionConfig } from 'payload';
import { roleAccess } from '../utils/permissions';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Gerente', value: 'manager' },
        { label: 'Vendedor', value: 'seller' },
        { label: 'Mensajero', value: 'courier' },
      ],
      defaultValue: 'employee',
    },
  ],
  access: {
    read: roleAccess(['admin', 'manager,',]),
    update: roleAccess(['admin', 'manager']),
    delete: roleAccess(['admin']),
  },
};

export default Users;
