import {ReviewRepoPort} from "../port/review.repo.port";
import {ListInputReview, ReviewListPagedResult} from "../dto";

export class ListReviewsUseCase {
  constructor(private repo: ReviewRepoPort) {}

  async execute(input: ListInputReview): Promise<ReviewListPagedResult> {
    return this.repo.listPaged(input);
  }
}
