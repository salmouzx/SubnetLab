"use client"

import * as React from "react"
import Link from "next/link"
import {
  Network,
  Home,
  BookOpen,
  Calculator,
  PencilLine,
  Award,
  Binary,
  Layers,
  GraduationCap,
  Info,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const subnetLabData = {
  user: {
    name: "Pengguna SubnetLab",
    email: "user@subnetlab.dev",
    avatar: "",
  },
  navMain: [
    {
      title: "Beranda",
      url: "/",
      icon: <Home className="size-4" />,
    },
    {
      title: "Materi Kelas C",
      url: "/materi",
      icon: <BookOpen className="size-4" />,
    },
    {
      title: "Simulator IPv4",
      url: "/simulator",
      icon: <Calculator className="size-4" />,
    },
    {
      title: "Latihan Soal",
      url: "/latihan",
      icon: <PencilLine className="size-4" />,
    },
    {
      title: "Kuis Evaluasi",
      url: "/kuis",
      icon: <Award className="size-4" />,
    },
  ],
  documents: [
    {
      name: "12 Topik Subnetting",
      url: "/materi",
      icon: <Layers className="size-4" />,
    },
    {
      name: "Visualisasi 32-bit",
      url: "/simulator",
      icon: <Binary className="size-4" />,
    },
    {
      name: "Panduan IPv4",
      url: "/materi",
      icon: <Layers className="size-4" />,
    },
  ],
  navSecondary: [
    {
      title: "Tentang Platform",
      url: "/",
      icon: <Info className="size-4" />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[slot=sidebar-menu-button]:p-2"
              render={<Link href="/" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#113057] text-white shadow-xs">
                <Network className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">SubnetLab IPv4</span>
                <span className="truncate text-xs text-muted-foreground">Networking Platform</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={subnetLabData.navMain} />
        <NavDocuments items={subnetLabData.documents} />
        <NavSecondary items={subnetLabData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={subnetLabData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
