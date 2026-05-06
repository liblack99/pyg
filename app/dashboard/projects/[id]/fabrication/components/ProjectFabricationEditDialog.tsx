"use client";

import Modal from "@/app/components/ui/Modal";
import {useFabricationDialogStore} from "../store/useFabricationDialog.store";
import {ProjectFabricationForm} from "./ProjectFabricationForm";

export function ProjectFabricationEditDialog() {
  const {open, fabrication, close} = useFabricationDialogStore();

  if (!open || !fabrication) return null;

  return (
    <Modal open={open} onClose={close} title="Editar fabricación">
      <div className="max-h-[85vh] overflow-y-auto p-1">
        <ProjectFabricationForm fabrication={fabrication} />
      </div>
    </Modal>
  );
}
