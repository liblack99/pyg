import {
  CreateReview,
  UpdateReview,
  Review,
  ReviewListPagedResult,
  ListInputReview,
} from "../dto";

export interface ReviewRepoPort {
  listPaged(params: ListInputReview): Promise<ReviewListPagedResult>;

  findById(id: string): Promise<Review | null>;

  create(data: CreateReview): Promise<Review>;

  update(id: string, data: UpdateReview): Promise<Review>;

  delete(id: string): Promise<void>;
}
