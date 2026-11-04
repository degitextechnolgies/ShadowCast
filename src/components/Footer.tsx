
export default function Footer() {
  return (
    <footer className="py-16 border-t border-[#27243A]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">S</div>
            <span className="font-semibold">Shadow Cast</span>
          </div>
          <p className="text-sm text-[#A1A1B5]">Your Screen. Without Limits.</p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'How It Works', 'Download'] },
          { title: 'Resources', links: ['Documentation', 'Support', 'Troubleshooting'] },
          { title: 'Legal', links: ['Privacy Policy', 'Terms of Service'] },
        ].map((g) => (
          <div key={g.title}>
            <div className="font-medium mb-3">{g.title}</div>
            <ul className="space-y-2">
              {g.links.map((l) => (
                <li key={l}><a href="#" className="text-sm text-[#A1A1B5] hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-10 text-xs text-[#A1A1B5]">© {new Date().getFullYear()} Shadow Cast. All rights reserved.</div>
    </footer>
  )
}
