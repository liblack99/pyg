// @/app/dashboard/components/UserHydrator.tsx
"use client";

import {useEffect} from "react";
import {useUserStore} from "../stores/useUserStore";
import type {Me} from "@/app/lib/auth.types";

export function UserHydrator({user}: {user: Me}) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
}
