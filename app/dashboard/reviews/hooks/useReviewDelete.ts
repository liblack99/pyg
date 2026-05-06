// app/dashboard/users/hooks/useUserDelete.ts
"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {apiDelete} from "@/app/lib/api.client";

export function useReviewDelete() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const remove = async (id: string) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este reseña?");
    if (!ok) return;

    try {
      setLoading(true);
      await apiDelete(`/api/reviews/${id}`);
      router.refresh(); // 👈 SSR refresh
    } finally {
      setLoading(false);
    }
  };

  return {remove, loading};
}
