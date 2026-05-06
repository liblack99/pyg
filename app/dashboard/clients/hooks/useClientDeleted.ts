"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {apiDelete} from "@/app/lib/api.client";

export function useClientDelete() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const remove = async (userId: string) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este cliente?");

    if (!ok) return;

    try {
      setLoading(true);
      await apiDelete(`/api/clients/${userId}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return {remove, loading};
}
