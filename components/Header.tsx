'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const nav = [
  { label: 'Soluções',  href: '/solucoes' },
  { label: 'Serviços',  href: '/servicos' },
  { label: "Ebook's",   href: '/ebooks' },
  { label: 'Tutoriais', href: '/tutoriais' },
  { label: 'Blog',      href: '/blog' },
]

export default function Header() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      style={{ background: scrolled ? 'rgba(7,9,14,0.92)' : '#07090E' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-md border-b border-white/5 shadow-2xl shadow-black/50' : 'border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[68px]">

        {/* LOGO */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo-horizontal-branco.png"
            alt="KION Dental Technology"
            width={140}
            height={40}
            priority
            className="h-9 w-auto opacity-95 hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/45 hover:text-white text-[12px] font-bold uppercase tracking-widest transition-colors duration-150"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <a
            href="https://clinic.kiwid.app/auth/login"
            target="_blank"
            rel="noopener"
            className="btn-tech text-[10px]"
          >
            Acessar Portal
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>

        {/* HAMBURGER */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block h-px w-5 bg-white/70 transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block h-px w-5 bg-white/70 transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block h-px w-5 bg-white/70 transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-80' : 'max-h-0'}`}
        style={{ background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-white/50 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://clinic.kiwid.app/auth/login"
            target="_blank"
            rel="noopener"
            className="btn-tech mt-2 justify-center"
          >
            Acessar Portal
          </a>
        </div>
      </div>
    </header>
  )
}
