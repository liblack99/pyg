// app/dashboard/users/hooks/useUserDelete.ts
"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {apiDelete} from "@/app/lib/api.client";

export function useProductDelete() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const remove = async (userId: string) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este producto?");
    if (!ok) return;

    try {
      setLoading(true);
      await apiDelete(`/api/products/${userId}`);
      router.refresh(); // 👈 SSR refresh
    } finally {
      setLoading(false);
    }
  };

  return {remove, loading};
}
