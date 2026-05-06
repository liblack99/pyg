"use client";

import Modal from "@/app/components/ui/Modal";
import {useInstallationDialogStore} from "../store/useInstallationDialog.store";
import {ProjectInstallationForm} from "./ProjectInstallationForm";

export function ProjectInstallationEditDialog() {
  const {open, installation, close} = useInstallationDialogStore();

  if (!open || !installation) return null;

  return (
    <Modal open={open} onClose={close} title="Editar instalación">
      <div className="max-h-[85vh] overflow-y-auto p-1">
        <ProjectInstallationForm installation={installation} />
      </div>
    </Modal>
  );
}
