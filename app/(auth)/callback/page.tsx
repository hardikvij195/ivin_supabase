"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../../store/hooks";
import { setUser } from "../../../store/reducers/userSlice";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";
import { onAuthenticatedUser } from "../../actions/auth";
import { Loader } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      if (!session) {
        router.replace("/dealer-login");
        return;
      }

      const result = await onAuthenticatedUser(session.access_token);

      if (result.status === 200 && result.user) {
        const userId = result.user.id;
        const email = result.user.email ?? "";
        const fullName = result.user.user_metadata.full_name ?? "";
        const avatar_url = result.user.user_metadata.avatar_url ?? null;
        console.log(fullName);
        console.log(avatar_url);
        const phone = result.user.phone ?? "";
        const role = "dealer";
        const status = "active";

        // 🔹 check profiles table instead of users
        const { data: existingProfile } = await supabaseBrowser
          .from("profiles")
          .select("id")
          .eq("id", userId)
          .maybeSingle();

        if (!existingProfile) {
          const { error: insertError } = await supabaseBrowser
            .from("profiles")
            .insert([
              {
                id: userId,
                email,
                full_name: fullName,
                phone,
                role,
                status,
                avatar_url: avatar_url,
              },
            ]);

          if (insertError) {
            console.error("Error inserting profile:", insertError);
          }
        } else {
          const { error: updateError } = await supabaseBrowser
            .from("profiles")
            .update({
              status: "active",
              full_name: fullName, 
              avatar_url: avatar_url,
            })
            .eq("id", userId);

          if (updateError) {
            console.error("Error updating profile:", updateError);
          }
        }

        // 🔹 fetch user subscriptions
        const { data: subscriptions } = await supabaseBrowser
          .from("user_subscription")
          .select("*")
          .eq("user_id", userId);

        dispatch(setUser({ ...result.user, subscriptionPlan: subscriptions }));
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }

      setLoading(false);
    })();
  }, [router, dispatch]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className="h-10 w-10 animate-spin text-purple-600" />
        <h3 className="text-xl font-bold">Authenticating...</h3>
        <p>Please wait while we verify your credentials</p>
      </div>
    </div>
  );
}
