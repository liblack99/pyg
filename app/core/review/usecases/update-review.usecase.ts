import {ReviewRepoPort} from "../port/review.repo.port";
import {UpdateReview} from "../dto";

export class UpdateReviewUseCase {
  constructor(private repo: ReviewRepoPort) {}

  async execute(id: string, input: UpdateReview) {
    return this.repo.update(id, input);
  }
}
