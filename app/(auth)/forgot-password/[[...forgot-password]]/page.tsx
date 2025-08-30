"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bot } from "lucide-react";
import Header from "@/components/Header";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      setError("");
      setMessage("");
      await handleFindUser(email);
      const { error } = await supabaseBrowser.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`, // make sure this page exists
        }
      );

      if (error) {
        setError(error.message);
      } else {
        setMessage("Password reset link has been sent to your email.");
      }
      setLoading(false);
    } catch (error: any) {
      console.log("Error resetting password:", error);
      setError(
        error?.message ||
          "An unexpected error occurred. Please try again later."
      );
      setLoading(false);
    }
  };

  const handleFindUser = async (email: string) => {
    const { data, error } = await supabaseBrowser
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    console.log("User data:", data);
    if (error || !data) {
      console.log("Error fetching user:", error);
      throw new Error("User not found");
    }
    return data;
  };

  return (
    <div className="flex gap-10 justify-center items-center min-h-screen ">
   
        <div className="hidden w-[35%] lg:block md:block relative">
      <Image
        src="/login.png"
        alt="forgot password"
           width={450}
          height={800} // ← Increased height here
          className="h-[550px] w-[100%] object-cover rounded-md shadow-md"
          priority
      />
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-auto px-4 py-8 lg:p-0">
        
        <div className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Forgot Your Password?
          </h2>
          <p className="text-gray-600  text-center">
            Enter your email and we'll send you a link to reset your password.
          </p>

          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#5E189D] mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#5E189D] text-white text-sm font-medium rounded-md hover:bg-[#5E189D]/90 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => router.push("/dealer-login")}
              className="cursor-pointer text-[#5E189D] hover:text-[#5E189D]/90 text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
