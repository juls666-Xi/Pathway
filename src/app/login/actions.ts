"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { ROLE_ROUTES } from "@/lib/role-routes";

export type LoginState = { message: string } | undefined;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  if (typeof emailValue !== "string" || typeof passwordValue !== "string" || !emailValue || !passwordValue) {
    return { message: "Enter your school email and password." };
  }

  let destination: string | undefined;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailValue.trim(),
      password: passwordValue,
    });

    if (error || !data.user) return { message: "Sign-in failed. Check your details or contact the school office." };

    const account = await prisma.user.findUnique({
      where: { email: data.user.email?.toLowerCase() },
      select: { authUserId: true, active: true, role: true },
    });

    if (!account?.active || account.authUserId !== data.user.id) {
      await supabase.auth.signOut();
      return { message: "This account is not enabled for the school portal. Contact the school office." };
    }

    destination = `/${ROLE_ROUTES[account.role].path}`;
  } catch {
    return { message: "Sign-in is temporarily unavailable. Please try again later." };
  }

  redirect(destination ?? "/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}