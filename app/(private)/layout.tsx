import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PrivateLayout({
  children
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    return <SupabaseSetupNotice />;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AppShell userEmail={user.email}>{children}</AppShell>;
}
