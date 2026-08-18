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
  if(!target){ toast('Tela em construção no protótipo'); return; }
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
  if(e.key === 'Escape'){ closeModal(); closeLanc(); closeTarefa(); closeDrawer(); }
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
  toast(msg || 'Etapa concluída (protótipo)');
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
