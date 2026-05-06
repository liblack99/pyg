"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {apiPut} from "@/app/lib/api.client";
import {ApiError} from "@/app/lib/http/api-error";
import type {
  ProjectFabricationDetail,
  UpdateProjectFabricationInput,
} from "@/app/core/projects/fabrication/dto";
import {updateProjectFabricationSchema} from "@/app/core/projects/fabrication/schema";
import {buildFabricationFormDefaults} from "../mappers/project-fabrication.form";
import {useProjectActivityStore} from "../../store/useProjectActivityStore";

type Params = {
  fabrication: ProjectFabricationDetail;
};

export function useProjectFabricationForm({fabrication}: Params) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const notifyChanged = useProjectActivityStore((state) => state.notifyChanged);

  const form = useForm<UpdateProjectFabricationInput>({
    resolver: zodResolver(updateProjectFabricationSchema),
    defaultValues: buildFabricationFormDefaults(fabrication),
    mode: "onSubmit",
  });

  useEffect(() => {
    form.reset(buildFabricationFormDefaults(fabrication));
  }, [fabrication, form]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await apiPut(
        `/api/projects/${fabrication.projectId}/fabrication`,
        values,
      );

      router.refresh();
      notifyChanged(fabrication.projectId);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setSubmitError(err.message || "No se pudo guardar la fabricación.");
      } else if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Ocurrió un error inesperado.");
      }
    }
  });

  return {
    form,
    onSubmit,
    submitError,
    isSubmitting,
  };
}
