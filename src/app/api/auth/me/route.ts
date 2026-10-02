import { NextResponse } from "next/server";
import { authorizeApiRequest } from "@/lib/auth";

export async function GET() {
  const access = await authorizeApiRequest();
  if (access.response) return access.response;

  return NextResponse.json({
    id: access.user.id,
    name: access.user.name,
    role: access.user.role,
  });
}