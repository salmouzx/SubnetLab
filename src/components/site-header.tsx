"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Network,
  BookOpen,
  Calculator,
  PencilLine,
  Award,
  Menu,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Beranda", icon: Network },
  { href: "/materi", label: "Materi", icon: BookOpen },
  { href: "/simulator", label: "Simulator", icon: Calculator },
  { href: "/latihan", label: "Latihan", icon: PencilLine },
  { href: "/kuis", label: "Kuis", icon: Award },
]

export function SiteHeader({
  showSidebarTrigger = false,
}: {
  showSidebarTrigger?: boolean
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className={cn(
          "flex w-full items-center justify-between px-4 sm:px-6 lg:px-8",
          !showSidebarTrigger && "max-w-7xl mx-auto"
        )}
      >
        {/* Left: Optional SidebarTrigger (only in dashboard) + Brand */}
        <div className="flex items-center gap-2">
          {showSidebarTrigger && (
            <>
              <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
              <Separator orientation="vertical" className="mx-1 h-4" />
            </>
          )}
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-foreground group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs transition-transform group-hover:scale-105">
              <Network className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-foreground">
                SubnetLab <span className="text-emerald-600 font-mono font-semibold">IPv4</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Desktop Nav Links (Pill Style) + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-1 bg-muted/60 p-1 rounded-xl border shadow-xs">
            {navLinks.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    isActive
                      ? "bg-emerald-600 text-white font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {!showSidebarTrigger && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="md:hidden h-8 w-8"
                    aria-label="Buka menu navigasi"
                  />
                }
              >
                <Menu className="h-4 w-4" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetHeader className="border-b px-4 py-4">
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white">
                      <Network className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold">
                      SubnetLab <span className="text-emerald-600 font-mono">IPv4</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 p-4">
                  {navLinks.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-emerald-600 text-white font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
