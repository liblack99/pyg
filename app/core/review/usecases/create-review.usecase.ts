import {ReviewRepoPort} from "../port/review.repo.port";
import {CreateReview} from "../dto";

export class CreateReviewUseCase {
  constructor(private repo: ReviewRepoPort) {}

  async execute(input: CreateReview) {
    return this.repo.create(input);
  }
}
