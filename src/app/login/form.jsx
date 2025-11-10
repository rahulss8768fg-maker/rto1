"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { signInWithEmailAndPassword } from "firebase/auth"; // For Firebase v9
import { auth } from "../lib/firebase";


export function UserAuthForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const router = useRouter();

  // Hardcoded email and password (replace with actual credentials)
  const hardcodedEmail = "fix@cocu.com";
  const hardcodedPassword = "cocu";

  function generateAuthString(email, password) {
    // Example: Concatenate email and password
    return `${email}:${password}`;
  }

  function checkCredentials(email, password) {
    // Example: Check if email and password match the hardcoded credentials
    return email === hardcodedEmail && password === hardcodedPassword;
  }

  // function handleLogin(e) {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   // Check if email and password match hardcoded credentials
  //   if (checkCredentials(email, password)) {
  //     // Generate auth string
  //     const authString = generateAuthString(email, password);

  //     // Example: Save auth string to localStorage
  //     localStorage.setItem("authString", authString);

  //     // Simulate login success
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       router.push(`/admin`, {
  //         scroll: false,
  //       });
  //       toast("Login successful!", {
  //         type: "success",
  //       });
  //     }, 2000);
  //   } else {
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       toast("Invalid email or password. Please try again.", {
  //         type: "error",
  //       });
  //     }, 1000);
  //   }
  // }

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login...");
      await signInWithEmailAndPassword(auth, email, password); // Firebase v9 syntax


      console.log("Login successful, redirecting...");
      router.push(`/admin`, { scroll: false });

      toast("Login successful!", {
        type: "success",
      });
    } catch (error) {
      console.error("Error during login:", error);
      toast("Invalid email or password. Please try again.", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6")}>
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          {/* Email field with floating label effect */}
          <div className="relative group">
            <Label 
              htmlFor="email"
              className="absolute left-3 top-3 text-white/60 text-sm transition-all duration-200 
                         group-focus-within:text-purple-300 group-focus-within:-translate-y-7 
                         group-focus-within:scale-75 group-focus-within:bg-transparent 
                         group-focus-within:px-1 z-10"
            >
              Email Address
            </Label>
            <Input
              id="email"
              placeholder=" "
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="bg-white/5 border-white/20 text-white placeholder-transparent 
                         focus:border-purple-400 focus:bg-white/10 transition-all duration-300
                         h-12 rounded-xl backdrop-blur-sm hover:bg-white/10"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 
                           opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Password field with floating label effect */}
          <div className="relative group">
            <Label 
              htmlFor="password"
              className="absolute left-3 top-3 text-white/60 text-sm transition-all duration-200 
                         group-focus-within:text-purple-300 group-focus-within:-translate-y-7 
                         group-focus-within:scale-75 group-focus-within:bg-transparent 
                         group-focus-within:px-1 z-10"
            >
              Password
            </Label>
            <Input
              id="password"
              placeholder=" "
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-white/5 border-white/20 text-white placeholder-transparent 
                         focus:border-purple-400 focus:bg-white/10 transition-all duration-300
                         h-12 rounded-xl backdrop-blur-sm hover:bg-white/10"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 
                           opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Enhanced submit button */}
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 
                       hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg 
                       hover:shadow-purple-500/25 transition-all duration-300 transform 
                       hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 
                       disabled:cursor-not-allowed disabled:transform-none
                       border-0 relative overflow-hidden group"
          >
            {/* Button gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button content */}
            <div className="relative z-10 flex items-center justify-center">
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <svg 
                    className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </>
              )}
            </div>
          </Button>

          {/* Forgot password link */}
          <div className="text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-white/60 hover:text-purple-300 transition-colors duration-200"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
