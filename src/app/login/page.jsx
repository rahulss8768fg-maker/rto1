import Image from "next/image";
import Link from "next/link";
import { UserAuthForm } from "./form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 z-10">
        {/* Left side with cool branding */}
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex animate-slideInLeft">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          
          {/* Logo section with cool animation */}
          <div className="relative z-20 flex items-center text-xl font-bold animate-fadeInUp">
            <div className="mr-3 p-2 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl shadow-lg animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-white"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Mr Professor
            </span>
          </div>
          
          {/* Cool animated content */}
          <div className="relative z-20 mt-auto space-y-6">
            <div className="space-y-4 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <h2 className="text-3xl font-bold leading-tight">
                Welcome to the
                <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Future of Learning
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-pulse"></div>
            </div>
            
            <blockquote className="space-y-4 p-6 border-l-4 border-purple-400/50 bg-white/5 backdrop-blur-sm rounded-r-lg 
                                   hover:bg-white/10 transition-all duration-300 animate-fadeInUp" 
                        style={{animationDelay: '0.4s'}}>
              <p className="text-lg leading-relaxed opacity-90">
                "Education is the most powerful weapon which you can use to change the world. 
                Join us in shaping tomorrow's leaders."
              </p>
              <footer className="text-sm">
                <cite className="not-italic font-semibold text-purple-300">- Mr Professor</cite>
              </footer>
            </blockquote>
            
            {/* Stats or features */}
            <div className="grid grid-cols-3 gap-4 pt-6 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <div className="text-center hover:transform hover:scale-110 transition-all duration-300 cursor-pointer">
                <div className="text-2xl font-bold text-purple-300">1000+</div>
                <div className="text-xs opacity-75">Students</div>
              </div>
              <div className="text-center hover:transform hover:scale-110 transition-all duration-300 cursor-pointer">
                <div className="text-2xl font-bold text-blue-300">50+</div>
                <div className="text-xs opacity-75">Courses</div>
              </div>
              <div className="text-center hover:transform hover:scale-110 transition-all duration-300 cursor-pointer">
                <div className="text-2xl font-bold text-indigo-300">99%</div>
                <div className="text-xs opacity-75">Success</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side with enhanced form */}
        <div className="lg:p-8 relative z-20 animate-slideInRight">
          <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
            {/* Glass card container */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 
                           hover:bg-white/15 transition-all duration-500 animate-fadeInUp
                           hover:shadow-purple-500/20 hover:border-purple-400/30">
              <div className="flex flex-col space-y-6 text-center">
                <div className="space-y-2 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  <h1 className="text-3xl font-bold tracking-tight text-white">
                    Welcome Back
                  </h1>
                  <p className="text-sm text-white/70">
                    Enter your credentials to access your account
                  </p>
                </div>
                
                <div className="animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                  <UserAuthForm />
                </div>
                
                <div className="relative animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/50">Secure Login</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="px-8 text-center text-xs text-white/60 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-purple-300 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-purple-300 transition-colors"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
