"use client";

import {ReactNode, useCallback, useState} from "react";
import AsideMenu from "../components/navigation/AsideMenu";
import Header from "../components/navigation/Header";
import {UniversalSearchClientModal} from "@/app/components/navigation/UniversalSearchClientModal";
import {UniversalSearchQuotationModal} from "@/app/components/navigation/UniversalSearchQuotationModal";
import {useUniversalSearch} from "@/app/dashboard/hooks/useUniversalSearch";

export default function DashboardLayout({children}: {children: ReactNode}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const {isClientOpen, isQuotationOpen, selectedId, closeModal} =
    useUniversalSearch();

  return (
    <div className="flex h-screen overflow-hidden">
      <AsideMenu
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
      />

      {mobileSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeMobileSidebar}
          aria-label="Cerrar menú lateral"
        />
      ) : null}

      <main className="relative flex-1 overflow-y-auto bg-[#F8FAFC]">
        <Header onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)} />
        <div className="space-y-6 p-2 md:p-4">{children}</div>
      </main>

      <UniversalSearchClientModal
        open={isClientOpen}
        clientId={isClientOpen ? selectedId : null}
        onClose={closeModal}
      />

      <UniversalSearchQuotationModal
        open={isQuotationOpen}
        quotationId={isQuotationOpen ? selectedId : null}
        onClose={closeModal}
      />
    </div>
  );
}
