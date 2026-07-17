export const generateSku = () => {
  const random = Math.floor(100000 + Math.random() * 900000);

  return `PV-${Date.now()}-${random}`;
};