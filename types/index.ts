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
  brand?: string | null;
  category?: string | { id?: string; name?: string; description?: string } | null;
  categoryId?: string | null;
  pricePerDay?: number | string;
  stockQuantity?: number;
  stock?: number;
  isAvailable?: boolean;
  condition?: string;
  image?: string;
  images?: string[];
  rating?: number;
  provider?: string | { id?: string; name?: string };
  providerId?: string;
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

export type Review = {
  _id?: string;
  id?: string;
  gearId?: string;
  rating?: number;
  comment?: string;
  user?: {
    name?: string;
    email?: string;
  };
};

export type ApiError = {
  message: string;
  statusCode?: number;
};