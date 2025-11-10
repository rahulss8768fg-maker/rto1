"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DevicesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Redirecting...</h2>
        <p className="text-muted-foreground">Device management is now on the main dashboard</p>
      </div>
    </div>
  );
}