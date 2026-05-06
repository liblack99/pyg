import {ReviewRepoPort} from "../port/review.repo.port";

export class GetReviewByIdUseCase {
  constructor(private repo: ReviewRepoPort) {}

  async execute(id: string) {
    return this.repo.findById(id);
  }
}
