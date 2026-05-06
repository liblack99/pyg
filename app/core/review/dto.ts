export type Review = {
  id: string;
  title: string;
  details: string | null;
  isActive: boolean;
  createdAt: Date;
};

export type UpdateReview = {
  id: string;
  title: string;
  details?: string | null;
};

export type CreateReview = Omit<Review, "id" | "isActive" | "createdAt"> & {
  createdById: string;
};

export type ListInputReview = {
  search?: string;
  limit?: number;
  cursor?: string | null;
};

export type ReviewListPagedResult = {
  items: Review[];
  nextCursor: string | null;
};
