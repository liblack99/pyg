import {ReviewRepoPort} from "../port/review.repo.port";
import {ListReviewsUseCase} from "./list-reviews.usecase";
import {CreateReviewUseCase} from "./create-review.usecase";
import {UpdateReviewUseCase} from "./update-review.usecase";
import {DeleteReviewUseCase} from "./delete-review.usecase";
import {GetReviewByIdUseCase} from "./get-review-by-id.usecase";

export function makeReviewUseCases(ReviewRepo: ReviewRepoPort) {
  return {
    listReviews: new ListReviewsUseCase(ReviewRepo),
    getReviewById: new GetReviewByIdUseCase(ReviewRepo),
    createReview: new CreateReviewUseCase(ReviewRepo),
    updateReview: new UpdateReviewUseCase(ReviewRepo),
    deleteReview: new DeleteReviewUseCase(ReviewRepo),
  };
}
