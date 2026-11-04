
export default function Footer() {
  return (
    <footer className="py-20 border-t border-[#1a151a] bg-[#020204]/40 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#FF1025]/10 via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-8 h-8 text-[#FF1025]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="font-bold tracking-tight text-white">
              Shadow<span className="text-[#FF1025]">Cast</span>
            </span>
          </div>
          <p className="text-sm text-[#92929E]">Your Screen. Without Limits.</p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'How It Works', 'Download'] },
          { title: 'Resources', links: ['Documentation', 'Support', 'Troubleshooting'] },
          { title: 'Legal', links: ['Privacy Policy', 'Terms of Service'] },
        ].map((g) => (
          <div key={g.title}>
            <div className="font-medium mb-4 text-[#FF1025] uppercase tracking-wider text-xs">{g.title}</div>
            <ul className="space-y-2">
              {g.links.map((l) => (
                <li key={l}><a href="#" className="text-sm text-[#92929E] hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 text-[10px] text-[#92929E] border-t border-[#1a151a]/50 pt-6">© {new Date().getFullYear()} Shadow Cast. All rights reserved.</div>
    </footer>
  )
}
