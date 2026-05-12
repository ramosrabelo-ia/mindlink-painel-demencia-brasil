import { useState } from "react";
import {
  ComposedChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

export default function App() {
  const [scenario, setScenario] = useState("moderado");

  const scenarioMeta = {
    conservador: {
      label: "Conservador",
      detail: "Mantém taxa observada sem aceleração adicional.",
      multiplier: 0.9,
    },
    moderado: {
      label: "Moderado",
      detail: "Projeta pressão hospitalar acompanhando envelhecimento 60+.",
      multiplier: 1,
    },
    critico: {
      label: "Crítico",
      detail: "Adiciona pressão por subnotificação e rede territorial tensionada.",
      multiplier: 1.18,
    },
  };

  const baseProjection = [
    { ano: "2020", pop60: 29.9, internacoes: 7251 },
    { ano: "2025", pop60: 34.6, internacoes: 8390 },
    { ano: "2030", pop60: 40.3, internacoes: 9773 },
    { ano: "2035", pop60: 47.1, internacoes: 11422 },
    { ano: "2040", pop60: 53.7, internacoes: 13022 },
    { ano: "2050", pop60: 64.5, internacoes: 15641 },
  ];

  const projection = baseProjection.map((item, index) => ({
    ...item,
    internacoesCenario: Math.round(item.internacoes * scenarioMeta[scenario].multiplier),
    pressao: Math.round(42 + index * 9.5 * scenarioMeta[scenario].multiplier),
  }));

  const kpis = [
    {
      label: "População 60+ projetada",
      value: "29,9M → 64,5M",
      note: "Projeção 2020–2050 usada como motor demográfico do modelo",
    },
    {
      label: "Internações estimadas",
      value: "7.251 → 15.641",
      note: "AIH/ano por demência no cenário demonstrativo nacional",
    },
    {
      label: "Variação acumulada",
      value: "+116%",
      note: "Crescimento simulado da pressão hospitalar até 2050",
    },
    {
      label: "Fator metodológico",
      value: "DIAG_PRINC + DIAG_SECUN",
      note: "Leitura ampliada para reduzir subnotificação assistencial",
    },
  ];

  const monthly = [
    { mes: "jan/23", principal: 92, qualquer: 740, previsao: null },
    { mes: "mar/23", principal: 95, qualquer: 780, previsao: null },
    { mes: "mai/23", principal: 101, qualquer: 835, previsao: null },
    { mes: "jul/23", principal: 110, qualquer: 890, previsao: null },
    { mes: "set/23", principal: 108, qualquer: 920, previsao: null },
    { mes: "nov/23", principal: 116, qualquer: 960, previsao: null },
    { mes: "jan/24", principal: 119, qualquer: 990, previsao: null },
    { mes: "mar/24", principal: 124, qualquer: 1035, previsao: null },
    { mes: "mai/24", principal: 130, qualquer: 1070, previsao: null },
    { mes: "jul/24", principal: 133, qualquer: 1115, previsao: null },
    { mes: "set/24", principal: 138, qualquer: 1160, previsao: null },
    { mes: "nov/24", principal: 142, qualquer: 1190, previsao: 1190 },
    { mes: "jan/25", principal: null, qualquer: null, previsao: 1215 },
    { mes: "mar/25", principal: null, qualquer: null, previsao: 1245 },
    { mes: "mai/25", principal: null, qualquer: null, previsao: 1280 },
    { mes: "jul/25", principal: null, qualquer: null, previsao: 1310 },
    { mes: "set/25", principal: null, qualquer: null, previsao: 1345 },
    { mes: "nov/25", principal: null, qualquer: null, previsao: 1360 },
  ];

  const causes = [
    { cid: "J18", rotulo: "Pneumonia", casos: 382 },
    { cid: "N39", rotulo: "Infecção urinária", casos: 205 },
    { cid: "J69", rotulo: "Pneumonia aspirativa", casos: 168 },
    { cid: "S72", rotulo: "Fratura de fêmur", casos: 129 },
    { cid: "I63", rotulo: "AVC isquêmico", casos: 94 },
    { cid: "E86", rotulo: "Desidratação", casos: 76 },
  ];

  const territories = [
    { lugar: "São Paulo", uf: "SP", score: 91, variacao: "+22%", classe: "Crítico", leitos: "Pressão crescente" },
    { lugar: "Rio de Janeiro", uf: "RJ", score: 84, variacao: "+19%", classe: "Alto", leitos: "Rede tensionada" },
    { lugar: "Minas Gerais", uf: "MG", score: 81, variacao: "+18%", classe: "Alto", leitos: "Interiorização do risco" },
    { lugar: "Bahia", uf: "BA", score: 74, variacao: "+15%", classe: "Médio-alto", leitos: "Atenção regional" },
    { lugar: "Paraná", uf: "PR", score: 70, variacao: "+14%", classe: "Médio", leitos: "Monitorar tendência" },
    { lugar: "Pernambuco", uf: "PE", score: 67, variacao: "+13%", classe: "Médio", leitos: "Capacidade sensível" },
  ];

  const architecture = [
    ["1", "SIH/SUS", "AIH reduzida, CID principal/secundário, permanência, valor e óbito"],
    ["2", "CNES", "Leitos, estabelecimentos, equipes e capacidade instalada"],
    ["3", "IBGE", "População 60+, faixa etária, sexo e projeção demográfica"],
    ["4", "PySUS + Pandas", "Extração, limpeza, padronização CID-10 e agregações"],
    ["5", "Oracle Autonomous DB", "Base analítica relacional com séries temporais e joins"],
    ["6", "Modelo preditivo", "Cenários 12m, 5 anos e 2050 com variáveis demográficas"],
    ["7", "React + Select AI", "Dashboard, alertas e consulta em linguagem natural"],
  ];

  const techStack = [
    {
      layer: "Dados públicos",
      items: ["SIH/SUS", "CNES", "DATASUS/TabNet", "IBGE Rev. 2024"],
      purpose: "Fontes auditáveis para demanda, capacidade e denominadores populacionais.",
    },
    {
      layer: "ETL e análise",
      items: ["Python", "PySUS", "Pandas", "Parquet/CSV"],
      purpose: "Coleta, conversão DBC, filtros CID-10, agregações mensais e séries territoriais.",
    },
    {
      layer: "Banco e IA Oracle",
      items: ["OCI", "Object Storage", "Autonomous Database", "Oracle Select AI"],
      purpose: "Persistência, rastreabilidade, consulta relacional e perguntas em linguagem natural.",
    },
    {
      layer: "Modelo e visualização",
      items: ["Scikit-learn", "Prophet", "React", "Vite", "Recharts", "GitHub Pages"],
      purpose: "Projeções, cenários, dashboard interativo e publicação do protótipo.",
    },
  ];

  const projectionUseCases = [
    "Projeção nacional de internações por demência até 2050",
    "Ranking de UFs/municípios com maior aceleração territorial",
    "Cenários de pressão por leito: conservador, moderado e crítico",
    "Estimativa de casos ocultos ao comparar DIAG_PRINC vs DIAG_SECUN",
    "Alertas para planejamento orçamentário e expansão de rede",
    "Consulta executiva via Select AI sobre indicadores e territórios",
  ];

  return (
    <main className="min-h-screen bg-[#f6faf9] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-[1.1rem] bg-teal-700 text-2xl font-black text-white">M</div>
            <div>
              <p className="m-0 text-xl font-black tracking-[0.26em] text-teal-700">MINDLINK</p>
              <p className="m-0 text-[11px] font-black uppercase tracking-[0.16em] text-orange-500">Oracle + FIAP 2026 · Sprint 2</p>
            </div>
          </div>
          <nav className="hidden gap-5 text-sm font-extrabold text-slate-500 md:flex">
            <a href="#metodologia">Metodologia</a>
            <a href="#projecoes">Projeções</a>
            <a href="#territorio">Território</a>
            <a href="#arquitetura">Arquitetura</a>
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-5 inline-flex rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-teal-800">
              Protótipo técnico demonstrativo · dados simulados
            </div>
            <h1 className="mb-5 text-4xl font-black leading-none tracking-[-0.05em] text-[#1f406d] md:text-6xl">
              PAINEL ANALÍTICO-PREDITIVO <br /> DE DEMÊNCIA NO BRASIL
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Modelo de apoio à decisão pública para estimar pressão hospitalar associada à demência, combinando AIH/SIH-SUS, capacidade CNES, projeções IBGE e cenários preditivos em arquitetura Oracle.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4"><b className="block text-[#10264a]">Unidade de análise</b>AIH mensal por território</div>
              <div className="rounded-2xl bg-slate-50 p-4"><b className="block text-[#10264a]">Recorte clínico</b>F00–F03 + G30/G31</div>
              <div className="rounded-2xl bg-slate-50 p-4"><b className="block text-[#10264a]">Saída</b>risco, tendência e alerta</div>
            </div>
          </div>

          <section className="grid gap-4 sm:grid-cols-2">
            {kpis.map((item) => (
              <article key={item.label} className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="m-0 text-sm font-extrabold text-slate-500">{item.label}</p>
                <p className="my-2 text-3xl font-black tracking-[-0.04em] text-[#10264a]">{item.value}</p>
                <p className="m-0 text-sm leading-5 text-slate-500">{item.note}</p>
              </article>
            ))}
          </section>
        </section>

        <section id="projecoes" className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Dashboard interativo demonstrativo</p>
              <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-[#10264a]">Brasil envelhece → pressão estimada sobre internações por demência</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(scenarioMeta).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setScenario(key)}
                  className={`rounded-2xl px-4 py-2 text-sm font-black ${
                    scenario === key
                      ? "bg-[#10264a] text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <p className="mb-4 max-w-4xl text-sm leading-6 text-slate-500">
            Simulação técnica baseada em premissas de projeção demográfica 60+ e taxa observada de internações por demência. Os valores são demonstrativos e serão substituídos por carga real via PySUS na Sprint 3. Cenário selecionado: <b>{scenarioMeta[scenario].label}</b> — {scenarioMeta[scenario].detail}
          </p>
          <div className="h-[410px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projection} margin={{ top: 16, right: 28, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} label={{ value: "População 60+ (milhões)", angle: -90, position: "insideLeft" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: "Internações estimadas (AIH/ano)", angle: 90, position: "insideRight" }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="pop60" name="População 60+ (milhões)" fill="#0f766e" radius={[8, 8, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="internacoesCenario" name="Internações por demência (cenário)" stroke="#f97316" strokeWidth={4} dot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section id="metodologia" className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Leitura metodológica</p>
              <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-[#10264a]">DIAG_PRINC isolado vs leitura ampliada da pressão assistencial</h2>
            </div>
            <p className="max-w-md text-sm text-slate-500">Série simulada para demonstrar o impacto de incluir diagnóstico secundário no filtro de demência.</p>
          </div>
          <div className="h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 10, right: 25, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="qualquer" name="DIAG_PRINC + DIAG_SECUN" stroke="#f97316" fill="#fed7aa" strokeWidth={3} />
                <Area type="monotone" dataKey="principal" name="DIAG_PRINC" stroke="#0f766e" fill="#ccfbf1" strokeWidth={3} />
                <Line type="monotone" dataKey="previsao" name="Previsão 12m" stroke="#10264a" strokeWidth={3} strokeDasharray="6 6" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section id="territorio" className="mt-6 grid gap-6 lg:grid-cols-[1.03fr_0.97fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Mapa territorial simulado</p>
            <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-[#10264a]">Previsão de explosão territorial da demanda</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              A visualização abaixo simula um ranking territorial. Na versão com dados reais, o score será calculado por crescimento de AIH, população 60+, permanência, custo, óbito e capacidade CNES.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {territories.map((item) => (
                <article key={item.uf} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="m-0 text-lg font-black text-[#10264a]">{item.uf} · {item.lugar}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.leitos}</p>
                    </div>
                    <div className="rounded-2xl bg-orange-100 px-3 py-2 text-right">
                      <p className="m-0 text-[10px] font-black uppercase text-orange-700">{item.classe}</p>
                      <p className="m-0 text-xl font-black text-orange-700">{item.variacao}</p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white">
                    <div className="h-2 rounded-full bg-teal-700" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Score territorial: {item.score}/100</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Condições associadas</p>
            <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-[#10264a]">Causas principais quando a demência aparece como secundária</h2>
            <div className="mt-5 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={causes} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="cid" type="category" tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value, name, props) => [`${value} casos`, props.payload.rotulo]} />
                  <Bar dataKey="casos" name="Casos" fill="#0f766e" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Tecnologias utilizadas</p>
          <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-[#10264a]">Stack técnica e papel de cada camada</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-4">
            {techStack.map((group) => (
              <article key={group.layer} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="m-0 text-lg font-black text-[#10264a]">{group.layer}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">{item}</span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{group.purpose}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Projeções possíveis</p>
            <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-[#10264a]">O que o modelo pode responder</h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Mesmo na fase simulada, o protótipo já explicita quais perguntas analíticas serão respondidas quando a carga real for conectada ao pipeline.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {projectionUseCases.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">{item}</div>
            ))}
          </div>
        </section>

        <section id="arquitetura" className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Arquitetura analítica</p>
          <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-[#10264a]">Dados públicos atravessam 7 camadas até virar decisão.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-7">
            {architecture.map(([number, title, desc]) => (
              <article key={number} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-700 font-black text-white">{number}</span>
                <b className="mt-3 block text-[#10264a]">{title}</b>
                <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm lg:grid-cols-[1fr_0.92fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Status da Fase 2</p>
            <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-[#10264a]">Protótipo demonstrativo, não carga real</h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Os dados desta página são simulados para demonstrar interface, metodologia e arquitetura. A leitura real será feita na Sprint 3 com PySUS, SIH/SUS, CNES, IBGE e persistência em base analítica Oracle.
            </p>
          </div>
          <div className="rounded-[1.6rem] bg-slate-950 p-6 font-mono text-sm text-slate-100">
            <p><span className="text-teal-300">$</span> npm install</p>
            <p><span className="text-teal-300">$</span> npm run dev</p>
            <br />
            <p className="text-slate-400"># Deploy automático no GitHub Pages</p>
            <p><span className="text-teal-300">$</span> git push origin main</p>
          </div>
        </section>

        <footer className="mt-6 rounded-[1.6rem] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          <b>MindLink</b> · Painel analítico-preditivo de demência no Brasil · protótipo técnico demonstrativo · Equipe She Leads
        </footer>
      </div>
    </main>
  );
}
