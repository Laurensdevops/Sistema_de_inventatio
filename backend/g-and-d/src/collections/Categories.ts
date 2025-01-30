import { roleAccess } from "@/utils/permissions";
import { CollectionConfig } from "payload";

const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "productCount",
      type: "number",
      admin: {
        readOnly: true,
      },
      defaultValue: 0,
    },
  ],
    access: {
      read: roleAccess(["admin", "manager", "seller"]),
      create: roleAccess(["admin", "manager"]),
      update: roleAccess(["admin", "manager", "seller"]),
      delete: roleAccess(["admin"]),
    },
};

export default Categories;
