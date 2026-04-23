import Link from 'next/link'
import Image from 'next/image'

const beneficios = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
    ),
    title: 'Transparência',
    desc: 'Painel completo para acompanhar suas solicitações em tempo real.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
    ),
    title: 'Simplicidade',
    desc: 'Aposente a tradicional Ordem de Serviço em papel.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>
    ),
    title: 'Controle',
    desc: 'Gerencie solicitações e todas as informações do caso em um só lugar.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    ),
    title: 'Scan Service',
    desc: 'Nossa equipe vai até sua clínica com o scanner intraoral.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
    title: 'Soluções completas',
    desc: 'Portfólio completo de serviços laboratoriais, simples ou complexos.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
    ),
    title: 'Experiência',
    desc: 'Expertise de um corpo técnico com mais de 30 anos de experiência.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
    ),
    title: 'Analógico ou Digital',
    desc: 'Um laboratório para todos, basta ter um celular com internet.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
    ),
    title: 'Atualização constante',
    desc: 'Conteúdos educativos e informativos para ir além na sua prática.',
  },
]

const servicos = [
  { title: 'Soluções sobre dente', href: '/solucoes/sobre-dente', num: '01' },
  { title: 'Soluções sobre implante', href: '/solucoes/sobre-implante', num: '02' },
  { title: 'Guia cirúrgica', href: '/solucoes/guia-cirurgica', num: '03' },
  { title: 'Prótese parcial removível', href: '/solucoes/protese-parcial', num: '04' },
  { title: 'Prótese total', href: '/solucoes/protese-total', num: '05' },
  { title: 'Soluções oclusais', href: '/solucoes/oclusais', num: '06' },
  { title: 'Soluções para ronco e apneia', href: '/solucoes/ronco-apneia', num: '07' },
  { title: 'Soluções digitais', href: '/solucoes/digitais', num: '08' },
  { title: 'Kion Scan', href: '/servicos#kionscan', num: '09' },
  { title: 'Assessoria Digital', href: '/servicos#assessoria', num: '10' },
  { title: 'Consultoria Técnica', href: '/servicos#consultoria', num: '11' },
  { title: 'Atendimento Clínico', href: '/servicos#atendimento', num: '12' },
]

const stats = [
  { value: '30+', label: 'Anos de experiência' },
  { value: '100%', label: 'Plataforma digital' },
  { value: '12', label: 'Soluções laboratoriais' },
  { value: '5★', label: 'Satisfação dos clientes' },
]

const depoimentos = [
  {
    texto: 'O professor fazia o passo a passo e explicava tudo detalhadamente. Também esclareceu muitas dúvidas minhas. Indico de olhos fechados. Sem falar na oportunidade de conhecer as instalações do laboratório, que é show!',
    nome: 'Dra. Silvia Ramiro',
    cargo: 'Cirurgiã-Dentista',
    inicial: 'S',
  },
  {
    texto: 'Depois do curso, pude perceber uma notória diferença desde o meu planejamento, a escolha do material adequado, a execução, o tempo clínico e, o mais importante, no resultado final dos meus casos.',
    nome: 'Dr. Wellington W. Schlinkert',
    cargo: 'Especialista em Prótese',
    inicial: 'W',
  },
]

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-escuro relative overflow-hidden min-h-[92vh] flex items-center noise-bg">
        {/* Background glow blobs */}
        <div className="absolute top-[-180px] right-[-120px] w-[560px] h-[560px] rounded-full bg-turquesa/6 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-amarelo/4 blur-[80px] pointer-events-none" />

        {/* Decorative rings */}
        <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-turquesa/8 pointer-events-none hidden md:block" />
        <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-turquesa/12 pointer-events-none hidden md:block" />

        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center w-full relative z-10">
          <div className="animate-fadeInUp">
            <div className="inline-flex items-center gap-2 bg-amarelo/10 border border-amarelo/20 text-amarelo text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-7">
              <span className="w-1.5 h-1.5 bg-amarelo rounded-full" />
              Dental Technology
            </div>
            <h1 className="text-white font-black text-5xl md:text-[3.4rem] leading-[1.1] mb-6 tracking-tight">
              Prótese dentária hoje com{' '}
              <span className="shimmer-text">a tecnologia do amanhã</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-md">
              Rápido, eficiente e digital. Reinventando a sua relação com o laboratório de prótese.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://clinic.kiwid.app/auth/login"
                target="_blank"
                rel="noopener"
                className="group relative overflow-hidden bg-turquesa text-white font-black text-[11px] uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:bg-ciano hover:text-escuro hover:shadow-xl hover:shadow-turquesa/30 hover:-translate-y-0.5"
              >
                Conheça o Portal
                <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="https://materiais.kiondental.tech/leads-website"
                target="_blank"
                rel="noopener"
                className="group border border-white/15 text-white/80 font-bold text-[11px] uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:border-turquesa hover:text-turquesa hover:bg-turquesa/5"
              >
                Faça seu cadastro
              </a>
            </div>
          </div>

          {/* Hero visual — logo flutuando */}
          <div className="hidden md:flex items-center justify-center relative">
            <div className="relative w-[340px] h-[340px] flex items-center justify-center">
              {/* Anéis pulsantes */}
              <div className="absolute inset-0 rounded-full border border-turquesa/15 animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-8 rounded-full border border-turquesa/20" />
              <div className="absolute inset-16 rounded-full bg-turquesa/8 border border-turquesa/25" />

              {/* Logo vertical flutuante */}
              <div className="relative z-10 animate-float">
                <Image
                  src="/logo-vertical-branco.png"
                  alt="KION Dental Technology"
                  width={180}
                  height={180}
                  className="drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Badge 100% Digital */}
              <div className="absolute -bottom-2 -right-2 bg-amarelo text-escuro text-[10px] font-black px-4 py-2 rounded-full shadow-lg shadow-amarelo/20 uppercase tracking-wider">
                100% Digital
              </div>

              {/* Badge anos */}
              <div className="absolute -top-2 -left-2 glass border border-turquesa/20 text-turquesa text-[10px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-wider">
                30+ anos
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="text-white text-[10px] uppercase tracking-widest">scroll</div>
          <div className="w-px h-8 bg-gradient-to-b from-white to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl md:text-4xl font-black text-escuro mb-1 group-hover:text-turquesa transition-colors duration-300">
                {s.value}
              </div>
              <div className="text-[11px] text-cinza2 uppercase tracking-widest font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-turquesa mb-4">Sobre a KION</div>
            <h2 className="text-4xl font-black text-escuro leading-tight mb-6">
              Uma nova experiência em{' '}
              <span className="text-gradient-cyan">soluções odontológicas</span>
            </h2>
            <p className="text-cinza1 leading-relaxed mb-5">
              A KION Dental Technology nasceu pensando no valor de cada sorriso. Um laboratório de prótese dentária que facilita o seu dia a dia com serviços personalizados de acordo com a sua necessidade e o orçamento do seu paciente.
            </p>
            <p className="text-cinza1 leading-relaxed mb-9">
              Nosso objetivo é otimizar o fluxo de trabalho, dando acesso ao melhor da prótese dentária para alcançar resultados consistentes.
            </p>
            <a
              href="https://clinic.kiwid.app/auth/login"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-escuro text-white font-black text-[11px] uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:bg-turquesa hover:-translate-y-0.5 hover:shadow-lg hover:shadow-turquesa/20"
            >
              Criar conta gratuita
              <span>→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'É possível', desc: 'Somos uma plataforma a serviço de cirurgiões-dentistas e laboratórios.', color: 'bg-turquesa', text: 'text-white' },
              { label: 'É diferente', desc: 'Simplificamos o fluxo laboratorial da prótese dentária para o seu dia a dia.', color: 'bg-escuro', text: 'text-white' },
              { label: 'É digital', desc: 'Plataforma 100% digital e segura integrada ao seu consultório.', color: 'bg-amarelo', text: 'text-escuro' },
            ].map((item, i) => (
              <div
                key={i}
                className={`${item.color} ${item.text} p-6 rounded-2xl flex items-start gap-4 group hover:-translate-y-1 transition-transform duration-200 cursor-default`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${i === 2 ? 'bg-escuro/10' : 'bg-white/10'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <div className="font-black text-sm mb-1">{item.label}</div>
                  <div className="text-xs leading-relaxed opacity-75">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section className="bg-gray-50/80 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-[10px] font-black uppercase tracking-widest text-turquesa mb-3">Vantagens</div>
            <h2 className="text-4xl font-black text-escuro leading-tight">
              Confira os benefícios desta<br />nova experiência
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {beneficios.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-gray-100 card-glow cursor-default"
              >
                <div className="w-11 h-11 rounded-xl bg-turquesa/8 text-turquesa flex items-center justify-center mb-4 group-hover:bg-turquesa group-hover:text-white transition-all duration-300">
                  {b.icon}
                </div>
                <h3 className="font-black text-escuro text-sm mb-2 group-hover:text-turquesa transition-colors duration-200">{b.title}</h3>
                <p className="text-cinza2 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section className="relative py-24 overflow-hidden bg-escuro">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-turquesa/90 to-escuro/95 pointer-events-none" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <div className="text-[10px] font-black uppercase tracking-widest text-amarelo mb-3">Portfólio</div>
            <h2 className="text-4xl font-black text-white leading-tight">Conheça nossa linha de serviços</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {servicos.map((s, i) => (
              <Link
                key={i}
                href={s.href}
                className="group relative glass rounded-xl p-5 hover:bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="text-white/25 text-[10px] font-black mb-2 group-hover:text-turquesa transition-colors">{s.num}</div>
                <div className="text-white group-hover:text-escuro font-bold text-sm leading-snug transition-colors duration-300 mb-2">
                  {s.title}
                </div>
                <div className="flex items-center gap-1 text-white/40 group-hover:text-turquesa text-[11px] font-semibold transition-colors">
                  ver mais
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTAL CTA ── */}
      <section className="bg-escuro py-24 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-turquesa/6" />
          <div className="absolute w-[420px] h-[420px] rounded-full border border-turquesa/10" />
          <div className="absolute w-[240px] h-[240px] rounded-full bg-turquesa/4 blur-[60px]" />
        </div>

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          {/* Logo azul no centro */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo-vertical-branco.png"
              alt="KION"
              width={90}
              height={90}
              className="opacity-30"
            />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-turquesa mb-4">Portal KION</div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            O futuro a apenas um<br />
            <span className="text-gradient">clique de distância</span>
          </h2>
          <p className="text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
            Aposente a ordem de serviços de papel. Visualize status das solicitações, entrega, pagamento e histórico em um único lugar.
          </p>
          <a
            href="https://clinic.kiwid.app/auth/login"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 bg-amarelo text-escuro font-black text-[11px] uppercase tracking-widest px-10 py-4 rounded-full transition-all duration-300 hover:bg-turquesa hover:text-white hover:shadow-xl hover:shadow-turquesa/30 hover:-translate-y-0.5"
          >
            Criar conta gratuita agora
            <span>→</span>
          </a>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-[10px] font-black uppercase tracking-widest text-turquesa mb-3">Depoimentos</div>
            <h2 className="text-4xl font-black text-escuro">Veja o que dizem nossos clientes</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {depoimentos.map((d, i) => (
              <div
                key={i}
                className="relative bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-turquesa/20 hover:shadow-xl hover:shadow-turquesa/5 transition-all duration-300 group"
              >
                {/* Quote mark */}
                <div className="absolute top-6 right-8 text-turquesa/10 text-[80px] font-black leading-none select-none">"</div>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} width="14" height="14" viewBox="0 0 24 24" fill="#F9EC1F"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>

                <p className="text-cinza1 leading-relaxed mb-7 text-sm relative z-10">{d.texto}</p>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-turquesa to-ciano flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md shadow-turquesa/20">
                    {d.inicial}
                  </div>
                  <div>
                    <div className="font-black text-escuro text-sm">{d.nome}</div>
                    <div className="text-cinza2 text-[11px]">{d.cargo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-turquesa mb-3">Newsletter</div>
          <h2 className="text-3xl font-black text-escuro mb-3">Assine a newsletter</h2>
          <p className="text-cinza1 text-sm mb-8 leading-relaxed">
            Receba conteúdos exclusivos sobre odontologia digital diretamente no seu e-mail.
          </p>
          <div className="flex gap-2 bg-white rounded-full border border-gray-200 p-1.5 shadow-sm focus-within:border-turquesa focus-within:shadow-md focus-within:shadow-turquesa/10 transition-all duration-200">
            <input
              type="email"
              placeholder="seu@email.com.br"
              className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-escuro placeholder:text-cinza2"
            />
            <button className="bg-turquesa text-white font-black text-[10px] uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-escuro transition-colors duration-200 flex-shrink-0">
              Assinar
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
