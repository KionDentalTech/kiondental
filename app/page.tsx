import Link from 'next/link'

const beneficios = [
  { icon: '📊', title: 'Transparência', desc: 'Um painel completo para acompanhar suas solicitações em tempo real.' },
  { icon: '✨', title: 'Simplicidade', desc: 'Aposente a tradicional Ordem de Serviço em papel.' },
  { icon: '🎯', title: 'Controle', desc: 'Controle as solicitações e todas as informações do caso.' },
  { icon: '🔬', title: 'Scan Service', desc: 'Nossa equipe vai até sua clínica com o scanner intraoral.' },
  { icon: '💎', title: 'Soluções completas', desc: 'Um portfólio completo de serviços laboratoriais, simples ou complexos.' },
  { icon: '🏆', title: 'Experiência', desc: 'Expertise de um corpo técnico com mais de 30 anos de experiência.' },
  { icon: '📱', title: 'Analógico ou Digital', desc: 'Um laboratório para todos, basta ter um celular com internet.' },
  { icon: '📚', title: 'Atualização constante', desc: 'Uma série de conteúdos educativos e informativos para ir além.' },
]

const servicos = [
  { title: 'Soluções sobre dente', href: '/solucoes/sobre-dente' },
  { title: 'Soluções sobre implante', href: '/solucoes/sobre-implante' },
  { title: 'Guia cirúrgica', href: '/solucoes/guia-cirurgica' },
  { title: 'Prótese parcial removível', href: '/solucoes/protese-parcial' },
  { title: 'Prótese total', href: '/solucoes/protese-total' },
  { title: 'Soluções oclusais', href: '/solucoes/oclusais' },
  { title: 'Soluções para ronco e apneia', href: '/solucoes/ronco-apneia' },
  { title: 'Soluções digitais', href: '/solucoes/digitais' },
  { title: 'Kion Scan', href: '/servicos#kionscan' },
  { title: 'Assessoria Digital', href: '/servicos#assessoria' },
  { title: 'Consultoria Técnica', href: '/servicos#consultoria' },
  { title: 'Atendimento Clínico', href: '/servicos#atendimento' },
]

const depoimentos = [
  {
    texto: 'O professor fazia o passo a passo e explicava tudo detalhadamente. Também esclareceu muitas dúvidas minhas. Indico de olhos fechados. Sem falar na oportunidade de conhecer as instalações do laboratório, que é show!',
    nome: 'Dra. Silvia Ramiro',
  },
  {
    texto: 'Fiz o curso de preparo para coroas, facetas e lentes. Depois do curso, pude perceber uma notória diferença desde o meu planejamento, a escolha do material adequado, a execução, o tempo clínico e, o mais importante, no resultado final dos meus casos.',
    nome: 'Dr. Wellington W. Schlinkert',
  },
]

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-escuro relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Decorative circles */}
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full border border-turquesa/10 pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full border border-amarelo/05 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div className="inline-block bg-amarelo text-escuro text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded mb-6">
              Dental Technology
            </div>
            <h1 className="text-white font-black text-5xl md:text-6xl leading-tight mb-6">
              Prótese dentária hoje com{' '}
              <span className="text-gradient">a tecnologia do amanhã</span>
            </h1>
            <p className="text-cinza2 text-lg leading-relaxed mb-10">
              Rápido, eficiente e digital. Reinventando a sua relação com o laboratório de prótese.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://clinic.kiwid.app/auth/login"
                target="_blank"
                className="bg-turquesa text-white font-black text-sm uppercase tracking-wider px-8 py-4 rounded transition hover:bg-ciano hover:text-escuro"
              >
                Conheça o Portal →
              </a>
              <a
                href="https://materiais.kiondental.tech/leads-website"
                target="_blank"
                className="border border-white/20 text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded transition hover:border-turquesa hover:text-turquesa"
              >
                Faça seu cadastro
              </a>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full bg-turquesa/10 border border-turquesa/20" />
              <div className="absolute inset-6 rounded-full bg-turquesa/15 border border-turquesa/30 flex items-center justify-center">
                <svg width="160" height="160" viewBox="0 0 48 48" fill="none">
                  <path d="M24 4 A20 20 0 1 1 4 24" stroke="url(#ghero)" strokeWidth="3" strokeLinecap="round"/>
                  <text x="8" y="28" fill="white" fontSize="12" fontWeight="900" fontFamily="Arial">KION</text>
                  <text x="5" y="36" fill="#00B1D2" fontSize="4" fontFamily="Arial">Dental Technology</text>
                  <defs>
                    <linearGradient id="ghero" x1="4" y1="24" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#00DCFF"/>
                      <stop offset="100%" stopColor="#F9EC1F"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-amarelo text-escuro text-xs font-black px-4 py-2 rounded">
                100% Digital
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-turquesa mb-4">Sobre a KION</div>
            <h2 className="text-4xl font-black text-escuro leading-tight mb-6">
              Uma nova experiência em soluções odontológicas
            </h2>
            <p className="text-cinza1 leading-relaxed mb-6">
              A KION Dental Technology nasceu pensando no valor de cada sorriso. Um laboratório de prótese dentária que facilita o seu dia a dia com serviços personalizados de acordo com a sua necessidade e o orçamento do seu paciente.
            </p>
            <p className="text-cinza1 leading-relaxed mb-8">
              Nosso objetivo é otimizar o fluxo de trabalho, dando acesso ao melhor da prótese dentária para alcançar resultados consistentes.
            </p>
            <a
              href="https://clinic.kiwid.app/auth/login"
              target="_blank"
              className="inline-block bg-turquesa text-white font-black text-sm uppercase tracking-wider px-8 py-4 rounded transition hover:bg-escuro"
            >
              Criar conta gratuita →
            </a>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'É possível', desc: 'Somos uma plataforma a serviço de cirurgiões-dentistas e laboratórios.' },
              { label: 'É diferente', desc: 'Simplificamos o fluxo laboratorial da prótese dentária.' },
              { label: 'É digital', desc: 'Plataforma 100% digital e segura para o seu consultório.' },
            ].map((item, i) => (
              <div key={i} className={`p-5 rounded-lg ${i === 0 ? 'bg-turquesa text-white' : i === 1 ? 'bg-escuro text-white' : 'bg-amarelo text-escuro'}`}>
                <div className="font-black text-sm mb-2">{item.label}</div>
                <div className="text-xs leading-relaxed opacity-80">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[10px] font-black uppercase tracking-widest text-turquesa mb-3">Vantagens</div>
            <h2 className="text-4xl font-black text-escuro">
              Confira os benefícios desta nova experiência
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {beneficios.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3 className="font-black text-escuro text-sm mb-2 group-hover:text-turquesa transition-colors">{b.title}</h3>
                <p className="text-cinza2 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section className="bg-turquesa py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[10px] font-black uppercase tracking-widest text-amarelo mb-3">Portfólio</div>
            <h2 className="text-4xl font-black text-white">Conheça nossa linha de serviços</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {servicos.map((s, i) => (
              <Link
                key={i}
                href={s.href}
                className="bg-white/10 border border-white/20 rounded-lg p-5 hover:bg-white hover:text-turquesa transition-all group"
              >
                <div className="text-white group-hover:text-turquesa font-bold text-sm leading-snug transition-colors">
                  {s.title}
                </div>
                <div className="text-white/50 group-hover:text-turquesa/70 text-xs mt-2 font-semibold transition-colors">
                  ver mais →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTAL CTA ── */}
      <section className="bg-escuro py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-turquesa mb-4">Portal KION</div>
          <h2 className="text-4xl font-black text-white leading-tight mb-6">
            Tenha acesso ao futuro a apenas um clique de distância
          </h2>
          <p className="text-cinza2 leading-relaxed mb-10">
            Aposente a ordem de serviços de papel e organize todos os fluxos da sua clínica pela My Kion. Em um único lugar, visualize o status das solicitações, entrega, pagamento e histórico.
          </p>
          <a
            href="https://clinic.kiwid.app/auth/login"
            target="_blank"
            className="inline-block bg-amarelo text-escuro font-black text-sm uppercase tracking-wider px-10 py-4 rounded transition hover:bg-turquesa hover:text-white"
          >
            Criar conta gratuita agora →
          </a>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[10px] font-black uppercase tracking-widest text-turquesa mb-3">Depoimentos</div>
            <h2 className="text-4xl font-black text-escuro">Veja o que dizem os nossos clientes</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {depoimentos.map((d, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="text-turquesa text-4xl font-black mb-4">"</div>
                <p className="text-cinza1 leading-relaxed mb-6 text-sm">{d.texto}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-turquesa/20 flex items-center justify-center text-turquesa font-black text-sm">
                    {d.nome[0]}
                  </div>
                  <div className="font-black text-escuro text-sm">{d.nome}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-turquesa mb-3">Newsletter</div>
          <h2 className="text-3xl font-black text-escuro mb-4">Assine a newsletter</h2>
          <p className="text-cinza1 text-sm mb-8">Receba conteúdos exclusivos sobre odontologia digital.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="seu@email.com.br"
              className="flex-1 px-4 py-3 rounded border border-gray-200 text-sm outline-none focus:border-turquesa transition-colors"
            />
            <button className="bg-turquesa text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-escuro transition-colors">
              Assinar
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
