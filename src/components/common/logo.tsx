import Image from "next/image"
import { Config } from "@/config"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src={Config.logo}
      alt="Logo"
      width={819}
      height={819}
      className={cn("w-10 md:w-12", className)}
    />
  )
}
