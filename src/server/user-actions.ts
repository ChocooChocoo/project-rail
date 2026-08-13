"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { prisma } from "@/server/db";

const userInputSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }),
  username: z.string().trim().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().trim().email({ message: "Please enter a valid email address." }),
  role: z.string().trim().min(1, { message: "Role is required." }),
});

export type UserInput = z.infer<typeof userInputSchema>;

export type ActionResult = { ok: true } | { error: string };

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
    return "A user with that username or email already exists.";
  }

  return "Something went wrong. Please try again.";
}

export async function createUser(input: UserInput): Promise<ActionResult> {
  const parsed = userInputSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await prisma.user.create({ data: parsed.data });
    revalidatePath("/users");
    return { ok: true };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateUser(id: string, input: UserInput): Promise<ActionResult> {
  const parsed = userInputSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await prisma.user.update({ where: { id }, data: parsed.data });
    revalidatePath("/users");
    return { ok: true };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/users");
    return { ok: true };
  } catch {
    return { error: "Could not delete this user." };
  }
}
