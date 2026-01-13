"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect } from "react";

const Logo = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-6 w-20 sm:h-7 sm:w-24 md:h-8 md:w-28" />; // Responsive placeholder
  }

  return (
    <div className="relative h-6 w-20 sm:h-7 sm:w-24 md:h-8 md:w-28 lg:w-36">
      <Image
        src={theme === "dark" ? "/asset3.svg" : "/asset3-light.svg"}
        alt="Spendix Logo"
        fill
        className="object-contain"
        priority
        sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
      />
    </div>
  );
};

export default Logo;
