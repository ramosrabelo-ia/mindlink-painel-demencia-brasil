# MindLink — Painel Analítico-Preditivo de Demência no Brasil

Protótipo técnico demonstrativo da **Sprint 2 — Arquitetura** do projeto MindLink, desenvolvido pela equipe **She Leads** no Challenge Oracle + FIAP 2026.

> Esta versão não usa carga real do DATASUS. Os gráficos e scores são simulados para demonstrar interface, metodologia e arquitetura. A Sprint 3 substituirá esses valores por CSV/JSON gerados via PySUS a partir do SIH/SUS, CNES e IBGE.

## Entrega da Fase 2

- Página pública em React.
- Dashboard interativo demonstrativo.
- Gráfico de projeção 2020–2050.
- Cenários conservador, moderado e crítico.
- Comparação metodológica entre `DIAG_PRINC` e `DIAG_PRINC + DIAG_SECUN`.
- Simulação de explosão territorial da demanda.
- Ranking de causas associadas quando demência aparece como diagnóstico secundário.
- Arquitetura analítica em 7 camadas.
- Stack técnica detalhada.

## Stack

- React
- Vite
- Tailwind CSS
- Recharts
- GitHub Pages
- GitHub Actions

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicar no GitHub Pages

1. Criar o repositório `mindlink-painel-demencia-brasil`.
2. Subir todos os arquivos.
3. Ir em **Settings > Pages**.
4. Selecionar **GitHub Actions**.
5. Aguardar a Action finalizar.

URL esperada:

```text
https://ramosrabelo-ia.github.io/mindlink-painel-demencia-brasil/
```

## Ajuste se mudar o nome do repositório

Em `vite.config.js`, troque:

```js
base: '/mindlink-painel-demencia-brasil/',
```

para o nome correto do repositório.

## Próxima etapa

Executar pipeline real com:

- PySUS
- SIH/SUS
- CNES
- IBGE
- Oracle Autonomous Database
- Oracle Select AI
