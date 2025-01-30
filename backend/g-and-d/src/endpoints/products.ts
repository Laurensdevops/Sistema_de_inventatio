import { Endpoint } from "payload";

const productEndpoints: Endpoint[] = [
  {
    path: "/products/recent",
    method: "get",
    handler: async (req, res) => {
      try {
        const recentProducts = await req.payload.find({
          collection: "products",
          sort: "-createdAt",
          limit: 10,
        });
        res.status(200).json(recentProducts);
      } catch (error) {
        console.error("Error obteniendo productos recientes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    },
  },
  {
    path: "/products/best-sellers",
    method: "get",
    handler: async (req, res) => {
      try {
        const bestSellers = await req.payload.find({
          collection: "products",
          sort: "-salesCount",
          limit: 10,
        });
        res.status(200).json(bestSellers);
      } catch (error) {
        console.error("Error obteniendo productos más vendidos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      }
    },
  },
];

export default productEndpoints;
