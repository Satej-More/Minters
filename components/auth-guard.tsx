"use client";

import { useLayoutEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname === "/") {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user && pathname !== "/auth") {
        router.replace("/auth");
      } else if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() && pathname !== "/auth") {
          router.replace("/auth");
        } else if (userDoc.exists() && !userDoc.data().walletAddress && pathname !== "/auth") {
          router.replace("/auth");
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return <>{children}</>;
}
