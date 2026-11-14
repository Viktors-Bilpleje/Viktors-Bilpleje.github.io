(function(){
  const PHONE='+4561302294';
  const smsHref=body=>'sms:'+PHONE+'?&body='+encodeURIComponent(body);
  // Små bevægelser, der viser at noget skete. Slås fra, hvis man har bedt om mindre bevægelse.
  const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE='cubic-bezier(0.23,1,0.32,1)';
  // Prisen "hopper" kort, når den ændrer sig, så øjet opdager det
  function bump(el){ if(REDUCE||!el||!el.animate) return;
    el.animate([{transform:'none'},{transform:'translateY(-3px) scale(1.12)',offset:.35},{transform:'none'}],{duration:280,easing:EASE}); }
  // Nyt billede i stor visning glider ind fra den side, man bladrer mod
  function slideIn(el,dir){ if(REDUCE||!dir||!el||!el.animate) return;
    el.animate([{transform:'translateX('+(dir*32)+'px)',opacity:.35},{transform:'none',opacity:1}],{duration:220,easing:EASE}); }

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
      const nv=String(first?Math.round(price*.8):price);
      if(el.textContent!==nv){ el.textContent=nv; if(el.dataset.ready) bump(el); }
      el.dataset.ready='1';
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
    {stars:5, name:'Helene', date:'2026-11-14', text:'10 stjerner herfra🤩 helt igennem fantastisk rengøring af vores bil, den ser ud som ny både indvendig og udvendig. Vil helt klart benytte os af Viktor igen!!'},
    {stars:5, name:'Nan', date:'2026-11-09', text:'Altså ⭐️ Top professionel og super tillidsfuld anbefaling fra os. Vi overlod en snavset bil til Victors bilpleje og kom hjem til et velduftende og håndpoleret pragteksemplar. 1000 tak!'},
    {stars:5, name:'Laila', date:'2026-11-09', text:'Fik klargjort 2 biler og de blev virkelig flot, og super søde og venlige var de. Vil bestemt bruge dem igen'},
    {stars:5, name:'Caroline, Alsønderup', date:'2026-11-07', text:'Få din bil ordnet af Viktor! De var så gode og vi er mere end tilfredse med resultatet! Det var intet problem at få ordnet en ekstra bil i samme omgang. En kæmpe anbefaling herfra!'},
    {stars:5, name:'Gus***', date:'2026-11-01', text:'Det var en rigtig grundig klargøring af min bil, det kan 100% anbefales herfra.'},
    {stars:5, name:'Ghi**, Helsinge', date:'2026-11-01', text:'Viktor fortjener helt sikkert en kæmpe anbefaling herfra. Aldrig har min bil været så fin og ren! Super service og god og nem kommunikation.'}
  ];
  const starSvg=(n,size)=>Array.from({length:5},(_,i)=>'<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="currentColor" class="'+(i<n?'':'off')+'" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>').join('');
  const maskName=n=>{const [who,...rest]=String(n).split(',');const m=who.trim().split(/\s+/).map((p,i)=>i===0?p.slice(0,3)+'*'.repeat(Math.max(0,p.length-3)):p[0]+'*'.repeat(Math.max(0,p.length-1))).join(' ');return rest.length?m+','+rest.join(','):m};
  const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // De nyeste anmeldelser på forsiden
  (function(){
    const box=document.getElementById('home-reviews'); if(!box||!REVIEWS.length) return;
    const avg=REVIEWS.reduce((a,r)=>a+r.stars,0)/REVIEWS.length;
    const sc=document.getElementById('hr-score');
    if(sc){ sc.innerHTML='<span class="hr-avg mono">'+avg.toLocaleString('da-DK',{minimumFractionDigits:1,maximumFractionDigits:1})+'</span><span class="stars-row" aria-hidden="true">'+starSvg(Math.round(avg),18)+'</span><span class="hr-n">'+REVIEWS.length+' anmeldelser</span>';
      sc.setAttribute('aria-label',avg.toFixed(1)+' ud af 5 stjerner fra '+REVIEWS.length+' anmeldelser'); sc.hidden=false; }
    box.innerHTML=REVIEWS.slice(0,3).map(r=>'<article class="r-card"><span class="stars-row" role="img" aria-label="'+r.stars+' af 5 stjerner">'+starSvg(r.stars,18)+'</span><p>'+esc(r.text)+'</p><div class="r-meta"><b>'+esc(maskName(r.name))+'</b><span>'+(r.date?new Date(r.date+'T12:00').toLocaleDateString('da-DK',{day:'numeric',month:'long'}):'')+'</span></div></article>').join('');
  })();

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
    const extra=$('o-extra'); let rowId=0; let wz=null;
    const PKGOPT='<option value="udv">Udvendig Vask</option><option value="ind">Indvendig Vask</option><option value="fuld">Fuld Vask</option><option value="voks">Fuld Vask + Voks</option>';
    const SIZEOPT='<option value="car">Personbil</option><option value="big">Store biler</option><option value="van">Varevogn</option>';
    const TICK='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5 10 17 19 7"/></svg>';
    const PKGPRICE={udv:'{"car":250,"big":350}',ind:'{"car":300,"big":400,"van":250}',fuld:'{"car":500,"big":600}',voks:'{"car":600,"big":700}'};
    function addRow(opt){
      opt=opt&&opt.size?opt:{};
      const i=++rowId, d=document.createElement('div'); d.className='o-row'+(opt.auto?' wz-auto':''); if(opt.auto) d.dataset.auto=opt.size;
      const sz='r-size-'+i, pk='r-pkg-'+i, ct='r-count-'+i;
      const seg=Object.entries({car:'Personbil',big:'Stor bil',van:'Varevogn'}).map(([v,t])=>'<button type="button" class="wz-seg" data-for="'+sz+'" data-value="'+v+'" aria-pressed="false">'+t+'</button>').join('');
      const chips=Object.keys(PKG).map(v=>'<button type="button" class="wz-pchip" data-for="'+pk+'" data-value="'+v+'" data-price=\''+PKGPRICE[v]+'\' data-size-from="'+sz+'" aria-pressed="false"><span class="wz-tick">'+TICK+'</span><b>'+PKG[v]+'</b><span class="wz-price mono"></span></button>').join('');
      d.innerHTML='<div class="o-row-head"><span>Bil '+(extra.children.length+2)+'</span><button type="button" class="o-del">Fjern</button></div>'+
        '<div class="wz-segs" role="group" aria-label="Biltype">'+seg+'</div>'+
        '<div class="wz-pchips" role="group" aria-label="Pakke">'+chips+'</div>'+
        '<div class="o-field wz-count"><label for="'+ct+'">Antal</label><div class="wz-stepper"><button type="button" data-target="'+ct+'" data-step="-1" aria-label="Én bil færre">−</button><input id="'+ct+'" class="r-count" type="number" inputmode="numeric" min="1" max="10" value="1"><button type="button" data-target="'+ct+'" data-step="1" aria-label="Én bil mere">+</button></div></div>'+
        '<div class="o-row-grid wz-native"><div class="o-field"><label for="'+pk+'">Pakke</label><select id="'+pk+'" class="r-pkg">'+PKGOPT+'</select></div>'+
        '<div class="o-field"><label for="'+sz+'">Biltype</label><select id="'+sz+'" class="r-size">'+SIZEOPT+'</select></div></div>';
      d.querySelector('.r-size').value=opt.size||size.value;
      d.querySelector('.r-pkg').value=opt.auto?(opt.size==='van'?'ind':(opt.pkg||pkg.value)):(pkg.value==='ind'?'fuld':'ind');
      if(opt.count) d.querySelector('.r-count').value=opt.count;
      d.querySelector('.o-del').addEventListener('click',()=>{ const a=d.dataset.auto; d.remove(); if(a&&wz) wz.dropType(a); renumber(); render(); if(wz) wz.sync(); $('o-add').focus();});
      if(opt.auto){ const firstManual=[...extra.children].find(r=>!r.dataset.auto); extra.insertBefore(d,firstManual||null); } else extra.appendChild(d);
      renumber(); if(opt.quiet) return d;
      render(); if(wz) wz.sync();
      if(!REDUCE && d.animate) d.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:220,easing:EASE});
      d.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'nearest'});
      (d.querySelector('.wz-seg[aria-pressed="true"]')||d.querySelector('.wz-seg')).focus({preventScroll:true});
    }
    function renumber(){[...extra.children].forEach((r,k)=>{ const a=r.dataset.auto, n=r.querySelector('.r-count').value; r.querySelector('.o-row-head span').textContent=a?SIZE[a].replace(' (kun førerkabinen)','')+(n>1?' × '+n:''):'Ekstra bil'; });}
    $('o-add').addEventListener('click',()=>addRow());
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
      const dirtyX=$('o-dirty')&&$('o-dirty').checked?150*cars:0; // ekstra beskidt +150 kr. pr. bil
      const full=wash+hoseX+dirtyX;
      const price=(first.checked?Math.round(wash*.8):wash)+hoseX+dirtyX;  // rabatten gælder selve vasken
      const op=$('o-price'), opv=krf(price);
      if(op.textContent!==opv){ const had=op.dataset.ready; op.textContent=opv; if(had) bump(op); }
      op.dataset.ready='1';
      $('o-old').textContent=krf(full); $('o-old').hidden=!first.checked;
      const order=R.length===1?['Pakke: '+PKG[R[0].pkg],'Biltype: '+SIZE[R[0].size],'Antal biler: '+R[0].n]
        :R.map((r,k)=>(k+1)+'. '+PKG[r.pkg]+', '+SIZE[r.size]+', '+r.n+' '+(r.n>1?'biler':'bil')+' ('+krf(r.price)+')');
      const lines=['Hej Viktor!','','Jeg vil gerne bestille:',...order,
        'Pris i alt: '+krf(price)+(first.checked?' (20 % rabat på første vask, normalt '+krf(full)+')':'')];
      if(hoseX) lines.push('Heraf '+krf(hoseX)+' for vask hjemme hos dig.');
      if(dirtyX) lines.push('Heraf '+krf(dirtyX)+' i gebyr, fordi '+(cars>1?'bilerne er':'bilen er')+' ekstra beskidt'+(cars>1?'e':'')+'.');
      if(first.checked) lines.push('Det er vores første vask hos dig.');
      if($('o-dog').checked) lines.push('Der er hundehår i bilen, så der kommer et tillæg på 100-150 kr.');
      if(hoseX) lines.push('Vi har ingen vandslange, så '+(cars>1?'bilerne':'bilen')+' skal vaskes hjemme hos dig.');
      if($('o-pay')&&$('o-pay').value) lines.push('Betaling: '+$('o-pay').value+'.');
      lines.push('','Adresse: '+($('o-addr').value.trim()),'Det passer mig bedst: '+($('o-when').value.trim()),'','Venlig hilsen'); const nm=$('o-name')&&$('o-name').value.trim(); if(nm) lines.push(nm);
      const body=lines.join('\n');
      $('o-preview').textContent=body;
      $('sms').href=smsHref(body);
    }
    f.addEventListener('input',render); f.addEventListener('change',render);
    f.addEventListener('submit',e=>e.preventDefault());

    // Bestilling i trin: bil → pakke → tilvalg → tid og sted → send.
    // Uden JavaScript vises alle felter på én gang som før.
    wz=(function(){
      const steps=[...f.querySelectorAll('.wz-step')];
      if(steps.length<2) return null;
      const prog=$('wz-prog'), back=$('wz-back'), next=$('wz-next'), sum=$('wz-sum');
      f.classList.add('wz-on'); prog.hidden=false;
      let cur=0, reached=0;
      prog.innerHTML=steps.map((s,i)=>'<li><button type="button" data-i="'+i+'"><span class="wz-num">'+(i+1)+'</span><span class="wz-lbl">'+s.dataset.title+'</span></button></li>').join('');
      const progBtns=[...prog.querySelectorAll('button')];
      progBtns.forEach(b=>b.addEventListener('click',()=>{ const i=+b.dataset.i; if(i<=reached) go(i); }));

      // Kort og knapper i stedet for rullemenuer (gælder også ekstra biler)
      f.addEventListener('click',e=>{
        const c=e.target.closest('[data-for]');
        if(c && f.contains(c) && !c.disabled){
          const sel=$(c.dataset.for); sel.value=c.dataset.value; sel.dispatchEvent(new Event('change',{bubbles:true}));
          return;
        }
        const st=e.target.closest('[data-target]');
        if(st && f.contains(st)){ const inp=$(st.dataset.target); inp.value=Math.min(10,Math.max(1,(parseInt(inp.value,10)||1)+(+st.dataset.step))); inp.dispatchEvent(new Event('input',{bubbles:true})); }
      });
      function sync(){
        f.querySelectorAll('[data-for]').forEach(c=>{
          const sel=$(c.dataset.for); if(!sel) return;
          c.setAttribute('aria-pressed',sel.value===c.dataset.value);
          if(c.dataset.price){
            const sid=c.dataset.sizeFrom||'o-size', row=c.closest('.o-row');
            const n=+(row?row.querySelector('.r-count').value:count.value)||1;
            const p=JSON.parse(c.dataset.price)[$(sid).value];
            c.disabled=p===undefined; c.hidden=p===undefined;
            c.querySelector('.wz-price').textContent=p===undefined?'':(n>1?n+' × ':'')+krf(p);
          }
        });
        const ml=$('wz-main-lbl');
        if(ml){ ml.hidden=!extra.children.length; ml.textContent=SIZE[size.value].replace(' (kun førerkabinen)','')+(count.value>1?' × '+count.value:''); }
        // opsummering på sidste trin
        if(sum){
          const R=rows(), row=(k,v)=>'<div><dt>'+k+'</dt><dd>'+esc(v)+'</dd></div>';
          const ex=[]; if(first.checked) ex.push('Første vask (−20 %)'); if(hose.checked) ex.push('Vask hos Viktor');
          if($('o-dirty').checked) ex.push('Ekstra beskidt'); if($('o-dog').checked) ex.push('Hundehår');
          const DUR={udv:'ca. 30 min – 1 time',ind:'ca. 1–2 timer',fuld:'ca. 2–3 timer',voks:'ca. 2–3 timer + voks'};
          const dur=r=>(r.size==='van'&&r.pkg==='ind'?'ca. 1–1½ time':DUR[r.pkg])+(r.n>1?' pr. bil':'');
          const row2=(k,v,sub)=>'<div><dt>'+k+'</dt><dd>'+esc(v)+'<small>'+esc(sub)+'</small></dd></div>';
          sum.innerHTML=R.map(r=>row2(r.n+' × '+SIZE[r.size].replace(' (kun førerkabinen)',''),PKG[r.pkg],'Forventet tid: '+dur(r))).join('')
            +(ex.length?row('Tilvalg',ex.join(', ')):'')
            +row('Hvornår',$('o-when').value.trim()||'Ikke valgt')+row('Adresse',$('o-addr').value.trim()||'Mangler')+row('Navn',($('o-name')&&$('o-name').value.trim())||'Ikke skrevet')+row('Betaling',($('o-pay')&&$('o-pay').value)||'Ikke valgt');
        }
        syncWhen(); syncPay();
      }
      const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

      // Trin 1: vælg alle de biltyper, der skal vaskes – hver med sit eget antal
      const types={}; types[size.value]=Math.max(1,parseInt(count.value,10)||1);
      const typeEls=[...f.querySelectorAll('.wz-type')];
      function renderTypes(){
        typeEls.forEach(t=>{ const k=t.dataset.size, n=types[k]||0;
          t.querySelector('.wz-tgl').setAttribute('aria-pressed',n>0);
          t.classList.toggle('on',n>0);
          t.querySelector('.wz-tcount').hidden=!n; t.querySelector('.wz-tnum').textContent=n||1; });
      }
      function applyTypes(){
        const sel=['car','big','van'].filter(k=>types[k]);
        const main=sel[0], autos=[...extra.children].filter(r=>r.dataset.auto);
        if(size.value!==main){
          const r=autos.find(r=>r.dataset.auto===main); if(r) pkg.value=r.querySelector('.r-pkg').value;
          size.value=main;
        }
        count.value=types[main];
        autos.forEach(r=>{ if(!sel.slice(1).includes(r.dataset.auto)) r.remove(); });
        sel.slice(1).forEach(k=>{
          let r=[...extra.children].find(r=>r.dataset.auto===k);
          if(!r) r=addRow({size:k,count:types[k],auto:true,quiet:true,pkg:pkg.value});
          r.querySelector('.r-count').value=types[k];
        });
        renumber(); render(); renderTypes(); sync();
      }
      typeEls.forEach(t=>{
        const k=t.dataset.size;
        t.querySelector('.wz-tgl').addEventListener('click',()=>{
          if(types[k]){ if(Object.values(types).filter(Boolean).length<2){ const h=$('wz-type-hint'); h.hidden=false; bump(h); return; } types[k]=0; }
          else types[k]=1;
          $('wz-type-hint').hidden=true; applyTypes();
        });
        t.querySelectorAll('[data-tstep]').forEach(b=>b.addEventListener('click',()=>{
          types[k]=Math.min(10,Math.max(1,(types[k]||1)+(+b.dataset.tstep))); applyTypes();
        }));
      });
      function dropType(k){ types[k]=0; if(!Object.values(types).some(Boolean)) types[size.value]=1; renderTypes(); }
      function resetTypes(){ Object.keys(types).forEach(k=>types[k]=0); types[size.value]=Math.max(1,parseInt(count.value,10)||1); [...extra.children].filter(r=>r.dataset.auto).forEach(r=>r.remove()); renumber(); render(); renderTypes(); }
      renderTypes();

      // Hurtigvalg af tid
      // Dag og tid: de næste weekender som knapper + formiddag/eftermiddag, eller skriv selv
      const days=$('wz-days'), parts=$('wz-parts'), when=$('o-when');
      const WD=['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag'], MO=['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'];
      // FØRSTE LEDIGE DAG: ret datoen her, når der er fuldt booket (år-måned-dag)
      const FIRST_FREE='2026-12-01';
      const opts=[]; const t0=new Date(); t0.setHours(12,0,0,0); t0.setDate(t0.getDate()+1);
      const ff=new Date(FIRST_FREE+'T12:00'); const start=ff>t0?ff:t0;
      for(let k=0;k<=27&&opts.length<8;k++){ const d=new Date(start); d.setDate(d.getDate()+k); if(d.getDay()===6||d.getDay()===0) opts.push(d); }
      const full=$('wz-full'); if(full && ff>t0){ full.hidden=false; full.querySelector('b').textContent='Fuldt booket indtil '+ff.getDate()+'. '+MO[ff.getMonth()]+'.'; }
      const longTxt=d=>WD[d.getDay()][0].toUpperCase()+WD[d.getDay()].slice(1)+' d. '+d.getDate()+'. '+MO[d.getMonth()];
      const shortTxt=d=>WD[d.getDay()].slice(0,3)+' '+d.getDate()+'. '+MO[d.getMonth()].slice(0,3);
      days.innerHTML=opts.map(d=>'<button type="button" class="wz-chip" data-day="'+longTxt(d)+'" aria-pressed="false">'+shortTxt(d).replace(/^./,c=>c.toUpperCase())+'</button>').join('')+'<button type="button" class="wz-chip" data-day="Hurtigst muligt" aria-pressed="false">Hurtigst muligt</button>';
      parts.innerHTML=['Formiddag','Eftermiddag'].map(p=>'<button type="button" class="wz-chip" data-part="'+p.toLowerCase()+'" aria-pressed="false">'+p+'</button>').join('');
      let selDay='', selPart='';
      const composeWhen=()=>{ when.value=selDay==='Hurtigst muligt'?selDay:(selDay?selDay+(selPart?', '+selPart:''):(selPart?selPart[0].toUpperCase()+selPart.slice(1):'')); when.dispatchEvent(new Event('input',{bubbles:true})); };
      days.addEventListener('click',e=>{ const b=e.target.closest('[data-day]'); if(!b) return; selDay=selDay===b.dataset.day?'':b.dataset.day; if(selDay==='Hurtigst muligt') selPart=''; composeWhen(); });
      parts.addEventListener('click',e=>{ const b=e.target.closest('[data-part]'); if(!b) return; selPart=selPart===b.dataset.part?'':b.dataset.part; if(selDay==='Hurtigst muligt') selDay=''; composeWhen(); });
      when.addEventListener('input',e=>{ if(e.isTrusted){ selDay=''; selPart=''; } });
      function syncWhen(){
        days.querySelectorAll('[data-day]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.day===selDay));
        parts.querySelectorAll('[data-part]').forEach(b=>{ b.setAttribute('aria-pressed',b.dataset.part===selPart); b.disabled=selDay==='Hurtigst muligt'; });
      }
      // Betaling: kontant eller MobilePay
      const pay=$('o-pay'), payBtns=[...f.querySelectorAll('[data-pay]')];
      payBtns.forEach(b=>b.addEventListener('click',()=>{ pay.value=pay.value===b.dataset.pay?'':b.dataset.pay; f.dispatchEvent(new Event('change')); }));
      function syncPay(){ payBtns.forEach(b=>{ const on=pay.value===b.dataset.pay; b.setAttribute('aria-checked',on); b.setAttribute('aria-pressed',on); }); }

      function valid(i){
        if(steps[i].dataset.title==='Tid og sted'){
          const ok=!!$('o-addr').value.trim(); $('wz-addr-err').hidden=ok;
          $('o-addr').setAttribute('aria-invalid',!ok); if(!ok) $('o-addr').focus();
          return ok;
        }
        return true;
      }
      function go(i,quiet){
        i=Math.max(0,Math.min(steps.length-1,i));
        if(i>cur){ for(let k=cur;k<i;k++){ if(!valid(k)){ i=k; break; } } }
        const dir=i>cur?1:-1, changed=i!==cur;
        cur=i; reached=Math.max(reached,i);
        steps.forEach((s,k)=>s.hidden=k!==i);
        progBtns.forEach((b,k)=>{ b.parentElement.className=k<i?'done':k===i?'now':''; b.disabled=k>reached; if(k===i) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current'); });
        back.hidden=i===0; next.hidden=i===steps.length-1;
        next.textContent=i===steps.length-2&&innerWidth>420?'Se opsummering':'Næste';
        sync();
        if(changed && !quiet){
          slideIn(steps[i],dir);
          const card=$('bestil'), r=card.getBoundingClientRect();
          if(r.top<0||r.top>innerHeight*.6) card.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'});
          const h=steps[i].querySelector('.wz-h'); h.tabIndex=-1; h.focus({preventScroll:true});
        }
      }
      next.addEventListener('click',()=>go(cur+1));
      // Ingen tilvalg: fjern alle afkrydsninger og gå videre
      const skip=$('wz-skip');
      if(skip) skip.addEventListener('click',()=>{
        ['o-first','o-hose','o-dirty','o-dog'].forEach(id=>{ const c=$(id); if(c) c.checked=false; });
        f.dispatchEvent(new Event('change')); go(cur+1);
      });
      back.addEventListener('click',()=>go(cur-1));
      $('o-addr').addEventListener('input',()=>{ if($('o-addr').value.trim()){ $('wz-addr-err').hidden=true; $('o-addr').removeAttribute('aria-invalid'); } });
      // Enter i et tekstfelt går videre i stedet for at gøre ingenting
      f.addEventListener('keydown',e=>{ if(e.key==='Enter' && e.target.matches('input:not([type=checkbox])')){ e.preventDefault(); go(cur+1); } });
      f.addEventListener('input',()=>sync()); f.addEventListener('change',()=>sync());
      go(0,true);
      return {go,sync,dropType,reset:resetTypes};
    })();
    // Fra pakkekortene på Priser-siden: udfyld formularen og hop ned til den
    const KEY={'Udvendig Vask':'udv','Indvendig Vask':'ind','Fuld Vask':'fuld','Fuld Vask + Voks':'voks'};
    document.querySelectorAll('[data-pkg]').forEach(a=>a.addEventListener('click',e=>{
      e.preventDefault();
      const pressed=document.querySelector('.sizes button[aria-pressed="true"]');
      if(pressed) size.value=pressed.dataset.size;
      pkg.value=KEY[a.dataset.pkg];
      const fb=document.getElementById('first'); if(fb) first.checked=fb.checked;
      render(); if(wz){ wz.reset(); wz.go(2,true); }
      document.getElementById('bestil').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
      // Ét sted at kigge: bestillingskortet lyser kort op, når man lander der
      const card=document.getElementById('bestil');
      if(!REDUCE && card){ card.classList.remove('staged'); setTimeout(()=>{ void card.offsetWidth; card.classList.add('staged'); setTimeout(()=>card.classList.remove('staged'),1300); },420); }
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
      if(!auto||SEEN) return;
      // Første besøg: alle billeder glider én gang, når siden åbnes. Ligger et billede uden for skærmen, glider det, når man scroller ned til det.
      // Ved senere besøg står de stille – man ved jo allerede, hvordan skyderen virker.
      setTimeout(play,400);
      const r=box.getBoundingClientRect();
      if(r.top>innerHeight && 'IntersectionObserver' in window){
        const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ io.disconnect(); touched=false; setTimeout(play,250);} }),{threshold:.5});
        io.observe(box);
      }
    }
    const SEEN=(()=>{ try{ return localStorage.getItem('vb-ba-seen')==='1'; }catch(e){ return false; } })();
    document.querySelectorAll('.ba-list .ba').forEach(b=>initBA(b,true));
    try{ localStorage.setItem('vb-ba-seen','1'); }catch(e){}

    // Stor visning
    const lb=document.getElementById('lb'), slot=document.getElementById('lb-slot');
    let last=null;
    const cards=[...document.querySelectorAll('.ba-list .ba-card')];
    const nav=document.getElementById('lb-nav'), count=document.getElementById('lb-count');
    let idx=-1;
    function showCard(i){
      const dir=idx<0?0:(i>idx?1:-1);
      idx=(i+cards.length)%cards.length;
      const card=cards[idx];
      const clone=card.querySelector('.ba').cloneNode(true);
      clone.classList.remove('dragging');
      clone.querySelectorAll('img').forEach(im=>im.loading='eager');
      slot.replaceChildren(clone); initBA(clone,false); slideIn(clone,dir);
      document.getElementById('lb-title').textContent=card.querySelector('.ba-cap b').textContent;
      document.getElementById('lb-sub').textContent=card.querySelector('.ba-cap span').textContent;
      if(nav){ nav.hidden=cards.length<2; count.textContent=(idx+1)+' / '+cards.length; }
      // hent naboerne i forvejen, så bladring føles øjeblikkelig
      [idx+1,idx-1].forEach(j=>{const c=cards[(j+cards.length)%cards.length]; c.querySelectorAll('.ba img').forEach(im=>{const p=new Image(); p.src=im.src;});});
    }
    function openLB(card,btn){
      last=btn;
      showCard(cards.indexOf(card));
      lb.hidden=false; document.body.classList.add('lb-lock');
      requestAnimationFrame(()=>lb.classList.add('open'));
      document.getElementById('lb-close').focus({preventScroll:true});
    }
    if(nav){
      document.getElementById('lb-prev').addEventListener('click',()=>showCard(idx-1));
      document.getElementById('lb-next').addEventListener('click',()=>showCard(idx+1));
      // stryg til siden uden for billedet (f.eks. på pilene eller teksten) for at bladre
      let tx=null, ty=0;
      lb.addEventListener('touchstart',e=>{ if(e.target.closest('.ba')) {tx=null; return;} tx=e.touches[0].clientX; ty=e.touches[0].clientY; },{passive:true});
      lb.addEventListener('touchend',e=>{ if(tx===null||nav.hidden) return; const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty; tx=null;
        if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5) showCard(idx+(dx<0?1:-1)); },{passive:true});
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
    // Videoer hentes og spiller først, når de er på skærmen (sparer data på telefonen), og pauser igen bagefter
    const vids=[...document.querySelectorAll('.g-ph video[data-autoplay]')];
    if(!reduce && 'IntersectionObserver' in window){
      const vio=new IntersectionObserver(es=>es.forEach(e=>{
        const v=e.target;
        if(e.isIntersecting){ if(v.preload==='none') v.preload='auto'; v.play().catch(()=>{}); }
        else v.pause();
      }),{rootMargin:'200px 0px',threshold:.25});
      vids.forEach(v=>vio.observe(v));
    } else if(!reduce){ vids.forEach(v=>{v.preload='auto'; v.play().catch(()=>{});}); }
    document.querySelectorAll('.g-ph').forEach(fig=>{
      const btn=fig.querySelector('button');
      btn.addEventListener('click',()=>{
        last=btn;
        const media=fig.querySelector('img,video').cloneNode(true); media.className='lb-img';
        if(media.tagName==='IMG') media.loading='eager'; else { media.controls=true; media.muted=true; }
        slot.replaceChildren(media); if(media.tagName==='VIDEO') media.play().catch(()=>{});
        if(nav) nav.hidden=true;
        document.getElementById('lb-title').textContent=fig.querySelector('figcaption b').textContent;
        document.getElementById('lb-sub').textContent=fig.querySelector('figcaption span').textContent;
        lb.hidden=false; document.body.classList.add('lb-lock');
        requestAnimationFrame(()=>lb.classList.add('open'));
        document.getElementById('lb-close').focus({preventScroll:true});
      });
    });
    document.getElementById('lb-close').addEventListener('click',closeLB);
    lb.addEventListener('click',e=>{ if(e.target===lb) closeLB(); });
    document.addEventListener('keydown',e=>{
      if(lb.hidden) return;
      if(e.key==='Escape') closeLB();
      // piletaster bladrer – undtagen når skyderen har fokus (så flytter de stregen)
      else if(nav && !nav.hidden && (e.key==='ArrowRight'||e.key==='ArrowLeft') && !(e.target.matches&&e.target.matches('input[type=range]'))){
        e.preventDefault(); showCard(idx+(e.key==='ArrowRight'?1:-1));
      }
    });
  })();

  // Eksempelbilleder på Priser-siden (ekstra beskidt bil): tryk for stor visning
  (function(){
    const figs=[...document.querySelectorAll('.dirty-pics figure')];
    const lb=document.getElementById('lb');
    if(!figs.length||!lb) return;
    const slot=document.getElementById('lb-slot'), nav=document.getElementById('lb-nav'), count=document.getElementById('lb-count');
    let i=0, last=null;
    function show(k,dir){
      i=(k+figs.length)%figs.length;
      const f=figs[i], img=f.querySelector('img').cloneNode(true);
      img.className='lb-img'; img.loading='eager'; img.removeAttribute('width'); img.removeAttribute('height');
      slot.replaceChildren(img); slideIn(img,dir);
      document.getElementById('lb-title').textContent=f.querySelector('figcaption').textContent;
      document.getElementById('lb-sub').textContent='Eksempel på en ekstra beskidt bil';
      nav.hidden=figs.length<2; count.textContent=(i+1)+' / '+figs.length;
    }
    function open(k,btn){
      last=btn; show(k);
      lb.hidden=false; document.body.classList.add('lb-lock');
      requestAnimationFrame(()=>lb.classList.add('open'));
      document.getElementById('lb-close').focus({preventScroll:true});
    }
    function close(){
      lb.classList.remove('open'); document.body.classList.remove('lb-lock');
      setTimeout(()=>{lb.hidden=true; slot.replaceChildren();},220);
      if(last) last.focus({preventScroll:true});
    }
    figs.forEach((f,k)=>{const b=f.querySelector('.dirty-open'); if(b) b.addEventListener('click',()=>open(k,b));});
    document.getElementById('lb-prev').addEventListener('click',()=>show(i-1,-1));
    document.getElementById('lb-next').addEventListener('click',()=>show(i+1,1));
    document.getElementById('lb-close').addEventListener('click',close);
    lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
    document.addEventListener('keydown',e=>{
      if(lb.hidden) return;
      if(e.key==='Escape') close();
      else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){ e.preventDefault(); show(i+(e.key==='ArrowRight'?1:-1),e.key==='ArrowRight'?1:-1); }
    });
    // stryg til siden for at bladre
    let tx=null, ty=0;
    lb.addEventListener('touchstart',e=>{tx=e.touches[0].clientX; ty=e.touches[0].clientY;},{passive:true});
    lb.addEventListener('touchend',e=>{ if(tx===null) return; const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty; tx=null;
      if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5) show(i+(dx<0?1:-1),dx<0?1:-1); },{passive:true});
  })();

  // Fast knapbjælke på telefonen: gemmes væk, når bestillingen er på skærmen (den har sin egen bund med pris og knapper)
  (function(){
    const bar=document.getElementById('mbar'), card=document.getElementById('bestil');
    if(!bar||!card||!('IntersectionObserver' in window)) return;
    new IntersectionObserver(es=>es.forEach(e=>bar.classList.toggle('away',e.isIntersecting)),{threshold:0}).observe(card);
  })();

  // Kort over Viktors område: rigtigt kort (OpenStreetMap, mørk stil) med zonen 30 km fra Blistrup – kun på land i Danmark.
  // Zonen er beregnet ud fra kommunegrænserne (land) og klippet ved 30 km, så hav og Sverige er skåret fra. Hentes først, når kortet kommer frem.
  (function(){
    const el=document.getElementById('area-map'); if(!el) return;
    const HOME=[56.0894,12.2078];
    const ZONE=[[[[55.9669,11.8434],[55.9646,11.844],[55.9635,11.8451],[55.962,11.8453],[55.9602,11.8475],[55.9574,11.8483],[55.957,11.847],[55.9557,11.8511],[55.9479,11.8522],[55.946,11.8534],[55.945,11.8547],[55.9429,11.8628],[55.9416,11.8657],[55.944,11.8657],[55.9445,11.866],[55.945,11.8717],[55.9443,11.8795],[55.9422,11.8854],[55.9418,11.8905],[55.943,11.8938],[55.9444,11.9026],[55.9475,11.9149],[55.9499,11.933],[55.9521,11.9407],[55.9532,11.944],[55.9549,11.9441],[55.9563,11.9455],[55.9583,11.9493],[55.9594,11.9554],[55.9616,11.9604],[55.965,11.971],[55.9663,11.974],[55.967,11.9792],[55.9653,11.9855],[55.9651,11.9889],[55.9665,11.9942],[55.9677,11.9972],[55.967,11.9994],[55.9643,11.9965],[55.9643,11.9971],[55.9652,12.0028],[55.9666,12.0033],[55.9677,12.0057],[55.9686,12.0107],[55.9671,12.0118],[55.9651,12.0062],[55.963,12.0047],[55.9606,12.0042],[55.9598,12.0095],[55.9634,12.0116],[55.9639,12.0132],[55.9618,12.0165],[55.9612,12.0144],[55.9592,12.011],[55.9576,12.0132],[55.9598,12.0175],[55.9593,12.0186],[55.9558,12.021],[55.9467,12.0226],[55.9438,12.0251],[55.9416,12.0281],[55.9363,12.0324],[55.9342,12.0336],[55.9337,12.0354],[55.9312,12.0386],[55.9245,12.0432],[55.9234,12.0434],[55.92,12.046],[55.9169,12.0464],[55.9145,12.0481],[55.9078,12.0471],[55.9066,12.0463],[55.9039,12.0456],[55.9017,12.0457],[55.9,12.0464],[55.897,12.0487],[55.8939,12.05],[55.8892,12.0537],[55.8856,12.0556],[55.88,12.0638],[55.8785,12.065],[55.8779,12.0666],[55.8775,12.0668],[55.877,12.0662],[55.8742,12.066],[55.8731,12.0648],[55.8707,12.0642],[55.8684,12.0645],[55.8681,12.0635],[55.8668,12.0635],[55.8663,12.0655],[55.8644,12.0642],[55.8611,12.065],[55.86,12.0642],[55.86,12.0622],[55.8582,12.0602],[55.858,12.0586],[55.8588,12.0489],[55.8579,12.0466],[55.8564,12.0453],[55.8508,12.0442],[55.8475,12.0445],[55.8447,12.043],[55.8438,12.0413],[55.8439,12.0432],[55.8425,12.0464],[55.8421,12.0504],[55.8416,12.0509],[55.8407,12.0507],[55.8378,12.0539],[55.8365,12.0534],[55.8366,12.0564],[55.8354,12.056],[55.8348,12.0511],[55.8344,12.0507],[55.8302,12.0738],[55.8261,12.103],[55.8229,12.1327],[55.8208,12.1626],[55.8197,12.1927],[55.8197,12.2229],[55.8208,12.253],[55.8229,12.2829],[55.8261,12.3126],[55.828,12.3273],[55.8327,12.3563],[55.8384,12.3847],[55.8416,12.3986],[55.8488,12.426],[55.8569,12.4525],[55.8613,12.4654],[55.8708,12.4904],[55.8811,12.5144],[55.893,12.5384],[55.8974,12.5358],[55.9067,12.5276],[55.9104,12.5258],[55.9134,12.5228],[55.9162,12.5208],[55.9166,12.5198],[55.9183,12.5185],[55.9221,12.5174],[55.9233,12.5182],[55.9262,12.5183],[55.9276,12.5197],[55.9279,12.5226],[55.9296,12.5234],[55.9297,12.5223],[55.9318,12.5214],[55.934,12.5222],[55.9352,12.5228],[55.9358,12.5238],[55.9359,12.527],[55.9371,12.5271],[55.9395,12.5297],[55.9397,12.5287],[55.9389,12.5279],[55.9385,12.5261],[55.9389,12.5237],[55.9399,12.5236],[55.9398,12.5268],[55.9402,12.5279],[55.9416,12.5282],[55.9421,12.5271],[55.9427,12.5271],[55.9462,12.53],[55.9498,12.5318],[55.954,12.5358],[55.9548,12.5358],[55.9571,12.5371],[55.9632,12.5418],[55.9687,12.5443],[55.9715,12.5477],[55.9709,12.5451],[55.9726,12.5455],[55.9763,12.5478],[55.9803,12.5516],[55.9853,12.5543],[55.9906,12.5602],[55.9921,12.5625],[55.9932,12.5618],[55.9954,12.5641],[56.0052,12.5799],[56.0084,12.5888],[56.0114,12.5952],[56.0154,12.5994],[56.0228,12.6051],[56.0277,12.6079],[56.0308,12.6122],[56.0321,12.6158],[56.0326,12.6161],[56.0338,12.6155],[56.036,12.6164],[56.0376,12.6147],[56.0382,12.6156],[56.0364,12.618],[56.0376,12.6183],[56.0377,12.6192],[56.0349,12.6194],[56.0383,12.6241],[56.0393,12.6242],[56.0401,12.6232],[56.0409,12.6206],[56.0411,12.6173],[56.0428,12.6163],[56.0414,12.6144],[56.0415,12.6138],[56.0422,12.6105],[56.0433,12.6129],[56.0439,12.6062],[56.0455,12.6047],[56.0478,12.5997],[56.0508,12.595],[56.0575,12.5789],[56.0619,12.5708],[56.0648,12.5669],[56.0686,12.5607],[56.0698,12.5597],[56.0747,12.5493],[56.0764,12.5473],[56.0798,12.5398],[56.0858,12.5195],[56.0888,12.5066],[56.0909,12.5003],[56.0914,12.4982],[56.0918,12.4873],[56.0932,12.4822],[56.0937,12.4761],[56.093,12.4652],[56.0936,12.4602],[56.0944,12.4588],[56.0942,12.458],[56.0935,12.4579],[56.0934,12.4567],[56.0943,12.4569],[56.0946,12.458],[56.0948,12.4565],[56.093,12.4446],[56.0932,12.4349],[56.0943,12.4243],[56.0966,12.417],[56.0979,12.4152],[56.0995,12.4094],[56.1,12.3975],[56.1013,12.3853],[56.1026,12.3827],[56.1036,12.3789],[56.105,12.3759],[56.1058,12.3753],[56.1073,12.371],[56.1101,12.3679],[56.1137,12.3621],[56.118,12.3543],[56.1198,12.3492],[56.1205,12.3347],[56.1215,12.3282],[56.1235,12.319],[56.1244,12.3172],[56.1249,12.3138],[56.1256,12.3137],[56.1255,12.31],[56.1264,12.3084],[56.1271,12.3103],[56.1277,12.3102],[56.128,12.3086],[56.1295,12.3095],[56.1279,12.3018],[56.1278,12.2975],[56.129,12.2913],[56.1292,12.2869],[56.1281,12.2758],[56.1265,12.2667],[56.1239,12.257],[56.1225,12.2491],[56.1221,12.2419],[56.1166,12.2199],[56.114,12.2077],[56.1132,12.196],[56.1094,12.1826],[56.1081,12.1792],[56.0993,12.1613],[56.0985,12.158],[56.0939,12.1492],[56.086,12.1304],[56.0796,12.1138],[56.0753,12.1051],[56.0619,12.072],[56.0588,12.0634],[56.0589,12.0625],[56.0593,12.0622],[56.05,12.0464],[56.0479,12.0408],[56.0375,12.0232],[56.0311,12.0086],[56.0161,11.9688],[56.0155,11.965],[56.0161,11.9646],[56.0135,11.9589],[56.013,11.9561],[56.011,11.9519],[56.0082,11.9431],[56.0038,11.9327],[56.0014,11.9246],[55.997,11.9161],[55.988,11.8928],[55.985,11.884],[55.9832,11.8752],[55.9766,11.8554],[55.975,11.8526],[55.9737,11.8513],[55.9701,11.8486],[55.9686,11.8486],[55.9671,11.8456],[55.9669,11.8434]]],[[[55.9211,11.901],[55.9182,11.902],[55.9161,11.9044],[55.9127,11.9098],[55.9052,11.9176],[55.9045,11.9186],[55.9042,11.9205],[55.9024,11.9211],[55.9017,11.9204],[55.901,11.9206],[55.9001,11.9223],[55.8992,11.9223],[55.8981,11.9234],[55.8961,11.9243],[55.894,11.9263],[55.8931,11.9291],[55.8917,11.9311],[55.8896,11.9315],[55.889,11.9304],[55.8845,11.9292],[55.8808,11.9292],[55.8744,11.9336],[55.8725,11.9361],[55.8715,11.9395],[55.8717,11.9439],[55.8713,11.9448],[55.8683,11.9475],[55.8637,11.9506],[55.8597,11.9551],[55.8488,11.9896],[55.8416,12.017],[55.8373,12.0364],[55.8377,12.0365],[55.8413,12.0334],[55.843,12.0394],[55.8432,12.0393],[55.8417,12.0333],[55.846,12.0323],[55.8513,12.0299],[55.8526,12.0264],[55.8532,12.021],[55.8544,12.0183],[55.8555,12.0143],[55.8558,12.0097],[55.8563,12.0087],[55.8582,12.0095],[55.8582,12.009],[55.8566,12.0072],[55.8576,12.0055],[55.8585,12.0015],[55.8606,12.0023],[55.8599,12.0004],[55.8604,11.9992],[55.8633,11.9975],[55.8665,11.9989],[55.8677,12],[55.87,11.9999],[55.8716,12.0007],[55.8725,12.0018],[55.8732,12.0018],[55.8756,11.9991],[55.8767,11.9992],[55.8787,12.0007],[55.8801,12.0004],[55.882,12.001],[55.8829,12.0055],[55.8844,12.0081],[55.8886,12.0092],[55.8902,12.0108],[55.8922,12.0159],[55.8942,12.0179],[55.8959,12.0216],[55.8991,12.0238],[55.9004,12.0262],[55.9074,12.0239],[55.9082,12.0227],[55.9082,12.0189],[55.9095,12.0151],[55.9102,12.0148],[55.9108,12.0135],[55.9114,12.0097],[55.9151,12.0049],[55.9153,12.0039],[55.9147,12.0018],[55.9137,12.0005],[55.9143,11.9979],[55.9126,11.9938],[55.9135,11.9906],[55.9135,11.9852],[55.9165,11.9786],[55.9182,11.9761],[55.9249,11.9712],[55.9295,11.9644],[55.9294,11.9605],[55.9301,11.9542],[55.9315,11.9524],[55.9324,11.9498],[55.9364,11.9088],[55.938,11.9048],[55.9366,11.9059],[55.9331,11.9067],[55.9271,11.9047],[55.9211,11.901]]]];
    const BOUNDS=[[55.8197,11.8434],[56.1295,12.6242]];
    let started=false;
    function start(){
      if(started) return; started=true;
      let n=0; const ready=()=>{ if(++n===2) init(); };
      const css=document.createElement('link'); css.rel='stylesheet'; css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; css.onload=ready; css.onerror=ready; document.head.appendChild(css);
      const js=document.createElement('script'); js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; js.onload=ready;
      js.onerror=()=>{ el.querySelector('.mp-loading').textContent='Kortet kunne ikke indlæses. Viktor kører inden for 30 km fra Blistrup.'; };
      document.head.appendChild(js);
    }
    function init(){
      el.innerHTML=''; el.classList.add('live');
      const map=L.map(el,{scrollWheelZoom:false, dragging:!L.Browser.mobile, tap:false, zoomSnap:.25, attributionControl:true});
      const fit=()=>map.fitBounds(BOUNDS,{padding:[2,2]});
      fit();
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{minZoom:8, maxZoom:15,
        attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(map);
      L.polygon(ZONE,{color:'#FFC531', weight:2, opacity:.9, dashArray:'6 6', fillColor:'#FFC531', fillOpacity:.22, interactive:false, smoothFactor:.5}).addTo(map);
      L.marker(HOME,{interactive:false, keyboard:false, icon:L.divIcon({className:'mp-pin', html:'<span class="mp-ring"></span><span class="mp-dot"></span><span class="mp-lbl">Blistrup</span>', iconSize:[18,18], iconAnchor:[9,9]})}).addTo(map);
      addEventListener('resize',fit);
    }
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(es=>{ if(es.some(e=>e.isIntersecting)){ io.disconnect(); start(); } },{rootMargin:'300px'});
      io.observe(el);
    } else start();
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
    const done=()=>{
      copy.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5 10 17 19 7"/></svg>Kopieret!';
      copy.classList.add('ok'); bump(copy);
      clearTimeout(copy._t); copy._t=setTimeout(()=>{copy.textContent='Kopiér nummer'; copy.classList.remove('ok');},1800);
    };
    const sel=()=>{const r=document.createRange();r.selectNodeContents(document.getElementById('phone'));const s=getSelection();s.removeAllRanges();s.addRange(r)};
    try{navigator.clipboard.writeText('+4561302294').then(done,sel)}catch(e){sel()}
  });

})();
