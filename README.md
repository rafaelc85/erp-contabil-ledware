# ERP Contábil Ledware — Protótipo Navegável

Mockup completo e navegável do **ERP Contábil da Ledware Tecnologia** (versão web), no mesmo formato do protótipo do módulo de Gestão Financeira. **100% estático** — HTML + CSS + JS puros, sem backend, todos os dados são fictícios.

**▶ Acesse:** https://rafaelc85.github.io/erp-contabil-ledware/

## Como navegar

1. Clique em **Entrar** na tela de login
2. Use o menu lateral para percorrer os módulos (no celular, o menu vira gaveta pelo botão ☰)
3. Alterne para o **Portal do Cliente** pelo seletor no topo da página
4. Troque a empresa ativa pelo seletor multiempresa no menu lateral

## Módulos do protótipo

| Área | Telas |
|---|---|
| **Visão geral** | Dashboard da empresa · Dashboard do Escritório |
| **Escritório** | Comercial & CRM (funil + precificação) · Societário & Legalização (processos e protocolos) · Agenda de Obrigações (calendário fiscal editável) · Tarefas (kanban drag & drop) · Documentos & Mensagens (Cofre Seguro + assinatura eletrônica de envelopes) · Contratos & Honorários · WhatsApp & Comunicação (Evolution API) |
| **Cadastros** | Clientes · Plano de Contas (árvore) · Cadastros Auxiliares (centros de custo, contas, patrimônio, certificados) |
| **Contabilidade** | Central de Relatórios (PDF/Excel + envios agendados) · Lançamentos (partida dobrada + CLPs de contabilização automática) · Demonstrações (DRE / Balancete / Balanço / Razão) · Fechamento Contábil (checklist) |
| **Fiscal** | Planejamento Tributário (simulador Simples × Presumido × Real + oportunidades) · IRPF dos Sócios (declarações, malha, restituições) · Notas Fiscais (captura automática DFe + buscador NFS-e + IA de CFOP) · Apuração de Impostos (Simples, ICMS/ST/DIFAL, PIS/COFINS, IRPJ/CSLL, ISS & retenções) · Livros Fiscais com observações · Guias DARF/DAS/GPS/FGTS · SPED & Declarações (auditoria eletrônica pré-transmissão, retificação de DCTFWeb, legados SEFIP/RAIS) |
| **Folha & Pessoal** | Funcionários · Folha de Pagamento (férias, rescisões, 13º, PLR, adiantamentos, pró-labore, autônomos/RPA) · FGTS Digital (guias, procurações, consulta de empregador, recomposição, conferência) · eSocial & EFD-Reinf (eventos de tabela, SST, exclusão S-3000, reabertura S-1298/1299) |
| **Financeiro** | Contas a Receber · Contas a Pagar · Conciliação Bancária · Fluxo de Caixa · Cobrança Boletos & PIX |
| **Administração** | Usuários & Permissões · Auditoria & LGPD · Integrações & Automações (Monitor Integra Contador por empresa — DCTFWeb, MIT, FGTS, eConsignado, PGDAS, CND… — visões por situação e por pagamento, custo Serpro com repasse por consulta, eSocial automático, puxar boletos, eConsignado com busca automática parametrizável) · Configurações · Ledware Growth (módulo opcional) · Central de Ajuda (tutoriais do canal + changelog de versão) |
| **Portal do Cliente** | Início · Documentos · Mensagens · Faturas · Folha & Holerites · Checklist do mês (envio de docs + confirmações do período) |

## Interações demonstradas

- Filtros por status (tabs), seleção em lote com barra de ações, paginação e chips de filtro funcionais
- Kanban de tarefas com arrastar e soltar (estilo Trello) e detalhe da tarefa
- Fichas de detalhe (cliente, funcionário, folha, rescisão) em modal
- Modais: novo título financeiro, lançamento contábil, nova tarefa
- Conciliação bancária com sugestão de pareamento (aceitar sugestão dá baixa)
- Checklist de fechamento com progressão de etapas
- Multiempresa (dados isolados por empresa) e persona escritório × cliente
- Assistente IA nos dashboards (pergunte aos seus dados)
- Integração de ponto eletrônico (AFD/REP) alimentando a prévia da folha
- Cobrança por WhatsApp em um clique (régua automática + IA sugerindo ações)
- Calendário fiscal com datas padrão por regime e eventos personalizados do escritório
- Painel de consumo do Integra Contador (Serpro) com política de repasse por cliente

## Responsividade

- **Desktop** ≥ 1024px: sidebar fixa, grids em colunas
- **Tablet** < 1024px: sidebar vira gaveta, grids colapsam
- **Celular** < 680px: tabelas viram cartões empilhados, formulários em coluna única
- Tema do chrome do protótipo acompanha claro/escuro do sistema; suporte a `prefers-reduced-motion` e impressão

## Estrutura

```
index.html   — todas as telas (SPA estática por seções)
styles.css   — design tokens + componentes + breakpoints
app.js       — navegação, filtros, modais, toasts (JS puro, sem dependências)
```

---
Protótipo produzido para avaliação interna. Nomes, empresas e valores são fictícios.
