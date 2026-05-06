import {Suspense} from "react";
import LoginPageContent from "./components/LoginPageContent";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50" />}>
      <LoginPageContent />
    </Suspense>
  );
}
