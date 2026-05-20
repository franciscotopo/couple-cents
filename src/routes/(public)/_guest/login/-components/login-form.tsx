import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trans, useTranslation } from "@/i18n";
import { useLogin } from "@/services/auth/actions";
import { getLoginPayloadSchema } from "@/services/auth/schemas";
import type { LoginPayload } from "@/services/auth/types";
import { setAuthToken } from "@/stores/use-auth-store";
import { handleAxiosFieldErrors } from "@/utils";

export const LoginForm = () => {
  const { t } = useTranslation();

  const loginMutation = useLogin();

  const router = useRouter();
  const search = useSearch({ from: "/(public)/_guest/login/" });
  const navigate = useNavigate();

  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(getLoginPayloadSchema()),
  });

  const onSubmit: SubmitHandler<LoginPayload> = (data) => {
    loginMutation.mutate(data, {
      onSuccess: async ({ data: { authToken } }) => {
        toast.success(t("login.success"));
        setAuthToken(authToken);
        await router.invalidate();
        await navigate({ to: search.redirect || "/" });
      },
      onError: (error) => {
        handleAxiosFieldErrors<LoginPayload>(error, setError, t("login.error"));
      },
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("form.email")}</Label>

        <Input {...register("email")} />

        <ErrorMessage errorMessage={errors?.email?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("form.password")}</Label>

          <Link
            className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:opacity-80"
            to="/"
          >
            {t("login.forgotYourPassword")}
          </Link>
        </div>

        <PasswordInput {...register("password")} />

        <ErrorMessage errorMessage={errors?.password?.message} />
      </div>

      <Button className="w-full" type="submit">
        {t("login.login")}
      </Button>

      <p className="text-center text-sm">
        <Trans
          components={{
            Link: <Link className="underline underline-offset-4 hover:opacity-80" to="/register" />,
          }}
          i18nKey="login.noAccount"
        />
      </p>
    </form>
  );
};
