'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navItems = [
  { label: 'Soluções', href: '/solucoes' },
  { label: 'Serviços', href: '/servicos' },
  { label: "Ebook's", href: '/ebooks' },
  { label: 'Tutoriais', href: '/tutoriais' },
  { label: 'Blog', href: '/blog' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-escuro/95 backdrop-blur-md shadow-xl shadow-black/30 border-b border-white/5'
          : 'bg-escuro'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-[72px]">

        {/* LOGO */}
        <Link href="/" className="flex-shrink-0 group">
          <Image
            src="/logo-horizontal-branco.png"
            alt="KION Dental Technology"
            width={148}
            height={44}
            priority
            className="h-10 w-auto transition-opacity duration-200 group-hover:opacity-80"
          />
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-white/60 hover:text-white text-[13px] font-700 uppercase tracking-wider transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-turquesa after:transition-all after:duration-200 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA DESKTOP */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://clinic.kiwid.app/auth/login"
            target="_blank"
            rel="noopener"
            className="relative overflow-hidden bg-turquesa text-escuro text-[11px] font-black uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 hover:bg-ciano hover:shadow-lg hover:shadow-turquesa/30 hover:-translate-y-px"
          >
            Acessar Portal
          </a>
        </div>

        {/* HAMBURGER */}
        <button
          className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className={`block h-px w-6 bg-white transition-all duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-px w-6 bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-6 bg-white transition-all duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* MOBILE NAV */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-escuro/98 border-t border-white/10 px-6 py-5 flex flex-col gap-4">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/70 hover:text-turquesa text-sm font-bold uppercase tracking-wider transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://clinic.kiwid.app/auth/login"
            target="_blank"
            rel="noopener"
            className="mt-2 bg-turquesa text-escuro text-xs font-black uppercase tracking-wider px-5 py-3 rounded-full text-center hover:bg-ciano transition-colors"
          >
            Acessar Portal
          </a>
        </div>
      </div>
    </header>
  )
}
