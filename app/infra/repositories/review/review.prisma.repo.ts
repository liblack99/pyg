import {prisma} from "@/app/lib/prisma";
import {Prisma} from "@/app/generated/prisma/client";
import {CreateReview, UpdateReview, Review} from "@/app/core/review/dto";
import {ReviewRepoPort} from "@/app/core/review/port/review.repo.port";

/* ===============================
   SELECT
   =============================== */

export const reviewSelect = {
  id: true,
  title: true,
  details: true,
  isActive: true,
  createdAt: true,
} as const;

type ReviewRow = Prisma.ReviewTemplateGetPayload<{
  select: typeof reviewSelect;
}>;

/* ===============================
   MAPPERS
   =============================== */

function toReviewDTO(row: ReviewRow): Review {
  return {
    id: row.id,
    title: row.title,
    details: row.details,
    isActive: row.isActive,
    createdAt: row.createdAt,
  };
}

/* ===============================
   SEARCH
   =============================== */

function makeWhere(search?: string) {
  if (!search) return undefined;
  const s = search.trim();
  if (!s) return undefined;

  return {
    OR: [
      {title: {contains: s, mode: "insensitive" as const}},
      {details: {contains: s, mode: "insensitive" as const}},
    ],
  };
}

/* ===============================
   REPOSITORY
   =============================== */

export const reviewRepo: ReviewRepoPort = {
  async listPaged({search, limit = 20, cursor}) {
    const take = Math.min(Math.max(limit, 1), 50);

    const rows = await prisma.reviewTemplate.findMany({
      where: {
        ...makeWhere(search),
        isActive: true, // 👈 solo activas por defecto
      },
      select: reviewSelect,
      orderBy: [{createdAt: "desc"}, {id: "desc"}],
      take: take + 1,
      ...(cursor ? {cursor: {id: cursor}, skip: 1} : {}),
    });

    const hasMore = rows.length > take;
    const pageRows = rows.slice(0, take);

    return {
      items: pageRows.map(toReviewDTO),
      nextCursor: hasMore ? pageRows[pageRows.length - 1].id : null,
    };
  },

  async findById(id: string) {
    const row = await prisma.reviewTemplate.findUnique({
      where: {id},
      select: reviewSelect,
    });

    return row ? toReviewDTO(row) : null;
  },

  async create(data: CreateReview) {
    const row = await prisma.reviewTemplate.create({
      data: {
        title: data.title,
        details: data.details ?? null,
        createdById: data.createdById,
      },
      select: reviewSelect,
    });

    return toReviewDTO(row);
  },

  async update(id: string, data: UpdateReview) {
    const row = await prisma.reviewTemplate.update({
      where: {id},
      data: {
        ...(data.title !== undefined ? {title: data.title} : {}),
        ...(data.details !== undefined ? {details: data.details} : {}),
      },
      select: reviewSelect,
    });

    return toReviewDTO(row);
  },

  async delete(id: string) {
    await prisma.reviewTemplate.delete({
      where: {id},
    });
  },
};
