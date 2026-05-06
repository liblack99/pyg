import {prisma} from "@/app/lib/prisma";
import {SupplierRepo} from "@/app/core/supplier/port/supplier.repo.port";

export const supplierRepo: SupplierRepo = {
  listSupplier: async () => {
    return prisma.supplier.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        contactName: true,
        phone: true,
        invoiceRequired: true,
        requiresProductionOrder: true,
        notes: true,
      },
      orderBy: {name: "asc"},
    });
  },
};
