import { prisma } from "@/server/db";

import { Users } from "./_components/users";

export default async function Page() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return <Users users={users} />;
}
