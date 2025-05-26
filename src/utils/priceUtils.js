export const getAppliedPrice = (prices, quantity) => {
    if (!prices) return "Precio 1";
    if (quantity >= 1 && quantity <= 5) return "Precio 1";
    if (quantity >= 6 && quantity <= 11) return "Precio 2";
    if (quantity >= 12) return "Precio 3";
    return "Precio 1";
  };
  