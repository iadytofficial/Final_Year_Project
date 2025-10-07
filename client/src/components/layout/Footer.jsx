export default function Footer() {
  return (
    <footer className="border-t bg-white mt-12">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-600 flex flex-wrap items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} AgroLK</p>
        <nav className="flex gap-4">
          <a href="/about" className="hover:text-brand">About</a>
          <a href="/faq" className="hover:text-brand">FAQ</a>
          <a href="/terms" className="hover:text-brand">Terms</a>
          <a href="/privacy" className="hover:text-brand">Privacy</a>
          <a href="/contact" className="hover:text-brand">Contact</a>
        </nav>
      </div>
    </footer>
  )
}
