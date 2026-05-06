import {
  SearchAutocomplete,
  type CursorPage,
} from "@/app/components/search/SearchAutocomplete";
import {apiGet} from "../../../lib/api.client";
import type {Review} from "@/app/core/review/dto";
import {UseFormSetValue, UseFormWatch} from "react-hook-form";
import type {QuotationFormData} from "../../../core/quotations/schemas/quotation.schema";

type ClientListResponse = CursorPage<Review>;

type Props = {
  watch: UseFormWatch<QuotationFormData>;
  setValue: UseFormSetValue<QuotationFormData>;
};

export default function FinalConditions({watch, setValue}: Props) {
  const searchReviews = async (term: string) => {
    const url = `/api/reviews?search=${encodeURIComponent(term)}&limit=10`;
    const res = await apiGet<ClientListResponse>(url);
    return res;
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-4 border-l-4 border-blue-700 pl-3">
        Condiciones finales
      </h3>

      <SearchAutocomplete
        minChars={2}
        searchFn={searchReviews}
        debounceMs={250}
        label="Reseña"
        getKey={(r) => r.id}
        onSelect={(review) => {
          setValue("conditions.reviews", review.title, {
            shouldValidate: true,
          });
          setValue("conditions.reviewsDetails", review.details);
        }}
        renderItem={(review) => (
          <div className="px-4 py-3 hover:bg-blue-50 transition">
            <p className="font-medium text-slate-900">{review.title}</p>
            <p className="text-xs text-slate-500">{review.details}</p>
          </div>
        )}
      />
      {watch("conditions.reviews") && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="font-semibold text-blue-900">
            {watch("conditions.reviews")}
          </p>
          <p className="text-sm text-slate-600">
            {watch("conditions.reviewsDetails")}
          </p>
        </div>
      )}
    </div>
  );
}
