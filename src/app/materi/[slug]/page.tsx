import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Network } from "lucide-react"

import { MATERIALS_DATA, getMaterialBySlug } from "@/data/materials-data"
import { SiteHeader } from "@/components/site-header"
import { MaterialReader } from "@/components/materi/material-reader"

interface MateriDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return MATERIALS_DATA.map((topic) => ({
    slug: topic.slug,
  }))
}

export async function generateMetadata({
  params,
}: MateriDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const topic = getMaterialBySlug(slug)

  if (!topic) {
    return {
      title: "Materi Tidak Ditemukan | SubnetLab IPv4",
    }
  }

  return {
    title: `Topik ${topic.order}: ${topic.title} | SubnetLab IPv4`,
    description: topic.shortDescription,
  }
}

async function MaterialContent({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const topic = getMaterialBySlug(slug)

  if (!topic) {
    notFound()
  }

  return <MaterialReader topic={topic} />
}

export default function MateriDetailPage({ params }: MateriDetailPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <React.Suspense
          fallback={
            <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
              Memuat Materi SubnetLab IPv4...
            </div>
          }
        >
          <MaterialContent params={params} />
        </React.Suspense>
      </main>

      <footer className="mt-auto border-t bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-[#113057]" />
            <span className="font-semibold text-foreground">SubnetLab IPv4</span>
          </div>
          <p>Platform Belajar & Simulasi Subnetting IPv4 - Paham Logika, Bukan Hafalan Rumus.</p>
        </div>
      </footer>
    </div>
  )
}
