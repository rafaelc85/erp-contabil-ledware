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
| **Escritório** | Agenda de Obrigações (calendário) · Tarefas (kanban) · Documentos & Mensagens · Contratos & Honorários |
| **Cadastros** | Clientes · Plano de Contas (árvore) · Cadastros Auxiliares (centros de custo, contas, patrimônio, certificados) |
| **Contabilidade** | Lançamentos (partida dobrada) · Demonstrações (DRE / Balancete) · Fechamento Contábil (checklist) |
| **Fiscal** | Notas Fiscais · Apuração de Impostos (memória de cálculo) · Guias DARF/DAS/GPS/FGTS · SPED & Declarações |
| **Folha & Pessoal** | Funcionários · Folha de Pagamento (férias, rescisões, 13º) · eSocial & EFD-Reinf |
| **Financeiro** | Contas a Receber · Contas a Pagar · Conciliação Bancária · Fluxo de Caixa · Cobrança Boletos & PIX |
| **Administração** | Usuários & Permissões · Auditoria & LGPD · Configurações |
| **Portal do Cliente** | Início · Documentos · Mensagens · Faturas · Folha & Holerites |

## Interações demonstradas

- Filtros por status (tabs), seleção em lote com barra de ações, paginação e chips de filtro funcionais
- Kanban de tarefas com arrastar e soltar (estilo Trello) e detalhe da tarefa
- Fichas de detalhe (cliente, funcionário, folha, rescisão) em modal
- Modais: novo título financeiro, lançamento contábil, nova tarefa
- Conciliação bancária com sugestão de pareamento (aceitar sugestão dá baixa)
- Checklist de fechamento com progressão de etapas
- Multiempresa (dados isolados por empresa) e persona escritório × cliente

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
