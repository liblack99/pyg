import React from "react";
import Modal from "@/app/components/ui/Modal";
import ProductionOrderForm from "../ProductionOrder/ProductionOrderForm";
import {useProductionOrderStore} from "../../store/productionOder.store";
import {useProductionOrder} from "../../hooks/useProductionOrder";

export default function ProjectProductionOrderModal() {
  const op = useProductionOrder();

  const openOp = useProductionOrderStore((s) => s.open);
  const closeOp = useProductionOrderStore((s) => s.close);
  return (
    <Modal open={openOp} onClose={closeOp}>
      <ProductionOrderForm
        submit={op.submit}
        form={op.form}
        isSaving={op.isSaving}
      />
    </Modal>
  );
}
