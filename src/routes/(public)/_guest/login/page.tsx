import { createFileRoute } from "@tanstack/react-router";

import { LoginForm } from "./-components/login-form";

const LoginPage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="w-96 rounded-2xl p-5 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/(public)/_guest/login/")({ component: LoginPage });
