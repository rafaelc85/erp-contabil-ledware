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
  if(e.key === 'Escape'){ closeModal(); closeLanc(); closeTarefa(); closeG(); closeF(); closeDrawer(); }
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

/* =========================================================================
   Extensões 2: formulários reais, downloads, ações com efeito visível
   ========================================================================= */

/* ---------- download helpers ---------- */
function dl(name, blob){
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function mkPdf(title, lines){
  function txt(s){
    return String(s).replace(/[—–]/g, '-').replace(/[“”]/g, '"').replace(/’/g, "'")
      .replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }
  var content = 'BT /F1 16 Tf 50 780 Td (' + txt(title) + ') Tj ET\n';
  var y = 748;
  (lines || []).forEach(function(l){
    content += 'BT /F1 10 Tf 50 ' + y + ' Td (' + txt(l) + ') Tj ET\n';
    y -= 16;
  });
  var objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Length ' + content.length + ' >>\nstream\n' + content + 'endstream'
  ];
  var pdf = '%PDF-1.4\n', offs = [];
  objs.forEach(function(o, i){ offs.push(pdf.length); pdf += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
  var xref = pdf.length;
  pdf += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n';
  offs.forEach(function(o){ pdf += ('0000000000' + o).slice(-10) + ' 00000 n \n'; });
  pdf += 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
  var bytes = new Uint8Array(pdf.length);
  for(var i = 0; i < pdf.length; i++){ var c = pdf.charCodeAt(i); bytes[i] = c <= 255 ? c : 63; }
  return new Blob([bytes], {type: 'application/pdf'});
}
function pdfDemo(file, title, lines){
  dl(file, mkPdf(title, lines || [
    'Documento gerado pelo protótipo ERP Contábil Ledware.',
    'Conteúdo fictício, sem valor fiscal ou legal.',
    'Emitido em 18/08/2026.'
  ]));
  toast('Download iniciado — ' + file);
}
function pdfRow(el){
  var name = 'Documento';
  var tr = el.closest('tr'), row = el.closest('.row');
  var src = tr ? tr.querySelector('.main-cell') : (row ? row.querySelector('.who') : null);
  if(src) name = src.textContent.replace(/[📄📎]/g, '').trim();
  var file = name.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'documento';
  pdfDemo(file + '.pdf', name);
}
function csvView(btn, name){
  var view = btn.closest('.view') || document;
  var tb = view.querySelector('table.tb') || view.querySelector('table.dre');
  var out = '﻿';
  if(tb){
    tb.querySelectorAll('tr').forEach(function(tr){
      var cells = [];
      tr.querySelectorAll('th,td').forEach(function(c){ cells.push('"' + c.textContent.trim().replace(/"/g, '""') + '"'); });
      if(cells.length) out += cells.join(';') + '\n';
    });
  }
  dl(name, new Blob([out], {type: 'text/csv;charset=utf-8'}));
  toast('Exportado — ' + name);
}
function pdfDre(){
  var tb = document.querySelector('#v-dre .dre');
  var lines = [];
  if(tb) tb.querySelectorAll('tr').forEach(function(tr){
    var cells = [];
    tr.querySelectorAll('th,td').forEach(function(c){ cells.push(c.textContent.trim()); });
    if(cells.join('')) lines.push(cells.join('  |  '));
  });
  pdfDemo('dre-jul-2026.pdf', 'DRE - Demonstracao do Resultado - Jul/2026', lines.slice(0, 38));
}
function cnab(){
  var l = [
    '02REMESSA01PAGAMENTOS      04111222000105 LEDWARE CONTABILIDADE      001 BANCO DO BRASIL  180826',
    '1 0001 DAS SIMPLES NACIONAL JUL/2026        VENC 20/08/2026  VALOR 0000794312',
    '1 0002 FGTS DIGITAL JUL/2026                VENC 20/08/2026  VALOR 0000221250',
    '9 TOTAL 000002 REGISTROS  VALOR 0001015562'
  ];
  dl('remessa-pagamentos-180826.rem', new Blob([l.join('\r\n')], {type: 'text/plain'}));
  toast('Remessa CNAB gerada — 2 pagamentos incluídos');
}
function jsonExport(){
  var data = {
    exportadoEm: '2026-08-18T09:30:00-03:00', escritorio: 'Ledware Contabilidade LTDA',
    clientes: 42, lancamentos: 312, notasFiscais: 91, guias: 64, colaboradores: 214,
    observacao: 'Exportação fictícia do protótipo — sem dados reais.'
  };
  dl('export-dados-ledware.json', new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'}));
  toast('Exportação completa gerada — export-dados-ledware.json');
}

/* ---------- tarefas: criação real no kanban ---------- */
function addTaskCard(title, meta, av){
  var col = document.querySelector('#v-tar .kanban .kcol');
  if(!col) return;
  var d = document.createElement('div');
  d.className = 'kcard';
  d.setAttribute('onclick', 'kopen(this)');
  d.innerHTML = '<b></b><div class="meta"><span class="avx">' + (av || 'RC') + '</span><span></span></div>';
  d.querySelector('b').textContent = title;
  d.querySelector('.meta span:last-child').textContent = meta;
  var first = col.querySelector('.kcard');
  if(first) col.insertBefore(d, first); else col.appendChild(d);
  kcounts();
}
function tarefaCreate(){
  addTaskCard('Conferir variáveis da folha de agosto', 'Padaria São José · vence 25/08', 'CN');
  nav('tar');
  toast('Tarefa criada e atribuída a Carla Nunes — já está no quadro');
}
function regTask(){
  addTaskCard('Regularizar DCTF Jun — multa e retificação', 'Transportes Alvorada · vence 19/08', 'BL');
  nav('tar');
  toast('Tarefa de regularização criada e atribuída a Bruno Lima');
}

/* ---------- salvar título financeiro (modal mback) ---------- */
function tituloSave(){
  var isIn = document.getElementById('seg-in').className === 'on-in';
  var tbody = document.querySelector(isIn ? '#rectb tbody' : '#pagtb tbody');
  if(tbody){
    var tr = document.createElement('tr');
    tr.dataset.st = 'pend'; tr.dataset.val = isIn ? '890' : '24.9';
    if(isIn){
      tr.innerHTML = '<td data-l=""><button class="chk" onclick="ck(this)" aria-label="selecionar"></button></td>' +
        '<td class="main-cell" data-l="Cliente">Padaria São José ME</td>' +
        '<td class="desc" data-l="Descrição">Honorários contábeis · Set/2026</td>' +
        '<td data-l="Vencimento">15/09</td><td class="num" data-l="Valor">R$ 890,00</td>' +
        '<td data-l="Forma"><span class="tag pri">Boleto + PIX</span></td>' +
        '<td data-l="Status"><span class="pill pend"><i></i>Pendente</span></td>';
    } else {
      tr.innerHTML = '<td data-l=""><button class="chk" onclick="ck(this)" aria-label="selecionar"></button></td>' +
        '<td class="main-cell" data-l="Fornecedor">Banco do Brasil</td>' +
        '<td class="desc" data-l="Descrição">Tarifas bancárias · Ago/2026</td>' +
        '<td data-l="Vencimento">15/09</td><td class="num" data-l="Valor">R$ 24,90</td>' +
        '<td data-l="Status"><span class="pill pend"><i></i>Pendente</span></td>';
    }
    tbody.insertBefore(tr, tbody.firstChild);
  }
  nav(isIn ? 'rec' : 'pag');
  toast('Título salvo — primeira linha da lista' + (isIn ? ' · boleto com PIX na fila de emissão' : ''));
}

/* ---------- gravar lançamento contábil (modal lback) ---------- */
function lancSave(){
  var tbody = document.querySelector('#v-lan table.tb tbody');
  if(tbody){
    var tr = document.createElement('tr');
    tr.innerHTML = '<td data-l="Nº">2842</td><td data-l="Data">18/08</td>' +
      '<td class="main-cell" data-l="Histórico">Pagamento de fornecedor — Moinho Sul, duplicata 4412/2</td>' +
      '<td class="desc" data-l="Débito">2.1.01 Fornecedores</td>' +
      '<td class="desc" data-l="Crédito">1.1.01.002 Banco BB</td>' +
      '<td class="num" data-l="Valor">R$ 3.120,00</td>' +
      '<td data-l="Origem"><span class="tag">Manual</span></td>';
    tbody.insertBefore(tr, tbody.firstChild);
  }
  nav('lan');
  toast('Lançamento nº 2842 gravado — primeira linha do diário');
}

/* ---------- ações com efeito visível ---------- */
function contabiliza(btn){
  btn.disabled = true;
  btn.textContent = '✓ Pendentes contabilizados (0)';
  var kpi = document.querySelectorAll('#v-lan .kpi .val')[2];
  if(kpi) kpi.textContent = '0';
  toast('23 lançamentos sugeridos foram gravados no diário');
}
function fecharComp(btn){
  document.querySelectorAll('#v-fec .mitem').forEach(function(m){
    m.classList.remove('hl'); m.classList.add('ok');
    var ic = m.querySelector('.mlink');
    if(ic){ ic.textContent = '✓'; ic.className = 'mlink ok'; }
  });
  var tr = document.querySelectorAll('#v-fec table.tb tbody tr')[1];
  if(tr){
    var tds = tr.querySelectorAll('td');
    tds[1].innerHTML = '<span class="pill ok"><i></i>Fechada</span>';
    tds[2].textContent = '18/08';
    tds[3].textContent = 'Rafael C.';
  }
  btn.disabled = true;
  btn.textContent = '✓ Competência Jul/2026 fechada';
  toast('Competência Jul/2026 fechada — lançamentos retroativos exigem reabertura auditada');
}
function calcFolha(btn){
  var tr = document.querySelector('#v-fol [data-pane="comp"] tbody tr');
  if(tr){
    var tds = tr.querySelectorAll('td');
    tds[2].textContent = 'R$ 15.120,00';
    tds[3].textContent = 'R$ 4.090,20';
    tds[4].textContent = 'R$ 12.729,90';
    tds[5].innerHTML = '<span class="pill inf"><i></i>Prévia p/ conferência</span>';
  }
  var kpi = document.querySelectorAll('#v-fol .kpi .val')[3];
  if(kpi) kpi.textContent = '100%';
  btn.disabled = true;
  btn.textContent = '✓ Folha Ago calculada';
  toast('Folha Ago/2026 calculada — prévia pronta para conferência');
}
function esoTransmit(btn){
  var tr = btn.closest('tr');
  if(tr){
    var st = tr.querySelector('.pill');
    if(st) st.outerHTML = '<span class="pill ok"><i></i>Aceito</span>';
    btn.textContent = 'Recibo';
    btn.setAttribute('onclick', "pdfDemo('recibo-esocial.pdf','Recibo eSocial')");
  }
  toast('Evento transmitido e aceito pelo eSocial');
}
function esoAll(btn){
  document.querySelectorAll('#v-eso table.tb tbody tr').forEach(function(tr){
    var st = tr.querySelector('.pill.pend');
    if(st){
      st.outerHTML = '<span class="pill ok"><i></i>Aceito</span>';
      var b = tr.querySelector('.btn.sm');
      if(b){ b.textContent = 'Recibo'; b.setAttribute('onclick', "pdfDemo('recibo-esocial.pdf','Recibo eSocial')"); }
    }
  });
  var vals = document.querySelectorAll('#v-eso .kpi .val');
  if(vals[0]) vals[0].textContent = '129';
  if(vals[1]) vals[1].textContent = '0';
  btn.disabled = true;
  btn.textContent = '✓ Fila transmitida (0)';
  toast('3 eventos transmitidos com certificado digital A1 — todos aceitos');
}
var esoFixRow = null;
function esoFix(btn){ esoFixRow = btn.closest('tr'); fOpen('corrigir'); }
function tokenNew(el){
  var inp = el.closest('.inp');
  if(inp) inp.childNodes[0].textContent = 'lw_live_ •••• •••• •••• 3c7d ';
  toast('Novo token gerado — o anterior foi revogado');
}
function portalMsg(btn){
  var list = document.querySelector('#p-msgs .duelist');
  var area = document.querySelector('#p-msgs .inp.area');
  var txt = area && area.textContent.trim() && area.textContent.indexOf('Escreva') !== 0
    ? area.textContent.trim() : 'Obrigado! Aguardamos o retorno sobre o fechamento.';
  var d = document.createElement('div');
  d.className = 'row';
  d.innerHTML = '<span class="avx" style="background:#E8B03A;color:#3A2B00">PS</span><div><div class="who">Você</div><div class="cat"></div></div><span class="d">agora</span>';
  d.querySelector('.cat').textContent = '“' + txt + '”';
  list.appendChild(d);
  if(area) area.textContent = 'Escreva uma mensagem para o escritório…';
  toast('Mensagem enviada — o escritório recebe uma notificação');
}
function aprovarBal(el){
  var al = el.closest('.alert');
  if(al){
    al.className = 'alert good';
    al.innerHTML = '<div class="ic">✓</div><div><b>Balancete de julho aprovado digitalmente</b><small>hoje às 09:30 · o escritório foi notificado</small></div>';
  }
  toast('Balancete aprovado — registro assinado digitalmente');
}

/* ---------- QR PIX fictício ---------- */
function qrSvg(){
  var s = '<svg viewBox="0 0 25 25" width="160" height="160" style="background:#fff;border-radius:10px;padding:6px;border:1px solid var(--line)" aria-label="QR Code PIX fictício">';
  function sq(x, y, w){ return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + w + '" fill="#0B3630"/>'; }
  [[0,0],[18,0],[0,18]].forEach(function(p){
    s += sq(p[0], p[1], 7) + '<rect x="' + (p[0]+1) + '" y="' + (p[1]+1) + '" width="5" height="5" fill="#fff"/>' + sq(p[0]+2, p[1]+2, 3);
  });
  for(var i = 0; i < 25; i++){
    for(var j = 0; j < 25; j++){
      var corner = (i < 8 && j < 8) || (i > 16 && j < 8) || (i < 8 && j > 16);
      if(!corner && ((i * 7 + j * 13 + i * j) % 5 < 2)) s += sq(i, j, 1);
    }
  }
  return s + '</svg>';
}

/* ---------- modal de formulário genérico ---------- */
var fCur = null;
function fld(label, val){ return '<div class="fld"><label>' + label + '</label><div class="inp">' + val + '</div></div>'; }
function fsel(label, id, opts){
  return '<div class="fld"><label>' + label + '</label><select class="inp" id="' + id + '">' +
    opts.map(function(o){ return '<option>' + o + '</option>'; }).join('') + '</select></div>';
}
var FF = {
  notif: { t: 'Notificações', save: 'Marcar todas como lidas', ok: 'Notificações marcadas como lidas',
    body: '<div class="alert warn"><div class="ic">−</div><div><b>DAS e FGTS vencem em 20/08</b><small>R$ 10.155,62 · guias geradas</small><br><button class="lk" onclick="closeF();nav(\'gui\')">Ver guias →</button></div></div>' +
      '<div class="alert bad"><div class="ic">!</div><div><b>3 obrigações em atraso</b><small>DCTF Jun, EFD ICMS Jul e mais 1</small><br><button class="lk" onclick="closeF();nav(\'obr\')">Ver agenda →</button></div></div>' +
      '<div class="alert info"><div class="ic">⧗</div><div><b>2 mensagens de clientes aguardando resposta</b><small>Transportes Alvorada · Studio Fit</small><br><button class="lk" onclick="closeF();nav(\'doc\')">Responder →</button></div></div>',
    apply: function(){ var d = document.querySelector('#v-dash .bell .dot'); if(d) d.remove(); } },
  agenda: { t: 'Gerar agenda do mês', save: 'Gerar agenda', ok: 'Agenda de setembro gerada — 14 obrigações criadas para 42 empresas',
    body: '<div class="alert info"><div class="ic">i</div><div><b>14 obrigações serão geradas para setembro/2026</b><small>com base no regime tributário e nas particularidades de cada uma das 42 empresas</small></div></div>' +
      fld('Competência', 'Setembro/2026') +
      '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Atribuir responsáveis pela regra padrão da equipe</div>' +
      '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Criar tarefas vinculadas no quadro</div>' },
  obrig: { t: 'Nova obrigação manual', save: 'Criar obrigação', ok: 'Obrigação criada — primeira linha da lista',
    body: fld('Obrigação', 'DCTFWeb') + '<div class="frow">' + fld('Competência', 'Ago/2026') + fld('Prazo', '28/08/2026 📅') + '</div>' +
      '<div class="frow">' + fsel('Abrangência', 'ob-cli', ['Padaria São José ME', 'Todas as empresas', 'Auto Peças Cruzeiro', 'Clínica Vida']) +
      fsel('Responsável', 'ob-resp', ['Ana Souza', 'Bruno Lima', 'Carla Nunes', 'Diego Alves']) + '</div>',
    apply: function(){
      var tbody = document.querySelector('#obrtb tbody');
      if(!tbody) return;
      var tr = document.createElement('tr');
      tr.dataset.st = 'pend';
      tr.innerHTML = '<td class="main-cell" data-l="Obrigação">DCTFWeb</td><td data-l="Competência">Ago/2026</td>' +
        '<td class="desc" data-l="Abrangência">' + document.getElementById('ob-cli').value + '</td>' +
        '<td data-l="Prazo">28/08</td><td data-l="Responsável">' + document.getElementById('ob-resp').value + '</td>' +
        '<td data-l="Status"><span class="pill pend"><i></i>Pendente</span></td>';
      tbody.insertBefore(tr, tbody.firstChild);
      filtra('obrtabs', 'obrtb', 'pend', document.querySelector('#obrtabs [data-f="pend"]'));
    } },
  template: { t: 'Aplicar template de tarefas', save: 'Aplicar template', ok: 'Template aplicado — 3 tarefas criadas no quadro',
    body: fsel('Template', 'tp-sel', ['Fechamento mensal (3 etapas)', 'Admissão de funcionário', 'Abertura de empresa', 'Troca de regime tributário']) +
      '<div class="frow">' + fsel('Cliente', 'tp-cli', ['Padaria São José ME', 'Auto Peças Cruzeiro', 'Clínica Vida']) + fld('Prazo final', '31/08/2026 📅') + '</div>',
    apply: function(){
      var cli = document.getElementById('tp-cli').value;
      addTaskCard('Gerar e revisar balancete', cli + ' · vence 31/08', 'RC');
      addTaskCard('Conciliar contas bancárias', cli + ' · vence 28/08', 'DA');
      addTaskCard('Importar e classificar notas do mês', cli + ' · vence 26/08', 'AS');
    } },
  soldoc: { t: 'Solicitar documento ao cliente', save: 'Enviar solicitação', ok: 'Solicitação enviada — lembretes automáticos programados',
    body: fld('Documento solicitado', 'Extratos bancários de agosto (2 contas)') +
      '<div class="frow">' + fsel('Cliente', 'sd-cli', ['Mercado Central', 'Padaria São José ME', 'Studio Fit Academia', 'Clínica Vida']) + fld('Prazo', '25/08/2026 📅') + '</div>' +
      '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="canal"></button> Lembrar por e-mail</div>' +
      '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="canal"></button> Lembrar por WhatsApp</div>',
    apply: function(){
      var tbody = document.querySelector('[data-pane="sol"] table tbody');
      if(!tbody) return;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td class="main-cell" data-l="Solicitação">Extratos bancários de agosto (2 contas)</td>' +
        '<td data-l="Cliente">' + document.getElementById('sd-cli').value + '</td>' +
        '<td data-l="Solicitado em">18/08</td><td data-l="Lembretes">programados</td>' +
        '<td data-l="Status"><span class="pill pend"><i></i>Aguardando</span></td>';
      tbody.insertBefore(tr, tbody.firstChild);
    } },
  updoc: { t: 'Enviar documento ao cliente', save: 'Enviar e publicar', ok: 'Documento publicado no portal — o cliente foi avisado',
    body: '<div class="drop">Arraste o arquivo aqui, ou <b>clique para selecionar</b> · PDF, JPG, PNG ou ZIP até 25 MB</div>' +
      '<div class="frow">' + fsel('Cliente', 'ud-cli', ['Padaria São José ME', 'Auto Peças Cruzeiro', 'Clínica Vida', 'Mercado Central']) + fld('Descrição', 'Relatório gerencial Jul/2026') + '</div>' +
      '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="notificar"></button> Notificar o cliente por e-mail</div>',
    apply: function(){
      var tbody = document.querySelector('[data-pane="docs"] table tbody');
      if(!tbody) return;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td class="main-cell" data-l="Documento">📄 Relatório gerencial Jul-2026.pdf</td>' +
        '<td data-l="Cliente">' + document.getElementById('ud-cli').value + '</td>' +
        '<td data-l="Enviado por">Escritório</td><td data-l="Data">18/08</td>' +
        '<td data-l="Status"><span class="pill inf"><i></i>Novo</span></td>' +
        '<td class="acts" data-l=""><button class="btn sm" onclick="pdfRow(this)">Baixar</button></td>';
      tbody.insertBefore(tr, tbody.firstChild);
    } },
  updocp: { t: 'Enviar arquivo ao escritório', save: 'Enviar', ok: 'Arquivo enviado — o escritório recebe uma notificação',
    body: '<div class="drop">Arraste o arquivo aqui, ou <b>clique para selecionar</b> · PDF, OFX, XML ou ZIP até 25 MB</div>' + fld('Descrição', 'Extrato BB Ago (parcial)'),
    apply: function(){
      var list = document.querySelector('#p-docs .duelist');
      if(!list) return;
      var d = document.createElement('div');
      d.className = 'row';
      d.innerHTML = '<div><div class="who">📎 Extrato BB Ago (parcial).ofx</div><div class="cat">você enviou · agora · recebido ✓</div></div><button class="btn sm" onclick="pdfRow(this)">Baixar</button>';
      list.insertBefore(d, list.firstChild);
    } },
  faturar: { t: 'Faturar honorários de setembro', save: 'Faturar 42 contratos', ok: '42 faturas geradas com boleto + PIX e publicadas no portal de cada cliente',
    body: '<div class="alert info"><div class="ic">i</div><div><b>42 contratos ativos · R$ 38.140,00</b><small>uma fatura por contrato, vencimento no dia definido em cada um</small></div></div>' +
      '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Emitir boleto registrado com QR Code PIX</div>' +
      '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Enviar por e-mail e WhatsApp</div>' +
      '<div class="ckrow"><button class="chk" onclick="ck(this)" aria-label="opção"></button> Aplicar reajuste anual pendente (3 contratos)</div>' },
  contrato: { t: 'Novo contrato de serviços', save: 'Criar contrato', ok: 'Contrato criado — honorários entram na régua de faturamento',
    body: '<div class="frow">' + fsel('Cliente', 'ct-cli', ['Barbearia Estilo', 'Novo cliente…']) + fld('Valor mensal', 'R$ 420,00') + '</div>' +
      '<div class="frow">' + fsel('Reajuste', 'ct-adj', ['IPCA · anual', 'IGP-M · anual', 'Sem reajuste']) + fld('Vigência', '01/09/2026 → 31/08/2027') + '</div>' +
      '<div class="fld"><label>Serviços incluídos</label><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="tag pri">Contábil</span><span class="tag pri">Fiscal</span><span class="tag">Folha</span><span class="tag">Portal do Cliente</span></div></div>' },
  impcli: { t: 'Importar clientes', save: 'Processar planilha', ok: 'Planilha processada — 3 clientes prontos para revisão no onboarding',
    body: '<div class="drop">Arraste a planilha aqui, ou <b>clique para selecionar</b> · XLSX ou CSV no modelo padrão</div>' +
      '<div class="alert info"><div class="ic">i</div><div><b>Consulta cadastral automática</b><small>razão social, regime e endereço são conferidos pelo CNPJ durante a importação</small></div></div>' },
  clinovo: { t: 'Novo cliente', save: 'Cadastrar cliente', ok: 'Cliente cadastrado — onboarding iniciado, primeira linha da lista',
    body: fld('Razão social', 'Café Aurora LTDA') +
      '<div class="frow">' + fld('CNPJ', '31.415.926/0001-53') + fsel('Regime', 'cn-reg', ['Simples Nacional', 'Lucro Presumido', 'Lucro Real', 'MEI']) + '</div>' +
      '<div class="frow">' + fsel('Responsável', 'cn-resp', ['Diego Alves', 'Ana Souza', 'Bruno Lima', 'Carla Nunes']) + fld('Honorário mensal', 'R$ 450,00') + '</div>',
    apply: function(){
      var tbody = document.querySelector('#v-cli table.tb tbody');
      if(!tbody) return;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td class="main-cell" data-l="Empresa">Café Aurora LTDA</td><td data-l="CNPJ">31.415.926/0001-53</td>' +
        '<td data-l="Regime"><span class="tag">' + document.getElementById('cn-reg').value + '</span></td>' +
        '<td data-l="Responsável">' + document.getElementById('cn-resp').value + '</td>' +
        '<td class="num" data-l="Honorário">R$ 450,00</td>' +
        '<td data-l="Situação"><span class="pill inf"><i></i>Onboarding</span></td>' +
        '<td class="acts" data-l=""><button class="btn sm" onclick="gOpen(\'cliente\',this)">Abrir</button></td>';
      tbody.insertBefore(tr, tbody.firstChild);
    } },
  modelo: { t: 'Aplicar modelo de plano de contas', save: 'Aplicar modelo', ok: 'Modelo aplicado — contas sem movimento foram substituídas',
    body: fsel('Modelo', 'md-sel', ['Comércio — Simples Nacional', 'Serviços — Simples Nacional', 'Comércio — Lucro Presumido', 'Indústria — Lucro Real']) +
      '<div class="alert warn"><div class="ic">−</div><div><b>Contas com movimento são preservadas</b><small>apenas contas sem lançamentos são substituídas pelo modelo</small></div></div>' },
  contanova: { t: 'Nova conta contábil', save: 'Criar conta', ok: 'Conta 1.1.04 criada no plano de contas',
    body: '<div class="frow">' + fld('Código', '1.1.04') + fld('Descrição', 'Aplicações Financeiras') + '</div>' +
      '<div class="frow">' + fsel('Tipo', 'nc-tipo', ['Analítica', 'Sintética']) + fsel('Natureza', 'nc-nat', ['Devedora', 'Credora']) + '</div>',
    apply: function(){
      var pass = document.querySelectorAll('#v-pla .tree .tr.l1')[1];
      if(!pass) return;
      var d = document.createElement('div');
      d.className = 'tr l3';
      d.innerHTML = '<span class="cod">1.1.04</span><span class="nm">Aplicações Financeiras</span><span class="sal">R$ 0,00</span>';
      pass.parentNode.insertBefore(d, pass);
    } },
  gerademo: { t: 'Gerar demonstração', save: 'Gerar', ok: 'Demonstração gerada',
    body: fsel('Demonstração', 'gd-sel', ['DRE', 'Balancete', 'Balanço Patrimonial', 'Razão analítico']) +
      '<div class="frow">' + fsel('Período', 'gd-per', ['Jul/2026', 'Jun/2026', '1º semestre 2026']) +
      fsel('Comparativo', 'gd-cmp', ['Mês anterior', 'Mesmo mês do ano anterior', 'Sem comparativo']) + '</div>',
    apply: function(){
      var i = document.getElementById('gd-sel').selectedIndex;
      var tab = document.querySelectorAll('#v-dre .tabs button')[i];
      if(tab) tab.click();
    } },
  xml: { t: 'Importar XML de notas', save: 'Importar', ok: '2 XMLs importados — aguardando classificação',
    body: '<div class="drop">Arraste XMLs ou um lote ZIP aqui, ou <b>clique para selecionar</b></div>' +
      '<div class="alert good"><div class="ic">✓</div><div><b>Captura automática ativa</b><small>o monitor baixa novas notas emitidas contra o CNPJ a cada hora — importe aqui apenas avulsos</small></div></div>',
    apply: function(){
      var tbody = document.querySelector('#nftb tbody');
      if(!tbody) return;
      ['NF-e 55.102 · Laticínios Serra Azul · R$ 1.240,00', 'NF-e 8.771 · Açúcar União Distribuidora · R$ 386,50'].forEach(function(s, ix){
        var p = s.split(' · ');
        var tr = document.createElement('tr');
        tr.dataset.st = 'pend';
        tr.innerHTML = '<td class="main-cell" data-l="Nota">' + p[0] + '</td>' +
          '<td data-l="Tipo"><span class="pill inf"><i></i>Entrada</span></td>' +
          '<td class="desc" data-l="Emitente">' + p[1] + '</td><td data-l="Emissão">18/08</td>' +
          '<td class="num" data-l="Valor">' + p[2] + '</td>' +
          '<td data-l="Situação"><span class="pill pend"><i></i>Classificar</span></td>';
        tbody.insertBefore(tr, tbody.firstChild);
      });
    } },
  nfse: { t: 'Emitir NFS-e', save: 'Emitir NFS-e', ok: 'NFS-e 443 autorizada pela prefeitura — primeira linha da lista',
    body: '<div class="frow">' + fsel('Tomador', 'nf-tom', ['Hotel Jardim Real', 'Mercado Bom Preço', 'Consumidor final']) + fld('Valor', 'R$ 850,00') + '</div>' +
      fld('Discriminação do serviço', 'Fornecimento de coffee break — evento 22/08') +
      '<div class="ckrow"><button class="chk" onclick="ck(this)" aria-label="ISS"></button> ISS retido pelo tomador</div>',
    apply: function(){
      var tbody = document.querySelector('#nftb tbody');
      if(!tbody) return;
      var tr = document.createElement('tr');
      tr.dataset.st = 'sai';
      tr.innerHTML = '<td class="main-cell" data-l="Nota">NFS-e 443</td>' +
        '<td data-l="Tipo"><span class="pill ok"><i></i>Saída</span></td>' +
        '<td class="desc" data-l="Destinatário">' + document.getElementById('nf-tom').value + '</td>' +
        '<td data-l="Emissão">18/08</td><td class="num" data-l="Valor">R$ 850,00</td>' +
        '<td data-l="Situação"><span class="tag pri">Autorizada</span></td>';
      tbody.insertBefore(tr, tbody.firstChild);
    } },
  guia: { t: 'Gerar guia de recolhimento', save: 'Gerar guia', ok: 'Guia gerada — primeira linha da lista, pronta para envio',
    body: '<div class="frow">' + fsel('Tipo', 'gg-tipo', ['DARF IRPJ', 'DAS Simples', 'GPS INSS', 'FGTS Digital', 'ISS Municipal']) +
      fsel('Cliente', 'gg-cli', ['Auto Peças Cruzeiro', 'Padaria São José ME', 'Clínica Vida', 'Transportes Alvorada']) + '</div>' +
      '<div class="frow">' + fld('Competência', 'Jul/2026') + fld('Vencimento', '31/08/2026 📅') + '</div>' + fld('Valor', 'R$ 2.140,00'),
    apply: function(){
      var tbody = document.querySelector('#guitb tbody');
      if(!tbody) return;
      var tr = document.createElement('tr');
      tr.dataset.st = 'pend'; tr.dataset.val = '2140';
      tr.innerHTML = '<td data-l=""><button class="chk" onclick="ck(this)" aria-label="selecionar"></button></td>' +
        '<td class="main-cell" data-l="Guia">' + document.getElementById('gg-tipo').value + '</td>' +
        '<td data-l="Cliente">' + document.getElementById('gg-cli').value + '</td>' +
        '<td data-l="Competência">Jul/2026</td><td data-l="Vencimento">31/08</td>' +
        '<td class="num" data-l="Valor">R$ 2.140,00</td>' +
        '<td data-l="Status"><span class="pill pend"><i></i>A vencer</span></td>';
      tbody.insertBefore(tr, tbody.firstChild);
    } },
  spedgen: { t: 'Gerar arquivo SPED / declaração', save: 'Gerar e transmitir', ok: 'Arquivo validado e transmitido — recibo no histórico',
    body: '<div class="frow">' + fsel('Declaração', 'sp-sel', ['EFD Contribuições', 'EFD ICMS/IPI', 'SPED ECD', 'SPED ECF', 'DCTFWeb']) +
      fsel('Cliente', 'sp-cli', ['Transportes Alvorada', 'Auto Peças Cruzeiro', 'Mercado Central', 'Lote — todas as obrigadas']) + '</div>' +
      fld('Período', 'Jul/2026') +
      '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="validar"></button> Validar no PVA antes de transmitir</div>',
    apply: function(){
      var tbody = document.querySelector('#v-sped table.tb tbody');
      if(!tbody) return;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td class="main-cell" data-l="Declaração">' + document.getElementById('sp-sel').value + '</td>' +
        '<td data-l="Cliente">' + document.getElementById('sp-cli').value + '</td>' +
        '<td data-l="Período">Jul/2026</td><td data-l="Transmitida">18/08 09:31</td>' +
        '<td data-l="Recibo" class="desc">41.' + String(Math.floor(Math.random() * 90) + 10) + '.88.20.' + String(Math.floor(Math.random() * 9000) + 1000) + '</td>' +
        '<td data-l="Status"><span class="pill ok"><i></i>Aceita</span></td>';
      tbody.insertBefore(tr, tbody.firstChild);
    } },
  impfun: { t: 'Importar funcionários', save: 'Processar planilha', ok: 'Planilha processada — 2 admissões prontas para conferência',
    body: '<div class="drop">Arraste a planilha aqui, ou <b>clique para selecionar</b> · XLSX no modelo padrão</div>' +
      '<div class="alert info"><div class="ic">i</div><div><b>Validação automática</b><small>CPF, PIS e datas são validados antes de gerar os eventos S-2200</small></div></div>' },
  admissao: { t: 'Nova admissão', save: 'Registrar admissão', ok: 'Admissão registrada — S-2200 na fila do eSocial',
    body: fld('Nome completo', 'Paulo Henrique Souza') +
      '<div class="frow">' + fld('Cargo', 'Atendente') + fld('Salário', 'R$ 1.720,00') + '</div>' +
      '<div class="frow">' + fld('Admissão', '01/09/2026 📅') + fsel('Jornada', 'ad-jor', ['44 h semanais', '40 h semanais', '30 h semanais', 'Intermitente']) + '</div>',
    apply: function(){
      var tbody = document.querySelector('#v-fun table.tb tbody');
      if(!tbody) return;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td class="main-cell" data-l="Nome">Paulo Henrique Souza</td><td data-l="Cargo">Atendente</td>' +
        '<td data-l="Admissão">01/09/2026</td><td class="num" data-l="Salário">R$ 1.720,00</td>' +
        '<td data-l="Situação"><span class="pill inf"><i></i>Admissão em curso</span></td>' +
        '<td class="acts" data-l=""><button class="btn sm" onclick="gOpen(\'func\',this)">Abrir</button></td>';
      tbody.insertBefore(tr, tbody.firstChild);
    } },
  corrigir: { t: 'Corrigir evento S-2206', save: 'Corrigir e reenviar', ok: 'Cadastro corrigido — evento retransmitido e aceito',
    body: '<div class="alert bad"><div class="ic">!</div><div><b>Erro 301 — CPF divergente do cadastro CNIS</b><small>retorno do eSocial em 12/08</small></div></div>' +
      '<div class="frow">' + fld('CPF informado', '412.588.109-**') + fld('CPF correto (CNIS)', '412.858.109-**') + '</div>',
    apply: function(){
      if(!esoFixRow) return;
      var st = esoFixRow.querySelector('.pill');
      if(st) st.outerHTML = '<span class="pill ok"><i></i>Aceito</span>';
      var b = esoFixRow.querySelector('.btn.sm');
      if(b){ b.textContent = 'Recibo'; b.setAttribute('onclick', "pdfDemo('recibo-esocial.pdf','Recibo eSocial')"); }
      esoFixRow = null;
    } },
  ofx: { t: 'Importar extrato bancário', save: 'Importar extrato', ok: 'Extrato importado — 2 novos movimentos aguardando conciliação',
    body: '<div class="drop">Arraste o arquivo OFX/CSV aqui, ou <b>clique para selecionar</b></div>' +
      fsel('Conta de destino', 'ofx-cta', ['Sicoob · CC 11.207-3', 'Banco do Brasil · CC 4.812-6', 'Caixa interno']) },
  cobranca: { t: 'Emitir cobranças em lote', save: 'Emitir 12 cobranças', ok: '12 cobranças emitidas — boletos registrados com QR Code PIX',
    body: '<div class="alert info"><div class="ic">i</div><div><b>12 títulos em aberto sem cobrança emitida · R$ 9.870,00</b><small>um boleto registrado com PIX por título</small></div></div>' +
      '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="régua"></button> Ativar régua de cobrança automática</div>' +
      '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="enviar"></button> Enviar por e-mail e WhatsApp ao sacado</div>' },
  convite: { t: 'Convidar usuário', save: 'Enviar convite', ok: 'Convite enviado por e-mail — expira em 7 dias',
    body: fld('E-mail', 'novo.colaborador@ledware.com.br') +
      '<div class="frow">' + fsel('Perfil', 'cv-perfil', ['Colaborador', 'Contador', 'Administrador']) +
      fsel('Empresas visíveis', 'cv-emp', ['Todas', 'Selecionar…']) + '</div>',
    apply: function(){
      var tbody = document.querySelector('#v-usu table.tb tbody');
      if(!tbody) return;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td class="main-cell" data-l="Usuário">Novo colaborador</td>' +
        '<td class="desc" data-l="E-mail">novo.colaborador@ledware.com.br</td>' +
        '<td data-l="Perfil"><span class="pill ok"><i></i>' + document.getElementById('cv-perfil').value + '</span></td>' +
        '<td data-l="2FA"><span class="pill pend"><i></i>Pendente</span></td>' +
        '<td data-l="Último acesso">—</td>' +
        '<td data-l="Status"><span class="pill inf"><i></i>Convite enviado</span></td>';
      tbody.appendChild(tr);
    } },
  cadaux: { t: 'Novo cadastro auxiliar', save: 'Criar cadastro', ok: 'Cadastro criado na estrutura selecionada',
    body: fsel('Tipo', 'cx-tipo', ['Centro de custo', 'Conta bancária', 'Bem patrimonial', 'Certificado digital']) +
      fld('Nome / descrição', 'Marketing e divulgação') + fld('Complemento', 'Tipo: Apoio · rateio manual') },
  banco: { t: 'Conectar novo banco', save: 'Iniciar conexão', ok: 'Conexão iniciada — autorize o acesso no app do banco',
    body: fsel('Banco', 'bk-sel', ['Itaú', 'Bradesco', 'Caixa Econômica', 'Banco Inter', 'Sicredi']) +
      fsel('Tipo de integração', 'bk-tipo', ['Open Finance (automática)', 'Importação OFX (manual)']),
    apply: function(){
      var chips = document.querySelector('#v-cfg .bankchips');
      if(!chips) return;
      var d = document.createElement('div');
      d.className = 'bankchip';
      d.innerHTML = '<span class="st off"></span>' + document.getElementById('bk-sel').value + ' <small>aguardando autorização</small>';
      chips.appendChild(d);
    } },
  pix: { t: 'Pagar com PIX', save: 'Copiar código PIX', ok: 'Código PIX copia-e-cola copiado',
    body: '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">' + qrSvg() +
      '<div style="flex:1;min-width:200px"><div class="kpi"><div class="lbl">Honorários · Ago/2026</div><div class="val">R$ 890,00</div><div class="sub">Ledware Contabilidade LTDA · vence 20/08</div></div></div></div>' +
      '<div class="fld"><label>PIX copia-e-cola</label><div class="inp" style="font-size:11px;word-break:break-all;white-space:normal">00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-ledw-4re0-cont-abil20260890005204000053039865406890.005802BR5925LEDWARE CONTABILIDADE LTD6009SAO PAULO62070503***6304A1B2</div></div>',
    apply: function(){
      try{ navigator.clipboard.writeText('00020126580014BR.GOV.BCB.PIX0136a1b2c3d4-ledw-4re0-cont-abil20260890005204000053039865406890.005802BR5925LEDWARE CONTABILIDADE LTD6009SAO PAULO62070503***6304A1B2'); }catch(e){}
    } }
};
function fOpen(key){
  fCur = FF[key];
  if(!fCur) return;
  document.getElementById('f-title').textContent = fCur.t;
  document.getElementById('f-body').innerHTML = fCur.body;
  document.getElementById('f-save').textContent = fCur.save || 'Salvar';
  document.getElementById('fback').classList.add('open');
}
function fSave(){
  var cur = fCur;
  closeF();
  if(cur && cur.apply){ try{ cur.apply(); }catch(e){} }
  if(cur) toast(cur.ok || 'Salvo');
}
function closeF(){
  var f = document.getElementById('fback');
  if(f) f.classList.remove('open');
  fCur = null;
}

/* ---------- conciliação: criar lançamento da tarifa ---------- */
function conc2(el){
  var item = el.closest('.mitem');
  if(item){
    item.classList.add('ok');
    item.querySelector('.l1').childNodes[0].textContent = 'Tarifa bancária — lançamento criado';
    item.querySelector('.l2').innerHTML = 'lançamento nº 2843 · débito 4.2.05 Despesas Bancárias × crédito Banco BB · conciliado ✓';
  }
  var ex = document.querySelectorAll('#v-conc .mcol')[0].querySelectorAll('.mitem')[1];
  if(ex) ex.classList.add('ok');
  toast('Lançamento nº 2843 criado e conciliado');
}
/* ---------- negociação de honorários ---------- */
FF.negociar = { t: 'Negociar títulos vencidos', save: 'Enviar proposta', ok: 'Proposta de parcelamento enviada — o cliente aceita pelo portal',
  body: '<div class="alert warn"><div class="ic">−</div><div><b>Títulos selecionados em atraso</b><small>a proposta substitui os títulos originais após o aceite</small></div></div>' +
    '<div class="frow">' + fsel('Parcelamento', 'ng-parc', ['3× sem juros', '2× sem juros', '4× com juros de 1% a.m.']) +
    fsel('Primeira parcela', 'ng-ini', ['25/08/2026', '01/09/2026', '10/09/2026']) + '</div>' +
    '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Emitir boletos com PIX para cada parcela</div>' };

/* =========================================================================
   Extensões 3: WhatsApp API, Integra Contador, calendário editável,
   Cofre Seguro, checklist do portal, Growth e Central de Ajuda
   ========================================================================= */

/* ---------- cobrar por WhatsApp ---------- */
function wppCobrar(btn){
  var cli = 'Clientes selecionados';
  var tr = btn && btn.closest ? btn.closest('tr') : null;
  if(tr){ var mc = tr.querySelector('.main-cell'); if(mc) cli = mc.textContent.trim(); }
  var tbody = document.querySelector('#wpptb tbody');
  if(tbody){
    var row = document.createElement('tr');
    row.dataset.st = 'cob';
    row.innerHTML = '<td data-l="Horário">Agora</td><td class="main-cell" data-l="Cliente"></td>' +
      '<td data-l="Tipo"><span class="pill pend"><i></i>Cobrança</span></td>' +
      '<td class="desc" data-l="Mensagem">Olá! Segue a 2ª via do boleto com QR Code PIX. Qualquer dúvida, estamos à disposição.</td>' +
      '<td data-l="Status"><span class="pill ok"><i></i>Enviada ✓</span></td>';
    row.querySelector('.main-cell').textContent = cli;
    tbody.insertBefore(row, tbody.firstChild);
  }
  toast('Cobrança enviada por WhatsApp — 2ª via + QR PIX · ' + cli);
}
function wppIA(el){
  var al = el.closest('.alert');
  if(al){
    al.className = 'alert good';
    al.innerHTML = '<div class="ic">✓</div><div><b>Lembrete enviado à Padaria São José</b><small>agora · com link direto para o portal — a IA monitora a resposta</small></div>';
  }
  wppCobrar(null);
}

/* ---------- captura de notas: aplicar CFOP sugerido ---------- */
function aplicarCfop(btn){
  var tr = btn.closest('tr');
  if(tr){
    var td = btn.closest('td');
    td.innerHTML = '<span class="pill ok"><i></i>Corrigida ✓</span>';
  }
  toast('CFOP corrigido e lançamento contábil reprocessado');
}

/* ---------- cofre seguro ---------- */
function aprovaDoc(btn){
  var tr = btn.closest('tr');
  if(tr){
    var pill = tr.querySelector('.pill');
    if(pill) pill.outerHTML = '<span class="pill ok"><i></i>Aprovado — no cofre</span>';
    btn.closest('td').innerHTML = '';
  }
  toast('Documento aprovado — disponível no fluxo contábil');
}

/* ---------- portal: checklist do mês ---------- */
function enviarDoc(btn){
  var row = btn.closest('.row');
  if(row){
    var cat = row.querySelector('.cat');
    if(cat) cat.innerHTML = 'enviado agora · em validação no Cofre Seguro';
    btn.outerHTML = '<span class="pill inf"><i></i>Em validação</span>';
  }
  var pend = document.querySelectorAll('#chk-pend .btn').length;
  var done = 5 - pend;
  var pct = Math.round(done / 5 * 100);
  var bar = document.getElementById('chk-bar'), pctEl = document.getElementById('chk-pct'), hint = document.getElementById('chk-hint');
  if(bar) bar.style.width = pct + '%';
  if(pctEl) pctEl.textContent = pct + '%';
  if(hint) hint.textContent = done + ' de 5 entregues' + (pend ? ' · faltam ' + pend + ' para fechar o mês' : ' · tudo entregue 🎉');
  toast('Arquivo enviado — passa pela quarentena do Cofre Seguro antes de liberar');
}
function resposta(btn, txt){
  var wrap = btn.parentElement;
  wrap.innerHTML = '<span class="pill ok"><i></i>' + txt + '</span>';
  toast('Resposta registrada — o escritório foi notificado');
}

/* ---------- central de ajuda: player de tutorial ---------- */
function vidOpen(title, meta, desc){
  document.getElementById('g-title').textContent = title;
  document.getElementById('g-body').innerHTML =
    '<div style="aspect-ratio:16/9;background:linear-gradient(135deg,#0B3630,#14795F);border-radius:12px;display:grid;place-items:center;color:#fff">' +
      '<div style="text-align:center"><div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.92);color:#0B3630;display:grid;place-items:center;font-size:22px;margin:0 auto 10px">▶</div>' +
      '<b>' + title + '</b><div style="opacity:.8;font-size:12px;margin-top:4px">' + meta + ' · player incorporado no produto final</div></div></div>' +
    '<p class="tiny muted">' + desc + '</p>' +
    '<div class="fld"><label>Capítulos</label><div class="duelist">' +
      '<div class="row"><span class="d">0:00</span><div class="who">Introdução</div></div>' +
      '<div class="row"><span class="d">1:40</span><div class="who">Passo a passo na tela</div></div>' +
      '<div class="row"><span class="d">' + meta.split(' ')[0] + '</span><div class="who">Dicas e erros comuns</div></div></div></div>';
  document.getElementById('gback').classList.add('open');
}

/* ---------- detalhe de bloqueio do cofre ---------- */
GDET.bloqueio = function(){
  return { title: 'Arquivo bloqueado — Contrato.exe', html:
    '<div class="alert bad"><div class="ic">🛡️</div><div><b>Executável disfarçado de PDF</b><small>a extensão declarada era .pdf, mas a assinatura de bytes identifica um executável Windows (MZ)</small></div></div>' +
    '<div class="frow">' + fldRow('Cliente', 'Barbearia Estilo') + fldRow('Recebido em', '18/08 08:12') + '</div>' +
    '<div class="frow">' + fldRow('Hash SHA-256', 'a3f1…9c22 (isolado)') + fldRow('Destino', 'Quarentena permanente') + '</div>' +
    '<div class="alert info" style="margin:0"><div class="ic">i</div><div><b>Cliente orientado automaticamente</b><small>mensagem enviada pelo portal e WhatsApp pedindo o reenvio do documento correto em PDF</small></div></div>' };
};

/* ---------- calendário fiscal editável ---------- */
function addCalEvent(dia, titulo, cls){
  var cells = document.querySelectorAll('#v-obr .cal .dc:not(.out)');
  for(var i = 0; i < cells.length; i++){
    var dn = cells[i].querySelector('.dn');
    if(dn && dn.textContent.trim() === String(dia)){
      var ev = document.createElement('span');
      ev.className = 'ev ' + (cls || 'c');
      ev.textContent = titulo;
      cells[i].appendChild(ev);
      return true;
    }
  }
  return false;
}

/* ---------- novos formulários ---------- */
FF.wppmanual = { t: 'Enviar notificação por WhatsApp', save: 'Enviar agora', ok: 'Notificação enviada pelo WhatsApp do escritório',
  body: '<div class="frow">' + fsel('Cliente', 'wm-cli', ['Padaria São José', 'Mercado Central', 'Transportes Alvorada', 'Todos os inadimplentes']) +
    fsel('Modelo', 'wm-mod', ['Cobrança de documento', 'Alerta de vencimento', 'Cobrança de honorários (2ª via + PIX)', 'Mensagem livre']) + '</div>' +
    '<div class="fld"><label>Mensagem</label><div class="inp area">Bom dia! Ainda aguardamos os documentos de julho. Segue o link do portal para envio…</div></div>' +
    '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Incluir link direto do portal do cliente</div>',
  apply: function(){
    var tbody = document.querySelector('#wpptb tbody');
    if(!tbody) return;
    var tr = document.createElement('tr');
    tr.dataset.st = 'cob';
    tr.innerHTML = '<td data-l="Horário">Agora</td><td class="main-cell" data-l="Cliente">' + document.getElementById('wm-cli').value + '</td>' +
      '<td data-l="Tipo"><span class="pill pend"><i></i>Manual</span></td>' +
      '<td class="desc" data-l="Mensagem">Bom dia! Ainda aguardamos os documentos de julho. Segue o link do portal…</td>' +
      '<td data-l="Status"><span class="pill ok"><i></i>Enviada ✓</span></td>';
    tbody.insertBefore(tr, tbody.firstChild);
  } };
FF.wppregra = { t: 'Regra de disparo automático', save: 'Salvar regra', ok: 'Regra salva e ativa — próxima janela de disparo às 08:30',
  body: '<div class="frow">' + fsel('Gatilho', 'wr-gat', ['Documento pendente com prazo próximo', 'Título de honorário vencido', 'Certificado digital a vencer', 'Documento validado pela IA', 'Guia disponível para pagamento']) +
    fsel('Quando', 'wr-qdo', ['Todos os dias às 08:30', 'No evento, imediatamente', '3 dias antes do prazo']) + '</div>' +
    '<div class="fld"><label>Mensagem (variáveis: {cliente}, {documento}, {prazo}, {link})</label><div class="inp area">Bom dia {cliente}! O documento {documento} vence em {prazo}. Envie pelo portal: {link}</div></div>' +
    '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Escalar para o responsável se não houver resposta em 24 h</div>' };
FF.evento = { t: 'Novo evento no calendário fiscal', save: 'Adicionar ao calendário', ok: 'Evento adicionado — o calendário padrão continua gerado por regime',
  body: fld('Título', 'Honorários — geração e envio') +
    '<div class="frow">' + fsel('Dia (agosto/2026)', 'ev-dia', ['26', '19', '21', '27', '28']) +
    fsel('Tipo', 'ev-tipo', ['Evento do escritório', 'Prazo de cliente', 'Obrigação extra']) + '</div>' +
    '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Repetir todo mês</div>' +
    '<div class="ckrow"><button class="chk" onclick="ck(this)" aria-label="opção"></button> Notificar a equipe por WhatsApp na véspera</div>',
  apply: function(){
    addCalEvent(document.getElementById('ev-dia').value, 'Honorários', 'c');
  } };
FF.repasse = { t: 'Política de repasse — Integra Contador', save: 'Salvar política', ok: 'Política de repasse atualizada — vale para as próximas faturas',
  body: fsel('Modo de repasse', 'rp-modo', ['Repassar integral ao cliente', 'Repassar com margem de 20%', 'Absorver pelo escritório']) +
    '<div class="frow">' + fld('Teto mensal por cliente', 'R$ 25,00') + fsel('Acima do teto', 'rp-teto', ['Exigir aprovação', 'Bloquear consultas', 'Repassar mesmo assim']) + '</div>' +
    '<div class="alert info" style="margin:0"><div class="ic">i</div><div><b>Lançamento automático</b><small>o repasse entra como item destacado na fatura mensal de honorários de cada cliente</small></div></div>' };
FF.growth1 = { t: 'Contratar — Presença nas Redes Sociais', save: 'Contratar por R$ 497/mês', ok: 'Contratação registrada — o time Growth agenda o onboarding em até 1 dia útil',
  body: '<div class="alert good"><div class="ic">✓</div><div><b>12 posts/mês na identidade do seu escritório</b><small>Instagram, LinkedIn e Facebook · calendário editorial fiscal · aprovação antes de publicar</small></div></div>' +
    '<div class="frow">' + fld('Escritório', 'Ledware Contabilidade LTDA') + fld('Início', '01/09/2026') + '</div>' +
    '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="aceite"></button> Li e aceito o contrato do módulo Growth (cancele quando quiser)</div>' };
FF.growth2 = { t: 'Contratar — Tráfego Pago para Captação', save: 'Contratar por R$ 897/mês', ok: 'Contratação registrada — briefing de campanha enviado ao seu e-mail',
  body: '<div class="alert good"><div class="ic">✓</div><div><b>Google Ads + Meta Ads segmentados no seu município</b><small>landing page inclusa · relatório mensal de leads · verba de mídia definida por você</small></div></div>' +
    '<div class="frow">' + fld('Município-alvo', 'São Paulo — zona oeste') + fld('Verba de mídia mensal', 'R$ 1.500,00') + '</div>' +
    '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="aceite"></button> Li e aceito o contrato do módulo Growth</div>' };

/* =========================================================================
   Extensões 4: FGTS Digital, PLR/adiantamentos/RPA, CLP, livros fiscais,
   ecossistema Ledware, retificação e restauração de backup
   ========================================================================= */

GDET.fgtsemp = function(t){
  t = t || 'Padaria São José ME';
  return { title: 'FGTS Digital — consulta de empregador', html:
    '<div class="frow">' + fldRow('Empregador', t) + fldRow('Situação', 'Regular — sem débitos') + '</div>' +
    '<div class="frow3">' + fldRow('Vínculos ativos', '8') + fldRow('Última guia', 'Jul/2026 · paga') + fldRow('Procuração', 'Ativa até 10/2027') + '</div>' +
    '<div class="fld"><label>Últimas competências</label><div class="duelist">' +
      '<div class="row"><div><div class="who">Jul/2026</div><div class="cat">guia mensal</div></div><span class="d">R$ 2.212,50</span><span class="pill pend"><i></i>A vencer 20/08</span></div>' +
      '<div class="row"><div><div class="who">Jun/2026</div><div class="cat">guia mensal</div></div><span class="d">R$ 2.212,50</span><span class="pill ok"><i></i>Paga</span></div>' +
      '<div class="row"><div><div class="who">Mai/2026</div><div class="cat">guia mensal</div></div><span class="d">R$ 2.180,10</span><span class="pill ok"><i></i>Paga</span></div></div></div>' };
};

FF.fgtsguia = { t: 'Gerar guia FGTS parametrizada', save: 'Gerar guia', ok: 'Guia parametrizada gerada — primeira linha da lista',
  body: '<div class="frow">' + fsel('Tipo', 'fg-tipo', ['Parametrizada — por tomador/obra', 'Mensal', 'Rescisória']) +
    fsel('Empresa', 'fg-emp', ['Auto Peças Cruzeiro', 'Padaria São José ME', 'Transportes Alvorada', 'Clínica Vida']) + '</div>' +
    '<div class="frow">' + fld('Competência', 'Ago/2026') + fld('Vencimento', '20/09/2026 📅') + '</div>' +
    '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Enviar ao cliente pelo portal + WhatsApp</div>',
  apply: function(){
    var tbody = document.querySelector('#v-fgts table.tb tbody');
    if(!tbody) return;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td class="main-cell" data-l="Empresa">' + document.getElementById('fg-emp').value + '</td>' +
      '<td data-l="Competência">Ago/2026</td><td data-l="Tipo"><span class="tag pri">' + document.getElementById('fg-tipo').value.split(' — ')[0] + '</span></td>' +
      '<td class="num" data-l="Valor">R$ 3.418,00</td><td data-l="Vencimento">20/09</td>' +
      '<td data-l="Status"><span class="pill pend"><i></i>Gerada</span></td>';
    tbody.insertBefore(tr, tbody.firstChild);
  } };
FF.fgtsrecomp = { t: 'Gerador de recomposição — FGTS Digital', save: 'Gerar e transmitir', ok: 'Recomposição transmitida — remuneração faltante regularizada',
  body: '<div class="alert warn"><div class="ic">−</div><div><b>1 remuneração faltante detectada</b><small>C. E. Ramos (Padaria São José) — competência Jul/2026 não consta no FGTS Digital</small></div></div>' +
    '<div class="frow">' + fsel('Colaborador', 'fr-col', ['C. E. Ramos — Padaria São José', 'A. Prado — Transportes Alvorada']) + fld('Competências', 'Jul/2026') + '</div>' +
    '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Recalcular a guia após a recomposição</div>',
  apply: function(){
    var p = document.querySelector('#v-fgts .pill.err');
    if(p && p.closest('tr')) p.outerHTML = '<span class="pill ok"><i></i>Recomposto ✓</span>';
  } };
FF.rpa = { t: 'Novo RPA — Recibo de Pagamento a Autônomo', save: 'Emitir RPA', ok: 'RPA emitido — retenções calculadas e refletidas no eSocial (S-1200)',
  body: '<div class="frow">' + fld('Autônomo', 'Sílvio Andrade') + fsel('Tipo', 'rp-tipo', ['Serviço comum', 'Transportador autônomo (frete)']) + '</div>' +
    '<div class="frow">' + fld('Serviço prestado', 'Frete intermunicipal — rota Campinas') + fld('Valor bruto', 'R$ 1.600,00') + '</div>' +
    '<div class="alert info" style="margin:0"><div class="ic">i</div><div><b>Retenções automáticas</b><small>INSS 11% (base reduzida p/ frete) · IRRF pela tabela · SEST/SENAT 2,5% quando transportador</small></div></div>',
  apply: function(){
    var tbody = document.querySelector('#auttb tbody');
    if(!tbody) return;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td class="main-cell" data-l="Autônomo">Sílvio Andrade — transportador autônomo</td>' +
      '<td class="desc" data-l="Serviço">Frete intermunicipal — rota Campinas</td>' +
      '<td class="num" data-l="Bruto">R$ 1.600,00</td><td class="num" data-l="INSS">R$ 176,00</td>' +
      '<td class="num" data-l="IRRF/ISS">R$ 40,00</td><td class="num" data-l="Líquido">R$ 1.344,00</td>' +
      '<td data-l="Status"><span class="pill pend"><i></i>RPA emitido</span></td>';
    tbody.insertBefore(tr, tbody.firstChild);
  } };
FF.novaclp = { t: 'Nova CLP — Lançamento Padrão', save: 'Criar CLP', ok: 'CLP criada — as próximas notas desta origem contabilizam sozinhas',
  body: '<div class="frow">' + fsel('Origem do movimento', 'cl-ori', ['NF-e entrada', 'NF-e / NFC-e saída', 'NFS-e entrada', 'NFS-e saída', 'Extrato bancário', 'Folha de pagamento']) +
    fsel('Abrangência', 'cl-abr', ['Geral (todas as empresas)', 'Somente esta empresa']) + '</div>' +
    '<div class="frow">' + fsel('Conta débito', 'cl-deb', ['1.1.03 Estoques', '1.1.02 Clientes', '4.2.11 Serviços de Terceiros', '4.2.05 Despesas Bancárias']) +
    fsel('Conta crédito', 'cl-cre', ['2.1.01 Fornecedores', '3.1.01 Receita de Vendas', '1.1.01 Bancos', '2.1.03 Salários a Pagar']) + '</div>' +
    '<div class="fld"><label>Condição (opcional)</label><div class="inp">CFOP começa com 5 e CST 00 · valor &gt; R$ 0,00</div></div>',
  apply: function(){
    var tbody = document.querySelector('#clptb tbody');
    if(!tbody) return;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td class="main-cell" data-l="CLP">416 — Nova regra</td>' +
      '<td data-l="Origem"><span class="tag pri">' + document.getElementById('cl-ori').value + '</span></td>' +
      '<td class="desc" data-l="Débito">' + document.getElementById('cl-deb').value + '</td>' +
      '<td class="desc" data-l="Crédito">' + document.getElementById('cl-cre').value + '</td>' +
      '<td data-l="Abrangência">' + (document.getElementById('cl-abr').selectedIndex === 0 ? 'Geral' : 'Empresa atual') + '</td>' +
      '<td data-l="Status"><span class="pill ok"><i></i>Ativa · nova</span></td>';
    tbody.insertBefore(tr, tbody.firstChild);
  } };
FF.obslivro = { t: 'Observações do livro fiscal', save: 'Registrar observação', ok: 'Observação registrada — sai impressa no livro e no SPED',
  body: '<div class="frow">' + fsel('Livro', 'ob-liv', ['Registro de Entradas', 'Registro de Saídas', 'Apuração de ICMS', 'Apuração de IPI']) + fld('Período', 'Jul/2026') + '</div>' +
    '<div class="fld"><label>Observação</label><div class="inp area">NF-e 18.220 — mercadoria recebida em desacordo, devolução parcial em 05/08 (NF-e 4.472)…</div></div>' +
    '<div class="frow">' + fld('Vincular à nota (opcional)', 'NF-e 18.220') + fsel('Código de observação', 'ob-cod', ['Livre', 'Ajuste de apuração', 'Devolução', 'Complemento de imposto']) + '</div>' };
FF.reabrir = { t: 'Reabrir período do eSocial (S-1298)', save: 'Transmitir reabertura', ok: 'S-1298 aceito — período reaberto · lembre de fechar com S-1299 após os ajustes',
  body: '<div class="frow">' + fsel('Empresa', 're-emp', ['Padaria São José ME', 'Clínica Vida', 'Mercado Central']) + fld('Competência', 'Jul/2026') + '</div>' +
    fsel('Motivo', 're-mot', ['Retificar remuneração (S-1200)', 'Incluir desligamento fora do prazo', 'Corrigir rubrica/verba (S-1010)']) +
    '<div class="alert warn" style="margin:0"><div class="ic">−</div><div><b>Período fechado em 07/08</b><small>a reabertura fica registrada na trilha de auditoria</small></div></div>' };
FF.retificar = { t: 'Retificar DCTFWeb', save: 'Transmitir retificadora', ok: 'DCTFWeb retificadora aceita — novo DARF previdenciário disponível nas Guias',
  body: '<div class="frow">' + fsel('Empresa', 'rt-emp', ['Clínica Vida', 'Auto Peças Cruzeiro', 'Transportes Alvorada']) + fld('Período de apuração', 'Jul/2026') + '</div>' +
    fsel('O que mudou', 'rt-mot', ['Folha reprocessada (eSocial retificado)', 'Reinf retificada (retenções)', 'Exclusão de evento (S-3000)']) +
    '<div class="alert info" style="margin:0"><div class="ic">i</div><div><b>Sequência correta</b><small>retifique primeiro eSocial/Reinf — a DCTFWeb rebate os novos débitos automaticamente e gera o DARF ajustado</small></div></div>' };
FF.restaurar = { t: 'Restaurar backup', save: 'Iniciar restauração', ok: 'Restauração iniciada em ambiente de homologação — você recebe aviso ao concluir',
  body: fsel('Ponto de restauração', 'rs-pto', ['Hoje 03:00 (automático)', 'Ontem 03:00 (automático)', '16/08 03:00 (automático)', '15/08 22:14 (manual — antes do fechamento)']) +
    fsel('Destino', 'rs-dst', ['Ambiente de homologação (recomendado)', 'Produção — substituir dados atuais']) +
    '<div class="alert warn" style="margin:0"><div class="ic">−</div><div><b>Restauração em produção exige dupla confirmação</b><small>um segundo administrador precisa aprovar · a base atual é preservada por 30 dias</small></div></div>' };

/* =========================================================================
   Extensões 5: Monitor Integra Contador (por situação / por pagamento)
   e parametrização do eConsignado automático
   ========================================================================= */

var IC_EMP = {
  PS: 'Padaria São José ME', AC: 'Auto Peças Cruzeiro', CV: 'Clínica Vida',
  TA: 'Transportes Alvorada', MC: 'Mercado Central', SF: 'Studio Fit Academia',
  BE: 'Barbearia Estilo', PF: 'Pet Shop Amigo Fiel'
};
/* [serviço, referência, {empresa: 'classe Rótulo'}] — g ok · n neutro · i info · r erro · w atenção */
var IC_SIT = [
  ['DCTFWeb', 'Ref. 07/2026', {PS: 'g Gerado', AC: 'g Gerado', CV: 'g Gerado', TA: 'n Não gerado', MC: 'g Gerado', SF: 'g Gerado', BE: 'g Gerado', PF: 'g Gerado'}],
  ['MIT', 'Ref. 07/2026', {PS: 'g Entregue', AC: 'g Entregue', CV: 'i Retificada', TA: 'n Não entregue', MC: 'g Entregue', SF: 'g Entregue', BE: 'g Entregue', PF: 'g Entregue'}],
  ['FGTS Digital', 'Ref. 07/2026', {PS: 'g Gerado', AC: 'g Gerado', CV: 'g Gerado', TA: 'g Gerado', MC: 'g Gerado', SF: 'n Não gerado', BE: 'g Gerado', PF: 'g Gerado'}],
  ['eConsignado', 'Ref. 08/2026', {PS: 'g Gerado', AC: 'g Gerado', CV: 'g Gerado', TA: 'n Não gerado', MC: 'n Não gerado'}],
  ['PGDAS', 'Ref. 07/2026', {PS: 'g Entregue', MC: 'g Entregue', SF: 'i Retificada', BE: 'r MAED', PF: 'g Entregue'}],
  ['DEFIS', 'Ano 2025', {PS: 'g Entregue', MC: 'g Entregue', SF: 'g Entregue', BE: 'g Entregue', PF: 'g Entregue'}],
  ['PGMEI', 'Ref. 07/2026', {PF: 'g Gerado'}],
  ['CCMEI', '', {PF: 'g Ativa'}],
  ['SITFIS', '', {PS: 'g Em dia', AC: 'g Em dia', CV: 'g Em dia', TA: 'w Pendências', MC: 'w Pendências', SF: 'g Em dia', BE: 'g Em dia', PF: 'g Em dia'}],
  ['CND', '', {PS: 'g Válida', AC: 'g Válida', CV: 'g Válida', TA: 'r Vencida', MC: 'w Vence em 12 dias', SF: 'g Válida', BE: 'g Válida', PF: 'g Válida'}],
  ['Procurações', '', {PS: 'g Ativa', AC: 'g Ativa', CV: 'g Ativa', TA: 'g Ativa', MC: 'g Ativa', SF: 'g Ativa', BE: 'w Pendente', PF: 'w Pendente'}],
  ['Caixa Postal', '', {PS: 'n Sem novidades', AC: 'n Sem novidades', CV: 'n Sem novidades', TA: 'i 2 novas', MC: 'n Sem novidades', SF: 'n Sem novidades', BE: 'n Sem novidades', PF: 'n Sem novidades'}]
];
var IC_PAG = [
  ['DCTFWeb — DARF previdenciário', 'Ref. 07/2026', {PS: 'g Pago', AC: 'g Pago', CV: 'g Pago', TA: 'w Em aberto', MC: 'g Pago', SF: 'g Pago', BE: 'g Pago', PF: 'g Pago'}],
  ['FGTS Digital — guia', 'Ref. 07/2026', {PS: 'w Em aberto', AC: 'w Em aberto', CV: 'g Paga', TA: 'g Paga', MC: 'w Em aberto', SF: 'n Não gerada', BE: 'g Paga', PF: 'g Paga'}],
  ['PGDAS — DAS', 'Ref. 07/2026', {PS: 'w Em aberto', MC: 'w Em aberto', SF: 'g Pago', BE: 'r Em atraso', PF: 'g Pago'}],
  ['PGMEI — DAS-MEI', 'Ref. 07/2026', {PF: 'g Pago'}],
  ['eConsignado — descontos', 'Ref. 08/2026', {PS: 'g Na folha', AC: 'g Na folha', CV: 'g Na folha'}]
];
var IC_LEG = {
  sit: [['g', 'Gerado / Entregue / Em dia / Válida'], ['n', 'Não gerado / Sem novidades'], ['i', 'Retificada / Mensagens novas'], ['w', 'Pendências / A vencer'], ['r', 'MAED / Vencida']],
  pag: [['g', 'Pago / Na folha'], ['w', 'Em aberto'], ['n', 'Não gerada'], ['r', 'Em atraso']]
};
function icRender(mode){
  var box = document.getElementById('icmon');
  if(!box) return;
  var data = mode === 'pag' ? IC_PAG : IC_SIT;
  var h = '';
  data.forEach(function(row){
    h += '<div class="icrow"><div class="iclbl">' + row[0] + (row[1] ? '<small>' + row[1] + '</small>' : '') + '</div><div class="icchips">';
    for(var k in IC_EMP){
      var st = row[2][k];
      if(!st) continue;
      var cls = st.split(' ')[0], lbl = st.slice(2);
      h += '<button class="icc ' + cls + '" data-sv="' + row[0] + '" data-emp="' + k + '" data-lbl="' + lbl + '" title="' + IC_EMP[k] + ' — ' + lbl + '" onclick="icDet(this)">' + k + '</button>';
    }
    h += '</div></div>';
  });
  box.innerHTML = h;
  var leg = document.getElementById('icleg');
  if(leg) leg.innerHTML = IC_LEG[mode === 'pag' ? 'pag' : 'sit'].map(function(l){
    return '<span><span class="icc ' + l[0] + '">⬤</span> ' + l[1] + '</span>';
  }).join('');
}
function icMode(mode, btn){
  btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  icRender(mode);
}
function icDet(el){
  var emp = IC_EMP[el.dataset.emp] || el.dataset.emp;
  document.getElementById('g-title').textContent = el.dataset.sv + ' — ' + emp;
  document.getElementById('g-body').innerHTML =
    '<div class="frow3">' + fldRow('Situação', el.dataset.lbl) + fldRow('Fonte', 'Integra Contador · Serpro') + fldRow('Custo da consulta', 'R$ 0,24 (repassado)') + '</div>' +
    '<div class="fld"><label>Ações</label><div style="display:flex; gap:8px; flex-wrap:wrap">' +
      '<button class="btn sm pri" onclick="closeG();toast(\'Consulta executada via Integra Contador — situação atualizada (1 consulta · R$ 0,24)\')">Consultar agora</button>' +
      '<button class="btn sm" onclick="pdfDemo(\'comprovante-integra-contador.pdf\',\'Comprovante - Integra Contador\')">Baixar comprovante</button>' +
      '<button class="btn sm" onclick="closeG();fOpen(\'repasse\')">Política de repasse</button></div></div>' +
    '<div class="alert info" style="margin:0"><div class="ic">i</div><div><b>Monitoramento automático</b><small>este serviço é verificado pelo robô diariamente — a consulta manual só é cobrada quando você força a atualização</small></div></div>';
  document.getElementById('gback').classList.add('open');
}
GDET.serprocob = function(){
  return { title: 'Como funciona a cobrança — Serpro', html:
    '<div class="tline" style="margin-top:2px">' +
      '<div class="ti"><b>Cada consulta ao gov.br é tarifada pelo Serpro</b><small>valores por serviço (ex.: PGDAS R$ 0,24 · DCTFWeb R$ 0,28 · SITFIS R$ 0,11)</small></div>' +
      '<div class="ti"><b>O painel soma tudo em tempo real</b><small>“Será pago ao Serpro (aprox.)” é a estimativa do fechamento do mês</small></div>' +
      '<div class="ti g"><b>O custo é gerado para o cliente</b><small>lançado como item destacado na fatura de honorários, conforme a política de repasse (integral, com margem ou absorvido)</small></div>' +
      '<div class="ti w"><b>Teto mensal por cliente</b><small>consultas acima do teto exigem aprovação — sem custo surpresa</small></div></div>' +
    '<div style="margin-top:4px"><button class="btn sm pri" onclick="closeG();fOpen(\'repasse\')">Configurar repasse</button></div>' };
};
FF.econsig = { t: 'Parametrização — eConsignado automático', save: 'Salvar e ativar busca', ok: 'Parametrização salva — o robô busca as informações e lança os descontos na folha automaticamente',
  body: '<div class="frow">' + fsel('Periodicidade da busca', 'ec-per', ['Diária — 06:00', 'Semanal — segunda-feira', 'No fechamento da folha', 'Sob demanda']) +
    fsel('Abrangência', 'ec-abr', ['Todas as empresas com folha (18)', 'Somente empresas com consignado ativo (3)', 'Selecionar…']) + '</div>' +
    '<div class="fld"><label>O que buscar automaticamente</label>' +
      '<div class="ckrow" style="padding:4px 0"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Margem consignável dos colaboradores</div>' +
      '<div class="ckrow" style="padding:4px 0"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Contratos averbados e alterações</div>' +
      '<div class="ckrow" style="padding:4px 0"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Parcelas do mês para desconto em folha</div></div>' +
    '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Lançar desconto na folha automaticamente (rubrica 9214 — empréstimo consignado)</div>' +
    '<div class="ckrow"><button class="chk on" onclick="ck(this)" aria-label="opção"></button> Avisar o colaborador por WhatsApp quando um novo contrato for averbado</div>' +
    '<div class="alert info" style="margin:0"><div class="ic">i</div><div><b>Custo estimado</b><small>~R$ 0,19 por colaborador consultado · repassado conforme a política do Integra Contador</small></div></div>',
  apply: function(){
    document.querySelectorAll('#v-int .mitem').forEach(function(m){
      if(m.textContent.indexOf('e-Consignado') >= 0){
        var l2 = m.querySelector('.l2');
        if(l2) l2.innerHTML = 'busca diária 06:00 ativa · margens, averbações e parcelas atualizadas e lançadas na folha — <button class="lk" onclick="fOpen(\'econsig\')">parametrizar →</button>';
      }
    });
  } };
icRender('sit');
