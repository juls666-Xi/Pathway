import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function Forbidden() {
  return (
    <main className="access-denied">
      <ShieldX size={32} aria-hidden="true" />
      <p className="eyebrow">HTTP 403</p>
      <h1>Access denied</h1>
      <p>Your account is not authorized to view this page.</p>
      <Link href="/">Return to the public homepage</Link>
    </main>
  );
}