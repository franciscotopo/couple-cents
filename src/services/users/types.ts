import type { z } from "zod";

import type {
  getCreateUserSchema,
  getUpdateUserSchema,
  getUserSchema,
  usersFilterSchema,
} from "./schemas";

export type User = z.infer<ReturnType<typeof getUserSchema>>;

export type UsersFilter = z.infer<typeof usersFilterSchema>;

export type CreateUser = z.infer<ReturnType<typeof getCreateUserSchema>>;

export type UpdateUser = z.infer<ReturnType<typeof getUpdateUserSchema>>;
