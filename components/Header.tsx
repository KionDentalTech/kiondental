'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-turquesa shadow-lg shadow-turquesa/20">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <path d="M24 4 A20 20 0 1 1 4 24" stroke="url(#gh)" strokeWidth="4" strokeLinecap="round"/>
            <defs>
              <linearGradient id="gh" x1="4" y1="24" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00DCFF"/>
                <stop offset="100%" stopColor="#F9EC1F"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <div className="text-white font-black text-xl tracking-widest leading-none">KION</div>
            <div className="text-white/80 text-[10px] tracking-widest uppercase">Dental Technology</div>
          </div>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Soluções', href: '/solucoes' },
            { label: 'Serviços', href: '/servicos' },
            { label: "Ebook's", href: '/ebooks' },
            { label: 'Tutoriais', href: '/tutoriais' },
            { label: 'Blog', href: '/blog' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/90 hover:text-amarelo text-sm font-700 uppercase tracking-wider transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://clinic.kiwid.app/auth/login"
            target="_blank"
            className="bg-amarelo text-escuro text-xs font-black uppercase tracking-wider px-4 py-2 rounded transition hover:bg-white"
          >
            Acessar Portal
          </a>
        </div>

        {/* MOBILE MENU BTN */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE NAV */}
      {open && (
        <div className="md:hidden bg-escuro px-6 py-4 flex flex-col gap-4">
          {[
            { label: 'Soluções', href: '/solucoes' },
            { label: 'Serviços', href: '/servicos' },
            { label: "Ebook's", href: '/ebooks' },
            { label: 'Tutoriais', href: '/tutoriais' },
            { label: 'Blog', href: '/blog' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/80 hover:text-amarelo text-sm font-700 uppercase tracking-wider"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://clinic.kiwid.app/auth/login"
            target="_blank"
            className="bg-amarelo text-escuro text-xs font-black uppercase tracking-wider px-4 py-2 rounded text-center mt-2"
          >
            Acessar Portal
          </a>
        </div>
      )}
    </header>
  )
}
