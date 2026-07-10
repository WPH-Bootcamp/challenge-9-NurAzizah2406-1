export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar akan ditambahkan di sini */}
      <main className="flex-1">{children}</main>
      {/* Footer akan ditambahkan di sini */}
    </div>
  );
}
