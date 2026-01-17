import Link from "next/link";
import Logo from "../logo";
import NavbarAuth from "./navbarAuth";
import { ModeToggle } from "../mode-toggle";

export default function Navbar() {
  return (
    <div className="fixed top-0 h-18 w-full bg-white/5 backdrop-blur-lg z-50 border-b border-border shadow-lg">
      <nav className="py-4 container mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex gap-6">
          <NavbarAuth />
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
}
