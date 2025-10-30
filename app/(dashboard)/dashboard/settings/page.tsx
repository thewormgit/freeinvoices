import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/components/profile-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ตั้งค่า</h1>
        <p className="text-muted-foreground">
          จัดการข้อมูลธุรกิจและบัญชีของคุณ
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลธุรกิจ</CardTitle>
            <CardDescription>
              กรอกข้อมูลธุรกิจของคุณเพื่อแสดงในใบเสร็จ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={profile} userEmail={user.email || ""} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>แพ็กเกจ</CardTitle>
            <CardDescription>
              แพ็กเกจปัจจุบันของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Free</p>
                  <p className="text-sm text-muted-foreground">
                    5 ใบเสร็จต่อเดือน
                  </p>
                </div>
                <div className="text-2xl font-bold">฿0/เดือน</div>
              </div>
              <p className="text-sm text-muted-foreground">
                อัพเกรดเป็น Pro เพื่อใบเสร็จไม่จำกัดและฟีเจอร์ AI
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>บัญชี</CardTitle>
            <CardDescription>
              ข้อมูลบัญชีของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">อีเมล</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">User ID</p>
                <p className="text-sm text-muted-foreground font-mono text-xs">
                  {user.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
