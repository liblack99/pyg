"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {apiPut} from "@/app/lib/api.client";
import {ApiError} from "@/app/lib/http/api-error";
import type {
  ProjectInstallationDetail,
  UpdateProjectInstallationInput,
} from "@/app/core/projects/installation/dto";
import {updateProjectInstallationSchema} from "@/app/core/projects/installation/schema";
import {buildInstallationFormDefaults} from "../mappers/project-installation.form";
import {useProjectActivityStore} from "../../store/useProjectActivityStore";

type Params = {
  installation: ProjectInstallationDetail;
};

export function useProjectInstallationForm({installation}: Params) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const notifyChanged = useProjectActivityStore((state) => state.notifyChanged);
  const form = useForm<UpdateProjectInstallationInput>({
    resolver: zodResolver(updateProjectInstallationSchema),
    defaultValues: buildInstallationFormDefaults(installation),
    mode: "onSubmit",
  });

  useEffect(() => {
    form.reset(buildInstallationFormDefaults(installation));
  }, [installation, form]);

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await apiPut(
        `/api/projects/${installation.projectId}/installation`,
        values,
      );
      router.refresh();
      notifyChanged(installation.projectId);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setSubmitError(err.message || "No se pudo guardar la instalación.");
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
