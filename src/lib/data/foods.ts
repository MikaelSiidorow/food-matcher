export const foodTypes = ["pizza", "burger", "pasta", "salad"] as const;
export type FoodType = (typeof foodTypes)[number];
