"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Eye, EyeOff, Loader } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabaseBrowser.auth.getUser();

      if (error) {
        
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("User already logged in:", data.user);
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);


 const handleSubmit = async () => {
  e.preventDefault();
  setError(""); 

  const { data, error } = await supabaseBrowser.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setError(error.message);
    return;
  }

  const user = data?.user;
  if (!user) {
    setError("Login failed. No user returned.");
    return;
  }

  await supabaseBrowser
    .from("users")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  const { data: profile, error: profileError } = await supabaseBrowser
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  } else if (profile) {

    localStorage.setItem("userRole", profile.role || "");
    localStorage.setItem("userFullName", profile.full_name || "");
    localStorage.setItem("avatarUrl",profile.avatar_url || "" );
  }

  router.push("/callback");
};


  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabaseBrowser.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });
      console.log("Google sign-in data:", data);

      if (error) {
        setError("Google sign-in failed.");
        console.error(error);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during Google login.");
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
       <Loader className="w-8 h-8 text-[#5E189D] animate-spin" />
      </div>
    );
  }

  return (
   
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 gap-10  lg:mx-20">
     

      <div className="hidden w-[40%] lg:block md:block relative">
        <Image
          src="/login.png"
          alt="signin Image"
          width={480}
          height={800}
          className="h-[550px] w-[100%] object-cover rounded-md shadow-md"
          priority
        />
       
      </div>

      {/* Right Form Section */}
      <div className="w-full max-w-md">
        
        <h1 className="text-2xl text-center font-bold mb-2">Login to Your Account</h1>
        <p className="text-gray-600 text-center text-[14px] mb-6">
        Enter your details to proceed further
        </p>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-[#5E189D]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5E189D]"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-[#5E189D]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5E189D]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-[#5E189D] border-gray-200 rounded"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#5E189D] hover:text-purple-700"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 rounded-3xl text-sm font-medium text-white bg-[#5E189D] hover:bg-purple-700"
          >
            Log in
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-200 shadow rounded-3xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Image src="/google.svg" alt="google" width={25} height={25} />
            Log in with Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/dealer-signup"
              className="font-medium text-[#5E189D] hover:text-purple-700"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>

  );
};

export default Signin;
