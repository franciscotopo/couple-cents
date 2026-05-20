import { useMutation } from "@tanstack/react-query";

import type { UseMutationProps } from "@/services/types";
import { mutations } from "./factories";

export const useLogin = (props?: UseMutationProps<typeof mutations.login>) => {
  return useMutation({
    mutationFn: mutations.login,
    ...props,
  });
};
