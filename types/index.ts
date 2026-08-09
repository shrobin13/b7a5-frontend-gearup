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
  status?: "ACTIVE" | "SUSPENDED";
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

export type RentalItem = {
  _id?: string;
  id?: string;
  quantity?: number;
  priceEach?: number | string;
  gearItemId?: string;
  gearItem?: Gear;
};

export type Rental = {
  _id?: string;
  id?: string;
  status?: string;
  totalAmount?: number | string;
  startDate?: string;
  endDate?: string;
  gear?: Gear;
  items?: RentalItem[];
  payments?: Payment[];
};

export type Payment = {
  _id?: string;
  id?: string;
  status?: string;
  amount?: number;
  currency?: string;
  provider?: string;
  transactionId?: string;
  rentalOrder?: Rental;
};

export type Review = {
  _id?: string;
  id?: string;
  gearId?: string;
  gearItemId?: string;
  rating?: number;
  comment?: string;
  user?: {
    name?: string;
    email?: string;
  };
  customer?: {
    id?: string;
    name?: string;
    email?: string;
  };
};

export type ApiError = {
  message: string;
  statusCode?: number;
};