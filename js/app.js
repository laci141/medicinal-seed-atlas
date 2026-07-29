
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
function stripTags(t){return (t||'').replace(/<[^>]+>/g,'').replace(/[,;]/g,' ');}
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
    'DTSTART:'+icsStamp(end),'DTEND:'+icsStamp(e2),'SUMMARY:'+stripTags(name+' '+T().calDone),
    'DESCRIPTION:'+stripTags(T().calDoneDesc),
    'BEGIN:VALARM','TRIGGER:-PT10M','ACTION:DISPLAY','DESCRIPTION:'+stripTags(name),'END:VALARM',
    'BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:'+stripTags(name),'END:VALARM',
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
    'SUMMARY:'+stripTags(name+' '+T().calDaily),'DESCRIPTION:'+(stripTags(tip)||''),
    'BEGIN:VALARM','TRIGGER:PT0M','ACTION:DISPLAY','DESCRIPTION:'+stripTags(name),'END:VALARM',
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
document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&overlay.classList.contains('open'))closeModal(); });
document.getElementById('primerBtn').addEventListener('click',function(){
  openModal(renderPrimer(),T().primerTitle,null,'📖','#38bdf8'); });
document.getElementById('soakTableBtn').addEventListener('click',function(){
  openModal(renderTable(),T().tableTitle,null,'⏱️','#2dd4bf',T().tablePill); });
document.getElementById('bestBtn').addEventListener('click',function(){
  openModal(renderSecs(pack().bestgen),T().bestTitle,null,'🔬','#34d399',T().bestPill); });
document.getElementById('compareBtn').addEventListener('click',openCompare);
document.getElementById('studyBtn').addEventListener('click',function(){
  openModal(renderAllStudies(),T().studyT,null,'🔬','#7dd3fc',T().studyPill); });

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
   LÉGZÉS + TENGERPART (respiration & beach)
   ========================================================= */
var PATTERNS={box:[4,4,4,4],relax:[4,7,8,0],coh:[5.5,0,5.5,0],ocean:[4,0,6,0]};
var brMode='box', brOn=false, brPhase=0, brT0=0, brCycles=0, brRAF=null;
var cv=document.getElementById('waveCv'), ctx=cv.getContext('2d'),
    phaseEl=document.getElementById('brPhase'),
    cntEl=document.getElementById('brCount'), beach=document.getElementById('beach');
var waveT=0, breath=0, brPhaseF=0, idleT=0;
var ripples=[], motes=[];

/* Fázisszínek: belégzés = világos kék, benttartás = fehér,
   kilégzés = türkiz, szünet = tompa szürkéskék. */
var PHASE_COL=[[125,211,252],[224,242,254],[94,234,212],[148,163,184]];
function phaseRGB(){ var c=PHASE_COL[brOn?brPhase:0]; return c[0]+','+c[1]+','+c[2]; }

function dpr(){ return Math.min(window.devicePixelRatio||1,2); }
function sizeCanvas(){
  var r=beach.getBoundingClientRect(), d=dpr();
  cv.width=Math.max(1,Math.round(r.width*d)); cv.height=Math.max(1,Math.round(r.height*d));
  ctx.setTransform(d,0,0,d,0,0);
  seedMotes(r.width,r.height);
}
window.addEventListener('resize',sizeCanvas);

/* Lassan felfelé szálló apró fénypontok — mélységet adnak a víznek. */
function seedMotes(w,h){
  motes=[];
  for(var i=0;i<20;i++) motes.push({x:Math.random()*w,y:Math.random()*h,
    r:Math.random()*1.3+0.4, sp:Math.random()*0.16+0.04, ph:Math.random()*6.283});
}

function drawBeach(){
  var d=dpr(), w=cv.width/d, h=cv.height/d;
  if(!w||!h) return;
  ctx.clearRect(0,0,w,h);

  var cx=w/2, cy=h*0.40, cs=phaseRGB();
  var R=Math.min(w,h)*0.19*(0.70+breath*0.58);
  /* A vízvonal jóval a kör alatt van, hogy a hullámok soha ne érjenek bele. */
  var waterY=h*0.72;

  motes.forEach(function(m){
    m.y-=m.sp; if(m.y<-4){ m.y=h+4; m.x=Math.random()*w; }
    var tw=0.35+0.3*Math.sin(waveT*1.4+m.ph);
    ctx.beginPath(); ctx.arc(m.x,m.y,m.r,0,6.283);
    ctx.fillStyle='rgba(190,225,255,'+(tw*0.45).toFixed(3)+')'; ctx.fill();
  });

  /* Halo: a kör fénye beteríti a hátteret, és vele együtt lélegzik. */
  var halo=ctx.createRadialGradient(cx,cy,R*0.2,cx,cy,R*3.2);
  halo.addColorStop(0,'rgba('+cs+',0.20)');
  halo.addColorStop(0.5,'rgba('+cs+',0.06)');
  halo.addColorStop(1,'rgba('+cs+',0)');
  ctx.fillStyle=halo; ctx.fillRect(0,0,w,h);

  /* Kifutó gyűrűk: minden be- és kilégzés kezdetén indul egy. */
  ripples.forEach(function(p){
    ctx.beginPath(); ctx.arc(cx,cy,R+p.r,0,6.283);
    ctx.strokeStyle='rgba('+cs+','+(p.a*0.45).toFixed(3)+')';
    ctx.lineWidth=1.3; ctx.stroke();
  });

  drawWater(w,h,waterY);

  /* A kör tükröződése a vízen, a hullámokkal együtt remegve. */
  ctx.save();
  ctx.beginPath(); ctx.rect(0,waterY-4,w,h-waterY+4); ctx.clip();
  var ry=waterY+R*0.7, rr=R*1.2;
  var refl=ctx.createRadialGradient(cx,ry,1,cx,ry,rr*1.6);
  refl.addColorStop(0,'rgba('+cs+',0.20)'); refl.addColorStop(1,'rgba('+cs+',0)');
  ctx.fillStyle=refl;
  ctx.beginPath();
  ctx.ellipse(cx,ry,rr,R*0.42+Math.sin(waveT*1.7)*2.5,0,0,6.283);
  ctx.fill();
  ctx.restore();

  drawOrb(cx,cy,R,cs);

  /* Finom sötét sáv legalul, hogy a fázisfelirat a hullámok fölött is olvasható legyen. */
  var scrim=ctx.createLinearGradient(0,h-44,0,h);
  scrim.addColorStop(0,'rgba(4,10,20,0)');
  scrim.addColorStop(1,'rgba(4,10,20,0.55)');
  ctx.fillStyle=scrim; ctx.fillRect(0,h-44,w,44);
}

function drawWater(w,h,y0){
  var layers=[
    {y:y0,          a:4.5,l:0.030,s:0.50,c:'rgba(56,189,248,.15)'},
    {y:y0+h*0.055,  a:6,  l:0.022,s:0.80,c:'rgba(45,212,191,.19)'},
    {y:y0+h*0.115,  a:8,  l:0.017,s:1.10,c:'rgba(125,211,252,.24)'},
    {y:y0+h*0.180,  a:5,  l:0.036,s:1.70,c:'rgba(255,255,255,.18)'}
  ];
  layers.forEach(function(L){
    var amp=L.a*(1+breath*0.7);
    ctx.beginPath(); ctx.moveTo(0,h);
    for(var x=0;x<=w;x+=3){
      var y=L.y+Math.sin(x*L.l+waveT*L.s)*amp+Math.sin(x*L.l*2.3+waveT*L.s*1.7)*amp*0.35;
      ctx.lineTo(x,y);
    }
    ctx.lineTo(w,h); ctx.closePath(); ctx.fillStyle=L.c; ctx.fill();
  });
}

function drawOrb(cx,cy,R,cs){
  /* Üvegszerű test: a fény bal-felülről esik rá. */
  var g=ctx.createRadialGradient(cx-R*0.30,cy-R*0.34,R*0.05,cx,cy,R);
  g.addColorStop(0,   'rgba(255,255,255,0.95)');
  g.addColorStop(0.34,'rgba('+cs+',0.72)');
  g.addColorStop(0.74,'rgba('+cs+',0.28)');
  g.addColorStop(1,   'rgba('+cs+',0.05)');
  ctx.beginPath(); ctx.arc(cx,cy,R,0,6.283); ctx.fillStyle=g; ctx.fill();

  /* Lassan körbeforduló fénypászta a gömb belsejében. */
  ctx.save();
  ctx.beginPath(); ctx.arc(cx,cy,R*0.97,0,6.283); ctx.clip();
  var a=waveT*0.30;
  var sh=ctx.createLinearGradient(cx+Math.cos(a)*R,cy+Math.sin(a)*R,
                                  cx-Math.cos(a)*R,cy-Math.sin(a)*R);
  sh.addColorStop(0,  'rgba(255,255,255,0.28)');
  sh.addColorStop(0.5,'rgba(255,255,255,0)');
  sh.addColorStop(1,  'rgba('+cs+',0.22)');
  ctx.fillStyle=sh; ctx.fillRect(cx-R,cy-R,R*2,R*2);
  ctx.restore();

  ctx.beginPath(); ctx.arc(cx,cy,R,0,6.283);
  ctx.strokeStyle='rgba(255,255,255,0.32)'; ctx.lineWidth=1; ctx.stroke();

  /* Haladó gyűrű: megmutatja, hol tartasz az aktuális fázisban. */
  var pr=R+8;
  ctx.beginPath(); ctx.arc(cx,cy,pr,0,6.283);
  ctx.strokeStyle='rgba(255,255,255,0.09)'; ctx.lineWidth=2.5; ctx.stroke();
  if(brOn&&brPhaseF>0.001){
    ctx.beginPath();
    ctx.arc(cx,cy,pr,-Math.PI/2,-Math.PI/2+6.283*Math.min(1,brPhaseF));
    ctx.strokeStyle='rgba('+cs+',0.92)'; ctx.lineWidth=2.5;
    ctx.lineCap='round'; ctx.stroke(); ctx.lineCap='butt';
  }
}
function phaseName(i){var t=T();return [t.brIn,t.brHold,t.brOut,t.brHold2][i];}
function stepBreath(now){
  var p=PATTERNS[brMode], dur=p[brPhase];
  while(dur===0){ brPhase=(brPhase+1)%4; if(brPhase===0)brCycles++; dur=p[brPhase]; }
  var el=(now-brT0)/1000;
  if(el>=dur){ brT0=now; brPhase=(brPhase+1)%4; if(brPhase===0)brCycles++;
    while(p[brPhase]===0){ brPhase=(brPhase+1)%4; if(brPhase===0)brCycles++; }
    el=0; dur=p[brPhase];
    /* Be- és kilégzés indulásakor útnak indul egy gyűrű. */
    if(brPhase===0||brPhase===2) ripples.push({r:0,a:1});
  }
  var f=Math.min(1,el/dur);
  brPhaseF=f;
  if(brPhase===0) breath=f;
  else if(brPhase===1) breath=1;
  else if(brPhase===2) breath=1-f;
  else breath=0;
  var left=Math.max(0,Math.ceil(dur-el));
  phaseEl.textContent=phaseName(brPhase)+' · '+left+'s';
  cntEl.textContent=T().brCycle+' '+(brCycles+1);
  setOceanIntensity(brPhase===0?0.35+f*0.6:(brPhase===2?0.95-f*0.6:(brPhase===1?0.95:0.35)));
}
function loop(now){
  waveT+=0.016*(1+breath*0.8);
  if(brOn) stepBreath(now);
  else {
    /* Nyugalomban is él: nagyon lassú, alig érzékelhető pulzálás. */
    idleT+=0.011; breath=0.20+0.13*Math.sin(idleT); brPhaseF=0;
  }
  ripples.forEach(function(p){ p.r+=0.85; p.a*=0.974; });
  if(ripples.length) ripples=ripples.filter(function(p){return p.a>0.02;});
  drawBeach();
  brRAF=requestAnimationFrame(loop);
}
function renderModes(){
  var box=document.getElementById('brModes'), m=T().brModes;
  box.innerHTML=Object.keys(PATTERNS).map(function(k){
    return '<button class="br-mode" data-m="'+k+'" aria-pressed="'+(k===brMode)+'">'+m[k]+'</button>';}).join('');
  box.querySelectorAll('.br-mode').forEach(function(b){
    b.addEventListener('click',function(){
      brMode=b.getAttribute('data-m'); brPhase=0; brT0=performance.now(); brCycles=0;
      renderModes(); renderBrMeta();
    });
  });
}
function renderBrMeta(){
  var p=PATTERNS[brMode], t=T();
  document.getElementById('brMetaL').innerHTML=t.brDesc[brMode];
  document.getElementById('brMetaR').innerHTML='<b>'+p.filter(function(x){return x>0;}).join('–')+' s</b>';
  document.getElementById('brStart').innerHTML=(brOn?'⏸ ':'▶ ')+(brOn?t.brStop:t.brStart);
  if(!brOn){ phaseEl.textContent=t.brReady; cntEl.textContent=''; }
}
document.getElementById('brStart').addEventListener('click',function(){
  brOn=!brOn; brPhase=0; brT0=performance.now(); if(!brOn)brCycles=0;
  if(brOn&&soundOn)ensureAudio();
  renderBrMeta();
});

/* ---------- Óceán-hang (WebAudio, külső fájl nélkül) ---------- */
var actx=null, noiseSrc=null, oceanFilter=null, oceanGain=null, soundOn=false, masterVol=0.5;
function ensureAudio(){
  if(actx) { if(actx.state==='suspended')actx.resume(); return; }
  try{
    actx=new (window.AudioContext||window.webkitAudioContext)();
    var len=actx.sampleRate*4, buf=actx.createBuffer(1,len,actx.sampleRate), dat=buf.getChannelData(0);
    var last=0;
    for(var i=0;i<len;i++){ var wn=Math.random()*2-1; last=(last+0.02*wn)/1.02; dat[i]=last*3.2; }
    noiseSrc=actx.createBufferSource(); noiseSrc.buffer=buf; noiseSrc.loop=true;
    oceanFilter=actx.createBiquadFilter(); oceanFilter.type='lowpass';
    oceanFilter.frequency.value=520; oceanFilter.Q.value=0.7;
    oceanGain=actx.createGain(); oceanGain.gain.value=0;
    noiseSrc.connect(oceanFilter); oceanFilter.connect(oceanGain); oceanGain.connect(actx.destination);
    noiseSrc.start(0);
  }catch(e){ actx=null; }
}
function setOceanIntensity(v){
  if(!actx||!soundOn||!oceanGain)return;
  var g=Math.max(0,Math.min(1,v))*0.34*masterVol;
  oceanGain.gain.setTargetAtTime(g,actx.currentTime,0.35);
  oceanFilter.frequency.setTargetAtTime(360+v*760,actx.currentTime,0.4);
}
document.getElementById('brSound').addEventListener('click',function(){
  soundOn=!soundOn;
  if(soundOn){ ensureAudio(); setOceanIntensity(0.6); }
  else if(oceanGain&&actx){ oceanGain.gain.setTargetAtTime(0,actx.currentTime,0.25); }
  this.innerHTML=(soundOn?'🔊 ':'🔈 ')+(soundOn?T().brSoundOn:T().brSoundOff);
});

/* ---------- Elalvás-időzítő ---------- */
var sleepTimer=null, dim=document.getElementById('dim');
function setSleep(min){
  document.querySelectorAll('.sl-btn').forEach(function(b){
    b.setAttribute('aria-pressed', String(parseFloat(b.getAttribute('data-min'))===min)); });
  clearInterval(sleepTimer); dim.classList.remove('catch'); dim.style.opacity=0; masterVol=0.5;
  if(!min)return;
  var ms=min*60000, t0=Date.now();
  sleepTimer=setInterval(function(){
    var p=Math.min(1,(Date.now()-t0)/ms);
    masterVol=0.5*(1-p);
    dim.style.opacity=(p*0.94).toFixed(3);
    /* csak sötétedés után nyeli el a koppintást, hogy az app közben használható maradjon */
    if(p>0.6) dim.classList.add('catch'); else dim.classList.remove('catch');
    if(actx&&soundOn&&oceanGain) oceanGain.gain.setTargetAtTime(0.34*masterVol*0.6,actx.currentTime,1);
    if(p>=1){ clearInterval(sleepTimer);
      if(oceanGain&&actx)oceanGain.gain.setTargetAtTime(0,actx.currentTime,2);
      brOn=false; renderBrMeta(); }
  },1000);
}
document.querySelectorAll('.sl-btn').forEach(function(b){
  b.addEventListener('click',function(){ setSleep(parseFloat(b.getAttribute('data-min'))||0); });
});
dim.addEventListener('click',function(){ setSleep(0); });

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
  document.getElementById('brSound').innerHTML=(soundOn?'🔊 ':'🔈 ')+(soundOn?t.brSoundOn:t.brSoundOff);
  document.querySelectorAll('.lang').forEach(function(b){
    b.setAttribute('aria-pressed',String(b.getAttribute('data-lang')===LANG)); });
}
function renderAll(){
  applyI18n(); buildCards(); buildNav(); renderModes(); renderBrMeta(); renderTrack(); renderTimers(); renderTips();
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
sizeCanvas();
brRAF=requestAnimationFrame(loop);
