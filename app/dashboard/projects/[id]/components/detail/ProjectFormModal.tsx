import React from "react";
import Modal from "@/app/components/ui/Modal";
import ProjectForm from "./ProjectForm";
import {useProjectForm} from "../../../hooks/useProjectForm";

export default function ProjectFormModal() {
  const projectForm = useProjectForm();

  return (
    <Modal
      open={projectForm.open}
      onClose={projectForm.close}
      title={
        projectForm.mode === "create" ? "Crear proyecto" : "Editar proyecto"
      }>
      <ProjectForm
        form={projectForm.form}
        submit={projectForm.submit}
        mode={projectForm.mode}
      />
    </Modal>
  );
}
