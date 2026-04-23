import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { label: 'Soluções',  href: '/solucoes' },
  { label: 'Serviços',  href: '/servicos' },
  { label: 'Blog',      href: '/blog' },
  { label: "Ebook's",   href: '/ebooks' },
  { label: 'Tutoriais', href: '/tutoriais' },
]

const socials = [
  {
    label: 'Instagram', href: 'https://www.instagram.com/kiondental.tech/',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  },
  {
    label: 'Facebook', href: 'https://www.facebook.com/kion.dentaltech/',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  {
    label: 'LinkedIn', href: 'https://br.linkedin.com/',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    label: 'YouTube', href: 'https://www.youtube.com/',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#07090E', borderTop: '1px solid rgba(0,177,210,0.15)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">

          {/* BRAND */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo-horizontal-branco.png"
                alt="KION Dental Technology"
                width={150}
                height={44}
                className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.35)' }} className="text-sm leading-relaxed mb-6 max-w-[280px]">
              Laboratório de prótese dentária digital. Tecnologia de ponta para cada sorriso.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B1D2] animate-pulse" />
              <span style={{ color: 'rgba(0,177,210,0.7)', fontSize: '10px', letterSpacing: '0.18em' }} className="font-bold uppercase">
                Sistema Online
              </span>
            </div>
          </div>

          {/* NAV */}
          <div className="md:col-span-3">
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '0.18em' }} className="font-black uppercase mb-5">
              Navegação
            </p>
            <div className="flex flex-col gap-3">
              {navLinks.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}
                  className="font-semibold hover:text-[#00DCFF] transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTATO */}
          <div className="md:col-span-4">
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', letterSpacing: '0.18em' }} className="font-black uppercase mb-5">
              Contato
            </p>
            <div className="flex flex-col gap-3 mb-7">
              {[
                { icon: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>, extra: <polyline points="22,6 12,13 2,6"/>, href: 'mailto:falekion@kiondental.tech', label: 'falekion@kiondental.tech' },
                { icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.28-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>, extra: null, href: 'tel:08005910188', label: '0800 591 0188' },
                { icon: null, extra: null, href: 'https://wa.me/551140409440', label: '(11) 4040-9440 — WhatsApp' },
              ].map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target={i === 2 ? '_blank' : undefined}
                  rel={i === 2 ? 'noopener' : undefined}
                  style={{ color: 'rgba(255,255,255,0.38)', fontSize: '13px' }}
                  className="font-semibold hover:text-[#00DCFF] transition-colors flex items-center gap-2"
                >
                  {c.icon && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {c.icon}{c.extra}
                    </svg>
                  )}
                  {c.label}
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)' }}
                  className="w-9 h-9 rounded flex items-center justify-center hover:bg-[#00B1D2] hover:border-[#00B1D2] hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>
            © 2026 KION Dental Technology. Todos os direitos reservados.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }} className="mono">
            kiondental.tech
          </p>
        </div>
      </div>
    </footer>
  )
}
