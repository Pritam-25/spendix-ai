"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function NavbarAuth() {
  return (
    <>
      <SignedOut>
        <SignInButton forceRedirectUrl="/dashboard">
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
