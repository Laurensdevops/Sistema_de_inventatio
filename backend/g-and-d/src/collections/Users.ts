import { roleAccess } from "@/utils/permissions";
import { CollectionConfig } from "payload";

// Lista combinada de todas las provincias de RD
const provincesOptions = [
  { label: "Distrito Nacional", value: "Distrito Nacional" },
  { label: "Santo Domingo Este", value: "Santo Domingo Este" },
  { label: "Santo Domingo Norte", value: "Santo Domingo Norte" },
  { label: "Santo Domingo Oeste", value: "Santo Domingo Oeste" },
  { label: "La Altagracia", value: "La Altagracia" },
  { label: "El Seibo", value: "El Seibo" },
  { label: "Hato Mayor", value: "Hato Mayor" },
  { label: "La Romana", value: "La Romana" },
  { label: "Puerto Plata", value: "Puerto Plata" },
  { label: "Santiago", value: "Santiago" },
  { label: "Duarte", value: "Duarte" },
  { label: "Samaná", value: "Samaná" },
  { label: "La Vega", value: "La Vega" },
  { label: "María Trinidad Sánchez", value: "María Trinidad Sánchez" },
  { label: "Santiago Rodríguez", value: "Santiago Rodríguez" },
  { label: "Barahona", value: "Barahona" },
  { label: "San Juan", value: "San Juan" },
  { label: "Bahoruco", value: "Bahoruco" },
  { label: "Peravia", value: "Peravia" },
  { label: "Azua", value: "Azua" },
  { label: "San Cristóbal", value: "San Cristóbal" },
  { label: "Monte Plata", value: "Monte Plata" },
  { label: "Valverde", value: "Valverde" },
  { label: "Sánchez Ramírez", value: "Sánchez Ramírez" },
  { label: "Monseñor Nouel", value: "Monseñor Nouel" },
  { label: "Hermanas Mirabal", value: "Hermanas Mirabal" },
];

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Gerente", value: "manager" },
        { label: "Vendedor", value: "seller" },
        { label: "Mensajero", value: "courier" },
      ],
      defaultValue: "employee",
    },
    {
      name: "province",
      type: "select",
      required: true,
      label: "Provincia",
      options: provincesOptions,
    },
  ],
  access: {
    read: roleAccess(["admin", "manager", "seller", "courier"]),
    create: roleAccess(["admin", "manager"]),
    update: roleAccess(["admin", "manager", "seller"]),
    delete: roleAccess(["admin"]),
  },
};

export default Users;
