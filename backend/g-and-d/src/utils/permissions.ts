export const roleAccess = (allowedRoles: string[]) => {
    return ({ req }) => {
      if (!req.user) return false; 
      return allowedRoles.includes(req.user.role);
    };
  };
  