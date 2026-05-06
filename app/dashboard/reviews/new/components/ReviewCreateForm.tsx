"use client";

import ReviewForm from "../../components/ReviewForm";
import {useReviewCreateForm} from "../hooks/useReviewCreateForm";

export default function ReviewCreateForm() {
  const {form, submit, serverError} = useReviewCreateForm();
  return (
    <ReviewForm
      form={form}
      onSubmit={submit}
      serverError={serverError}
      submitLabel="Crear"
    />
  );
}
