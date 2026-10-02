import "server-only";

import { cache } from "react";
import { forbidden, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const resolveIdentity = cache(async () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;

  const account = await prisma.user.findUnique({
    where: { authUserId: data.user.id },
    select: {
      id: true,
      authUserId: true,
      email: true,
      name: true,
      role: true,
      active: true,
      permissions: { select: { permission: true } },
    },
  });

  return { account };
});

export async function requireAuthenticatedUser() {
  const identity = await resolveIdentity();
  if (!identity) redirect("/login");
  if (!identity.account || !identity.account.active) forbidden();
  return identity.account;
}

export async function requireRole(roles: readonly UserRole[]) {
  const user = await requireAuthenticatedUser();
  if (!roles.includes(user.role)) forbidden();
  return user;
}

export async function requirePermission(permission: string) {
  const user = await requireAuthenticatedUser();
  if (user.role !== "ADMIN" && !user.permissions.some((item) => item.permission === permission)) {
    forbidden();
  }
  return user;
}

export async function authorizeApiRequest(roles?: readonly UserRole[], permission?: string) {
  const identity = await resolveIdentity();

  if (!identity) {
    return { user: null, response: NextResponse.json({ error: "Authentication required." }, { status: 401 }) };
  }

  const user = identity.account;
  if (!user || !user.active) {
    return { user: null, response: NextResponse.json({ error: "Access denied." }, { status: 403 }) };
  }

  if (roles && !roles.includes(user.role)) {
    return { user: null, response: NextResponse.json({ error: "Access denied." }, { status: 403 }) };
  }

  if (permission && user.role !== "ADMIN" && !user.permissions.some((item) => item.permission === permission)) {
    return { user: null, response: NextResponse.json({ error: "Access denied." }, { status: 403 }) };
  }

  return { user, response: null };
}