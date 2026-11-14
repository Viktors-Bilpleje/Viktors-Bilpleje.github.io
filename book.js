// Booking i trin (inspireret af VIP Mobile Detailing):
// Bil → Pakke → Tilvalg → Dato og tid → Adresse → Dine oplysninger → Opsummering → Bekræftet.
// Til sidst skrives en SMS til Viktor, som kunden selv sender.
(function(){
  const app=document.getElementById('bk'); if(!app) return;
  const PHONE='+4561302294';
  // FØRSTE LEDIGE DAG: ret datoen her, når der er fuldt booket (år-måned-dag)
  const FIRST_FREE='2026-12-01';
  const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TYPES={
    car:{name:'Personbil', short:'Personbil', desc:'3- og 5-dørs biler og stationcars', ic:'<path d="M5 16h14l-1.5-5.5A2 2 0 0 0 15.6 9H8.4a2 2 0 0 0-1.9 1.5z"/><circle cx="8" cy="17" r="1.6"/><circle cx="16" cy="17" r="1.6"/>'},
    big:{name:'Stor bil', short:'Stor bil', desc:'7-personers, store SUV’er og pickups', ic:'<path d="M3 16h18v-4l-2-4H9L6 12H3z"/><circle cx="7.5" cy="17" r="1.6"/><circle cx="16.5" cy="17" r="1.6"/><path d="M9 8v4M14 8v4"/>'},
    van:{name:'Varevogn', short:'Varevogn', desc:'Kun indvendig vask af førerkabinen', ic:'<path d="M2 16V7h12v9M14 10h4l3 3v3h-7"/><circle cx="6.5" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>'}
  };
  const PK={
    udv:{name:'Udvendig Vask', desc:'Ren lak, fælge og ruder udenpå.', dur:'ca. 30 min – 1 time', min:45,
      list:['Håndvask med skånsom shampoo','Fælge gjort rene','Ruder udvendigt','Tørret af i hånden'],
      ic:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>'},
    ind:{name:'Indvendig Vask', desc:'En frisk og ren kabine.', dur:'ca. 1–2 timer', min:90,
      list:['Støvsugning af gulv, sæder og bagagerum','Aftørring af instrumentbræt og døre','Ruder indvendigt'],
      ic:'<path d="M7 20v-3h10v3"/><path d="M8 17V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v11"/><path d="M5 12h3M16 12h3"/>'},
    fuld:{name:'Fuld Vask', desc:'Hele bilen ind og ud i ét besøg.', dur:'ca. 2–3 timer', min:150,
      list:['Alt fra Udvendig Vask','Alt fra Indvendig Vask','50 kr. billigere end hver for sig'],
      ic:'<path d="M5 16h14l-1.5-5.5A2 2 0 0 0 15.6 9H8.4a2 2 0 0 0-1.9 1.5z"/><circle cx="8" cy="17" r="1.6"/><circle cx="16" cy="17" r="1.6"/><path d="M3 13h2M19 13h2"/>'},
    voks:{name:'Fuld Vask + Voks', desc:'Fuld vask og voks, der beskytter lakken.', dur:'ca. 2–3 timer + voks', min:180, hot:'Mest valgt',
      list:['Alt fra Fuld Vask','Et lag voks på lakken','Vandet perler af','Dyb glans i lakken'],
      ic:'<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'}
  };
  const PRICES={car:{udv:250,ind:300,fuld:500,voks:600}, big:{udv:350,ind:400,fuld:600,voks:700}, van:{ind:250}};
  const VAN_DUR='ca. 1–1½ time';

  const STEPS=[
    {key:'bil', label:'Bil', title:'Din bil', sub:'Vælg de biler, der skal vaskes, og hvor mange.', ic:TYPES.car.ic},
    {key:'pakke', label:'Pakke', title:'Vælg din vask', sub:'Vælg hvor grundigt bilen skal vaskes.', ic:'<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/>'},
    {key:'tilvalg', label:'Tilvalg', title:'Tilføj ekstra', sub:'Vælg det, der passer til jer. Eller spring over.', ic:'<path d="M12 5v14M5 12h14"/>'},
    {key:'tid', label:'Dato og tid', title:'Dato og tid', sub:'Vælg hvornår det passer dig.', ic:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/>'},
    {key:'sted', label:'Adresse', title:'Hvor står bilen?', sub:'Viktor kommer ud til dig.', ic:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'},
    {key:'info', label:'Dine oplysninger', title:'Dine oplysninger', sub:'Så ved Viktor, hvem han skriver med.', ic:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'},
    {key:'sum', label:'Opsummering', title:'Opsummering', sub:'Tjek din bestilling, og send den til Viktor.', ic:'<path d="M5 12.5 10 17 19 7"/>'}
  ];

  // ---------- tilstand ----------
  const q=new URLSearchParams(location.search);
  const startPkg=PK[q.get('pakke')]?q.get('pakke'):'voks';
  const startType=TYPES[q.get('bil')]?q.get('bil'):'car';
  const S={
    types:{car:0,big:0,van:0}, pkg:{car:startPkg,big:startPkg,van:'ind'}, models:{car:[],big:[],van:[]}, tab:startType,
    first:false, nohose:false, dirty:false, dog:false,
    date:null, time:'', wish:'', street:'', zip:'', city:'', name:'', note:'', pay:'Kontant',
    step:0, reached:0, done:false
  };
  S.types[startType]=1; if(startType==='van') S.pkg.van='ind';

  // ---------- hjælpere ----------
  const kr=n=>n.toLocaleString('da-DK')+' kr.';
  const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const svg=(p,s=20,w=2)=>'<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
  const CHECK='<path d="M5 12.5 10 17 19 7"/>';
  const sel=()=>Object.keys(TYPES).filter(k=>S.types[k]>0);
  const cars=()=>sel().reduce((a,k)=>a+S.types[k],0);
  const nonVan=()=>sel().filter(k=>k!=='van').reduce((a,k)=>a+S.types[k],0);
  const hasInside=()=>sel().some(k=>S.pkg[k]!=='udv');
  const WD=['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag'], MO=['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'];
  const dayTxt=d=>WD[d.getDay()][0].toUpperCase()+WD[d.getDay()].slice(1)+' d. '+d.getDate()+'. '+MO[d.getMonth()];
  const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  const firstFree=new Date(FIRST_FREE+'T12:00:00');
  const today=new Date(); today.setHours(12,0,0,0);
  const minDay=new Date(Math.max(firstFree, today.getTime()+864e5));
  const isFree=d=>d>=minDay && (d.getDay()===0||d.getDay()===6);
  let calMonth=new Date(minDay.getFullYear(),minDay.getMonth(),1,12);

  function lines(){
    const L=sel().map(k=>{ const p=S.pkg[k], n=S.types[k], price=PRICES[k][p]*n;
      return {k,p,n,price,label:(n>1?n+' × ':'')+TYPES[k].short, pkg:PK[p].name, dur:k==='van'?VAN_DUR:PK[p].dur}; });
    const wash=L.reduce((a,l)=>a+l.price,0);
    const disc=S.first?Math.round(wash*.2):0;
    const hose=S.nohose?50*nonVan():0;
    const dirty=S.dirty?150*cars():0;
    return {L,wash,disc,hose,dirty,total:wash-disc+hose+dirty};
  }
  function durTxt(){
    const m=sel().reduce((a,k)=>a+(k==='van'?75:PK[S.pkg[k]].min)*S.types[k],0);
    const h=Math.round(m/30)/2; return 'ca. '+String(h).replace('.',',')+' '+(h===1?'time':'timer');
  }

  // ---------- skelet ----------
  app.innerHTML=
    '<ol class="bk-prog" id="bk-prog" aria-label="Trin"></ol>'+
    '<div class="bk-bar" aria-hidden="true"><span id="bk-bar"></span></div>'+
    '<div class="bk-stage" id="bk-stage" tabindex="-1"></div>'+
    '<div class="bk-foot" id="bk-foot">'+
      '<button type="button" class="bk-back" id="bk-back">'+svg('<path d="M15 5l-7 7 7 7"/>',18,2.4)+'<span>Tilbage</span></button>'+
      '<div class="bk-total"><span>I alt</span><b class="mono" id="bk-total"></b></div>'+
      '<button type="button" class="bk-next" id="bk-next">Fortsæt'+svg('<path d="M9 5l7 7-7 7"/>',18,2.4)+'</button>'+
      '<a class="bk-next bk-send" id="bk-send" href="sms:'+PHONE+'" hidden>'+svg('<path d="M4 5h16v11H9l-5 4z"/>',18)+'Send på SMS</a>'+
    '</div>';
  const $=id=>document.getElementById(id);
  const prog=$('bk-prog'), stage=$('bk-stage'), back=$('bk-back'), next=$('bk-next'), send=$('bk-send');
  prog.innerHTML=STEPS.map((s,i)=>'<li><button type="button" data-i="'+i+'"><span class="bk-num">'+(i+1)+'</span><span class="bk-lbl">'+s.label+'</span></button></li>').join('');
  prog.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const i=+b.dataset.i; if(i<=S.reached) go(i); });

  // ---------- trin ----------
  function head(s){ return '<div class="bk-head"><span class="bk-ic">'+svg(s.ic,22)+'</span><h1>'+s.title+'</h1><p>'+s.sub+'</p></div>'; }
  const V={};
  V.bil=()=>'<div class="bk-types">'+Object.entries(TYPES).map(([k,t])=>{ const n=S.types[k];
      return '<div class="bk-type'+(n?' on':'')+'"><button type="button" class="bk-tile" data-type="'+k+'" aria-pressed="'+(n>0)+'"><span class="bk-tick">'+svg(CHECK,14,3)+'</span><span class="bk-tic">'+svg(t.ic,26,1.8)+'</span><b>'+t.name+'</b><small>'+t.desc+'</small></button>'+
        (n?'<div class="bk-count"><span>Antal</span><div class="bk-step"><button type="button" data-cnt="'+k+'" data-d="-1" aria-label="Én færre">−</button><b>'+n+'</b><button type="button" data-cnt="'+k+'" data-d="1" aria-label="Én mere">+</button></div></div>':'')+'</div>'; }).join('')+'</div>'+
    '<p class="bk-err" id="bk-err" hidden>Vælg mindst én bil.</p>'+
    modelFields();
  // Ét felt til mærke og model pr. bil
  const EX=['Kia EV9','VW Golf','Toyota Yaris','Tesla Model Y','Ford Transit'];
  function modelFields(){
    const list=[]; sel().forEach(k=>{ for(let i=0;i<S.types[k];i++) list.push([k,i]); });
    if(!list.length) return '';
    const one=list.length===1;
    return '<div class="bk-models bk-narrow"><p class="bk-models-h">Mærke og model <i>(valgfri)</i></p>'+list.map(([k,i],n)=>
      '<label class="bk-field"><span>'+(one?TYPES[k].name:'Bil '+(n+1)+' · '+TYPES[k].short)+'</span><input data-model="'+k+'-'+i+'" type="text" autocomplete="off" placeholder="Fx '+(k==='van'?'Ford Transit':EX[n%4])+'" value="'+esc(S.models[k][i]||'')+'"></label>').join('')+'</div>';
  }
  const modelsOf=k=>S.models[k].slice(0,S.types[k]).map(x=>(x||'').trim()).filter(Boolean);
  V.pakke=()=>{
    const ts=sel(); if(!ts.includes(S.tab)) S.tab=ts[0];
    const k=S.tab, keys=k==='van'?['ind']:['udv','ind','fuld','voks'];
    const tabs=ts.length>1?'<div class="bk-tabs" role="tablist">'+ts.map(t=>'<button type="button" role="tab" data-tab="'+t+'" aria-selected="'+(t===k)+'">'+(S.types[t]>1?S.types[t]+' × ':'')+TYPES[t].short+'<small>'+PK[S.pkg[t]].name+'</small></button>').join('')+'</div>':'';
    return tabs+'<div class="bk-pkgs'+(keys.length===1?' one':'')+'">'+keys.map(p=>{ const P=PK[p], on=S.pkg[k]===p, n=S.types[k];
      return '<button type="button" class="bk-pk'+(P.hot?' hot':'')+(on?' on':'')+'" data-pkg="'+p+'" aria-pressed="'+on+'">'+(P.hot?'<span class="bk-badge">'+P.hot+'</span>':'')+
        '<span class="bk-pk-top"><span class="bk-pk-ic">'+svg(P.ic,18)+'</span><b>'+P.name+'</b></span><small>'+P.desc+'</small>'+
        '<span class="bk-price mono">'+(n>1?'<i>'+n+' × </i>':'')+kr(PRICES[k][p])+'</span><span class="bk-dur">'+(k==='van'?VAN_DUR+', kun førerkabinen':P.dur)+'</span>'+
        '<ul>'+P.list.map(x=>'<li>'+svg(CHECK,14,3)+x+'</li>').join('')+'</ul><span class="bk-pk-btn">'+(on?'Valgt':'Vælg')+'</span></button>'; }).join('')+'</div>';
  };
  const ADD=[
    {k:'first', t:'Det er vores første vask', d:'20 % rabat på selve vasken. Én gang pr. husstand.', p:()=>'−20 %'},
    {k:'nohose', t:'Vi har ingen vandslange', d:'Bilen vaskes hjemme hos Viktor i Blistrup.', p:()=>'+50 kr.'+(cars()>1?' pr. bil':''), hide:()=>!nonVan()},
    {k:'dirty', t:'Bilen er ekstra beskidt', d:'Meget mudder og jord. <a href="priser.html#beskidt">Se eksempel</a>', p:()=>'+150 kr.'+(cars()>1?' pr. bil':'')},
    {k:'dog', t:'Der er hundehår i bilen', d:'Kun ved indvendig vask. Tillægget afhænger af mængden.', p:()=>'+100–150 kr.', hide:()=>!hasInside()}
  ];
  V.tilvalg=()=>'<div class="bk-adds">'+ADD.filter(a=>!(a.hide&&a.hide())).map(a=>'<button type="button" class="bk-add'+(S[a.k]?' on':'')+'" data-add="'+a.k+'" aria-pressed="'+S[a.k]+'"><span class="bk-plus">'+svg(S[a.k]?CHECK:'<path d="M12 6v12M6 12h12"/>',16,2.6)+'</span><span class="bk-add-t"><b>'+a.t+'</b><small>'+a.d+'</small></span><span class="bk-add-p mono">'+a.p()+'</span></button>').join('')+'</div>'+
    '<p class="bk-hint">Ingen tilvalg? Tryk bare Fortsæt.</p>';
  V.tid=()=>{
    const y=calMonth.getFullYear(), m=calMonth.getMonth();
    const first=new Date(y,m,1,12), start=(first.getDay()+6)%7, days=new Date(y,m+1,0).getDate();
    const prevOk=new Date(y,m,0,12)>=minDay;
    let cells=''; for(let i=0;i<start;i++) cells+='<span></span>';
    for(let d=1;d<=days;d++){ const dt=new Date(y,m,d,12), ok=isFree(dt), on=S.date&&iso(S.date)===iso(dt);
      cells+='<button type="button" class="'+(on?'on':'')+'" data-day="'+iso(dt)+'" '+(ok?'':'disabled')+' aria-label="'+dayTxt(dt)+(ok?'':' (optaget)')+'">'+d+'</button>'; }
    return '<p class="bk-note warn"><b>Fuldt booket indtil '+firstFree.getDate()+'. '+MO[firstFree.getMonth()]+'.</b> Viktor vasker mest i weekenderne.</p>'+
      '<div class="bk-cal"><div class="bk-cal-h"><button type="button" data-mon="-1" aria-label="Forrige måned" '+(prevOk?'':'disabled')+'>'+svg('<path d="M15 5l-7 7 7 7"/>',18,2.4)+'</button><b>'+MO[m][0].toUpperCase()+MO[m].slice(1)+' '+y+'</b><button type="button" data-mon="1" aria-label="Næste måned">'+svg('<path d="M9 5l7 7-7 7"/>',18,2.4)+'</button></div>'+
      '<div class="bk-cal-w">'+['Ma','Ti','On','To','Fr','Lø','Sø'].map(w=>'<span>'+w+'</span>').join('')+'</div><div class="bk-cal-d">'+cells+'</div></div>'+
      '<div class="bk-times" role="group" aria-label="Tidspunkt">'+['Formiddag','Eftermiddag'].map(t=>'<button type="button" data-time="'+t+'" aria-pressed="'+(S.time===t)+'"'+(S.time===t?' class="on"':'')+'><b>'+t+'</b><small>'+(t==='Formiddag'?'kl. 9–12':'kl. 12–16')+'</small></button>').join('')+'</div>'+
      '<label class="bk-field bk-narrow"><span>Ønske til tidspunkt <i>(valgfri)</i></span><input id="f-wish" type="text" placeholder="Fx helst kl. 10" value="'+esc(S.wish)+'"></label>'+
      '<p class="bk-err" id="bk-err" hidden>Vælg en dag og et tidspunkt.</p>';
  };
  V.sted=()=>'<div class="bk-form">'+
      '<label class="bk-field"><span>Adresse</span><input id="f-street" type="text" autocomplete="address-line1" placeholder="Fx Blistrup Hovedgade 1" value="'+esc(S.street)+'"></label>'+
      '<div class="bk-row"><label class="bk-field"><span>Postnr.</span><input id="f-zip" type="text" inputmode="numeric" autocomplete="postal-code" maxlength="4" placeholder="3230" value="'+esc(S.zip)+'"></label>'+
      '<label class="bk-field"><span>By</span><input id="f-city" type="text" autocomplete="address-level2" placeholder="Græsted" value="'+esc(S.city)+'"></label></div>'+
      '<p class="bk-note">'+svg('<path d="M3 12h7a3 3 0 0 1 3 3v1"/><path d="M13 16h3l3-3"/>',18)+'<span>Viktor kommer med alt udstyret. Du skal bare have vandslange og strøm. Kørsel er gratis op til 20 km fra Blistrup, derefter +50 kr.</span></p>'+
      '<p class="bk-err" id="bk-err" hidden>Skriv adressen, så Viktor ved, hvor han skal køre hen.</p></div>';
  V.info=()=>'<div class="bk-form">'+
      '<label class="bk-field"><span>Dit navn</span><input id="f-name" type="text" autocomplete="name" placeholder="Fx Mette Hansen" value="'+esc(S.name)+'"></label>'+
      '<label class="bk-field"><span>Besked til Viktor <i>(valgfri)</i></span><textarea id="f-note" rows="3" placeholder="Fx bilen står i carporten, eller der er sand i bagagerummet">'+esc(S.note)+'</textarea></label>'+
      '<p class="bk-note">'+svg('<path d="M4 5h16v11H9l-5 4z"/>',18)+'<span>Viktor svarer på det nummer, du sender SMS’en fra.</span></p>'+
      '<p class="bk-err" id="bk-err" hidden>Skriv dit navn.</p></div>';
  V.sum=()=>{
    const T=lines(); const ex=[];
    if(S.first) ex.push(['Første vask (−20 %)','−'+kr(T.disc)]); if(S.nohose) ex.push(['Vask hjemme hos Viktor','+'+kr(T.hose)]);
    if(S.dirty) ex.push(['Ekstra beskidt','+'+kr(T.dirty)]); if(S.dog&&hasInside()) ex.push(['Hundehår','100–150 kr.']);
    const box=(h,rows)=>'<section class="bk-box"><h2>'+h+'</h2>'+rows+'</section>';
    const row=(a,b,sub)=>'<div class="bk-li"><span>'+svg(CHECK,14,3)+'<b>'+a+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</span><span class="mono">'+b+'</span></div>';
    return '<div class="bk-sum">'+
      box('Vask',T.L.map(l=>row(l.pkg,kr(l.price),l.label+(modelsOf(l.k).length?' · '+esc(modelsOf(l.k).join(', ')):'')+' · '+l.dur)).join(''))+
      (ex.length?box('Tilvalg',ex.map(e=>row(e[0],e[1])).join('')):'')+
      box('Tidspunkt','<p class="bk-big">'+(S.date?dayTxt(S.date):'Ikke valgt')+(S.time?', '+S.time.toLowerCase():'')+'</p>'+(S.wish?'<p class="bk-sm">'+esc(S.wish)+'</p>':'')+'<p class="bk-sm">'+esc([S.street,[S.zip,S.city].filter(Boolean).join(' ')].filter(Boolean).join(', '))+'</p>')+
      '<section class="bk-box bk-tot"><div class="bk-li"><span>'+svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',16)+'<b>Forventet tid</b></span><span class="mono">'+durTxt()+'</span></div>'+
        '<div class="bk-li bk-grand"><b>I alt</b><b class="mono">'+kr(T.total)+'</b></div><p class="bk-sm">+50 kr. i kørsel, hvis du bor over 20 km fra Blistrup.</p></section>'+
      '<section class="bk-box"><h2>Betaling</h2><div class="bk-pay">'+[['Kontant','Betal når bilen er vasket','<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>'],['MobilePay','Betal når bilen er vasket','<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18h2"/>']].map(p=>'<button type="button" data-pay="'+p[0]+'" aria-pressed="'+(S.pay===p[0])+'" class="'+(S.pay===p[0]?'on':'')+'">'+svg(p[2],18)+'<span><b>'+p[0]+'</b><small>'+p[1]+'</small></span></button>').join('')+'</div><p class="bk-sm">Valget er ikke bindende.</p></section>'+
      '<details class="bk-msg"><summary>Se beskeden til Viktor</summary><pre id="bk-pre"></pre></details>'+
      '<p class="bk-tip">'+svg('<rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>',18)+'<span>Vedhæft gerne et billede af bilen i SMS’en, især hvis den er ekstra beskidt eller har hundehår.</span></p>'+
      '</div>';
  };
  function doneView(){
    return '<div class="bk-done"><span class="bk-done-ic">'+svg(CHECK,34,2.6)+'</span><h1>Næsten færdig'+(S.name?', '+esc(S.name.split(' ')[0]):'')+'!</h1>'+
      '<p>Din besked til Viktor er klar i SMS-appen. Tryk <b>send</b>, så bekræfter Viktor tiden:</p>'+
      '<p class="bk-big">'+(S.date?dayTxt(S.date):'')+(S.time?', '+S.time.toLowerCase():'')+'</p>'+
      '<p class="bk-sm">Du betaler først, når bilen er vasket.</p>'+
      '<div class="bk-done-btns"><a class="bk-ghost" href="index.html">Til forsiden</a><button type="button" class="bk-ghost" id="bk-edit">Ret bestillingen</button></div>'+
      '<p class="bk-sm">Kom SMS-appen ikke frem? Skriv eller ring til <span class="mono" style="user-select:all">61 30 22 94</span>.</p></div>';
  }

  // ---------- SMS ----------
  function smsBody(){
    const T=lines();
    const order=T.L.length===1?['Pakke: '+T.L[0].pkg,'Bil: '+TYPES[T.L[0].k].name+(T.L[0].n>1?' ('+T.L[0].n+' stk.)':'')]
      :T.L.map((l,i)=>(i+1)+'. '+l.pkg+', '+TYPES[l.k].name+(l.n>1?' ('+l.n+' stk.)':'')+' ('+kr(l.price)+')');
    const L=['Hej Viktor!','','Jeg vil gerne bestille:',...order];
    const ms=sel().filter(k=>modelsOf(k).length).map(k=>modelsOf(k).join(', ')+(sel().length>1?' ('+TYPES[k].short.toLowerCase()+')':''));
    if(ms.length) L.push((cars()>1?'Bilerne: ':'Bilen: ')+ms.join('; '));
    L.push('Pris i alt: '+kr(T.total)+(S.first?' (20 % rabat på første vask)':''));
    if(S.nohose) L.push('Vi har ingen vandslange, så bilen skal vaskes hjemme hos dig (+'+kr(T.hose)+').');
    if(S.dirty) L.push('Bilen er ekstra beskidt (+'+kr(T.dirty)+').');
    if(S.dog&&hasInside()) L.push('Der er hundehår i bilen, så der kommer et tillæg på 100–150 kr.');
    if(S.first) L.push('Det er vores første vask hos dig.');
    L.push('','Dato: '+(S.date?dayTxt(S.date):'')+(S.time?', '+S.time.toLowerCase():''));
    if(S.wish) L.push('Ønske: '+S.wish);
    L.push('Adresse: '+[S.street,[S.zip,S.city].filter(Boolean).join(' ')].filter(Boolean).join(', '));
    L.push('Betaling: '+S.pay+'.');
    if(S.note) L.push('','Besked: '+S.note);
    L.push('','Venlig hilsen',S.name);
    return L.join('\n');
  }

  // ---------- visning ----------
  function update(){
    const T=lines(); $('bk-total').textContent=kr(T.total);
    const body=smsBody(); send.href='sms:'+PHONE+'?&body='+encodeURIComponent(body);
    const pre=$('bk-pre'); if(pre) pre.textContent=body;
  }
  function render(focus){
    const s=STEPS[S.step];
    app.classList.toggle('is-done',S.done);
    stage.innerHTML=S.done?doneView():'<div class="bk-view bk-'+s.key+'">'+head(s)+V[s.key]()+'</div>';
    [...prog.children].forEach((li,i)=>{ li.className=i===S.step&&!S.done?'now':(i<S.step||S.done?'past':''); li.querySelector('button').disabled=i>S.reached; if(i===S.step) li.querySelector('button').setAttribute('aria-current','step'); else li.querySelector('button').removeAttribute('aria-current'); });
    $('bk-bar').style.width=(S.done?100:(S.step/(STEPS.length-1))*100)+'%';
    back.style.visibility=S.step>0&&!S.done?'visible':'hidden';
    const last=S.step===STEPS.length-1;
    next.hidden=last||S.done; send.hidden=!last||S.done;
    $('bk-foot').hidden=S.done;
    update();
    const now=prog.children[S.step]; if(now&&now.scrollIntoView&&prog.scrollWidth>prog.clientWidth) prog.scrollTo({left:now.offsetLeft-prog.clientWidth/2+now.offsetWidth/2,behavior:REDUCE?'auto':'smooth'});
    if(focus){ window.scrollTo({top:Math.max(0,app.getBoundingClientRect().top+scrollY-90),behavior:REDUCE?'auto':'smooth'}); stage.focus({preventScroll:true}); }
    if(!REDUCE&&focus&&stage.firstElementChild&&stage.firstElementChild.animate) stage.firstElementChild.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:280,easing:'cubic-bezier(0.23,1,0.32,1)'});
  }
  function err(show){ const e=$('bk-err'); if(e){ e.hidden=!show; if(show&&e.animate&&!REDUCE) e.animate([{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'none'}],{duration:220}); } return !show; }
  function valid(i){
    const k=STEPS[i].key;
    if(k==='bil') return err(!sel().length);
    if(k==='tid') return err(!(S.date&&(S.time||S.wish.trim())));
    if(k==='sted') return err(!S.street.trim());
    if(k==='info') return err(!S.name.trim());
    return true;
  }
  function go(i){ S.step=Math.max(0,Math.min(STEPS.length-1,i)); S.reached=Math.max(S.reached,S.step); render(true); }
  next.addEventListener('click',()=>{ if(valid(S.step)) go(S.step+1); });
  back.addEventListener('click',()=>go(S.step-1));
  send.addEventListener('click',()=>{ setTimeout(()=>{ S.done=true; render(true); },600); });

  // ---------- input ----------
  stage.addEventListener('input',e=>{
    const t=e.target;
    if(t.dataset.model){ const [k,i]=t.dataset.model.split('-'); S.models[k][+i]=t.value; update(); return; }
    const map={'f-wish':'wish','f-street':'street','f-zip':'zip','f-city':'city','f-name':'name','f-note':'note'};
    if(map[t.id]){ S[map[t.id]]=t.value; update(); const er=$('bk-err'); if(er&&!er.hidden) valid(S.step); }
  });
  stage.addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.target.tagName==='INPUT'){ e.preventDefault(); next.click(); } });
  stage.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    if(b.id==='bk-edit'){ S.done=false; go(STEPS.length-1); return; }
    const d=b.dataset;
    if(d.type){ const k=d.type; S.types[k]=S.types[k]?0:1; if(S.types[k]) S.tab=k; render(); }
    else if(d.cnt){ const k=d.cnt; S.types[k]=Math.min(10,Math.max(1,S.types[k]+(+d.d))); render(); }
    else if(d.tab){ S.tab=d.tab; render(); }
    else if(d.pkg){ S.pkg[S.tab]=d.pkg; render(); }
    else if(d.add){ S[d.add]=!S[d.add]; render(); }
    else if(d.mon){ calMonth=new Date(calMonth.getFullYear(),calMonth.getMonth()+(+d.mon),1,12); render(); }
    else if(d.day){ S.date=new Date(d.day+'T12:00:00'); render(); }
    else if(d.time){ S.time=S.time===d.time?'':d.time; render(); }
    else if(d.pay){ S.pay=d.pay; render(); }
    else return;
    // behold fokus på knappen efter genopbygning
    const sel2=Object.keys(d).map(k=>'[data-'+k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())+'="'+d[k]+'"]').join('');
    const nb=sel2&&stage.querySelector(sel2); if(nb) nb.focus({preventScroll:true});
    const er=$('bk-err'); if(er&&!er.hidden) valid(S.step);
  });

  render(false);
})();
