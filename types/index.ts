export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type AppUser = {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  isActive?: boolean;
};

export type Gear = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  category?: string;
  pricePerDay?: number;
  stock?: number;
  condition?: string;
  image?: string;
  rating?: number;
  provider?: string;
};

export type Rental = {
  _id?: string;
  id?: string;
  status?: string;
  totalAmount?: number;
  startDate?: string;
  endDate?: string;
  gear?: Gear;
};

export type Payment = {
  _id?: string;
  id?: string;
  status?: string;
  amount?: number;
  currency?: string;
  provider?: string;
};

export type ApiError = {
  message: string;
  statusCode?: number;
};
