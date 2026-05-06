import {prisma} from "@/app/lib/prisma";

import {SUPPLIERS_SEED} from "../data/suppliers.data";

async function main() {
  for (const s of SUPPLIERS_SEED) {
    await prisma.supplier.upsert({
      where: {name: s.name},
      update: {
        city: s.city,
        contactName: s.contactName,
        phone: s.phone,
        invoiceRequired: s.invoiceRequired,
        requiresProductionOrder: s.requiresProductionOrder,
        notes: s.notes,
      },
      create: {
        name: s.name,
        city: s.city,
        contactName: s.contactName,
        phone: s.phone,
        invoiceRequired: s.invoiceRequired,
        requiresProductionOrder: s.requiresProductionOrder,
        notes: s.notes,
      },
    });
  }

  console.log(`✅ Suppliers seeded: ${SUPPLIERS_SEED.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
