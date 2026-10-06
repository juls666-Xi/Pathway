"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { ROLE_ROUTES } from "@/lib/role-routes";

export type LoginState = { message: string } | undefined;

function authCallbackUrl(next: string, flow?: "signup" | "recovery") {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) throw new Error("NEXT_PUBLIC_SITE_URL is missing.");

  const callback = new URL("/auth/callback", siteUrl);
  callback.searchParams.set("next", next);
  if (flow) callback.searchParams.set("flow", flow);
  return callback.toString();
}

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
      where: { authUserId: data.user.id },
      select: { active: true, role: true },
    });

    if (!account?.active) {
      await supabase.auth.signOut();
      return { message: "This account is not enabled for the school portal. Contact the school office." };
    }

    destination = `/${ROLE_ROUTES[account.role].path}`;
  } catch {
    return { message: "Sign-in is temporarily unavailable. Please try again later." };
  }

  redirect(destination ?? "/");
}

export async function createAccount(_state: LoginState, formData: FormData): Promise<LoginState> {
  const nameValue = formData.get("name");
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const confirmationValue = formData.get("password_confirmation");
  const name = typeof nameValue === "string" ? nameValue.trim() : "";
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

  if (name.length < 2 || name.length > 100 || !email.includes("@") || email.length > 254) {
    return { message: "Enter your name and a valid school email." };
  }
  if (typeof passwordValue !== "string" || passwordValue.length < 10 || passwordValue.length > 128) {
    return { message: "Choose a password between 10 and 128 characters." };
  }
  if (passwordValue !== confirmationValue) return { message: "The passwords do not match." };

  try {
    const existingAccount = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existingAccount) return { message: "We could not create that account. Check your details or contact the school office." };

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: passwordValue,
      options: {
        data: { display_name: name },
        emailRedirectTo: authCallbackUrl("/login/create-account?pending=1", "signup"),
      },
    });

    if (error || !data.user || data.user.identities?.length === 0) {
      return { message: "We could not create that account. Check your details or contact the school office." };
    }

    await prisma.user.create({
      data: {
        authUserId: data.user.id,
        email,
        name,
        role: "STUDENT",
        active: false,
      },
    });

    await supabase.auth.signOut();
    return { message: "Check your email to confirm your account. Portal access will be available after school approval." };
  } catch {
    return { message: "Account registration is temporarily unavailable. Please contact the school office." };
  }
}

export async function requestPasswordReset(_state: LoginState, formData: FormData): Promise<LoginState> {
  const emailValue = formData.get("email");
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  if (!email.includes("@") || email.length > 254) return { message: "Enter a valid email address." };

  try {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: authCallbackUrl("/login/update-password", "recovery"),
    });
  } catch {
    return { message: "Password recovery is temporarily unavailable. Please try again later." };
  }

  return { message: "If an account matches that email, a password reset link will be sent." };
}

export async function updatePassword(_state: LoginState, formData: FormData): Promise<LoginState> {
  const passwordValue = formData.get("password");
  const confirmationValue = formData.get("password_confirmation");
  if (typeof passwordValue !== "string" || passwordValue.length < 10 || passwordValue.length > 128) {
    return { message: "Choose a password between 10 and 128 characters." };
  }
  if (passwordValue !== confirmationValue) return { message: "The passwords do not match." };

  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return { message: "This reset link is invalid or has expired. Request a new one." };

    const { error } = await supabase.auth.updateUser({ password: passwordValue });
    if (error) return { message: "The password could not be updated. Choose a different password or request a new link." };

    await supabase.auth.signOut();
    return { message: "Your password has been updated. You can now sign in." };
  } catch {
    return { message: "Password update is temporarily unavailable. Please try again later." };
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}