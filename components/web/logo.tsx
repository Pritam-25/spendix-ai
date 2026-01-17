"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

const Logo = () => {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div className="relative h-6 w-20 sm:h-7 sm:w-24 md:h-8 md:w-28 lg:w-36">
      <Image
        src={isDark ? "/asset3.svg" : "/asset3-light.svg"}
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
