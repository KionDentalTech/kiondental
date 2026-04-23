import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-escuro text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* LOGO */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 4 A20 20 0 1 1 4 24" stroke="url(#gf)" strokeWidth="4" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gf" x1="4" y1="24" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#00DCFF"/>
                    <stop offset="100%" stopColor="#F9EC1F"/>
                  </linearGradient>
                </defs>
              </svg>
              <div>
                <div className="text-white font-black text-2xl tracking-widest leading-none">KION</div>
                <div className="text-turquesa text-[10px] tracking-widest uppercase">Dental Technology</div>
              </div>
            </div>
            <p className="text-cinza2 text-sm leading-relaxed mb-4 max-w-xs">
              Laboratório de prótese dentária digital. Rápido, eficiente e digital.
            </p>
            <div className="text-turquesa font-bold text-sm">
              Rápido, eficiente, <span className="text-amarelo">digital.</span>
            </div>
          </div>

          {/* LINKS */}
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-cinza2 mb-4">Navegação</div>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Soluções', href: '/solucoes' },
                { label: 'Serviços', href: '/servicos' },
                { label: 'Blog', href: '/blog' },
                { label: "Ebook's", href: '/ebooks' },
                { label: 'Tutoriais', href: '/tutoriais' },
              ].map(item => (
                <Link key={item.href} href={item.href} className="text-cinza2 hover:text-turquesa text-sm transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTATO */}
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-cinza2 mb-4">Contato</div>
            <div className="flex flex-col gap-2 text-sm text-cinza2">
              <a href="mailto:falekion@kiondental.tech" className="hover:text-turquesa transition-colors">
                falekion@kiondental.tech
              </a>
              <a href="tel:08005910188" className="hover:text-turquesa transition-colors">
                0800 591 0188
              </a>
              <a href="https://wa.me/551140409440" target="_blank" className="hover:text-turquesa transition-colors">
                (11) 4040-9440 WhatsApp
              </a>
            </div>
            <div className="flex gap-3 mt-6">
              {[
                { href: 'https://www.instagram.com/kiondental.tech/', label: 'IG' },
                { href: 'https://www.facebook.com/kion.dentaltech/', label: 'FB' },
                { href: 'https://br.linkedin.com/', label: 'LI' },
                { href: 'https://www.youtube.com/', label: 'YT' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-black text-white hover:bg-turquesa transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cinza2 text-xs">© 2026 KION Dental Technology. Todos os direitos reservados.</p>
          <p className="text-cinza2 text-xs">kiondental.tech</p>
        </div>
      </div>
    </footer>
  )
}
