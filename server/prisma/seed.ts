import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Seed Users
  const users = await prisma.user.createMany({
    data: await Promise.all([
      {
        name: "Admin One",
        email: "admin1@example.com",
        password: await bcrypt.hash("adminpass", 10),
        role: "Admin",
      },
      {
        name: "Admin Two",
        email: "admin2@example.com",
        password: await bcrypt.hash("adminpass", 10),
        role: "Admin",
      },
      {
        name: "Sales One",
        email: "sales1@example.com",
        password: await bcrypt.hash("salespass", 10),
        role: "Sales_Person",
      },
      {
        name: "Sales Two",
        email: "sales2@example.com",
        password: await bcrypt.hash("salespass", 10),
        role: "Sales_Person",
      },
      {
        name: "Sales Three",
        email: "sales3@example.com",
        password: await bcrypt.hash("salespass", 10),
        role: "Sales_Person",
      },
    ]),
  });

  // 2. Seed Customers
  const customers = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.customer.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number({ style: "international" }),
          address: faker.location.streetAddress(),
        },
      })
    )
  );

  // 3. Seed Products
  const products = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          sku: faker.string.uuid(),
          category: faker.commerce.department(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 50, max: 500 })),
          stockQuantity: faker.number.int({ min: 50, max: 200 }),
          imageUrl: faker.image.url(),
          rating: parseFloat(faker.number.float({ min: 3, max: 5 }).toFixed(1)),
        },
      })
    )
  );

  // 4. Seed Purchases
  for (const product of products) {
    for (let i = 0; i < 5; i++) {
      const quantity = faker.number.int({ min: 10, max: 50 });
      const unitCost = parseFloat(faker.commerce.price({ min: 30, max: 300 }));
      await prisma.purchase.create({
        data: {
          productId: product.id,
          quantity,
          unitCost,
          totalCost: quantity * unitCost,
          note: faker.lorem.sentence(),
          timestamp: faker.date.past(),
        },
      });

      // Update stockQuantity
      await prisma.product.update({
        where: { id: product.id },
        data: {
          stockQuantity: {
            increment: quantity,
          },
        },
      });
    }
  }

  // 5. Seed Orders
  for (let i = 0; i < 10; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const orderItems = [];

    let orderTotal = 0;
    const selectedProducts = faker.helpers.arrayElements(products, 2);

    for (const product of selectedProducts) {
      const quantity = faker.number.int({ min: 1, max: 5 });
      const unitPrice = product.price;
      const total = quantity * unitPrice;

      orderItems.push({
        productId: product.id,
        quantity,
        unitPrice,
        total,
      });

      orderTotal += total;
    }

    await prisma.order.create({
      data: {
        customerId: customer.id,
        status: faker.helpers.arrayElement([
          "pending",
          "completed",
          "cancelled",
        ]),
        paymentStatus: faker.helpers.arrayElement([
          "unpaid",
          "paid",
          "refunded",
        ]),
        total: orderTotal,
        items: {
          create: orderItems,
        },
      },
    });
  }

  // 6. Seed Expenses
  const expenseCategories = [
    "Rent",
    "Utilities",
    "Marketing",
    "Transport",
    "Supplies",
  ];
  for (let i = 0; i < 15; i++) {
    await prisma.expense.create({
      data: {
        category: faker.helpers.arrayElement(expenseCategories),
        amount: parseFloat(faker.commerce.price({ min: 1000, max: 20000 })),
        note: faker.lorem.sentence(),
        timestamp: faker.date.recent({ days: 60 }),
      },
    });
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
