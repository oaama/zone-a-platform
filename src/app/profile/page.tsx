import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileView from "@/components/ProfileView";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, created_at, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <ProfileView
      name={profile?.full_name || ""}
      email={user.email || ""}
      role={profile?.role || "student"}
      createdAt={profile?.created_at || ""}
      avatarUrl={profile?.avatar_url || ""}
    />
  );
}
