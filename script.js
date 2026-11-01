(function(){
  const PHONE='+4561302294';
  const smsHref=body=>'sms:'+PHONE+'?&body='+encodeURIComponent(body);

  // Priser, rabat og SMS-links (kun på Priser og booking)
  if(document.getElementById('first')){
  const PHONE='+4561302294';
  const sizeNames={car:'personbil',big:'store bil',van:'varevogn'};
  const firstBox=document.getElementById('first');
  let size='car';
  const kr=n=>n.toLocaleString('da-DK')+' kr.';
  const smsHref=body=>'sms:'+PHONE+'?&body='+encodeURIComponent(body);

  function smsText(pkg,price,first){
    const lines=['Hej Viktor!','',
      'Jeg vil gerne bestille '+pkg+' til min '+sizeNames[size]+' ('+(first?kr(Math.round(price*.8))+' med 20 % rabat på første vask':kr(price))+').'];
    if(first) lines.push('Det er vores første vask hos dig.');
    lines.push('','Antal biler: ','Adresse: ','Det passer mig bedst: ','','Venlig hilsen');
    return lines.join('\n');
  }

  function update(){
    const first=firstBox.checked;
    document.querySelectorAll('.prog').forEach(card=>{
      const el=card.querySelector('[data-price]');
      const price=JSON.parse(el.dataset.price)[size];
      card.hidden=price===undefined;
      if(price===undefined) return;
      const wrap=el.parentElement;
      let old=wrap.querySelector('s'); if(!old){old=document.createElement('s');wrap.prepend(old)}
      let tag=wrap.querySelector('.disc'); if(!tag){tag=document.createElement('span');tag.className='disc';tag.textContent='første vask';wrap.append(tag)}
      old.textContent=kr(price); old.hidden=!first;
      el.textContent=first?Math.round(price*.8):price;
      wrap.classList.toggle('is-first',first);
      const btn=card.querySelector('[data-pkg]');
      btn.href=smsHref(smsText(btn.dataset.pkg,price,first));
    });
    const durNote={car:'Meget beskidte biler tager lidt længere.',big:'Store og meget beskidte biler tager lidt længere.',van:'Meget beskidte varevogne tager lidt længere.'}[size];
    document.querySelectorAll('.dur').forEach(el=>{
      const d=JSON.parse(el.dataset.dur)[size];
      if(d){el.querySelector('.dur-t').textContent=d; el.querySelector('.dur-n').textContent=durNote;}
    });
    const hose=document.getElementById('hose-pill'); if(hose) hose.hidden=size==='van';
    document.getElementById('size-desc').innerHTML={
      car:'<strong>Personbil:</strong> 3- og 5-dørs biler og almindelige familiebiler, fx stationcars.',
      big:'<strong>Store biler:</strong> 7-personers, store SUV’er, pickups og lignende.',
      van:'<strong>Varevogn:</strong> Kun indvendig vask af førerkabinen. Det kræver ikke en vandslange, så vi kan godt tage varevognen, selvom der ikke er en tilgængelig.'
    }[size];
    const smsEl=document.getElementById('sms'); if(smsEl) smsEl.href=smsHref(['Hej Viktor!','','Jeg vil gerne høre om en vask af min bil.'+(first?' Det er vores første gang, så vi får 20 % rabat.':''),'','Antal biler: ','Adresse: ','Det passer mig bedst: ','','Venlig hilsen'].join('\n'));
  }
  document.querySelectorAll('.sizes button').forEach(b=>b.addEventListener('click',()=>{
    size=b.dataset.size;
    document.querySelectorAll('.sizes button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    update();
  }));
  firstBox.addEventListener('change',update);
  update();
  }

  // Anmeldelser: tilføj godkendte anmeldelser her, nyeste først.
  // Eksempel: {stars:5, name:'Mette fra Helsinge', date:'2026-11-01', text:'Bilen har aldrig været så ren.'}
  const REVIEWS=[
    {stars:5, name:'Ghita, Helsinge', date:'2026-11-01', text:'Viktor fortjener helt sikkert en kæmpe anbefaling herfra. Aldrig har min bil været så fin og ren! Super service og god og nem kommunikation.'}
  ];
  const starSvg=(n,size)=>Array.from({length:5},(_,i)=>'<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="currentColor" class="'+(i<n?'':'off')+'" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>').join('');
  const maskName=n=>{const [who,...rest]=String(n).split(',');const m=who.trim().split(/\s+/).map((p,i)=>i===0?p.slice(0,3)+'*'.repeat(Math.max(0,p.length-3)):p[0]+'*'.repeat(Math.max(0,p.length-1))).join(' ');return rest.length?m+','+rest.join(','):m};
  const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  (function(){
    const list=document.getElementById('r-list'), sum=document.getElementById('r-summary');
    if(!list) return;
    if(!REVIEWS.length){
      list.innerHTML='<div class="r-empty"><strong>Ingen anmeldelser endnu</strong><span>Har du fået vasket bilen hos Viktor? Bliv den første til at skrive en anmeldelse.</span><a class="btn btn-signal" href="#r-form">Skriv en anmeldelse</a></div>';
      return;
    }
    const avg=REVIEWS.reduce((a,r)=>a+r.stars,0)/REVIEWS.length;
    sum.hidden=false;
    sum.innerHTML='<span class="r-avg">'+avg.toLocaleString('da-DK',{minimumFractionDigits:1,maximumFractionDigits:1})+'</span><div><span class="stars-row" role="img" aria-label="'+avg.toFixed(1)+' af 5 stjerner">'+starSvg(Math.round(avg),22)+'</span><div class="r-count">'+REVIEWS.length+' anmeldelse'+(REVIEWS.length>1?'r':'')+'</div></div>';
    list.innerHTML=REVIEWS.map(r=>'<article class="r-card"><span class="stars-row" role="img" aria-label="'+r.stars+' af 5 stjerner">'+starSvg(r.stars,18)+'</span><p>'+esc(r.text)+'</p><div class="r-meta"><b>'+esc(maskName(r.name))+'</b><span>'+(r.date?new Date(r.date+'T12:00').toLocaleDateString('da-DK',{day:'numeric',month:'long',year:'numeric'}):'')+'</span></div></article>').join('');
  })();

  // Skriv anmeldelse → SMS
  (function(){
    if(!document.getElementById('r-form')) return;
    const words={1:'Dårlig',2:'Under middel',3:'Okay',4:'God',5:'Fantastisk'};
    const labels=[...document.querySelectorAll('#star-btns label')];
    const txt=document.getElementById('star-txt');
    let stars=5;
    const paint=n=>{labels.forEach((l,i)=>l.classList.toggle('on',i<n)); txt.textContent=n+' af 5 stjerner: '+words[n]};
    document.querySelectorAll('input[name="stars"]').forEach(inp=>inp.addEventListener('change',()=>{stars=+inp.value;paint(stars)}));
    labels.forEach((l,i)=>{l.addEventListener('mouseenter',()=>paint(i+1));});
    document.getElementById('star-btns').addEventListener('mouseleave',()=>paint(stars));
    document.getElementById('r-form').addEventListener('submit',e=>{
      e.preventDefault();
      const name=document.getElementById('r-name'), text=document.getElementById('r-text');
      const bad=[name,text].filter(x=>!x.value.trim());
      document.getElementById('r-err').hidden=!bad.length;
      if(bad.length){bad[0].focus();return}
      const body=['Anmeldelse til Viktors Bilpleje','','★'.repeat(stars)+'☆'.repeat(5-stars)+' ('+stars+'/5)','Navn: '+name.value.trim(),'',text.value.trim(),'','Jeg giver lov til, at anmeldelsen bliver vist på hjemmesiden.'].join('\n');
      location.href=smsHref(body);
    });
  })();

  // Menu (burger)
  (function(){
    const btn=document.getElementById('burger'), drawer=document.getElementById('drawer'), scrim=document.getElementById('scrim'), close=document.getElementById('drawer-close');
    let open=false;
    function set(v){
      open=v;
      btn.setAttribute('aria-expanded',v); btn.setAttribute('aria-label',v?'Luk menu':'Åbn menu');
      document.body.classList.toggle('menu-open',v);
      if(v){ drawer.inert=false; scrim.hidden=false; requestAnimationFrame(()=>{drawer.classList.add('open'); scrim.classList.add('open')}); setTimeout(()=>drawer.querySelector('a').focus({preventScroll:true}),50); }
      else { drawer.classList.remove('open'); scrim.classList.remove('open'); drawer.inert=true; setTimeout(()=>{ if(!open) scrim.hidden=true },300); btn.focus({preventScroll:true}); }
    }
    btn.addEventListener('click',()=>set(!open));
    close.addEventListener('click',()=>set(false));
    scrim.addEventListener('click',()=>set(false));
    drawer.querySelectorAll('.drawer-list a').forEach(a=>a.addEventListener('click',()=>set(false)));
    document.addEventListener('keydown',e=>{ if(open&&e.key==='Escape') set(false) });
  })();

  // Kopiér nummer
  const copy=document.getElementById('copy');
  if(copy) copy.addEventListener('click',()=>{
    const done=()=>{copy.textContent='Kopieret';setTimeout(()=>copy.textContent='Kopiér nummer',1600)};
    const sel=()=>{const r=document.createRange();r.selectNodeContents(document.getElementById('phone'));const s=getSelection();s.removeAllRanges();s.addRange(r)};
    try{navigator.clipboard.writeText('+4561302294').then(done,sel)}catch(e){sel()}
  });

})();
