// app/dashboard/users/hooks/useUserDelete.ts
"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {apiDelete} from "@/app/lib/api.client";

export function useUserDelete() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const remove = async (userId: string) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (!ok) return;

    try {
      setLoading(true);
      await apiDelete(`/api/users/${userId}`);
      router.refresh(); // 👈 SSR refresh
    } finally {
      setLoading(false);
    }
  };

  return {remove, loading};
}
