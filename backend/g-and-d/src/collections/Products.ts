import { CollectionConfig } from "payload";
import { roleAccess } from "../utils/permissions";

const Products: CollectionConfig = {
  slug: "products",
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
      name: "description",
      type: "textarea",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "categories",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      required: true,
    },
    {
      name: "prices",
      type: "group",
      fields: [
        { name: "base", label: "Precio Base", type: "number", required: true },
        { name: "wholesale", label: "Precio al por mayor", type: "number", required: true },
        { name: "retail", label: "Precio al detalle", type: "number", required: true },
      ],
    },
    {
      name: "stock",
      type: "number",
      required: true,
    },
    {
      name: "salesCount", 
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "isFeatured",
      type: "checkbox",
      defaultValue: false,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (!doc.categories || doc.categories.length === 0) return;

        setTimeout(async () => {
          for (const categoryId of doc.categories) {
            const products = await req.payload.find({
              collection: "products",
              where: {
                categories: { in: [categoryId] },
              },
            });

            const newProductCount = products.totalDocs || 0;
            const currentCategory = await req.payload.findByID({
              collection: "categories",
              id: categoryId,
            });

            if (currentCategory.productCount !== newProductCount) {
              await req.payload.update({
                collection: "categories",
                id: categoryId,
                data: { productCount: newProductCount },
              });
            }
          }
        }, 1500); 
      },
    ],
  },
  access: {
    read: roleAccess(["admin", "manager", "seller", "courier"]),
    create: roleAccess(["admin", "manager"]),
    update: roleAccess(["admin", "manager", "seller"]),
    delete: roleAccess(["admin"]),
  },
};

export default Products;
