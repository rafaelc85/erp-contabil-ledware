/* =========================================================================
   ERP Contábil Ledware — protótipo navegável (sem backend, dados fictícios)
   ========================================================================= */

/* ---------- toast ---------- */
var toastTimer;
function toast(msg){
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 3400);
}

/* ---------- estágios: login / app / portal ---------- */
function stages(id){
  ['login','app','portal'].forEach(function(s){
    document.getElementById(s).classList.toggle('on', s === id);
  });
  window.scrollTo(0,0);
}
function enter(){
  stages('app');
  toast('Bem-vindo! Sessão iniciada com verificação em duas etapas (2FA)');
}
function restart(){ stages('login'); persona('sys', true); closeDrawer(); }
function persona(p, silent){
  document.getElementById('sw-sys').classList.toggle('on', p === 'sys');
  document.getElementById('sw-por').classList.toggle('on', p === 'por');
  if(p === 'por'){
    stages('portal');
    if(!silent) toast('Você está vendo o que o cliente do escritório vê no Portal do Cliente');
  } else if(!document.getElementById('login').classList.contains('on')){
    stages('app');
  }
}

/* ---------- navegação entre views ---------- */
function go(v, btn){
  document.querySelectorAll('#app .view').forEach(function(x){ x.classList.remove('on'); });
  var target = document.getElementById('v-' + v);
  if(!target){ toast('Tela indisponível'); return; }
  target.classList.add('on');
  document.querySelectorAll('.nav button[data-v]').forEach(function(b){ b.classList.remove('on'); });
  if(btn && btn.dataset && btn.dataset.v){
    btn.classList.add('on');
  } else {
    var nb = document.querySelector('.nav button[data-v="' + v + '"]');
    if(nb) nb.classList.add('on');
  }
  closeDrawer();
  window.scrollTo(0,0);
}
/* atalho: navegar por nome a partir de links no conteúdo */
function nav(v){ go(v, null); }

/* ---------- gaveta mobile ---------- */
function openDrawer(){
  document.getElementById('side').classList.add('open');
  document.getElementById('scrim').classList.add('on');
}
function closeDrawer(){
  var s = document.getElementById('side');
  if(s) s.classList.remove('open');
  var sc = document.getElementById('scrim');
  if(sc) sc.classList.remove('on');
}

/* ---------- multiempresa ---------- */
function toggleComp(e){ e.stopPropagation(); document.getElementById('compdd').classList.toggle('open'); }
function pickComp(name, initials, el){
  document.getElementById('comp-name').textContent = name;
  document.getElementById('comp-av').textContent = initials;
  document.querySelectorAll('.comp-echo').forEach(function(x){ x.textContent = name; });
  document.querySelectorAll('#compdd button').forEach(function(b){ b.classList.remove('sel'); });
  el.classList.add('sel');
  document.getElementById('compdd').classList.remove('open');
  toast('Empresa alterada para “' + name + '” — mesmos usuários, dados isolados');
}
document.addEventListener('click', function(e){
  var dd = document.getElementById('compdd');
  if(dd && dd.classList.contains('open') && !e.target.closest('.comp')) dd.classList.remove('open');
});

/* ---------- modal lançamento financeiro ---------- */
function openModal(tipo){
  document.getElementById('mback').classList.add('open');
  segTipo(tipo || 'in');
}
function closeModal(){ document.getElementById('mback').classList.remove('open'); }
function segTipo(t){
  var si = document.getElementById('seg-in'), so = document.getElementById('seg-out');
  si.className = t === 'in' ? 'on-in' : '';
  so.className = t === 'out' ? 'on-out' : '';
  document.getElementById('mtitle').textContent = t === 'in' ? 'Novo título — a receber' : 'Novo título — a pagar';
  document.getElementById('m-desc').textContent = t === 'in' ? 'Honorários contábeis · Set/2026' : 'Tarifas bancárias · Ago/2026';
  document.getElementById('m-who').textContent  = t === 'in' ? 'Padaria São José ME' : 'Banco do Brasil';
  document.getElementById('m-val').textContent  = t === 'in' ? 'R$ 890,00' : 'R$ 24,90';
  document.getElementById('m-cat').textContent  = t === 'in' ? 'Honorários' : 'Despesas fixas';
  document.getElementById('m-bol').style.display = t === 'in' ? 'flex' : 'none';
}

/* ---------- modal lançamento contábil ---------- */
function openLanc(){ document.getElementById('lback').classList.add('open'); }
function closeLanc(){ document.getElementById('lback').classList.remove('open'); }

/* ---------- modal nova tarefa ---------- */
function openTarefa(){ document.getElementById('tback').classList.add('open'); }
function closeTarefa(){ document.getElementById('tback').classList.remove('open'); }

document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){ closeModal(); closeLanc(); closeTarefa(); closeG(); closeDrawer(); }
});

/* ---------- checkbox / seleção em lote ---------- */
function ck(el){
  el.classList.toggle('on');
  var tr = el.closest('tr');
  if(tr && tr.closest('[data-bulk]')){
    var wrap = tr.closest('[data-bulk]');
    tr.classList.toggle('rowsel', el.classList.contains('on'));
    var sel = wrap.querySelectorAll('.chk.on'), sum = 0;
    sel.forEach(function(c){
      var r = c.closest('tr');
      if(r) sum += parseFloat(r.dataset.val || 0);
    });
    var bulkId = wrap.dataset.bulk;
    var bulk = document.getElementById(bulkId);
    if(bulk){
      bulk.classList.toggle('show', sel.length > 0);
      var txt = bulk.querySelector('.bulktxt');
      if(txt) txt.textContent = sel.length + ' selecionado' + (sel.length > 1 ? 's' : '') +
        (sum > 0 ? ' · R$ ' + sum.toLocaleString('pt-BR', {minimumFractionDigits:2}) : '');
    }
  }
}

/* ---------- filtro por status (tabelas com data-st) ---------- */
function filtra(tabId, tbId, f, btn){
  document.querySelectorAll('#' + tbId + ' tbody tr').forEach(function(tr){
    tr.style.display = (f === 'all' || tr.dataset.st === f) ? '' : 'none';
  });
  document.querySelectorAll('#' + tabId + ' button').forEach(function(b){
    b.classList.toggle('on', b.dataset.f === f);
  });
}

/* ---------- abas genéricas (troca painéis data-pane) ---------- */
function aba(groupId, pane, btn){
  document.querySelectorAll('[data-group="' + groupId + '"]').forEach(function(p){
    p.style.display = p.dataset.pane === pane ? '' : 'none';
  });
  var tabs = btn.parentElement.querySelectorAll('button');
  tabs.forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
}

/* ---------- conciliação bancária ---------- */
function conc1(){
  ['ex1','ln1'].forEach(function(id){
    var el = document.getElementById(id);
    el.classList.remove('hl'); el.classList.add('ok');
  });
  var mid = document.getElementById('mid1');
  mid.textContent = '✓'; mid.className = 'mlink ok';
  document.getElementById('conf1').textContent = '';
  document.getElementById('ln1l2').innerHTML = 'conciliado agora · baixa registrada no contas a receber ✓';
  var b = document.getElementById('concall');
  b.textContent = 'Conciliar sugeridos (0)'; b.disabled = true;
  toast('Conciliado! Título baixado e saldo atualizado');
}
function concAll(){ conc1(); }

/* ---------- fechamento contábil (checklist) ---------- */
function fecStep(el, msg){
  var icon = el.querySelector('.mlink');
  if(icon){ icon.textContent = '✓'; icon.className = 'mlink ok'; }
  el.classList.add('ok');
  toast(msg || 'Etapa concluída');
}

/* ---------- portal do cliente ---------- */
function pgo(v, btn){
  document.querySelectorAll('#portal .pview').forEach(function(x){ x.classList.remove('on'); });
  document.getElementById('p-' + v).classList.add('on');
  document.querySelectorAll('.pnav button').forEach(function(b){ b.classList.remove('on'); });
  if(btn) btn.classList.add('on');
  window.scrollTo(0,0);
}

/* ---------- busca no menu lateral ---------- */
function navFilter(q){
  q = (q || '').toLowerCase().trim();
  document.querySelectorAll('#nav > li').forEach(function(li){
    if(li.classList.contains('sec')){ li.style.display = q ? 'none' : ''; return; }
    var t = li.textContent.toLowerCase();
    li.style.display = (!q || t.indexOf(q) >= 0) ? '' : 'none';
  });
}

/* =========================================================================
   Extensões: kanban drag & drop, modal de detalhe, filtros e paginação
   ========================================================================= */

/* ---------- paginação (visual) ---------- */
function pgn(btn){
  var wrap = btn.parentElement;
  var pages = Array.prototype.slice.call(wrap.querySelectorAll('.pg'));
  var nums = pages.filter(function(b){ return /^\d+$/.test(b.textContent.trim()); });
  var target = btn;
  if(!/^\d+$/.test(btn.textContent.trim())){
    var cur = nums.findIndex(function(b){ return b.classList.contains('on'); });
    target = nums[Math.min(cur + 1, nums.length - 1)];
  }
  pages.forEach(function(b){ b.classList.remove('on'); });
  if(target) target.classList.add('on');
}

/* ---------- chips de filtro: alternam entre valores ---------- */
function fcycle(el, opts){
  var label = el.querySelector('span') ? el.querySelector('span').textContent : '';
  var cur = el.textContent.replace(label, '').replace('▾', '').trim();
  var i = (opts.indexOf(cur) + 1) % opts.length;
  el.innerHTML = '<span>' + label + '</span> ' + opts[i] + ' ▾';
}

/* ---------- modal genérico de detalhe ---------- */
var CLI_DATA = {
  'Padaria São José ME':      ['12.345.678/0001-90', 'Simples Nacional · Anexo I', 'Ana Souza', 'R$ 890,00', 'Mar/2020'],
  'Auto Peças Cruzeiro LTDA': ['98.765.432/0001-10', 'Lucro Presumido', 'Ana Souza', 'R$ 1.150,00', 'Jun/2019'],
  'Clínica Vida':             ['45.678.912/0001-55', 'Lucro Presumido', 'Carla Nunes', 'R$ 640,00', 'Jan/2022'],
  'Transportes Alvorada':     ['33.222.111/0001-77', 'Lucro Real', 'Bruno Lima', 'R$ 1.180,00', 'Set/2018'],
  'Mercado Central':          ['22.333.444/0001-21', 'Simples Nacional', 'Ana Souza', 'R$ 890,00', 'Fev/2021'],
  'Studio Fit Academia':      ['55.666.777/0001-33', 'Simples Nacional', 'Carla Nunes', 'R$ 520,00', 'Ago/2023'],
  'Barbearia Estilo':         ['77.888.999/0001-44', 'Simples Nacional', 'Diego Alves', 'R$ 420,00', 'Jul/2026'],
  'Pet Shop Amigo Fiel':      ['11.222.333/0001-88', 'Simples Nacional', 'Rafael C.', 'R$ 480,00', 'Nov/2022']
};
var FUNC_DATA = {
  'Maria Aparecida Santos': ['Padeira chefe', '03/02/2020', 'R$ 3.240,00', '2 dependentes', 'Dez/2026 (programadas)'],
  'João Pedro Oliveira':    ['Atendente', '15/07/2023', 'R$ 1.720,00', 'sem dependentes', 'período vence 14/10 ⚠'],
  'Fernanda Costa Lima':    ['Confeiteira', '01/03/2022', 'R$ 2.480,00', '1 dependente', '01–30/09 (aviso enviado)'],
  'Carlos Eduardo Ramos':   ['Auxiliar de produção', '10/01/2024', 'R$ 1.640,00', 'sem dependentes', 'a programar'],
  'José Pereira Filho':     ['Entregador', '05/05/2021', 'R$ 1.880,00', '1 dependente', '— (rescisão em curso)']
};
function fldRow(label, val){
  return '<div class="fld"><label>' + label + '</label><div class="inp">' + val + '</div></div>';
}
var GDET = {
  cliente: function(t){
    t = t || 'Padaria São José ME';
    var d = CLI_DATA[t] || ['—', '—', '—', '—', '—'];
    return { title: t, html:
      '<div class="frow">' + fldRow('CNPJ', d[0]) + fldRow('Regime tributário', d[1]) + '</div>' +
      '<div class="frow3">' + fldRow('Responsável', d[2]) + fldRow('Honorário mensal', d[3]) + fldRow('Cliente desde', d[4]) + '</div>' +
      '<div class="fld"><label>Serviços contratados</label><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="tag pri">Contábil</span><span class="tag pri">Fiscal</span><span class="tag pri">Folha</span><span class="tag">Portal do Cliente</span></div></div>' +
      '<div class="fld"><label>Atividade recente</label><div class="tline" style="margin-top:4px">' +
        '<div class="ti g"><b>Balancete Jul/2026 aprovado no portal</b><small>ontem 17:40</small></div>' +
        '<div class="ti"><b>18 XMLs importados pelo monitor</b><small>hoje 07:40</small></div>' +
        '<div class="ti w"><b>Honorário Ago/2026 gerado — boleto + PIX</b><small>15/08</small></div></div></div>' };
  },
  func: function(t){
    t = t || 'Maria Aparecida Santos';
    var d = FUNC_DATA[t] || ['—', '—', '—', '—', '—'];
    return { title: t, html:
      '<div class="frow">' + fldRow('Cargo', d[0]) + fldRow('Admissão', d[1]) + '</div>' +
      '<div class="frow3">' + fldRow('Salário base', d[2]) + fldRow('Dependentes', d[3]) + fldRow('Próximas férias', d[4]) + '</div>' +
      '<div class="fld"><label>Documentos</label><div class="duelist">' +
        '<div class="row"><div><div class="who">📄 Contrato de trabalho.pdf</div><div class="cat">assinado digitalmente</div></div><span class="pill ok"><i></i>OK</span></div>' +
        '<div class="row"><div><div class="who">📄 Exame admissional (ASO)</div><div class="cat">válido até renovar</div></div><span class="pill ok"><i></i>OK</span></div>' +
        '<div class="row"><div><div class="who">📄 Ficha de registro</div><div class="cat">eSocial S-2200 aceito</div></div><span class="pill ok"><i></i>OK</span></div></div></div>' };
  },
  resc: function(t){
    t = t || 'José Pereira Filho';
    return { title: 'Rescisão — ' + t, html:
      '<div class="frow3">' + fldRow('Modalidade', 'Dispensa sem justa causa') + fldRow('Aviso', 'Indenizado') + fldRow('Total rescisório', 'R$ 6.412,80') + '</div>' +
      '<div class="fld"><label>Checklist</label>' +
        '<div class="mitem ok"><div class="l1"><span class="mlink ok">✓</span> TRCT emitido e conferido</div></div>' +
        '<div class="mitem ok"><div class="l1"><span class="mlink ok">✓</span> Guia FGTS rescisório gerada</div></div>' +
        '<div class="mitem"><div class="l1"><span class="mlink q">›</span> Homologação agendada — 22/08</div></div>' +
        '<div class="mitem"><div class="l1"><span class="mlink q">›</span> Transmitir S-2299 ao eSocial</div></div></div>' };
  },
  folha: function(t){
    t = t || 'Jul/2026';
    return { title: 'Folha de Pagamento — ' + t, html:
      '<div class="frow3">' + fldRow('Total bruto', 'R$ 14.980,00') + fldRow('Encargos', 'R$ 4.052,50') + fldRow('Líquido', 'R$ 12.610,40') + '</div>' +
      '<div class="fld"><label>Colaboradores</label><div class="duelist">' +
        '<div class="row"><div><div class="who">Maria Aparecida Santos</div><div class="cat">Padeira chefe · 22 dias</div></div><span class="amt">R$ 2.874,10</span></div>' +
        '<div class="row"><div><div class="who">Fernanda Costa Lima</div><div class="cat">Confeiteira · 22 dias</div></div><span class="amt">R$ 2.201,60</span></div>' +
        '<div class="row"><div><div class="who">João Pedro Oliveira</div><div class="cat">Atendente · 22 dias + 6 h extras</div></div><span class="amt">R$ 1.598,45</span></div>' +
        '<div class="row"><div><div class="who">Carlos Eduardo Ramos</div><div class="cat">Aux. produção · 22 dias</div></div><span class="amt">R$ 1.489,20</span></div>' +
        '<div class="row"><div><div class="who">Demais colaboradores (4)</div><div class="cat">ver folha completa</div></div><span class="amt">R$ 4.447,05</span></div></div></div>' +
      '<div class="alert good" style="margin:0"><div class="ic">✓</div><div><b>Holerites publicados no portal</b><small>eSocial S-1200/S-1210 aceitos · guias FGTS e INSS geradas</small></div></div>' };
  }
};
function gOpen(kind, el){
  var title = null;
  if(el && el.closest){
    var tr = el.closest('tr');
    if(tr){ var mc = tr.querySelector('.main-cell'); if(mc) title = mc.textContent.trim(); }
  }
  var make = GDET[kind];
  if(!make) return;
  var d = make(title);
  document.getElementById('g-title').textContent = d.title;
  document.getElementById('g-body').innerHTML = d.html;
  document.getElementById('gback').classList.add('open');
}
function closeG(){
  var g = document.getElementById('gback');
  if(g) g.classList.remove('open');
}

/* ---------- detalhe de tarefa (a partir do cartão) ---------- */
function kopen(el){
  if(kSuppress) return;
  var t = el.querySelector('b') ? el.querySelector('b').textContent : 'Tarefa';
  var meta = el.querySelector('.meta') ? el.querySelector('.meta').textContent.trim() : '';
  document.getElementById('g-title').textContent = t;
  document.getElementById('g-body').innerHTML =
    (meta ? '<div><span class="tag pri">' + meta + '</span></div>' : '') +
    '<div class="fld"><label>Checklist</label>' +
      '<div class="ckrow" style="padding:5px 0"><button class="chk on" onclick="ck(this)" aria-label="etapa"></button> Reunir documentos e conferências</div>' +
      '<div class="ckrow" style="padding:5px 0"><button class="chk on" onclick="ck(this)" aria-label="etapa"></button> Executar e validar valores</div>' +
      '<div class="ckrow" style="padding:5px 0"><button class="chk" onclick="ck(this)" aria-label="etapa"></button> Revisão do contador</div>' +
      '<div class="ckrow" style="padding:5px 0"><button class="chk" onclick="ck(this)" aria-label="etapa"></button> Comunicar o cliente</div></div>' +
    '<div class="fld"><label>Comentários</label><div class="duelist">' +
      '<div class="row"><span class="avx">RC</span><div><div class="who">Rafael Contador</div><div class="cat">“Priorizar até quinta — o cliente pediu retorno.”</div></div><span class="d">ontem</span></div></div></div>' +
    '<div class="fld"><label>Novo comentário</label><div class="inp area">Escreva um comentário…</div></div>';
  document.getElementById('gback').classList.add('open');
}

/* ---------- kanban: arrastar e soltar (mouse e toque) ---------- */
var kCard = null, kGhost = null, kDragging = false, kSuppress = false;
var kStartX = 0, kStartY = 0, kOffX = 0, kOffY = 0;

function kcounts(){
  document.querySelectorAll('.kanban .kcol').forEach(function(col){
    var s = col.querySelector('h4 span');
    if(!s) return;
    var extra = parseInt(s.dataset.extra || '0', 10);
    s.textContent = col.querySelectorAll('.kcard').length + extra;
  });
}
document.addEventListener('pointerdown', function(e){
  var c = e.target.closest('.kcard');
  if(!c || e.button > 0) return;
  kCard = c; kDragging = false;
  kStartX = e.clientX; kStartY = e.clientY;
  var r = c.getBoundingClientRect();
  kOffX = e.clientX - r.left; kOffY = e.clientY - r.top;
});
document.addEventListener('pointermove', function(e){
  if(!kCard) return;
  if(!kDragging && Math.hypot(e.clientX - kStartX, e.clientY - kStartY) > 7){
    kDragging = true;
    kGhost = kCard.cloneNode(true);
    kGhost.classList.add('kghost');
    kGhost.style.width = kCard.offsetWidth + 'px';
    document.body.appendChild(kGhost);
    kCard.classList.add('kdrag-src');
  }
  if(!kDragging) return;
  e.preventDefault();
  kGhost.style.left = (e.clientX - kOffX) + 'px';
  kGhost.style.top  = (e.clientY - kOffY) + 'px';
  kGhost.style.display = 'none';
  var under = document.elementFromPoint(e.clientX, e.clientY);
  kGhost.style.display = '';
  var col = under && under.closest ? under.closest('.kcol') : null;
  document.querySelectorAll('.kcol').forEach(function(k){ k.classList.remove('kover'); });
  if(col){
    col.classList.add('kover');
    var cards = Array.prototype.slice.call(col.querySelectorAll('.kcard')).filter(function(k){ return k !== kCard; });
    var next = null;
    for(var i = 0; i < cards.length; i++){
      var r = cards[i].getBoundingClientRect();
      if(e.clientY < r.top + r.height / 2){ next = cards[i]; break; }
    }
    if(next) col.insertBefore(kCard, next); else col.appendChild(kCard);
  }
}, {passive:false});
function kEnd(e){
  if(kDragging){
    var col = kCard.closest('.kcol');
    document.querySelectorAll('.kcol').forEach(function(k){ k.classList.remove('kover'); });
    kCard.classList.remove('kdrag-src');
    if(kGhost){ kGhost.remove(); kGhost = null; }
    kcounts();
    if(col){
      var h4 = col.querySelector('h4');
      var name = h4 ? h4.childNodes[0].textContent.trim() : '';
      toast('Tarefa movida para “' + name + '”');
    }
    kSuppress = true;
    setTimeout(function(){ kSuppress = false; }, 80);
  }
  kCard = null; kDragging = false;
}
document.addEventListener('pointerup', kEnd);
document.addEventListener('pointercancel', kEnd);
