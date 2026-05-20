import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStoreState = {
  token: string | null;
};

type AuthStoreActions = {
  setToken: (token: string) => void;
  clearToken: () => void;
};

type AuthStore = AuthStoreState & AuthStoreActions;

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => {
      return {
        token: null,

        setToken: (token: string) => {
          return set(() => {
            return { token };
          });
        },
        clearToken: () => {
          return set(() => {
            return { token: null };
          });
        },
      };
    },
    {
      name: "auth-storage",
      partialize: (state) => {
        return { token: state.token };
      },
    },
  ),
);

export const getAuthStoreState = () => {
  return useAuthStore.getState();
};

export const useAuthToken = () => {
  return useAuthStore((s) => {
    return s.token;
  });
};
export const setAuthToken = (token: string) => {
  return useAuthStore.getState().setToken(token);
};

export const clearAuthToken = () => {
  return useAuthStore.getState().clearToken();
};
