import Navbar from "@/components/web/navbar/navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
    </>
  )
}
