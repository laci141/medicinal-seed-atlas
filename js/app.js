
/* =========================================================
   Medicinal Seed Atlas — alkalmazás-logika
   ========================================================= */
var LANG='hu';
function pack(){return window.LANGS[LANG]||window.LANGS.hu;}
function T(){return pack().ui;}
function S(){return pack().seeds;}
function TG(){return pack().tags;}
function SC(){return pack().sec;}
function FIND(id){return (pack().findings||{})[id]||[];}

try{ var st=localStorage.getItem('msa.lang'); if(st&&/^(hu|ro|en|de)$/.test(st))LANG=st; }catch(e){}

/* A nyelvi csomagot csak akkor töltjük le, amikor tényleg kell. */
var loading={};
function ensureLang(code,cb){
  if(window.LANGS[code]) return cb();
  if(loading[code]) { loading[code].push(cb); return; }
  loading[code]=[cb];
  var s=document.createElement('script');
  s.src='js/lang/'+code+'.js';
  s.onload=function(){ var q=loading[code]; loading[code]=null; q.forEach(function(f){f();}); };
  s.onerror=function(){ loading[code]=null; console.error('Nem sikerult betolteni a nyelvet:',code); cb(); };
  document.head.appendChild(s);
}

function icon(shape,c){
  var s='<svg width="34" height="34" viewBox="0 0 40 40" fill="none">';
  if(shape==='teardrop') s+='<path d="M20 4C11 10 8 22 12 32c3 6 13 6 16 0C32 22 29 10 20 4Z" stroke="'+c+'" stroke-width="1.6" fill="'+c+'22"/><circle cx="15" cy="19" r="1.5" fill="'+c+'"/><circle cx="25" cy="19" r="1.5" fill="'+c+'"/><circle cx="15" cy="26" r="1.5" fill="'+c+'"/><circle cx="25" cy="26" r="1.5" fill="'+c+'"/>';
  else if(shape==='brain') s+='<circle cx="20" cy="20" r="15" stroke="'+c+'" stroke-width="1.6" fill="'+c+'18"/><path d="M20 6v28M13 9c4 5 4 17 0 22M27 9c-4 5-4 17 0 22" stroke="'+c+'" stroke-width="1.1" opacity=".7"/><path d="M8 20c5-3 9 3 12 0s7-3 12 0" stroke="'+c+'" stroke-width="1" opacity=".5"/>';
  else if(shape==='oval') s+='<ellipse cx="20" cy="20" rx="8.5" ry="13.5" stroke="'+c+'" stroke-width="1.6" fill="'+c+'18"/><path d="M20 8v24" stroke="'+c+'" stroke-width="1" opacity=".45"/>';
  else if(shape==='gel') s+='<circle cx="20" cy="20" r="15" stroke="'+c+'" stroke-width="1" stroke-dasharray="2 3" opacity=".7"/><ellipse cx="20" cy="20" rx="6" ry="8" stroke="'+c+'" stroke-width="1.6" fill="'+c+'26"/><path d="M17 16c2 1 4 1 6 0" stroke="'+c+'" stroke-width="1" opacity=".6"/>';
  else if(shape==='diagonal') s+='<ellipse cx="20" cy="20" rx="7" ry="12" stroke="'+c+'" stroke-width="1.6" fill="'+c+'18" transform="rotate(20 20 20)"/><path d="M14 26L26 14" stroke="#fbbf24" stroke-width="1.4"/><path d="M24 12l3 1-1 3" stroke="#fbbf24" stroke-width="1.4"/>';
  else if(shape==='husk') s+='<path d="M8 22c3-2 5 2 8 0s5-3 8-1 5 1 8-1" stroke="'+c+'" stroke-width="1.5"/><path d="M9 27c3-2 5 2 8 0s5-3 8-1 5 1 7-1" stroke="'+c+'" stroke-width="1.3" opacity=".7"/><path d="M10 16c3-2 5 2 8 0s5-3 8-1 4 1 6-1" stroke="'+c+'" stroke-width="1.2" opacity=".5"/>';
  else if(shape==='flower') s+='<circle cx="20" cy="20" r="6" stroke="'+c+'" stroke-width="1.6" fill="'+c+'22"/><g stroke="'+c+'" stroke-width="1.4"><path d="M20 14V6"/><path d="M20 26v8"/><path d="M14 20H6"/><path d="M26 20h8"/><path d="M15.8 15.8L10 10"/><path d="M24.2 24.2L30 30"/><path d="M24.2 15.8L30 10"/><path d="M15.8 24.2L10 30"/></g>';
  else if(shape==='dots') s+='<circle cx="20" cy="20" r="14" stroke="'+c+'" stroke-width="1.3" opacity=".5"/><circle cx="16" cy="16" r="2" fill="'+c+'"/><circle cx="24" cy="16" r="2" fill="'+c+'"/><circle cx="20" cy="22" r="2" fill="'+c+'"/><circle cx="15" cy="24" r="2" fill="'+c+'"/><circle cx="25" cy="24" r="2" fill="'+c+'"/>';
  return s+'</svg>';
}
var TIERVAR={eros:'--t-eros',kozepes:'--t-kozepes',korai:'--t-korai',taperk:'--t-taperk'};
function tierColor(t){return getComputedStyle(document.documentElement).getPropertyValue(TIERVAR[t]).trim();}
function tierName(t){return T().tiers[t];}
function seedById(id){for(var i=0;i<SEEDS.length;i++)if(SEEDS[i].id===id)return SEEDS[i];return null;}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ---------- Szekció-renderelés ---------- */
function renderSecs(secs){
  return secs.map(function(s){
    var title = s.t || SC()[s.k] || '';
    var body = Array.isArray(s.b)
      ? '<ul class="ev-list">'+s.b.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>'
      : (s.v?'<div class="vc">'+s.b+'</div>':'<div class="ev-c">'+s.b+'</div>');
    if(s.v) return '<div class="ev-verdict2"><div class="vh"><span>'+(s.ic||'⚖️')+'</span> '+title+'</div>'+body+'</div>';
    return '<div class="ev-sec"><div class="ev-h"><span class="ev-ic">'+s.ic+'</span> '+title+'</div>'+body+'</div>';
  }).join('');
}

/* ---------- Kártyák + oldalsáv ---------- */
function buildCards(){
  var cards=document.getElementById('cards');
  cards.innerHTML='';
  SEEDS.forEach(function(s,i){
    var d=S()[s.id], num=String(i+1).padStart(2,'0'), tc=tierColor(s.tier);
    var specHtml=d.spec.map(function(p){return '<div><span>'+p[0]+'</span><b>'+p[1]+'</b></div>';}).join('');
    var warnHtml=d.warn?'<div class="warn">'+d.warn+'</div>':'';

    var card=document.createElement('div');
    card.className='card'; card.id='c-'+s.id; card.setAttribute('data-flipped','false');
    card.style.setProperty('--c',s.c);
    card.innerHTML=
     '<div class="flip">'+
       '<div class="face front glass" tabindex="0" role="button" aria-label="'+esc(d.n)+' – '+esc(T().cardFlip)+'">'+
         '<span class="badge">'+num+' · '+d.n+'</span>'+
         '<span class="ico">'+icon(s.shape,s.c)+'</span>'+
         '<h2>'+d.n+'</h2>'+
         '<span class="tier-pill" style="color:'+tc+';background:'+tc+'1e;border:1px solid '+tc+'"><span class="sq" style="background:'+tc+'"></span>'+T().tierLbl+': '+tierName(s.tier)+'</span>'+
         '<p class="q"><span class="qmark">?</span>'+d.q+'</p>'+
         '<div class="flip-cue"><span class="ring">↻</span> '+T().flipCue+'</div>'+
       '</div>'+
       '<div class="face back glass" tabindex="0" role="button" aria-label="'+esc(T().cardBack)+'">'+
         '<div class="btag">'+T().answer+'</div>'+
         '<p class="ans">'+d.a+'</p>'+
         warnHtml+
         '<div class="spec">'+specHtml+'</div>'+
         '<div class="cite">▸ '+d.cite+'</div>'+
         '<div class="btn-row">'+
           '<button class="ev-btn" data-ev="'+s.id+'">📖 '+T().evBtn+'</button>'+
           '<button class="use-btn" data-use="'+s.id+'">🍽️ '+T().useBtn+'</button>'+
         '</div>'+
         '<div class="back-cue">'+T().backCue+'</div>'+
       '</div>'+
     '</div>';
    cards.appendChild(card);
  });
  wireCards();
}

function wireCards(){
  document.querySelectorAll('.card').forEach(function(card){
    function flip(){card.setAttribute('data-flipped',card.getAttribute('data-flipped')==='true'?'false':'true');}
    card.querySelectorAll('.face').forEach(function(f){
      f.addEventListener('click',function(e){ if(e.target.closest('.ev-btn,.use-btn'))return; flip(); });
      f.addEventListener('keydown',function(e){ if((e.key==='Enter'||e.key===' ')&&!e.target.closest('.ev-btn,.use-btn')){e.preventDefault();flip();} });
    });
  });
  document.querySelectorAll('.ev-btn').forEach(function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      var s=seedById(b.getAttribute('data-ev')), d=S()[s.id];
      var secs=d.ev.slice();
      secs.push({ic:'🧬',k:'fiber',b:d.fib});
      if(d.warn) secs.push({ic:'⚠️',k:'safety',b:d.warn.replace(/^⚠\s*/,'')});
      openModal(renderSecs(secs)+studySection(s.id)+tagRow(s), d.n, s.tier, icon(s.shape,s.c), s.c);
    });
  });
  document.querySelectorAll('.use-btn').forEach(function(b){
    b.addEventListener('click',function(e){
      e.stopPropagation();
      var s=seedById(b.getAttribute('data-use')), d=S()[s.id];
      var arr=d.use.slice();
      var last=arr.pop();
      arr.push({ic:'🎯',k:'best',b:d.best});
      arr.push({ic:'🍋',k:'pair',b:d.pair});
      arr.push(last);
      openModal(renderSecs(arr)+soakWidget(s)+tagRow(s), d.n, null, icon(s.shape,s.c), s.c, T().usePill);
      setupSoak(s);
    });
  });
}
function wireNav(){
  document.querySelectorAll('.navitem').forEach(function(item){
    item.addEventListener('click',function(){
      var el=document.getElementById(item.getAttribute('data-target'));
      if(shell.getAttribute('data-view')!=='cards') setView('cards');
      if(window.matchMedia('(max-width:760px)').matches){setNav('closed');}
      if(!el)return;
      el.scrollIntoView({behavior:'smooth',block:'center'});
      el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse');
    });
  });
}
function tagRow(s){
  if(!s.tags||!s.tags.length) return '';
  var g=TG();
  return '<div class="chips" style="margin-top:4px">'+s.tags.map(function(k){
    return '<span class="chip" style="cursor:default;--c:'+s.c+'">'+g[k]+'</span>';}).join('')+'</div>';
}
function paintNavEaten(){
  document.querySelectorAll('.navitem').forEach(function(n){
    n.setAttribute('data-eaten', EATEN.indexOf(n.getAttribute('data-seed'))>=0?'1':'0');
  });
}

/* ---------- Primer / táblázat / általános tippek ---------- */
function renderPrimer(){
  var p=pack().primer;
  var h='<div class="ev-sec"><div class="ev-h"><span class="ev-ic">📊</span> '+p.t1+'</div>'+
    '<div class="ev-c" style="padding-left:0;margin-bottom:10px">'+p.intro+'</div><div class="ladder">'+
    pack().ladder.map(function(x,i){return '<div class="rung"><span class="rn">'+(i+1)+'</span><span>'+x+'</span></div>';}).join('')+
    '</div></div>';
  h+=renderSecs([{ic:'❓',t:p.t2,b:p.q3},{ic:'🏷️',t:p.t3,b:p.lab},{ic:'✅',t:p.t4,v:1,b:p.fin}]);
  return h;
}
function renderTable(){
  var rows=SEEDS.map(function(s){
    var d=S()[s.id], cls=s.h?'soak-need':'soak-no';
    return '<tr><td><span class="soak-dot" style="background:'+s.c+'"></span>'+d.n+'</td>'+
      '<td class="'+cls+'">'+d.soak.label+'</td><td>'+d.soak.amt+'</td></tr>';}).join('');
  return '<div class="ev-c" style="padding-left:0;margin-bottom:12px">'+T().tableIntro+'</div>'+
    '<div class="table-wrap"><table class="soak-table"><thead><tr><th>'+T().thSeed+'</th><th>'+T().thSoak+
    '</th><th>'+T().thAmt+'</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}

/* ---------- Naptár segédek ---------- */
function pad(n){return String(n).padStart(2,'0');}
function fmtClock(d){return pad(d.getHours())+':'+pad(d.getMinutes());}
function fmtRemain(ms){ if(ms<0)ms=0; var s=Math.floor(ms/1000);
  var h=Math.floor(s/3600); s-=h*3600; var m=Math.floor(s/60); s-=m*60;
  return (h>0?h+':':'')+pad(m)+':'+pad(s); }
function icsStamp(d){ return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+
  pad(d.getUTCHours())+pad(d.getUTCMinutes())+pad(d.getUTCSeconds())+'Z'; }
function stripTags(t){return (t||'').replace(/<[^>]+>/g,'');}
/* RFC 5545 3.3.11: a TEXT értékben a \ ; , és az újsor escape-elendő. */
function icsText(s){
  return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,')
    .replace(/\r\n|\r|\n/g,'\\n');
}
/* RFC 5545 3.1: 75 oktettnél hosszabb sort CRLF + szóköz tör; több bájtos UTF-8 karaktert nem vágunk ketté. */
function icsFold(line){
  var out='', n=0;
  for(var i=0;i<line.length;){
    var cp=line.codePointAt(i), ch=String.fromCodePoint(cp),
        b=cp<0x80?1:cp<0x800?2:cp<0x10000?3:4;
    if(n+b>75){ out+='\r\n '; n=1; }
    out+=ch; n+=b; i+=ch.length;
  }
  return out;
}
function nextAt(hhmm){var p=(hhmm||'08:00').split(':');var d=new Date();
  d.setHours(parseInt(p[0],10)||8,parseInt(p[1],10)||0,0,0);
  if(d.getTime()<=Date.now())d.setDate(d.getDate()+1); return d;}
function gcalUrl(name,end){
  var e2=new Date(end.getTime()+15*60000);
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+
    encodeURIComponent(name+' '+T().calDone)+'&dates='+icsStamp(end)+'/'+icsStamp(e2)+
    '&details='+encodeURIComponent(T().calDoneDesc+' ('+T().brand+')');
}
function dlFile(text,name,mime){
  var blob=new Blob([text],{type:mime}); var url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url; a.download=name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(url);},1500);
}
function slug(n){return n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'mag';}
function downloadICS(name,end){
  var e2=new Date(end.getTime()+15*60000);
  dlFile(['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Magok//Soak//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',
    'BEGIN:VEVENT','UID:soak-'+Date.now()+'@magok','DTSTAMP:'+icsStamp(new Date()),
    'DTSTART:'+icsStamp(end),'DTEND:'+icsStamp(e2),icsFold('SUMMARY:'+icsText(stripTags(name+' '+T().calDone))),
    icsFold('DESCRIPTION:'+icsText(stripTags(T().calDoneDesc))),
    'BEGIN:VALARM','TRIGGER:-PT10M','ACTION:DISPLAY',icsFold('DESCRIPTION:'+icsText(stripTags(name))),'END:VALARM',
    'BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY',icsFold('DESCRIPTION:'+icsText(stripTags(name))),'END:VALARM',
    'END:VEVENT','END:VCALENDAR'].join('\r\n'), slug(name)+'-soak.ics','text/calendar;charset=utf-8');
}
function gcalDaily(name,start,tip){
  var e2=new Date(start.getTime()+15*60000);
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+
    encodeURIComponent(name+' '+T().calDaily)+'&dates='+icsStamp(start)+'/'+icsStamp(e2)+
    '&recur='+encodeURIComponent('RRULE:FREQ=DAILY')+'&details='+encodeURIComponent(stripTags(tip));
}
function downloadICSDaily(name,start,tip){
  var e2=new Date(start.getTime()+15*60000);
  dlFile(['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Magok//Daily//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',
    'BEGIN:VEVENT','UID:daily-'+Date.now()+'@magok','DTSTAMP:'+icsStamp(new Date()),
    'DTSTART:'+icsStamp(start),'DTEND:'+icsStamp(e2),'RRULE:FREQ=DAILY',
    icsFold('SUMMARY:'+icsText(stripTags(name+' '+T().calDaily))),icsFold('DESCRIPTION:'+icsText(stripTags(tip))),
    'BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY',icsFold('DESCRIPTION:'+icsText(stripTags(name))),'END:VALARM',
    'END:VEVENT','END:VCALENDAR'].join('\r\n'), slug(name)+'-daily.ics','text/calendar;charset=utf-8');
}

/* ---------- Áztatás-időzítők (globálisak, a jobb panel is látja) ---------- */
var TIMERS=[];
function findTimer(id){for(var i=0;i<TIMERS.length;i++)if(TIMERS[i].id===id)return TIMERS[i];return null;}
function saveTimers(){ try{localStorage.setItem('msa.timers',JSON.stringify(TIMERS.map(function(t){
  return {id:t.id,start:t.start,end:t.end};})));}catch(e){} }
function loadTimers(){ try{ var r=JSON.parse(localStorage.getItem('msa.timers')||'[]');
  TIMERS=r.filter(function(t){return seedById(t.id)&&t.end>Date.now()-6*3600000;}); }catch(e){TIMERS=[];} }
function startTimer(id,hours){
  var now=Date.now(), t=findTimer(id);
  if(t){t.start=now;t.end=now+hours*3600000;} else TIMERS.push({id:id,start:now,end:now+hours*3600000});
  saveTimers(); renderTimers();
}
function stopTimer(id){ TIMERS=TIMERS.filter(function(t){return t.id!==id;}); saveTimers(); renderTimers(); }

function soakWidget(s){
  var d=S()[s.id], inner;
  if(s.h){
    var t=findTimer(s.id), live=!!t;
    inner='<button class="soak-start" data-h="'+s.h+'" data-id="'+s.id+'"'+(live?' style="display:none"':'')+'>'+T().soakStart+'</button>'+
      '<div class="soak-hint">'+T().soakTime+' <b>'+d.soak.label+'</b></div>'+
      '<div class="soak-live"'+(live?'':' hidden')+'><div class="sl-top"></div><div class="big"></div>'+
      '<div class="soak-cal"><a class="cal-btn gcal" target="_blank" rel="noopener">📅 '+T().gcal+'</a>'+
      '<button class="cal-btn ics">⬇️ '+T().icsDl+'</button></div>'+
      '<button class="soak-stop">'+T().soakStop+'</button></div>';
  } else {
    inner='<div class="soak-note">'+d.soak.label+' '+T().dailyIntro+'</div>'+
      '<div class="daily-box" data-name="'+esc(d.n)+'" data-tip="'+esc(stripTags(d.best))+'">'+
      '<label>'+T().dailyLbl+'</label>'+
      '<input type="time" class="daily-time" value="08:00">'+
      '<div class="soak-cal"><a class="cal-btn dgcal" target="_blank" rel="noopener">📅 '+T().gcalDaily+'</a>'+
      '<button class="cal-btn dics">⬇️ '+T().icsDaily+'</button></div></div>';
  }
  return '<div class="ev-sec soak-tool"><div class="ev-h"><span class="ev-ic">⏰</span> '+T().soakTitle+'</div>'+inner+'</div>';
}
function paintModalSoak(){
  var live=mBody.querySelector('.soak-live'); if(!live||live.hidden)return;
  var id=mBody.querySelector('.soak-start'); if(!id)return;
  var t=findTimer(id.getAttribute('data-id')); if(!t)return;
  var top=live.querySelector('.sl-top'), big=live.querySelector('.big');
  var rem=t.end-Date.now(), sd=new Date(t.start), ed=new Date(t.end);
  if(rem<=0){ top.innerHTML=T().soakSoaked+' '+fmtClock(sd)+' · '+T().soakReady+' '+fmtClock(ed);
    big.textContent=T().soakDone; return; }
  top.innerHTML=T().soakSoaked+' '+fmtClock(sd)+' · '+T().soakReady+' <b>'+fmtClock(ed)+'</b>';
  big.textContent=T().soakLeft+' '+fmtRemain(rem);
}
function setupSoak(s){
  var startBtn=mBody.querySelector('.soak-start');
  if(startBtn){
    var live=mBody.querySelector('.soak-live'), stop=mBody.querySelector('.soak-stop'),
        gcal=live.querySelector('.gcal'), icsBtn=live.querySelector('.ics'), d=S()[s.id];
    function arm(){
      var t=findTimer(s.id); if(!t)return;
      gcal.href=gcalUrl(d.n,new Date(t.end));
      icsBtn.onclick=function(){downloadICS(d.n,new Date(t.end));};
      paintModalSoak();
    }
    if(findTimer(s.id)) arm();
    startBtn.addEventListener('click',function(){
      startTimer(s.id,parseFloat(startBtn.getAttribute('data-h')));
      startBtn.style.display='none'; live.hidden=false; arm();
    });
    stop.addEventListener('click',function(){
      stopTimer(s.id); live.hidden=true; startBtn.style.display='';
    });
  }
  var dtime=mBody.querySelector('.daily-time');
  if(dtime){
    var box=dtime.closest('.daily-box'), nm=box.getAttribute('data-name'),
        dtip=box.getAttribute('data-tip')||'', dg=box.querySelector('.dgcal'), di=box.querySelector('.dics');
    function refresh(){ dg.href=gcalDaily(nm,nextAt(dtime.value),dtip); }
    refresh();
    dtime.addEventListener('change',refresh); dtime.addEventListener('input',refresh);
    di.addEventListener('click',function(){ downloadICSDaily(nm,nextAt(dtime.value),dtip); });
  }
}
function renderTimers(){
  var box=document.getElementById('timerList');
  if(!TIMERS.length){ box.innerHTML='<div class="empty">'+T().timerEmpty+'</div>'; return; }
  box.innerHTML=TIMERS.map(function(t){
    var s=seedById(t.id), d=S()[t.id], rem=t.end-Date.now(), done=rem<=0;
    return '<div class="tm" data-id="'+t.id+'"><span class="td" style="background:'+s.c+'"></span>'+
      '<span class="tn">'+d.n+'</span>'+
      '<span class="tv'+(done?' done':'')+'">'+(done?'✅':fmtRemain(rem))+'</span>'+
      '<button class="tx" aria-label="'+esc(T().soakStop)+'">✕</button></div>';
  }).join('');
  box.querySelectorAll('.tx').forEach(function(b){
    b.addEventListener('click',function(){ stopTimer(b.closest('.tm').getAttribute('data-id')); });
  });
}
setInterval(function(){
  TIMERS.forEach(function(t){
    var el=document.querySelector('.tm[data-id="'+t.id+'"] .tv'); if(!el)return;
    var rem=t.end-Date.now();
    if(rem<=0){ el.textContent='✅'; el.classList.add('done'); }
    else el.textContent=fmtRemain(rem);
  });
  paintModalSoak();
},1000);

/* ---------- Mai magok / sorozat ---------- */
var EATEN=[], STREAK=0;
function today(){var d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function yesterday(){var d=new Date(Date.now()-86400000);return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function loadTrack(){
  try{
    var r=JSON.parse(localStorage.getItem('msa.track')||'{}');
    STREAK=r.streak||0;
    EATEN=(r.date===today())?(r.eaten||[]):[];
    if(r.date&&r.date!==today()&&r.date!==yesterday()) STREAK=0;
  }catch(e){EATEN=[];STREAK=0;}
}
function saveTrack(){
  try{
    var r=JSON.parse(localStorage.getItem('msa.track')||'{}');
    if(EATEN.length&&r.date!==today()) STREAK=(r.date===yesterday()?(r.streak||0):0)+1;
    if(!EATEN.length&&r.date===today()) STREAK=Math.max(0,(r.streak||1)-1);
    localStorage.setItem('msa.track',JSON.stringify({date:today(),eaten:EATEN,streak:STREAK}));
  }catch(e){}
}
function toggleEaten(id){
  var i=EATEN.indexOf(id);
  if(i>=0)EATEN.splice(i,1); else EATEN.push(id);
  saveTrack(); renderTrack(); paintNavEaten();
}
function renderTrack(){
  var chips=document.getElementById('trkChips');
  chips.innerHTML=SEEDS.map(function(s){
    var on=EATEN.indexOf(s.id)>=0;
    return '<button class="chip" data-seed="'+s.id+'" style="--c:'+s.c+'" aria-pressed="'+on+'">'+
      '<span class="cd"></span>'+S()[s.id].n+'</button>';}).join('');
  chips.querySelectorAll('.chip').forEach(function(b){
    b.addEventListener('click',function(){toggleEaten(b.getAttribute('data-seed'));});
  });
  document.getElementById('trkN').textContent=EATEN.length;
  document.getElementById('trkOf').textContent=T().trkOf;
  document.getElementById('trkStreak').textContent=STREAK>0?('🔥 '+STREAK+' '+T().trkStreak):'';
  document.getElementById('trkBar').style.width=Math.round(EATEN.length/SEEDS.length*100)+'%';
}

/* ---------- Napi tipp ---------- */
var tipIdx=0;
function renderTips(){
  var list=pack().tips;
  tipIdx=tipIdx%list.length;
  var a=list[tipIdx], b=list[(tipIdx+1)%list.length], c=list[(tipIdx+2)%list.length];
  document.getElementById('tipList').innerHTML=[a,b,c].map(function(x){
    return '<div class="tip"><span class="th">'+x[0]+'</span>'+x[1]+'</div>';}).join('')+
    '<button class="rp-reset" id="tipNext">'+T().tipMore+'</button>';
  document.getElementById('tipNext').addEventListener('click',function(){tipIdx=(tipIdx+1)%list.length;renderTips();});
}

/* ---------- Modal ---------- */
var overlay=document.getElementById('modalOverlay'),modalCard=document.getElementById('modalCard'),
    mTitle=document.getElementById('modalTitle'),mTier=document.getElementById('modalTier'),
    mBody=document.getElementById('modalBody'),mIcon=document.getElementById('modalIcon'),
    mClose=document.getElementById('modalClose'),lastFocus=null;
function openModal(html,title,tier,iconHtml,accent,pillText){
  lastFocus=document.activeElement;
  modalCard.classList.remove('wide');
  modalCard.style.setProperty('--mc', accent||'#38bdf8');
  mBody.innerHTML=html; mTitle.textContent=title; mBody.scrollTop=0;
  if(tier){var tc=tierColor(tier);
    mTier.style.display='inline-flex'; mTier.style.color=tc;
    mTier.style.background=tc+'1e'; mTier.style.border='1px solid '+tc;
    mTier.innerHTML='<span class="sq" style="width:8px;height:8px;border-radius:2px;background:'+tc+'"></span>'+T().tierLbl+': '+tierName(tier);
  } else if(pillText){var ac=accent||'#38bdf8';
    mTier.style.display='inline-flex'; mTier.style.color=ac;
    mTier.style.background='rgba(255,255,255,.05)'; mTier.style.border='1px solid '+ac;
    mTier.innerHTML=pillText;
  } else { mTier.style.display='none'; }
  mIcon.innerHTML=iconHtml||'📖';
  overlay.classList.add('open'); mClose.focus();
}
function closeModal(){ overlay.classList.remove('open'); if(lastFocus&&lastFocus.focus)lastFocus.focus(); }
mClose.addEventListener('click',closeModal);
overlay.addEventListener('click',function(e){ if(e.target===overlay)closeModal(); });
/* Fókuszcsapda: nyitott ablaknál a Tab / Shift+Tab csak a #modalCard elemein körbe jár. */
function modalFocusables(){
  return Array.prototype.filter.call(modalCard.querySelectorAll(
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'),
    function(el){ return el.getClientRects().length>0; });
}
document.addEventListener('keydown',function(e){
  if(!overlay.classList.contains('open'))return;
  if(e.key==='Escape'){ closeModal(); return; }
  if(e.key!=='Tab')return;
  var f=modalFocusables(); if(!f.length){ e.preventDefault(); return; }
  var i=f.indexOf(document.activeElement);
  if(e.shiftKey){ if(i<=0){ e.preventDefault(); f[f.length-1].focus(); } }
  else if(i===-1||i===f.length-1){ e.preventDefault(); f[0].focus(); }
});
document.getElementById('primerBtn').addEventListener('click',function(){
  openModal(renderPrimer(),T().primerTitle,null,'📖','#38bdf8'); });
document.getElementById('soakTableBtn').addEventListener('click',function(){
  openModal(renderTable(),T().tableTitle,null,'⏱️','#2dd4bf',T().tablePill); });
document.getElementById('bestBtn').addEventListener('click',function(){
  openModal(renderSecs(pack().bestgen),T().bestTitle,null,'🔬','#34d399',T().bestPill); });
document.getElementById('compareBtn').addEventListener('click',openCompare);
document.getElementById('studyBtn').addEventListener('click',function(){
  openModal(renderAllStudies(),T().studyT,null,'🔬','#7dd3fc',T().studyPill); });
/* Mobilon ugyanez a két ablak a bal menü aljáról nyílik; bezáráskor a fókusz a menügombra tér vissza. */
document.getElementById('sidePrimer').addEventListener('click',function(){
  setNav('closed'); openModal(renderPrimer(),T().primerTitle,null,'📖','#38bdf8'); lastFocus=menuBtn; });
document.getElementById('sideStudy').addEventListener('click',function(){
  setNav('closed'); openModal(renderAllStudies(),T().studyT,null,'🔬','#7dd3fc',T().studyPill); lastFocus=menuBtn; });

/* ---------- Menük ---------- */
var shell=document.getElementById('shell'),menuBtn=document.getElementById('menuBtn'),
    collapseBtn=document.getElementById('collapseBtn'),backdrop=document.getElementById('backdrop'),
    rbackdrop=document.getElementById('rbackdrop');
function setNav(st){shell.setAttribute('data-nav',st);menuBtn.setAttribute('aria-expanded',st==='open'?'true':'false');}
function setRight(st){shell.setAttribute('data-right',st);
  var tb=document.getElementById('tbPanels'); if(tb)tb.setAttribute('aria-pressed',st==='open'?'true':'false');}
menuBtn.addEventListener('click',function(){setNav(shell.getAttribute('data-nav')==='open'?'closed':'open');});
collapseBtn.addEventListener('click',function(){setNav('closed');});
backdrop.addEventListener('click',function(){setNav('closed');});
rbackdrop.addEventListener('click',function(){setRight('closed');});
document.getElementById('rightClose').addEventListener('click',function(){setRight('closed');});
document.getElementById('rightBtn').addEventListener('click',function(){
  setRight(shell.getAttribute('data-right')==='open'?'closed':'open');});
document.getElementById('tbMenu').addEventListener('click',function(){setNav(shell.getAttribute('data-nav')==='open'?'closed':'open');});
document.getElementById('tbTable').addEventListener('click',function(){openModal(renderTable(),T().tableTitle,null,'⏱️','#2dd4bf',T().tablePill);});
document.getElementById('tbCompare').addEventListener('click',openCompare);
document.getElementById('tbStudy').addEventListener('click',function(){openModal(renderSecs(pack().bestgen),T().bestTitle,null,'🔬','#34d399',T().bestPill);});
document.getElementById('tbPanels').addEventListener('click',function(){setRight(shell.getAttribute('data-right')==='open'?'closed':'open');});

/* =========================================================
   VIDEÓ OLDAL (bal menü: ▶ Videók) — 16 hely, js/videos.js
   ========================================================= */
var videoPage=document.getElementById('videoPage');
function renderVideos(){
  var t=T(), list=(typeof VIDEOS!=='undefined')?VIDEOS:[];
  var cards=list.map(function(v,i){
    var tl=(v&&v.t)||[], l1=String(tl[0]||''), l2=String(tl[1]||''), id=String((v&&v.id)||'');
    var ph=String(t.videoPh).replace('{n}',i+1), title=(l1+' '+l2).trim()||ph;
    /* Csak érvényes, 11 karakteres azonosítóból lesz lejátszó; különben helyőrző. */
    var player=/^[A-Za-z0-9_-]{11}$/.test(id)
      ? '<iframe src="https://www.youtube-nocookie.com/embed/'+esc(id)+'?rel=0" title="'+esc(title)+'" loading="lazy"'+
        ' allow="encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe>'
      : '<span class="vid-ph">'+esc(t.videoSoon)+'</span>';
    return '<article class="vid-card glass"><div class="vid-wrap">'+player+'</div>'+
      '<p class="vid-title">'+
        (l1?'<span class="vid-line">'+esc(l1)+'</span>':'<span class="vid-line placeholder">'+esc(ph)+'</span>')+
        '<span class="vid-line second">'+esc(l2)+'&nbsp;</span>'+
      '</p></article>';
  }).join('');
  videoPage.innerHTML=
    '<div class="vid-head glass"><h2>▶ '+esc(t.videosTitle)+'</h2><p>'+esc(t.videosSub)+'</p></div>'+
    '<div class="vid-grid">'+cards+'</div>';
}
/* Nézetváltás: kártyák vagy videók. A videóoldal elhagyásakor a lejátszók megszűnnek, így a hang sem szól tovább. */
function setView(v){
  shell.setAttribute('data-view',v);
  document.getElementById('pgCards').setAttribute('aria-pressed',String(v==='cards'));
  document.getElementById('pgVideos').setAttribute('aria-pressed',String(v==='videos'));
  if(v==='videos') renderVideos(); else videoPage.innerHTML='';
}
function openView(v){
  setView(v);
  if(window.matchMedia('(max-width:760px)').matches) setNav('closed');
  window.scrollTo(0,0);
}
document.getElementById('pgCards').addEventListener('click',function(){openView('cards');});
document.getElementById('pgVideos').addEventListener('click',function(){openView('videos');});

/* =========================================================
   NYELVVÁLTÁS
   ========================================================= */
function applyI18n(){
  var t=T();
  document.documentElement.lang=t.htmlLang;
  document.title=t.title+' · '+t.brand;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k=el.getAttribute('data-i18n'); if(t[k]!=null)el.textContent=t[k];
  });
  document.getElementById('sideLbl').textContent=t.sideLbl;
  document.getElementById('sideNote').innerHTML=t.sideNote;
  document.getElementById('studyHint').innerHTML=t.studyHint;
  document.getElementById('footTxt').innerHTML=t.footTxt;
  document.getElementById('footNote').textContent=t.footNote;
  document.getElementById('footReviewed').innerHTML=t.reviewedTxt+' <b>'+REVIEWED+'</b>';
  var si=document.getElementById('navSearch');
  if(si){ si.placeholder=t.searchPh; si.setAttribute('aria-label',t.searchPh); }
  document.getElementById('modalNote').textContent=t.modalNote;
  document.getElementById('collapseBtn').setAttribute('aria-label',t.menuTitle);
  document.getElementById('modalClose').setAttribute('aria-label',t.closeLbl);
  document.querySelectorAll('.lang').forEach(function(b){
    b.setAttribute('aria-pressed',String(b.getAttribute('data-lang')===LANG)); });
}
function renderAll(){
  applyI18n(); buildCards(); buildNav(); renderTrack(); renderTimers(); renderTips();
  if(shell.getAttribute('data-view')==='videos') renderVideos();
}
document.querySelectorAll('.lang').forEach(function(b){
  b.addEventListener('click',function(){
    var code=b.getAttribute('data-lang');
    ensureLang(code,function(){
      LANG=code;
      try{localStorage.setItem('msa.lang',LANG);}catch(e){}
      if(overlay.classList.contains('open'))closeModal();
      navFilter='';
      var si=document.getElementById('navSearch'); if(si)si.value='';
      renderAll();
    });
  });
});

/* =========================================================
   INDÍTÁS
   ========================================================= */
/* Az indítás a fájl legvégén fut — addigra minden `var` adat
   (CMPCOLS, TIER_ORDER, navFilter…) is értéket kapott. */

/* =========================================================
   ÖSSZEHASONLÍTÓ TÁBLÁZAT
   Két kapcsoló: 100 g ↔ napi adag, illetve gramm ↔ %DV.
   ========================================================= */
var cmpSort={col:'f',dir:-1}, cmpAmount='100', cmpUnit='g';

/* k = NUT mező, t = UI-kulcs a fejléchez, u = mértékegység,
   dv = a DV-kulcs (ha van), d = tizedesjegy */
var CMPCOLS=[
 {k:'name',t:'cSeed'},
 {k:'kcal',t:'cKcal',num:true,d:0,u:'',    dv:'kcal'},
 {k:'p',   t:'cProt',num:true,d:1,u:' g',  dv:'p'},
 {k:'fat', t:'cFat', num:true,d:1,u:' g',  dv:'fat'},
 {k:'f',   t:'cFib', num:true,d:1,u:' g',  dv:'f'},
 {k:'ala', t:'cAla', num:true,d:2,u:' g'},
 {k:'ca',  t:'cCa',  num:true,d:0,u:' mg', dv:'ca',mg:true},
 {k:'mg',  t:'cMg',  num:true,d:0,u:' mg', dv:'mg',mg:true},
 {k:'k',   t:'cK',   num:true,d:0,u:' mg', dv:'k', mg:true},
 {k:'fe',  t:'cFe',  num:true,d:1,u:' mg', dv:'fe',mg:true},
 {k:'zn',  t:'cZn',  num:true,d:1,u:' mg', dv:'zn',mg:true},
 {k:'tier',t:'cEv'}
];

function dec(v,d){
  var s=v.toFixed(d);
  return (LANG==='en')?s:s.replace('.',',');
}
/* A megjelenített szám: adagra váltva és/vagy %DV-re alakítva. */
function cellValue(id,col){
  var raw=NUT[id][col.k];
  if(raw===null||raw===undefined) return null;
  var scale=(cmpAmount==='por')?(NUT[id].por/100):1;
  var v=raw*scale;
  if(cmpUnit==='dv'&&col.dv) return {n:v/DV[col.dv]*100,txt:dec(v/DV[col.dv]*100,0)+'%'};
  var d=col.d;
  if(col.mg&&cmpAmount==='por'&&v<10) d=1;
  return {n:v,txt:dec(v,d)+col.u};
}

function renderCompare(){
  var t=T();
  var maxes={};
  CMPCOLS.forEach(function(c){
    if(!c.num)return;
    var m=-Infinity;
    SEEDS.forEach(function(s){var v=cellValue(s.id,c); if(v&&v.n>m)m=v.n;});
    maxes[c.k]=m;
  });

  var col=CMPCOLS.filter(function(c){return c.k===cmpSort.col;})[0]||CMPCOLS[4];
  var rows=SEEDS.slice().sort(function(a,b){
    if(col.k==='name') return S()[a.id].n.localeCompare(S()[b.id].n,LANG)*cmpSort.dir;
    if(col.k==='tier') return String(a.tier).localeCompare(String(b.tier))*cmpSort.dir;
    var va=cellValue(a.id,col), vb=cellValue(b.id,col);
    return ((va?va.n:-1)-(vb?vb.n:-1))*cmpSort.dir;
  });

  var tools=
   '<div class="cmp-tools">'+
     '<div><span class="seg-lbl">'+t.lblAmount+'</span><div class="seg" id="segAmount">'+
       '<button data-v="100" aria-pressed="'+(cmpAmount==='100')+'">'+t.amt100+'</button>'+
       '<button data-v="por" aria-pressed="'+(cmpAmount==='por')+'">'+t.amtPor+'</button></div></div>'+
     '<div><span class="seg-lbl">'+t.lblUnit+'</span><div class="seg" id="segUnit">'+
       '<button data-v="g" aria-pressed="'+(cmpUnit==='g')+'">'+t.unitG+'</button>'+
       '<button data-v="dv" aria-pressed="'+(cmpUnit==='dv')+'">'+t.unitDV+'</button></div></div>'+
   '</div>';

  var head='<tr>'+CMPCOLS.map(function(c){
    var arrow=(c.k===cmpSort.col)?(cmpSort.dir<0?' ▾':' ▴'):'';
    return '<th class="cmp-th'+(c.num?' num':'')+'" data-col="'+c.k+'" tabindex="0" role="button">'+t[c.t]+arrow+'</th>';
  }).join('')+'</tr>';

  var body=rows.map(function(s){
    return '<tr>'+CMPCOLS.map(function(c){
      if(c.k==='name') return '<td class="cmp-name"><span class="soak-dot" style="background:'+s.c+'"></span>'+S()[s.id].n+'</td>';
      if(c.k==='tier'){ var tc=tierColor(s.tier);
        return '<td><span class="tier-pill" style="margin:0;color:'+tc+';background:'+tc+'1e;border:1px solid '+tc+'"><span class="sq" style="background:'+tc+'"></span>'+tierName(s.tier)+'</span></td>'; }
      var v=cellValue(s.id,c);
      if(!v) return '<td class="num nodata">—</td>';
      var top=(v.n===maxes[c.k]&&v.n>0);
      return '<td class="num'+(top?' top':'')+(cmpUnit==='dv'?' dv':'')+'">'+v.txt+'</td>';
    }).join('')+'</tr>';
  }).join('');

  var notes='<div class="cmp-note">'+(cmpAmount==='por'?t.porNote:t.cmpIntro)+'</div>'+
    (cmpUnit==='dv'?'<div class="cmp-note">'+t.dvNote+'</div>':'')+
    '<div class="cmp-note">'+t.srcNote+'</div>'+
    '<div class="cmp-note">'+t.reviewedTxt+' <b>'+REVIEWED+'</b></div>';

  return tools+'<div class="table-wrap"><table class="soak-table cmp-table"><thead>'+head+
    '</thead><tbody>'+body+'</tbody></table></div>'+notes;
}

/* A fejléc-címke kövesse, hogy 100 g-ot vagy napi adagot mutatunk. */
function cmpPillText(){
  var t=T();
  return '📊 '+SEEDS.length+' · '+(cmpAmount==='100'?t.amt100:t.amtPor)+(cmpUnit==='dv'?' · %DV':'');
}
function redrawCompare(){
  mBody.innerHTML=renderCompare(); wireCompare();
  mTier.innerHTML=cmpPillText();
}
function wireCompare(){
  mBody.querySelectorAll('.cmp-th').forEach(function(th){
    function go(){
      var c=th.getAttribute('data-col');
      if(cmpSort.col===c) cmpSort.dir*=-1; else { cmpSort.col=c; cmpSort.dir=(c==='name')?1:-1; }
      redrawCompare();
    }
    th.addEventListener('click',go);
    th.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();go();} });
  });
  var a=mBody.querySelector('#segAmount'), u=mBody.querySelector('#segUnit');
  if(a) a.querySelectorAll('button').forEach(function(b){
    b.addEventListener('click',function(){ cmpAmount=b.getAttribute('data-v'); redrawCompare(); }); });
  if(u) u.querySelectorAll('button').forEach(function(b){
    b.addEventListener('click',function(){ cmpUnit=b.getAttribute('data-v'); redrawCompare(); }); });
}
function openCompare(){
  openModal(renderCompare(),T().cmpTitle,null,'📊','#7dd3fc',cmpPillText());
  modalCard.classList.add('wide');
  wireCompare();
}

/* =========================================================
   KERESŐ A BAL MENÜBEN
   ========================================================= */
var navFilter='';
function fold(s){
  return String(s).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[đĐ]/g,'d').replace(/[țţ]/g,'t').replace(/[șş]/g,'s');
}
function matches(s){
  if(!navFilter) return true;
  var d=S()[s.id], q=fold(navFilter);
  return fold(d.n).indexOf(q)>=0 || fold(d.tag||'').indexOf(q)>=0;
}
var TIER_ORDER=['eros','kozepes','korai','taperk'];

function buildNav(){
  var nav=document.getElementById('nav'), t=T();
  nav.innerHTML='';
  var hits=SEEDS.filter(matches);
  if(!hits.length){
    nav.innerHTML='<div class="nav-empty">'+t.searchNone+' <b>'+esc(navFilter)+'</b></div>';
    return;
  }
  function item(s){
    var d=S()[s.id], tc=tierColor(s.tier);
    var bi=document.createElement('button');
    bi.className='navitem'; bi.style.setProperty('--c',s.c);
    bi.setAttribute('data-target','c-'+s.id); bi.setAttribute('data-seed',s.id);
    bi.innerHTML='<span class="dot"></span><span class="k">'+d.n+'</span>'+
      '<span class="eaten">✓</span><span class="tierdot" style="background:'+tc+'" title="'+esc(tierName(s.tier))+'"></span>';
    nav.appendChild(bi);
  }
  if(navFilter){ hits.forEach(item); }
  else {
    /* Szűrés nélkül bizonyíték-szint szerint csoportosítunk — így a menü rangsor is. */
    TIER_ORDER.forEach(function(tier){
      var g=hits.filter(function(s){return s.tier===tier;});
      if(!g.length)return;
      var tc=tierColor(tier), h=document.createElement('div');
      h.className='nav-group';
      h.innerHTML='<span class="gs" style="background:'+tc+'"></span>'+esc(tierName(tier))+' · '+g.length;
      nav.appendChild(h);
      g.forEach(item);
    });
  }
  wireNav();
  paintNavEaten();
}
function wireSearch(){
  var inp=document.getElementById('navSearch'),
      box=document.getElementById('sideSearch'),
      clr=document.getElementById('navClear');
  if(!inp)return;
  inp.addEventListener('input',function(){
    navFilter=inp.value.trim();
    box.setAttribute('data-has',navFilter?'1':'0');
    buildNav();
  });
  clr.addEventListener('click',function(){
    inp.value=''; navFilter=''; box.setAttribute('data-has','0'); buildNav(); inp.focus();
  });
  inp.addEventListener('keydown',function(e){
    if(e.key==='Escape'){ inp.value=''; navFilter=''; box.setAttribute('data-has','0'); buildNav(); }
    if(e.key==='Enter'){
      var first=document.querySelector('.navitem');
      if(first) first.click();
    }
  });
}
/* ===== Hivatkozas-renderelés ===== */
function tyLabel(ty){var t=T();return ty==='ma'?t.tyMa:ty==='rct'?t.tyRct:ty==='rev'?t.tyRev:t.tyNa;}
function studyCard(st,txt){
  var t=T();
  if(st.ty==='na') return '<div class="study na"><div class="st-h"><span class="st-ty na">'+t.tyNa+'</span></div>'+
    '<div class="st-f">'+(txt||'')+'</div></div>';
  var links='<a class="st-l" href="https://pubmed.ncbi.nlm.nih.gov/'+st.pmid+'/" target="_blank" rel="noopener">PubMed '+st.pmid+' ↗</a>';
  if(st.doi){
    links+='<a class="st-l" href="https://doi.org/'+st.doi+'" target="_blank" rel="noopener">DOI ↗</a>'+
      '<a class="st-l" href="https://openalex.org/works?filter=doi:'+encodeURIComponent(st.doi)+'" target="_blank" rel="noopener">OpenAlex ↗</a>';
  }
  return '<div class="study"><div class="st-h"><span class="st-ty '+st.ty+'">'+tyLabel(st.ty)+'</span>'+
    '<span class="st-j">'+st.j+' · '+st.y+'</span></div>'+
    '<div class="st-t">'+st.t+'</div>'+
    '<div class="st-f">'+(txt||'')+'</div>'+
    '<div class="st-links">'+links+'</div></div>';
}
function studySection(id){
  var list=STUDIES[id]||[];
  if(!list.length) return '';
  var txt=FIND(id);
  return '<div class="ev-sec"><div class="ev-h"><span class="ev-ic">📚</span> '+T().studyT+'</div>'+
    '<div class="studies">'+list.map(function(s,i){return studyCard(s,txt[i]);}).join('')+'</div></div>';
}
function renderAllStudies(){
  var t=T();
  return '<div class="ev-c" style="padding-left:0;margin-bottom:14px">'+t.studyIntro+'</div>'+
    SEEDS.map(function(s){
      var list=STUDIES[s.id]||[], txt=FIND(s.id);
      return '<div class="ev-sec"><div class="ev-h" style="border-left-color:'+s.c+';color:'+s.c+'">'+
        '<span class="ev-ic">'+(SEEDS.indexOf(s)+1)+'</span> '+S()[s.id].n+'</div>'+
        '<div class="studies">'+list.map(function(x,i){return studyCard(x,txt[i]);}).join('')+'</div></div>';
    }).join('')+
    '<div class="cmp-note">'+t.srcNote+'</div>';
}

/* =========================================================
   INDÍTÁS
   ========================================================= */
loadTimers(); loadTrack();
if(window.matchMedia('(max-width:760px)').matches){ setNav('closed'); setRight('closed'); }
else if(window.matchMedia('(max-width:1240px)').matches){ setRight('closed'); }
wireSearch();
ensureLang(LANG,function(){ renderAll(); });
