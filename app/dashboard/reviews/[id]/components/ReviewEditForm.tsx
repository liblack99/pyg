"use client";
import React from "react";
import {useReviewEditForm} from "../hooks/useReviewEditForm";
import ReviewForm from "../../components/ReviewForm";

import type {UpdateReview} from "@/app/core/review/dto";

type Props = {
  reviewId: string;
  defaults: UpdateReview;
};

export default function ReviewEditForm({reviewId, defaults}: Props) {
  const {form, submit, serverError} = useReviewEditForm(reviewId, defaults);
  return (
    <ReviewForm
      form={form}
      onSubmit={submit}
      serverError={serverError}
      submitLabel="Guardar"
    />
  );
}
