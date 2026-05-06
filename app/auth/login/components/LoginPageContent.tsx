"use client";

import {LoginForm} from "./LoginForm";
import {useLoginForm} from "../hooks/useLoginForm";

export default function LoginPageContent() {
  const {form, onSubmit, submitError} = useLoginForm();

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <LoginForm form={form} onSubmit={onSubmit} error={submitError} />
    </main>
  );
}
