export const roleOptions = ["admin", "administrator", "user"] as const;

export const roleFilterOptions = ["All", ...roleOptions] as const;

export type UserRow = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: Date;
};
