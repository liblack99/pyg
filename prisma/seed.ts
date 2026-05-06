import {prisma} from "@/app/lib/prisma";
import {SUPPLIERS_SEED} from "./data/suppliers.data";
import bcrypt from "bcryptjs";

import {Prisma} from "@/app/generated/prisma/client";

const D = (n: number | string) => new Prisma.Decimal(n);

const REQUIRED_TERMS = [
  {
    key: "contrato_legal",
    text: "La ejecución de la presente cotización está sujeta a un Contrato Legal entre las partes: Contratante y Contratista.",
    required: true,
    accepted: true,
    order: 1,
  },
  {
    key: "documentos_cliente",
    text: "El cliente debe enviar RUT de la empresa o persona natural o Cédula de Ciudadanía.",
    required: true,
    accepted: true,
    order: 2,
  },
  {
    key: "orden_compra",
    text: "El cliente debe enviar orden de compra y/o servicio y soporte de consignación.",
    required: true,
    accepted: true,
    order: 3,
  },
  {
    key: "mano_obra",
    text: "Esta cotización incluye mano de obra calificada y herramientas para su ejecución.",
    required: true,
    accepted: true,
    order: 4,
  },
  {
    key: "gastos_fuera_ciudad",
    text: "Fuera de la ciudad de Barranquilla, el cliente asume los gastos de transporte de productos, viáticos y transporte de instalador(es).",
    required: true,
    accepted: true,
    order: 5,
  },
  {
    key: "preparacion_terreno",
    text: "El cliente se encargará de la preparación del terreno para las instalaciones.",
    required: true,
    accepted: true,
    order: 6,
  },
  {
    key: "primer_nivel",
    text: "Los productos serán colocados en un área que se encuentre en primer nivel y sea de fácil acceso. No incluye desplazamientos verticales.",
    required: true,
    accepted: true,
    order: 7,
  },
  {
    key: "transporte_obra",
    text: "Esta cotización incluye transporte de los productos al sitio de la obra.",
    required: true,
    accepted: true,
    order: 8,
  },
  {
    key: "aceptacion_expresa",
    text: "Al aceptar la cotización se aceptan de manera expresa el contenkeyo y condiciones de la misma; de igual forma, declaro conocer y entender las especificaciones, recomendaciones de uso y calkeyad de los materiales y/o productos objeto de la presente cotización, ofertados por la empresa.",
    required: true,
    accepted: true,
    order: 9,
  },
] as const;

const pad3 = (n: number) => String(n).padStart(3, "0");
const pick = <T>(arr: T[], i: number) => arr[i % arr.length];

async function seedBusinessData() {
  // 1) Usuario ADMIN
  const admin = await prisma.user.findFirst({where: {name: "Admin"}});
  if (!admin)
    throw new Error("No hay usuario ADMIN. Crea uno antes de correr seed.");

  const createdById = admin.id;

  // (Opcional) limpiar datos previos de prueba (ajusta si no quieres borrar)
  // OJO: orden importa por FK
  await prisma.quotationTerm.deleteMany();
  await prisma.quotationItem.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.reviewTemplate.deleteMany();
  await prisma.product.deleteMany();
  await prisma.client.deleteMany();

  // 2) 10 Clientes
  const clientsData: Prisma.ClientCreateManyInput[] = Array.from(
    {length: 10},
    (_, i) => {
      const n = i + 1;
      const isCompany = n % 2 === 0;

      return {
        name: isCompany
          ? `Constructora Cliente ${n} SAS`
          : `Cliente Persona ${n}`,
        documentType: isCompany ? "NIT" : "C.C",
        documentNumber: isCompany ? `90000000${n}-1` : `10${n}88000${n}`,
        email: isCompany
          ? `compras${n}@cliente${n}.com`
          : `cliente${n}@gmail.com`,
        phone: `30010${pad3(n)}`,
        address: `Calle ${10 + n} #${5 + n}-${20 + n}`,
        city: n % 3 === 0 ? "Soledad" : "Barranquilla",
        department: "Atlántico",

        contactName1: isCompany ? `Contacto ${n} Compras` : `Contacto ${n}`,
        contactRole1: isCompany ? "Compras" : "Titular",
        contactPhone1: `30120${pad3(n)}`,

        contactName2: isCompany ? `Contacto ${n} Obra` : null,
        contactRole2: isCompany ? "Residente" : null,
        contactPhone2: isCompany ? `30230${pad3(n)}` : null,

        createdById,
      };
    },
  );

  await prisma.client.createMany({data: clientsData});

  const clients = await prisma.client.findMany({orderBy: {createdAt: "asc"}});

  // 3) 10 Productos
  const productsData: Prisma.ProductCreateManyInput[] = [
    {
      code: "PYG-PRD-001",
      name: "Grama natural (m²)",
      unitPrice: D("28000.00"),
      description: "Suministro e instalación de grama natural",
      imageUrl: null,
      createdById,
    },
    {
      code: "PYG-PRD-002",
      name: "Grama sintética (m²)",
      unitPrice: D("65000.00"),
      description: "Grama sintética alta resistencia",
      imageUrl: null,
      createdById,
    },
    {
      code: "PYG-PRD-003",
      name: "Sistema de riego (unidad)",
      unitPrice: D("1200000.00"),
      description: "Kit de riego automatizado",
      imageUrl: null,
      createdById,
    },
    {
      code: "PYG-PRD-004",
      name: "Tierra abonada (bulto)",
      unitPrice: D("22000.00"),
      description: "Bulto de tierra abonada",
      imageUrl: null,
      createdById,
    },
    {
      code: "PYG-PRD-005",
      name: "Fertilizante (kg)",
      unitPrice: D("18000.00"),
      description: "Fertilizante para césped",
      imageUrl: null,
      createdById,
    },
    {
      code: "PYG-PRD-006",
      name: "Piedra decorativa (m²)",
      unitPrice: D("48000.00"),
      description: "Piedra decorativa para jardines",
      imageUrl: null,
      createdById,
    },
    {
      code: "PYG-PRD-007",
      name: "Borde plástico (ml)",
      unitPrice: D("12000.00"),
      description: "Borde separador de jardín",
      imageUrl: null,
      createdById,
    },
    {
      code: "PYG-PRD-008",
      name: "Malla anti-maleza (m²)",
      unitPrice: D("9000.00"),
      description: "Malla para control de maleza",
      imageUrl: null,
      createdById,
    },
    {
      code: "PYG-PRD-009",
      name: "Siembra semillas (m²)",
      unitPrice: D("15000.00"),
      description: "Preparación + siembra de semillas",
      imageUrl: null,
      createdById,
    },
    {
      code: "PYG-PRD-010",
      name: "Mantenimiento (visita)",
      unitPrice: D("250000.00"),
      description: "Mantenimiento general de zonas verdes",
      imageUrl: null,
      createdById,
    },
  ];

  await prisma.product.createMany({data: productsData});

  const products = await prisma.product.findMany({orderBy: {createdAt: "asc"}});

  // 4) 10 Reseñas (ReviewTemplate)
  const reviewsData: Prisma.ReviewTemplateCreateManyInput[] = Array.from(
    {length: 10},
    (_, i) => {
      const n = i + 1;
      return {
        title: `Reseña ${n} - ${n % 2 === 0 ? "Instalación incluida" : "Condición comercial"}`,
        details:
          n % 2 === 0
            ? "Incluye instalación y puesta en marcha sin costo adicional."
            : "La oferta aplica según disponibilidad y condiciones comerciales vigentes.",
        isActive: true,
        createdById,
      };
    },
  );

  await prisma.reviewTemplate.createMany({data: reviewsData});

  const reviewTemplates = await prisma.reviewTemplate.findMany({
    where: {isActive: true},
    orderBy: {createdAt: "asc"},
  });

  // 5) 10 Cotizaciones con items + términos required
  for (let i = 0; i < 10; i++) {
    const n = i + 1;
    const client = pick(clients, i);
    const review = pick(reviewTemplates, i);

    // items: 2 a 4 items por cotización
    const itemsCount = 2 + (n % 3); // 2..4
    const itemsProducts = Array.from({length: itemsCount}, (_, k) =>
      pick(products, i + k),
    );
    type SeedItem = Omit<
      Prisma.QuotationItemCreateWithoutQuotationInput,
      "quantity" | "unitPrice"
    > & {
      quantity: Prisma.Decimal;
      unitPrice: Prisma.Decimal;
    };

    const itemsCreate: SeedItem[] = itemsProducts.map((p, idx) => {
      const qty = D(String((idx + 1) * (n % 3 === 0 ? 5 : 10))); // 10,20,... o 5,10...
      // si es "unidad/visita" usa 1
      const unit =
        p.name.includes("(unidad)") || p.name.includes("(visita)")
          ? "unidad"
          : p.name.includes("(ml)")
            ? "ml"
            : p.name.includes("(kg)")
              ? "kg"
              : p.name.includes("(bulto)")
                ? "bulto"
                : "m2";

      return {
        productId: p.id,
        productName: p.name,
        code: p.code,
        description: p.description ?? p.name,
        unit,
        quantity: unit === "unidad" ? D("1.00") : qty, // qty ya es Decimal
        unitPrice: p.unitPrice, // Decimal de DB

        adminPercent: D("2.50"),
        utilPercent: D("10.00"),
        imprPercent: D("5.00"),
        ivaPercent: D("19.00"),
      };
    });

    // totalGeneral simple = sum(qty*unitPrice)
    const totalGeneral = itemsCreate.reduce((acc, it) => {
      return acc.plus(it.quantity.times(it.unitPrice));
    }, D("0.00"));
    // status variado para probar filtros
    const statusCycle = [
      "DRAFT",
      "SENT",
      "APPROVED",
      "REJECTED",
      "CANCELLED",
    ] as const;
    const status = statusCycle[i % statusCycle.length];

    const now = Date.now();
    const sentAt =
      status === "SENT" || status === "APPROVED"
        ? new Date(now - 1000 * 60 * 60 * 24 * 2)
        : null;
    const approvedAt =
      status === "APPROVED" ? new Date(now - 1000 * 60 * 60 * 24) : null;
    const rejectedAt =
      status === "REJECTED" ? new Date(now - 1000 * 60 * 60 * 24) : null;
    const cancelledAt =
      status === "CANCELLED" ? new Date(now - 1000 * 60 * 60 * 12) : null;

    await prisma.quotation.create({
      data: {
        numberQuotation: `COTIZ-${pad3(n)}`,
        status,
        sentAt: sentAt ?? undefined,
        approvedAt: approvedAt ?? undefined,
        rejectedAt: rejectedAt ?? undefined,
        cancelledAt: cancelledAt ?? undefined,

        date: new Date(now - 1000 * 60 * 60 * 24 * (10 - n)),
        validDays: 30,
        createdById,

        clientId: client.id,
        clientSnapshot: client as unknown as Prisma.InputJsonValue,

        projectReference: `Proyecto ${n} - Zona verde`,
        projectPresentation: `Alcance ${n}: suministro e instalación según ítems`,

        specialConditions:
          "Cotización sujeta a confirmación de medidas finales en visita técnica.",
        timeDelivery: "10 a 15 días hábiles",
        workLocation: client.city ?? "Barranquilla",

        guarantees: "1 año por defectos de instalación (no aplica vandalismo).",
        commercialCondition: "Precios sujetos a disponibilidad.",
        paymentMethod:
          "Consignación a cuenta Bancolombia a nombre de Parque y Grama Construcciones S.A.S.",

        reviewTemplateId: review.id,
        reviewTitle: review.title,
        reviewDetails: review.details ?? null,

        totalGeneral,

        items: {create: itemsCreate},

        // ✅ SOLO REQUIRED
        terms: {
          create: REQUIRED_TERMS.map((t) => ({
            key: t.key,
            text: t.text,
            required: true,
            accepted: true,
            order: t.order,
          })),
        },
      },
    });
  }

  console.log(
    "✅ Seed listo: 10 clientes, 10 productos, 10 reseñas, 10 cotizaciones.",
  );
}

const PERMISSIONS = [
  // Quotations
  {key: "quotation:create", description: "Crear cotizaciones"},
  {key: "quotation:read", description: "Ver cotizaciones"},
  {key: "quotation:update", description: "Editar cotizaciones"},
  {key: "quotation:delete", description: "Eliminar cotizaciones"},
  {key: "quotation:send", description: "Enviar cotizaciones"},
  {key: "quotation:approve", description: "Aprobar/Marcar como aceptada"},
  {key: "quotation:reject", description: "Rechazar cotizaciones"},
  {key: "quotation:cancel", description: "Cancelar cotizaciones"},

  // Clients
  {key: "clients:read", description: "Ver clientes"},
  {key: "clients:create", description: "Crear clientes"},
  {key: "clients:update", description: "Editar clientes"},
  {key: "clients:delete", description: "Eliminar clientes"},
  {key: "clients:manage", description: "Gestionar clientes (todo)"},

  // Products
  {key: "products:read", description: "Ver productos"},
  {key: "products:create", description: "Crear productos"},
  {key: "products:update", description: "Editar productos"},
  {key: "products:delete", description: "Eliminar productos"},
  {key: "products:manage", description: "Gestionar productos (todo)"},

  // Reviews (plantillas de reseñas)
  {key: "reviews:read", description: "Ver reseñas (plantillas)"},
  {key: "reviews:create", description: "Crear reseñas (plantillas)"},
  {key: "reviews:update", description: "Editar reseñas (plantillas)"},
  {key: "reviews:delete", description: "Desactivar reseñas (plantillas)"},
  {key: "reviews:manage", description: "Gestionar reseñas (todo)"},

  // Projects (futuro)
  {key: "project:create", description: "Crear proyectos"},
  {key: "project:read", description: "Ver proyectos"},
  {key: "project:update", description: "Actualizar proyectos"},
  {key: "project:manage_tasks", description: "Gestionar tareas del proyecto"},

  // Accounting (futuro)
  {key: "accounting:manage_payments", description: "Gestionar pagos"},

  // Admin
  {key: "users:manage", description: "Administrar usuarios"},
  {key: "roles:manage", description: "Administrar roles y permisos"},

  // Suppliers
  {key: "suppliers:read", description: "Ver proveedores"},
  {key: "suppliers:create", description: "Crear proveedores"},
  {key: "suppliers:update", description: "Editar proveedores"},
  {key: "suppliers:delete", description: "Eliminar proveedores"},
  {key: "suppliers:manage", description: "Gestionar proveedores (todo)"},
] as const;

export const ROLES = [
  {
    name: "ADMIN",
    permissions: PERMISSIONS.map((p) => p.key),
  },

  {
    name: "GERENCIA_GENERAL",
    permissions: PERMISSIONS.map((p) => p.key),
  },

  {
    name: "COORDINADOR_COMERCIAL",
    permissions: [
      "quotation:create",
      "quotation:read",
      "quotation:update",
      "quotation:send",
      "quotation:approve",
      "quotation:reject",
      "quotation:cancel",

      "clients:read",
      "clients:create",
      "clients:update",

      "products:read",

      "reviews:read",
      "reviews:create",
      "reviews:update",

      "project:create",
      "project:read",

      "suppliers:read",
    ],
  },

  {
    name: "ASESOR_COMERCIAL_1",
    permissions: [
      "quotation:create",
      "quotation:read",
      "quotation:update",
      "quotation:send",

      "clients:read",
      "clients:create",
      "clients:update",

      "products:read",
      "reviews:read",

      "project:read",

      "suppliers:read",
    ],
  },

  {
    name: "ASESOR_COMERCIAL_2",
    permissions: [
      "quotation:create",
      "quotation:read",
      "quotation:update",
      "quotation:send",

      "clients:read",
      "clients:create",
      "clients:update",

      "products:read",
      "reviews:read",

      "project:read",

      "suppliers:read",
    ],
  },

  {
    name: "ASISTENTE_ADMINISTRATIVO",
    permissions: [
      "quotation:read",

      "clients:read",

      "products:read",

      "reviews:read",

      "project:read",
      "project:update",

      "suppliers:read",
      "suppliers:create",
      "suppliers:update",
    ],
  },

  {
    name: "AUXILIAR_CONTABLE",
    permissions: [
      "quotation:read",

      "clients:read",

      "products:read",

      "reviews:read",

      "project:read",

      "accounting:manage_payments",

      "suppliers:read",
    ],
  },

  {
    name: "SUPERVISOR_OBRA",
    permissions: [
      "quotation:read",

      "clients:read",

      "products:read",

      "reviews:read",

      "project:read",
      "project:update",
      "project:manage_tasks",

      "suppliers:read",
    ],
  },
] as const;

// async function main() {
//   // 1) Crear permisos
//   for (const p of PERMISSIONS) {
//     await prisma.permission.upsert({
//       where: {key: p.key},
//       update: {description: p.description},
//       create: {key: p.key, description: p.description},
//     });
//   }

//   // 2) Crear roles + asignar permisos
//   for (const r of ROLES) {
//     const role = await prisma.role.upsert({
//       where: {name: r.name},
//       update: {},
//       create: {name: r.name},
//     });

//     await prisma.rolePermission.deleteMany({
//       where: {roleId: role.id},
//     });

//     const perms = await prisma.permission.findMany({
//       where: {key: {in: [...r.permissions]}},
//       select: {id: true},
//     });

//     await prisma.rolePermission.createMany({
//       data: perms.map((p) => ({
//         roleId: role.id,
//         permissionId: p.id,
//       })),
//       skipDuplicates: true,
//     });
//   }

//   // 3) Crear usuario ADMIN inicial
//   const adminEmail = "admin@local.com";
//   const adminName = "Admin";

//   const adminRole = await prisma.role.findUnique({
//     where: {name: "ADMIN"},
//   });
//   if (!adminRole) throw new Error("Role ADMIN no existe");

//   await prisma.user.upsert({
//     where: {email: adminEmail},
//     update: {
//       name: adminName,
//       roleId: adminRole.id,
//     },
//     create: {
//       email: adminEmail,
//       name: adminName,
//       roleId: adminRole.id,
//     },
//   });

//   await prisma.quotationSequence.upsert({
//     where: {id: 1},
//     create: {id: 1, lastNumber: 10},
//     update: {},
//   });

//   await seedBusinessData();

//   console.log("✅ Seed listo: roles, permisos (incluye reviews) y admin");

//   for (const s of SUPPLIERS_SEED) {
//     await prisma.supplier.upsert({
//       where: {name: s.name},
//       update: {
//         city: s.city,
//         contactName: s.contactName,
//         phone: s.phone,
//         invoiceRequired: s.invoiceRequired,
//         requiresProductionOrder: s.requiresProductionOrder,
//         notes: s.notes,
//       },
//       create: {
//         name: s.name,
//         city: s.city,
//         contactName: s.contactName,
//         phone: s.phone,
//         invoiceRequired: s.invoiceRequired,
//         requiresProductionOrder: s.requiresProductionOrder,
//         notes: s.notes,
//       },
//     });
//   }

//   console.log(`✅ Suppliers seeded: ${SUPPLIERS_SEED.length}`);
// }

async function main() {
  // Asegúrate de que adminPasswordHash esté definido aquí o importado
  const adminPasswordHash = await bcrypt.hash("Admin123*", 10);

  await prisma.user.update({
    where: {email: "admin@local.com"},
    data: {
      passwordHash: adminPasswordHash,
    },
  });

  console.log("✅ Usuario actualizado correctamente");
}
main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
