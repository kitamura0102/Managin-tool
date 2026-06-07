import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!hasSupabaseEnv()) {
    return <SupabaseSetupNotice />;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <AuthForm />
    </main>
  );
}
