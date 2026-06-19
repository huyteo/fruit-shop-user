export const FREE_SHIP_THRESHOLD = 200000;
export const SHIPPING_FEE = 25000;

export const calcShippingFee = (subtotal: number) =>
  subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;