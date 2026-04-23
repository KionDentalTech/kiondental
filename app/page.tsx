import Link from 'next/link'
import Image from 'next/image'

/* ─── DATA ─────────────────────────────────────── */

const stats = [
  { value: '30+',  unit: 'anos',  label: 'de expertise técnica' },
  { value: '100%', unit: '',      label: 'plataforma digital' },
  { value: '12',   unit: 'tipos', label: 'de soluções laboratoriais' },
  { value: '5★',   unit: '',      label: 'avaliação dos clientes' },
]

const passos = [
  { num: '01', title: 'Envie o caso', desc: 'Cadastre a solicitação no portal My Kion com todos os detalhes do caso clínico, de forma rápida e sem papelada.' },
  { num: '02', title: 'Acompanhe em tempo real', desc: 'Monitore o status da produção, prazo de entrega e pagamento em um painel centralizado e transparente.' },
  { num: '03', title: 'Receba com qualidade', desc: 'Próteses produzidas com precisão digital, entregues no prazo e com histórico completo registrado na plataforma.' },
]

const beneficios = [
  { icon: 'M9 17H7A5 5 0 017 7h2M15 7h2a5 5 0 010 10h-2M8 12h8', title: 'Integração digital', desc: 'Fluxo 100% online, sem ficha de papel.' },
  { icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z', title: 'Transparência total', desc: 'Painel com status em tempo real de cada caso.' },
  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Segurança clínica', desc: 'Dados dos pacientes protegidos e auditáveis.' },
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Scan Service', desc: 'Scanner intraoral na sua clínica, sem deslocamento.' },
  { icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', title: 'Portfólio completo', desc: '12 categorias de soluções laboratoriais digitais.' },
  { icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', title: 'Multi-solução', desc: 'Analógico ou digital, simples ou complexo.' },
  { icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 7a4 4 0 100 8 4 4 0 000-8z', title: '30 anos de equipe', desc: 'Corpo técnico especializado e em constante atualização.' },
  { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', title: 'Conteúdo educativo', desc: 'Cursos, ebooks e tutoriais para o seu crescimento.' },
]

const servicos = [
  { n: '01', title: 'Soluções sobre dente',      href: '/solucoes/sobre-dente' },
  { n: '02', title: 'Soluções sobre implante',   href: '/solucoes/sobre-implante' },
  { n: '03', title: 'Guia cirúrgica',            href: '/solucoes/guia-cirurgica' },
  { n: '04', title: 'Prótese parcial removível', href: '/solucoes/protese-parcial' },
  { n: '05', title: 'Prótese total',             href: '/solucoes/protese-total' },
  { n: '06', title: 'Soluções oclusais',         href: '/solucoes/oclusais' },
  { n: '07', title: 'Ronco e apneia',            href: '/solucoes/ronco-apneia' },
  { n: '08', title: 'Soluções digitais',         href: '/solucoes/digitais' },
  { n: '09', title: 'Kion Scan',                 href: '/servicos#kionscan' },
  { n: '10', title: 'Assessoria Digital',        href: '/servicos#assessoria' },
  { n: '11', title: 'Consultoria Técnica',       href: '/servicos#consultoria' },
  { n: '12', title: 'Atendimento Clínico',       href: '/servicos#atendimento' },
]

const depoimentos = [
  {
    texto: 'O professor fazia o passo a passo e explicava tudo detalhadamente. Também esclareceu muitas dúvidas minhas. Indico de olhos fechados. Sem falar na oportunidade de conhecer as instalações do laboratório, que é show!',
    nome: 'Dra. Silvia Ramiro',
    cargo: 'Cirurgiã-Dentista',
    ini: 'S',
  },
  {
    texto: 'Depois do curso, pude perceber uma notória diferença desde o meu planejamento, a escolha do material adequado, a execução, o tempo clínico e, o mais importante, no resultado final dos meus casos.',
    nome: 'Dr. Wellington W. Schlinkert',
    cargo: 'Especialista em Prótese',
    ini: 'W',
  },
]

/* ─── ICONS ─────────────────────────────────────── */
function Icon({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

/* ─── PAGE ─────────────────────────────────────── */
export default function Home() {
  return (
    <>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex items-center min-h-[94vh] dot-grid"
        style={{ background: '#07090E' }}
      >
        {/* Glow */}
        <div className="pointer-events-none absolute right-[-10%] top-[-10%] w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,177,210,0.09) 0%, transparent 70%)' }} />
        <div className="pointer-events-none absolute left-[-5%] bottom-[-5%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249,236,31,0.04) 0%, transparent 70%)' }} />

        {/* Horizontal rule top */}
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,177,210,0.3), transparent)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-28 grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="animate-fade-up">
            {/* Tag */}
            <div className="label-tag mb-8">
              Laboratório · Dental Technology · Inovação
            </div>

            <h1 className="section-title text-white mb-6" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', lineHeight: 1.05 }}>
              A prótese dentária<br />
              <span className="text-shimmer">reinventada.</span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.42)', lineHeight: 1.8, maxWidth: '460px' }} className="text-base mb-12">
              Tecnologia digital de ponta integrada ao seu consultório. Mais agilidade, controle e qualidade em cada caso.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="https://clinic.kiwid.app/auth/login" target="_blank" rel="noopener" className="btn-tech">
                Acessar o Portal
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="https://materiais.kiondental.tech/leads-website" target="_blank" rel="noopener" className="btn-ghost">
                Criar conta gratuita
              </a>
            </div>

            {/* Mini badges */}
            <div className="flex flex-wrap gap-3 mt-10">
              {['Rápido', 'Eficiente', '100% Digital', 'Sem papelada'].map(tag => (
                <span
                  key={tag}
                  style={{ background: 'rgba(0,177,210,0.07)', border: '1px solid rgba(0,177,210,0.18)', color: 'rgba(0,220,255,0.7)', fontSize: '10px', letterSpacing: '0.14em' }}
                  className="px-3 py-1 font-bold uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — Logo visual */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              {/* Rings */}
              <div className="absolute inset-[-48px] rounded-full"
                style={{ border: '1px solid rgba(0,177,210,0.08)' }} />
              <div className="absolute inset-[-24px] rounded-full"
                style={{ border: '1px solid rgba(0,177,210,0.12)' }} />
              <div className="absolute inset-0 rounded-full"
                style={{ border: '1px solid rgba(0,177,210,0.18)' }} />

              {/* Logo */}
              <div className="relative w-[280px] h-[280px] rounded-full flex items-center justify-center animate-float"
                style={{ background: 'rgba(0,177,210,0.04)' }}>
                <Image
                  src="/logo-vertical-branco.png"
                  alt="KION Dental Technology"
                  width={200}
                  height={200}
                  className="drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Floating chips */}
              <div
                className="absolute -top-4 -right-8 mono text-[10px] font-bold px-3 py-1.5"
                style={{ background: '#F9EC1F', color: '#07090E', borderRadius: '2px', letterSpacing: '0.1em' }}
              >
                100% DIGITAL
              </div>
              <div
                className="absolute -bottom-4 -left-8 mono text-[10px] font-bold px-3 py-1.5"
                style={{ background: 'rgba(0,177,210,0.12)', border: '1px solid rgba(0,177,210,0.3)', color: '#00DCFF', borderRadius: '2px', letterSpacing: '0.1em' }}
              >
                30+ ANOS
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section style={{ background: '#0D1117', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
            {stats.map((s, i) => (
              <div key={i} className="py-10 px-8 group cursor-default">
                <div className="mono text-[2.4rem] font-bold leading-none mb-1" style={{ color: '#00B1D2' }}>
                  {s.value}
                  {s.unit && <span className="text-base ml-1" style={{ color: 'rgba(0,177,210,0.5)' }}>{s.unit}</span>}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', letterSpacing: '0.06em' }} className="font-semibold mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SOBRE
      ══════════════════════════════════════════ */}
      <section className="py-28" style={{ background: '#07090E' }}>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <div>
            <div className="label-tag">Sobre a KION</div>
            <h2 className="section-title text-white mb-6">
              Uma nova era no<br />
              <span className="text-cyan">laboratório digital</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.9 }} className="text-sm mb-4">
              A KION Dental Technology nasceu pensando no valor de cada sorriso. Um laboratório de prótese dentária que facilita o seu dia a dia com serviços personalizados de acordo com a sua necessidade e o orçamento do seu paciente.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.9 }} className="text-sm mb-10">
              Nosso objetivo é otimizar o fluxo de trabalho, dando acesso ao melhor da prótese dentária para alcançar resultados consistentes e previsíveis.
            </p>
            <a href="https://clinic.kiwid.app/auth/login" target="_blank" rel="noopener" className="btn-tech">
              Criar conta gratuita
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>

          {/* Right — feature pills */}
          <div className="flex flex-col gap-4">
            {[
              { tag: 'Possível',  desc: 'Plataforma a serviço de cirurgiões-dentistas e laboratórios de todo o Brasil.', accent: '#00B1D2' },
              { tag: 'Diferente', desc: 'Simplificamos o fluxo laboratorial: do pedido à entrega, tudo em um só lugar.', accent: 'rgba(255,255,255,0.8)' },
              { tag: 'Digital',   desc: 'Plataforma 100% digital, segura e acessível de qualquer dispositivo.', accent: '#F9EC1F' },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card p-6 flex gap-5 items-start"
                style={{ borderRadius: '4px' }}
              >
                <div className="flex-shrink-0 w-1 self-stretch" style={{ background: item.accent, opacity: 0.7, borderRadius: '2px' }} />
                <div>
                  <div className="font-black text-white text-sm mb-1 uppercase tracking-widest" style={{ letterSpacing: '0.1em' }}>
                    É {item.tag}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.7 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMO FUNCIONA
      ══════════════════════════════════════════ */}
      <section className="py-28 line-grid" style={{ background: '#0B0E16' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="label-tag justify-center">Como funciona</div>
            <h2 className="section-title text-white">Simples como deve ser</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.6%+24px)] right-[calc(16.6%+24px)] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(0,177,210,0.2), rgba(0,177,210,0.5), rgba(0,177,210,0.2))' }} />

            {passos.map((p, i) => (
              <div key={i} className="glass-card p-8" style={{ borderRadius: '4px', position: 'relative' }}>
                <div className="mono text-[2.8rem] font-bold leading-none mb-6"
                  style={{ color: 'rgba(0,177,210,0.15)' }}>
                  {p.num}
                </div>
                <div
                  className="w-10 h-10 rounded flex items-center justify-center mb-6 font-black text-sm"
                  style={{ background: 'rgba(0,177,210,0.1)', border: '1px solid rgba(0,177,210,0.2)', color: '#00DCFF', borderRadius: '3px' }}
                >
                  {i + 1}
                </div>
                <h3 className="text-white font-black text-base mb-3">{p.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '13px', lineHeight: 1.8 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BENEFÍCIOS
      ══════════════════════════════════════════ */}
      <section className="py-28" style={{ background: '#07090E' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="label-tag">Vantagens</div>
            <h2 className="section-title text-white max-w-lg">
              Por que escolher a KION?
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {beneficios.map((b, i) => (
              <div key={i} className="glass-card p-6 group cursor-default" style={{ borderRadius: '4px' }}>
                <div
                  className="w-10 h-10 flex items-center justify-center mb-5 transition-all duration-300"
                  style={{ background: 'rgba(0,177,210,0.06)', border: '1px solid rgba(0,177,210,0.15)', borderRadius: '3px', color: '#00B1D2' }}
                >
                  <Icon d={b.icon} />
                </div>
                <h3 className="text-white font-black text-[13px] mb-2 leading-snug">{b.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVIÇOS
      ══════════════════════════════════════════ */}
      <section className="py-28" style={{ background: '#0B0E16', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="label-tag">Portfólio</div>
              <h2 className="section-title text-white">Nossas soluções</h2>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', maxWidth: '300px', lineHeight: 1.7 }} className="font-semibold">
              12 categorias de serviços laboratoriais para todas as necessidades clínicas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            {servicos.map((s, i) => (
              <Link
                key={i}
                href={s.href}
                className="group flex flex-col justify-between p-6 transition-all duration-200"
                style={{ background: '#0B0E16' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(0,177,210,0.06)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.background = '#0B0E16'
                }}
              >
                <div>
                  <div className="mono text-[10px] mb-3" style={{ color: 'rgba(0,177,210,0.4)' }}>{s.n}</div>
                  <div className="text-white font-bold text-sm leading-snug mb-4" style={{ lineHeight: 1.5 }}>{s.title}</div>
                </div>
                <div className="flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Ver detalhes
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PORTAL CTA
      ══════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden" style={{ background: '#07090E' }}>
        {/* Accent glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(0,177,210,0.07) 0%, transparent 70%)' }} />
        </div>
        <div className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,177,210,0.25), transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,177,210,0.25), transparent)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Logo small */}
          <div className="flex justify-center mb-10">
            <Image
              src="/logo-horizontal-branco.png"
              alt="KION"
              width={120}
              height={36}
              className="h-8 w-auto"
              style={{ opacity: 0.25 }}
            />
          </div>

          <div className="label-tag justify-center">Portal KION</div>

          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em' }} className="text-white mb-6">
            Seu laboratório digital<br />
            <span className="text-cyan">começa agora.</span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.38)', lineHeight: 1.9, maxWidth: '520px' }} className="text-sm mx-auto mb-12">
            Aposente a ordem de serviços de papel. Visualize o status da produção, entrega, pagamento e histórico completo, tudo em um único painel.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://clinic.kiwid.app/auth/login" target="_blank" rel="noopener"
              className="btn-tech text-base px-10 py-4">
              Criar conta gratuita
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="https://materiais.kiondental.tech/leads-website" target="_blank" rel="noopener" className="btn-ghost">
              Falar com a equipe
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-6 mt-14">
            {['Gratuito para começar', 'Sem fidelidade', 'Suporte humanizado'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00B1D2" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }} className="font-semibold">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DEPOIMENTOS
      ══════════════════════════════════════════ */}
      <section className="py-28" style={{ background: '#0B0E16', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="label-tag justify-center">Depoimentos</div>
            <h2 className="section-title text-white">Quem usa, aprova.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {depoimentos.map((d, i) => (
              <div key={i} className="glass-card p-8" style={{ borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative quote */}
                <div className="absolute top-4 right-6 mono text-[5rem] font-bold leading-none select-none pointer-events-none"
                  style={{ color: 'rgba(0,177,210,0.06)' }}>
                  "
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#F9EC1F">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>

                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.85 }} className="mb-8 relative z-10">
                  "{d.texto}"
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #00B1D2, #00DCFF)', color: '#07090E', borderRadius: '3px' }}
                  >
                    {d.ini}
                  </div>
                  <div>
                    <div className="text-white font-black text-sm">{d.nome}</div>
                    <div style={{ color: 'rgba(0,177,210,0.6)', fontSize: '11px' }} className="font-semibold uppercase tracking-wide">{d.cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════ */}
      <section className="py-24" style={{ background: '#07090E', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="label-tag justify-center">Newsletter</div>
          <h2 className="section-title text-white mb-3" style={{ fontSize: '2rem' }}>
            Conteúdo que vai além.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', lineHeight: 1.8 }} className="mb-10">
            Dicas, tendências e novidades sobre odontologia digital direto no seu e-mail.
          </p>

          <div className="flex gap-2" style={{ border: '1px solid rgba(0,177,210,0.2)', borderRadius: '3px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
            <input
              type="email"
              placeholder="seu@email.com.br"
              className="flex-1 px-5 py-3.5 text-sm font-semibold outline-none bg-transparent"
              style={{ color: 'white' }}
            />
            <button
              className="flex-shrink-0 font-black text-[10px] uppercase tracking-widest px-7 py-3.5 transition-all duration-200"
              style={{ background: '#00B1D2', color: '#07090E', letterSpacing: '0.14em' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00DCFF' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#00B1D2' }}
            >
              Assinar
            </button>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11px' }} className="mt-4 font-semibold">
            Sem spam. Cancele quando quiser.
          </p>
        </div>
      </section>
    </>
  )
}
