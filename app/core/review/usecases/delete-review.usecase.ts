import {ReviewRepoPort} from "../port/review.repo.port";

export class DeleteReviewUseCase {
  constructor(private repo: ReviewRepoPort) {}

  async execute(id: string) {
    return this.repo.delete(id);
  }
}
