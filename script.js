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
      van:'<strong>Varevogn:</strong> Kun indvendig vask af førerkabinen. Det kræver ikke en vandslange, kun adgang til strøm.'
    }[size];
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
    {stars:5, name:'Caroline, Alsønderup', date:'2026-11-07', text:'Få din bil ordnet af Viktor! De var så gode og vi er mere end tilfredse med resultatet! Det var intet problem at få ordnet en ekstra bil i samme omgang. En kæmpe anbefaling herfra!'},
    {stars:5, name:'Gus***', date:'2026-11-01', text:'Det var en rigtig grundig klargøring af min bil, det kan 100% anbefales herfra.'},
    {stars:5, name:'Ghi**, Helsinge', date:'2026-11-01', text:'Viktor fortjener helt sikkert en kæmpe anbefaling herfra. Aldrig har min bil været så fin og ren! Super service og god og nem kommunikation.'}
  ];
  const starSvg=(n,size)=>Array.from({length:5},(_,i)=>'<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="currentColor" class="'+(i<n?'':'off')+'" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>').join('');
  const maskName=n=>{const [who,...rest]=String(n).split(',');const m=who.trim().split(/\s+/).map((p,i)=>i===0?p.slice(0,3)+'*'.repeat(Math.max(0,p.length-3)):p[0]+'*'.repeat(Math.max(0,p.length-1))).join(' ');return rest.length?m+','+rest.join(','):m};
  const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Samlet rating øverst på forsiden
  (function(){
    const el=document.getElementById('hero-rating');
    if(!el||!REVIEWS.length) return;
    const avg=REVIEWS.reduce((a,r)=>a+r.stars,0)/REVIEWS.length;
    const n=REVIEWS.length;
    el.innerHTML='<span class="stars-row" aria-hidden="true">'+starSvg(Math.round(avg),16)+'</span><b>'+avg.toLocaleString('da-DK',{minimumFractionDigits:1,maximumFractionDigits:1})+'</b><span class="cnt">· '+n+' anmeldelse'+(n>1?'r':'')+'</span>';
    el.setAttribute('aria-label',avg.toFixed(1)+' ud af 5 stjerner fra '+n+' anmeldelse'+(n>1?'r':'')+'. Læs anmeldelserne');
    el.hidden=false;
  })();

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

  // Bestillingsformular: SMS'en skrives ud fra valgene
  (function(){
    const f=document.getElementById('order'); if(!f) return;
    const PRICES={car:{udv:250,ind:300,fuld:500,voks:600},big:{udv:350,ind:400,fuld:600,voks:700},van:{ind:250}};
    const PKG={udv:'Udvendig Vask',ind:'Indvendig Vask',fuld:'Fuld Vask',voks:'Fuld Vask + Voks'};
    const SIZE={car:'Personbil',big:'Store biler',van:'Varevogn (kun førerkabinen)'};
    const $=id=>document.getElementById(id);
    const pkg=$('o-pkg'), size=$('o-size'), count=$('o-count'), first=$('o-first'), hose=$('o-hose');
    const krf=n=>n.toLocaleString('da-DK')+' kr.';
    const extra=$('o-extra'); let rowId=0;
    const PKGOPT='<option value="udv">Udvendig Vask</option><option value="ind">Indvendig Vask</option><option value="fuld">Fuld Vask</option><option value="voks">Fuld Vask + Voks</option>';
    const SIZEOPT='<option value="car">Personbil</option><option value="big">Store biler</option><option value="van">Varevogn</option>';
    function addRow(){
      const i=++rowId, d=document.createElement('div'); d.className='o-row';
      d.innerHTML='<div class="o-row-head"><span>Ydelse '+(extra.children.length+2)+'</span><button type="button" class="o-del">Fjern</button></div>'+
        '<div class="o-row-grid"><div class="o-field"><label for="r-pkg-'+i+'">Pakke</label><select id="r-pkg-'+i+'" class="r-pkg">'+PKGOPT+'</select></div>'+
        '<div class="o-field"><label for="r-size-'+i+'">Biltype</label><select id="r-size-'+i+'" class="r-size">'+SIZEOPT+'</select></div>'+
        '<div class="o-field"><label for="r-count-'+i+'">Antal</label><input id="r-count-'+i+'" class="r-count" type="number" inputmode="numeric" min="1" max="10" value="1"></div></div>';
      d.querySelector('.r-pkg').value=pkg.value==='ind'?'fuld':'ind';
      d.querySelector('.o-del').addEventListener('click',()=>{d.remove(); renumber(); render(); $('o-add').focus();});
      extra.appendChild(d); render(); d.querySelector('.r-pkg').focus();
    }
    function renumber(){[...extra.children].forEach((r,k)=>r.querySelector('.o-row-head span').textContent='Ydelse '+(k+2));}
    $('o-add').addEventListener('click',addRow);
    function rows(){
      const list=[{p:pkg,s:size,c:count},...[...extra.children].map(r=>({p:r.querySelector('.r-pkg'),s:r.querySelector('.r-size'),c:r.querySelector('.r-count')}))];
      return list.map(({p,s,c})=>{
        const van=s.value==='van';
        [...p.options].forEach(o=>o.disabled=van&&o.value!=='ind'); if(van) p.value='ind';
        const n=Math.min(10,Math.max(1,parseInt(c.value,10)||1));
        return {pkg:p.value,size:s.value,n,price:PRICES[s.value][p.value]*n};
      });
    }
    function render(){
      const R=rows();
      const inside=R.filter(r=>r.pkg!=='udv');
      const nonVan=R.filter(r=>r.size!=='van').reduce((a,r)=>a+r.n,0), cars=R.reduce((a,r)=>a+r.n,0);
      const noIn=!inside.length, allVan=!nonVan;
      $('o-dog').disabled=noIn; $('o-dog-wrap').classList.toggle('off',noIn); if(noIn) $('o-dog').checked=false;
      $('o-addon-hint').hidden=!noIn;
      $('o-addon-hint').textContent='Hund kan vælges til Indvendig Vask og Fuld Vask.';
      $('o-van').hidden=!R.some(r=>r.size==='van'); $('o-hose-wrap').hidden=allVan; if(allVan) hose.checked=false;
      const wash=R.reduce((a,r)=>a+r.price,0);
      const hoseX=hose.checked?50*nonVan:0;                  // vask hos Viktor +50 kr. pr. bil
      const full=wash+hoseX;
      const price=(first.checked?Math.round(wash*.8):wash)+hoseX;  // rabatten gælder selve vasken
      $('o-price').textContent=krf(price);
      $('o-old').textContent=krf(full); $('o-old').hidden=!first.checked;
      const order=R.length===1?['Pakke: '+PKG[R[0].pkg],'Biltype: '+SIZE[R[0].size],'Antal biler: '+R[0].n]
        :R.map((r,k)=>(k+1)+'. '+PKG[r.pkg]+', '+SIZE[r.size]+', '+r.n+' '+(r.n>1?'biler':'bil')+' ('+krf(r.price)+')');
      const lines=['Hej Viktor!','','Jeg vil gerne bestille:',...order,
        'Pris i alt: '+krf(price)+(first.checked?' (20 % rabat på første vask, normalt '+krf(full)+')':'')];
      if(hoseX) lines.push('Heraf '+krf(hoseX)+' for vask hjemme hos dig.');
      if(first.checked) lines.push('Det er vores første vask hos dig.');
      if($('o-dog').checked) lines.push('Der er hundehår i bilen, så der kommer et tillæg på 100-150 kr.');
      if(hoseX) lines.push('Vi har ingen vandslange, så '+(cars>1?'bilerne':'bilen')+' skal vaskes hjemme hos dig.');
      lines.push('','Adresse: '+($('o-addr').value.trim()),'Det passer mig bedst: '+($('o-when').value.trim()),'','Venlig hilsen');
      const body=lines.join('\n');
      $('o-preview').textContent=body;
      $('sms').href=smsHref(body);
    }
    f.addEventListener('input',render); f.addEventListener('change',render);
    f.addEventListener('submit',e=>e.preventDefault());
    // Fra pakkekortene på Priser-siden: udfyld formularen og hop ned til den
    const KEY={'Udvendig Vask':'udv','Indvendig Vask':'ind','Fuld Vask':'fuld','Fuld Vask + Voks':'voks'};
    document.querySelectorAll('[data-pkg]').forEach(a=>a.addEventListener('click',e=>{
      e.preventDefault();
      const pressed=document.querySelector('.sizes button[aria-pressed="true"]');
      if(pressed) size.value=pressed.dataset.size;
      pkg.value=KEY[a.dataset.pkg];
      const fb=document.getElementById('first'); if(fb) first.checked=fb.checked;
      render();
      document.getElementById('bestil').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      setTimeout(()=>$('o-addr').focus({preventScroll:true}),450);
    }));
    render();
  })();


  // Før/efter-galleri
  (function(){
    if(!document.querySelector('.ba')) return;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; // ease-in-out til bevægelse på skærmen
    function initBA(box,auto){
      const input=box.querySelector('input');
      const tags=box.querySelectorAll('.ba-tag');
      let anim=null, touched=false;
      const set=v=>{box.style.setProperty('--pos',v+'%'); input.value=v;
        tags[0].style.opacity=v<12?0:1; tags[1].style.opacity=v>88?0:1;};
      const stop=()=>{touched=true; if(anim){cancelAnimationFrame(anim); anim=null;}};
      input.addEventListener('input',()=>{stop(); set(+input.value);});
      input.addEventListener('pointerdown',()=>{stop(); box.classList.add('dragging');});
      addEventListener('pointerup',()=>box.classList.remove('dragging'));
      // Automatisk glid første gang billedet kommer frem: før → efter → midten
      const keys=[[0,50],[900,100],[2200,0],[3100,50]];
      function play(){
        if(reduce||touched) return;
        const t0=performance.now();
        const step=now=>{
          const t=now-t0; let i=0; while(i<keys.length-2&&t>keys[i+1][0]) i++;
          const [ta,va]=keys[i],[tb,vb]=keys[i+1];
          const p=Math.min(1,Math.max(0,(t-ta)/(tb-ta)));
          set(va+(vb-va)*ease(p));
          if(t<keys[keys.length-1][0]) anim=requestAnimationFrame(step); else {anim=null; set(50);}
        };
        anim=requestAnimationFrame(step);
      }
      set(50);
      if(!auto) return;
      // Alle billeder glider én gang, når siden åbnes. Ligger et billede uden for skærmen, glider det igen, når man scroller ned til det.
      setTimeout(play,400);
      const r=box.getBoundingClientRect();
      if(r.top>innerHeight && 'IntersectionObserver' in window){
        const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ io.disconnect(); touched=false; setTimeout(play,250);} }),{threshold:.5});
        io.observe(box);
      }
    }
    document.querySelectorAll('.ba-list .ba').forEach(b=>initBA(b,true));
  
    // Stor visning
    const lb=document.getElementById('lb'), slot=document.getElementById('lb-slot');
    let last=null;
    function openLB(card,btn){
      last=btn;
      const clone=card.querySelector('.ba').cloneNode(true);
      clone.classList.remove('dragging');
      slot.replaceChildren(clone); initBA(clone,false);
      document.getElementById('lb-title').textContent=card.querySelector('.ba-cap b').textContent;
      document.getElementById('lb-sub').textContent=card.querySelector('.ba-cap span').textContent;
      lb.hidden=false; document.body.classList.add('lb-lock');
      requestAnimationFrame(()=>lb.classList.add('open'));
      document.getElementById('lb-close').focus({preventScroll:true});
    }
    function closeLB(){
      lb.classList.remove('open'); document.body.classList.remove('lb-lock');
      setTimeout(()=>{lb.hidden=true; slot.replaceChildren();},220);
      if(last) last.focus({preventScroll:true});
    }
    document.querySelectorAll('.ba-card').forEach(card=>{
      const btn=card.querySelector('.ba-open');
      btn.addEventListener('click',e=>{e.stopPropagation(); openLB(card,btn);});
      // tryk (uden at trække) på billedet åbner også stor visning
      const box=card.querySelector('.ba'); let sx=0, sy=0, moved=false;
      box.addEventListener('pointerdown',e=>{sx=e.clientX; sy=e.clientY; moved=false;});
      box.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-sx)>6||Math.abs(e.clientY-sy)>6) moved=true;});
      box.addEventListener('click',e=>{ if(!moved && e.target.tagName!=='BUTTON') openLB(card,btn); });
    });
    if(reduce) document.querySelectorAll('.g-ph video').forEach(v=>{v.removeAttribute('autoplay'); v.pause();});
    document.querySelectorAll('.g-ph').forEach(fig=>{
      const btn=fig.querySelector('button');
      btn.addEventListener('click',()=>{
        last=btn;
        const media=fig.querySelector('img,video').cloneNode(true); media.className='lb-img';
        if(media.tagName==='IMG') media.loading='eager'; else { media.controls=true; media.muted=true; }
        slot.replaceChildren(media); if(media.tagName==='VIDEO') media.play().catch(()=>{});
        document.getElementById('lb-title').textContent=fig.querySelector('figcaption b').textContent;
        document.getElementById('lb-sub').textContent=fig.querySelector('figcaption span').textContent;
        lb.hidden=false; document.body.classList.add('lb-lock');
        requestAnimationFrame(()=>lb.classList.add('open'));
        document.getElementById('lb-close').focus({preventScroll:true});
      });
    });
    document.getElementById('lb-close').addEventListener('click',closeLB);
    lb.addEventListener('click',e=>{ if(e.target===lb) closeLB(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!lb.hidden) closeLB(); });
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
