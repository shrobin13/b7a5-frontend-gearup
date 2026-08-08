const BACKEND_BASE = process.env.BACKEND_API_URL ?? "https://gearup-igqw.onrender.com";
const UNCATEGORIZED_CATEGORY_ID = "0f9b8502-b642-4c2b-8e63-5f7bf02a5799";

const PASSWORD = "GearUp@2026!";

type LoginResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    user?: { id?: string; name?: string; email?: string; role?: string };
    accessToken?: string;
    refreshToken?: string;
  };
};

type MeResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
};

type RegisterResponse = LoginResponse;

type GearPayload = {
  name: string;
  description?: string;
  brand?: string;
  categoryId: string;
  pricePerDay: number;
  stockQuantity: number;
  condition?: string;
};

type CategoryPayload = {
  name: string;
  description?: string;
};

const CATEGORY_DEFS: CategoryPayload[] = [
  { name: "Camping", description: "Tents, sleeping bags, stoves, and camping essentials" },
  { name: "Hiking", description: "Trekking poles, backpacks, and hiking accessories" },
  { name: "Cycling", description: "Bikes, helmets, locks, and cycling gear" },
  { name: "Water Sports", description: "SUPs, kayaks, wetsuits, and water accessories" },
];

const PROVIDERS = [
  {
    name: "Summit Rentals",
    email: "summit.rentals@gearup.dev",
    phone: "+1-555-0101",
    address: "Denver, CO",
    gear: [
      { name: "Mountain Tent 2P", category: "Camping", description: "Lightweight 2-person backpacking tent", brand: "Big Agnes", pricePerDay: 35, stockQuantity: 8, condition: "Excellent" },
      { name: "Sleeping Bag -15°C", category: "Camping", description: "Down sleeping bag rated to -15°C", brand: "Marmot", pricePerDay: 18, stockQuantity: 12, condition: "Good" },
      { name: "Backpacking Stove", category: "Camping", description: "Compact isobutane stove with windscreen", brand: "MSR", pricePerDay: 8, stockQuantity: 20, condition: "Excellent" },
      { name: "Trekking Poles (Pair)", category: "Hiking", description: "Adjustable carbon trekking poles", brand: "Black Diamond", pricePerDay: 6, stockQuantity: 15, condition: "Good" },
      { name: "Headlamp 400lm", category: "Camping", description: "Rechargeable 400-lumen headlamp", brand: "Petzl", pricePerDay: 4, stockQuantity: 25, condition: "Excellent" },
    ],
  },
  {
    name: "Coastal Watersports",
    email: "coastal.watersports@gearup.dev",
    phone: "+1-555-0102",
    address: "San Diego, CA",
    gear: [
      { name: "Stand-Up Paddleboard", category: "Water Sports", description: "Inflatable 10'6\" SUP with paddle and pump", brand: "iRocker", pricePerDay: 45, stockQuantity: 6, condition: "Excellent" },
      { name: "Kayak - Sit-on-Top", category: "Water Sports", description: "Single-person sit-on-top kayak with paddle", brand: "Perception", pricePerDay: 40, stockQuantity: 4, condition: "Good" },
      { name: "Wetsuit 3/2mm", category: "Water Sports", description: "Full 3/2mm neoprene wetsuit", brand: "O'Neill", pricePerDay: 15, stockQuantity: 10, condition: "Good" },
      { name: "Snorkel Set", category: "Water Sports", description: "Mask, snorkel, and fins set", brand: "Cressi", pricePerDay: 10, stockQuantity: 18, condition: "Excellent" },
      { name: "Dry Bag 20L", category: "Water Sports", description: "Waterproof roll-top dry bag", brand: "Sea to Summit", pricePerDay: 5, stockQuantity: 30, condition: "Excellent" },
    ],
  },
  {
    name: "Urban Cycle Hub",
    email: "urban.cycle@gearup.dev",
    phone: "+1-555-0103",
    address: "Portland, OR",
    gear: [
      { name: "Hybrid Bike", category: "Cycling", description: "Comfort hybrid bike with 21 speeds", brand: "Trek", pricePerDay: 30, stockQuantity: 10, condition: "Good" },
      { name: "Road Bike Carbon", category: "Cycling", description: "Carbon road bike with Shimano 105", brand: "Specialized", pricePerDay: 60, stockQuantity: 3, condition: "Excellent" },
      { name: "Mountain Bike Full-Suspension", category: "Cycling", description: "Full-suspension trail mountain bike", brand: "Giant", pricePerDay: 55, stockQuantity: 5, condition: "Good" },
      { name: "Helmet MIPS", category: "Cycling", description: "MIPS-equipped cycling helmet", brand: "Giro", pricePerDay: 7, stockQuantity: 20, condition: "Excellent" },
      { name: "Bike Lock U-Lock", category: "Cycling", description: "Heavy-duty U-lock with cable", brand: "Kryptonite", pricePerDay: 3, stockQuantity: 25, condition: "Excellent" },
    ],
  },
];

const ADMIN = {
  name: "GearUp Admin",
  email: "admin@gearup.dev",
  phone: "+1-555-0100",
  address: "Head Office",
};

const CUSTOMER = {
  name: "Alex Carter",
  email: "alex.carter@gearup.dev",
  phone: "+1-555-0199",
  address: "Seattle, WA",
};

async function api<T>(path: string, options: { method?: string; token?: string; body?: unknown } = {}): Promise<T> {
  const { method = "GET", token, body } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BACKEND_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message ?? data?.error ?? `Request failed (${response.status})`;
    throw new Error(`${method} ${path} → ${message}`);
  }

  return data as T;
}

async function loginUser(email: string): Promise<{ user: { id?: string; name?: string; email?: string; role?: string }; token: string }> {
  const response = await api<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password: PASSWORD },
  });
  const token = response.data?.accessToken;
  if (!token) throw new Error(`Login failed for ${email}: missing access token`);

  const me = await api<MeResponse>("/api/auth/me", {
    method: "GET",
    token,
  });
  const user = me.data;
  if (!user?.id || !user.email) throw new Error(`Login failed for ${email}: could not load user profile`);

  console.log(`  ✓ Logged in: ${user.role ?? "user"} ${user.name ?? user.email} (id: ${user.id})`);
  return { user, token };
}

async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  address?: string;
  role: "ADMIN" | "PROVIDER" | "CUSTOMER";
}): Promise<{ user: { id?: string; name?: string; email?: string; role?: string }; token: string } | null> {
  try {
    const response = await api<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: payload,
    });
    const user = response.data?.user;
    const token = response.data?.accessToken;
    if (!user || !token) throw new Error("Missing user or token in response");
    console.log(`  ✓ Registered ${user.role}: ${user.name} <${user.email}> (id: ${user.id})`);
    return { user, token };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("already exists") || message.toLowerCase().includes("duplicate")) {
      console.log(`  ⚠ ${payload.email} already exists — logging in`);
      return loginUser(payload.email);
    }
    throw error;
  }
}

async function createCategory(token: string, category: CategoryPayload) {
  const response = await api<{ data?: { id?: string; name?: string } }>("/api/categories", {
    method: "POST",
    token,
    body: category,
  });
  return response.data;
}

async function getAllCategories() {
  const response = await api<{ data?: Array<{ id?: string; name?: string; description?: string }> }>("/api/categories");
  return response.data ?? [];
}

async function createGear(token: string, gear: Omit<GearPayload, "categoryId">, categoryId: string) {
  const payload: GearPayload = { ...gear, categoryId };
  const response = await api<{ data?: { id?: string; name?: string } }>("/api/provider/gear", {
    method: "POST",
    token,
    body: payload,
  });
  return response.data;
}

async function updateGear(token: string, gearId: string, patch: Partial<GearPayload>) {
  const response = await api<{ data?: { id?: string; name?: string } }>(`/api/provider/gear/${gearId}`, {
    method: "PUT",
    token,
    body: patch,
  });
  return response.data;
}

async function getProviderGear(token: string) {
  const response = await api<{ data?: Array<{ id?: string; name?: string; categoryId?: string | null }> }>("/api/provider/gear", {
    method: "GET",
    token,
  });
  return response.data ?? [];
}

async function main() {
  console.log(`\n🌱 GearUp Seeder`);
  console.log(`   Backend: ${BACKEND_BASE}\n`);

  console.log("👑 Admin:");
  const admin = await registerUser({
    name: ADMIN.name,
    email: ADMIN.email,
    password: PASSWORD,
    confirmPassword: PASSWORD,
    phone: ADMIN.phone,
    address: ADMIN.address,
    role: "ADMIN",
  });

  const categoryIdMap = new Map<string, string>();
  if (admin) {
    console.log("\n📂 Categories:");
    const existingCategories = await getAllCategories();
    for (const category of CATEGORY_DEFS) {
      const existing = existingCategories.find((c) => c.name?.toLowerCase() === category.name.toLowerCase());
      if (existing?.id) {
        categoryIdMap.set(category.name, existing.id);
        console.log(`  ⚠ Category "${category.name}" already exists — reusing id ${existing.id}`);
        continue;
      }
      try {
        const created = await createCategory(admin.token, category);
        categoryIdMap.set(category.name, created?.id ?? "");
        console.log(`  ✓ Created category: ${created?.name ?? category.name}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.toLowerCase().includes("duplicate") || message.toLowerCase().includes("already")) {
          console.log(`  ⚠ Category "${category.name}" already exists — skipping`);
        } else {
          console.log(`  ✗ Failed to create category "${category.name}": ${message}`);
        }
      }
    }

    for (const category of CATEGORY_DEFS) {
      if (!categoryIdMap.get(category.name)) {
        const fresh = await getAllCategories();
        const match = fresh.find((c) => c.name?.toLowerCase() === category.name.toLowerCase());
        if (match?.id) {
          categoryIdMap.set(category.name, match.id);
          console.log(`  ✓ Resolved category "${category.name}" → ${match.id}`);
        }
      }
    }
  }

  console.log("\n🧑 Customer:");
  await registerUser({
    name: CUSTOMER.name,
    email: CUSTOMER.email,
    password: PASSWORD,
    confirmPassword: PASSWORD,
    phone: CUSTOMER.phone,
    address: CUSTOMER.address,
    role: "CUSTOMER",
  });

  console.log("\n🏕️ Providers & Gear:");
  for (const provider of PROVIDERS) {
    console.log(`\n  ${provider.name}:`);
    const result = await registerUser({
      name: provider.name,
      email: provider.email,
      password: PASSWORD,
      confirmPassword: PASSWORD,
      phone: provider.phone,
      address: provider.address,
      role: "PROVIDER",
    });

    if (!result) continue;

    const existingGear = await getProviderGear(result.token);

    for (const gear of provider.gear) {
      try {
        const categoryId = categoryIdMap.get(gear.category) ?? UNCATEGORIZED_CATEGORY_ID;
        const existing = existingGear.find((g) => g.name?.toLowerCase() === gear.name.toLowerCase());

        if (existing?.id) {
          if (existing.categoryId !== categoryId) {
            await updateGear(result.token, existing.id, { categoryId });
            console.log(`    ↻ Updated existing gear: ${gear.name} → ${gear.category}`);
          } else {
            console.log(`    = Gear already correct: ${gear.name} (${gear.category})`);
          }
        } else {
          const created = await createGear(result.token, gear, categoryId);
          console.log(`    ✓ Created gear: ${created?.name ?? gear.name} (${gear.category})`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`    ✗ Failed to process gear "${gear.name}": ${message}`);
      }
    }
  }

  console.log("\n──────────────────────────────");
  console.log("✅ Seeding complete!");
  console.log("\nTest credentials (password for all):");
  console.log(`  ${PASSWORD}`);
  console.log("\nAccounts:");
  if (admin) console.log(`  ADMIN    → ${ADMIN.email}`);
  console.log(`  CUSTOMER → ${CUSTOMER.email}`);
  for (const p of PROVIDERS) console.log(`  PROVIDER → ${p.email}`);
  console.log("\nCategories:");
  for (const category of CATEGORY_DEFS) {
    console.log(`  - ${category.name} → ${categoryIdMap.get(category.name) ?? "⚠️ missing"}`);
  }
  console.log("");
}

main().catch((error) => {
  console.error("\n❌ Seeder failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});