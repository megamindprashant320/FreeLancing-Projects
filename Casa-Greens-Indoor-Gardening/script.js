'use strict';
// Shared navigation: a disclosure on tablets/mobile, ordinary links on desktop.
const toggle=document.querySelector('.menu-toggle');
const nav=document.getElementById('main-nav');
if(toggle&&nav){
 const header=toggle.closest('.site-header');
 const mobileNav=window.matchMedia('(max-width:1150px)');
 // CSS can hide a focused desktop link before the media-query callback runs.
 let navHadFocus=false,pointerInHeader=false;
 document.addEventListener('focusin',event=>{navHadFocus=nav.contains(event.target)});
 document.addEventListener('pointerdown',event=>{pointerInHeader=header.contains(event.target);if(!nav.contains(event.target))navHadFocus=false});
 document.addEventListener('pointerup',()=>{pointerInHeader=false});
 document.addEventListener('pointercancel',()=>{pointerInHeader=false});
 function setMenu(open,restoreFocus=false){
  const expanded=mobileNav.matches&&open;
  nav.classList.toggle('open',expanded);
  toggle.setAttribute('aria-expanded',String(expanded));
  toggle.setAttribute('aria-label',expanded?'Close menu':'Open menu');
  nav.inert=mobileNav.matches&&!expanded;
  if(mobileNav.matches)nav.setAttribute('aria-hidden',String(!expanded));
  else nav.removeAttribute('aria-hidden');
  if(restoreFocus)toggle.focus();
 }
 header.classList.add('nav-enhanced');
 setMenu(false);
 // Hide the initial disclosure before enabling transitions; avoid a closing-menu flash.
 function enableMenuMotion(){requestAnimationFrame(()=>requestAnimationFrame(()=>header.classList.add('nav-animated')))}
 enableMenuMotion();
 toggle.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
 toggle.addEventListener('keydown',event=>{
  if(mobileNav.matches&&(event.key==='ArrowDown'||event.key==='ArrowUp')){
   event.preventDefault();setMenu(true);
   const links=nav.querySelectorAll('a[href]');
   const target=event.key==='ArrowDown'?links[0]:links[links.length-1];
   if(target)target.focus();
  }
 });
 // Let the link's native activation complete before making its ancestor inert.
 nav.addEventListener('click',event=>{
  if(event.target.closest('a'))window.setTimeout(()=>setMenu(false),0);
 });
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&nav.classList.contains('open')){
   event.preventDefault();setMenu(false,true);
  }
 });
 document.addEventListener('click',event=>{
  if(nav.classList.contains('open')&&!nav.contains(event.target)&&!toggle.contains(event.target))setMenu(false);
 });
 header.addEventListener('focusout',event=>{
  // WebKit pointer clicks can blur to BODY without focusing the clicked control.
  // Pointer activation inside the header must finish; outside clicks are handled separately.
  if(pointerInHeader)return;
  // relatedTarget is reliable while the browser is still moving focus.
  if(event.relatedTarget){
   if(!header.contains(event.relatedTarget))setMenu(false);
  }else{
   window.setTimeout(()=>{if(!header.contains(document.activeElement))setMenu(false)},0);
  }
 });
 mobileNav.addEventListener('change',()=>{
  header.classList.remove('nav-animated');
  const moveFocus=mobileNav.matches&&(nav.contains(document.activeElement)||(navHadFocus&&document.activeElement===document.body));
  setMenu(false,moveFocus);
  enableMenuMotion();
 });
 window.addEventListener('pageshow',()=>setMenu(false));
}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));document.body.classList.add('js-motion')}
// Gallery nodes are retained while filtering; native buttons support keyboard and touch.
const inspirationGallery=document.querySelector('.page-projects .project-grid');
if(inspirationGallery){
 const filters=document.querySelector('.gallery-filters');
 const buttons=Array.from(filters.querySelectorAll('[data-filter]'));
 const tiles=Array.from(inspirationGallery.querySelectorAll('.project-tile[data-category]'));
 const status=document.querySelector('.gallery-status');
 let selected=null;
 buttons.forEach(button=>{
  const count=tiles.filter(tile=>button.dataset.filter==='all'||tile.dataset.category===button.dataset.filter).length;
  const label=button.querySelector('.filter-label').textContent.trim();
  button.dataset.label=label;
  const badge=button.querySelector('.gallery-count');badge.textContent=count;button.disabled=false;
  // Native visible labels (including counts) also support speech input.
  button.removeAttribute('aria-label');badge.removeAttribute('aria-hidden');
  button.setAttribute('aria-controls',inspirationGallery.id);
  button.addEventListener('click',()=>select(button));
 });
 function select(button){
  const category=button.dataset.filter;
  if(selected===category)return;
  selected=category;let count=0;
  buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  tiles.forEach(tile=>{const show=category==='all'||tile.dataset.category===category;tile.hidden=!show;if(show)count++});
  status.textContent=category==='all'?`Showing all ${count} inspirations`:`Showing ${count} inspiration${count===1?'':'s'} for ${button.dataset.label}`;
 }
 select(buttons[0]);filters.hidden=false;
}

// Opt-in for verified image pairs only. The Projects template stays inert until populated.
function initImageComparisons(root=document){
 root.querySelectorAll('[data-comparison]').forEach(component=>{
  if(component.dataset.initialized)return;
  const range=component.querySelector('input[type="range"]');
  const images=component.querySelectorAll('img');
  if(!range||images.length!==2||Array.from(images).some(img=>!img.getAttribute('src')||!img.alt.trim()))return;
  const update=()=>{
   const value=Math.max(0,Math.min(100,Number(range.value)));
   component.style.setProperty('--comparison-position',value+'%');
   range.setAttribute('aria-valuetext',value+'% after image revealed');
  };
  range.addEventListener('input',update);component.dataset.initialized='true';update();
 });
}
initImageComparisons();

// Demonstration catalogue: stable IDs and separate content fields can later map to a verified catalogue.
// No commercial data is inferred from these examples or their inspiration images.
const productCategories={plants:'Artificial Indoor Plants',trees:'Artificial Trees',planters:'Decorative Planters',hanging:'Hanging Artificial Plants',panels:'Artificial Green Wall Panels',arrangements:'Customized Botanical Arrangements'};
const productCatalog=Object.freeze([
 {id:'broad-leaf-example',category:'plants',name:'Broad-leaf Plant Concept',description:'Explore a lifelike leafy accent for a side table, living room or workspace. Ask about actual artificial plant options.',image:'leaf-detail.webp',visual:'Stock foliage inspiration; living plant shown',position:'50% 55%'},
 {id:'statement-tree-example',category:'trees',name:'Statement Tree Concept',description:'A starting point for a sculptural artificial tree arrangement. Discuss the look and placement for your interior.',image:'indoor-garden.webp',visual:'Interior design concept; not a product photograph',position:'12% center'},
 {id:'decorative-planter-example',category:'planters',name:'Decorative Planter Concept',description:'Explore a coordinated planter direction for artificial foliage. Confirm actual designs and finishes with us.',image:'studio-plants.webp',visual:'Stock planter inspiration; living plants shown',position:'48% center'},
 {id:'trailing-greenery-example',category:'hanging',name:'Trailing Greenery Concept',description:'Consider hanging artificial foliage and cascading arrangements to soften shelves, ceilings or partitions.',image:'green-wall.webp',visual:'Greenery design concept; not a product photograph',position:'50% 28%'},
 {id:'green-wall-example',category:'panels',name:'Green Wall Panel Concept',description:'Explore layered artificial foliage panels for a feature wall. Enquire about a product selection or an installation.',image:'green-wall.webp',visual:'Installation design concept; not a product photograph',position:'50% 65%'},
 {id:'botanical-arrangement-example',category:'arrangements',name:'Botanical Arrangement Concept',description:'Discuss a custom combination of artificial foliage and planters for your home, business or a larger order.',image:'complete-garden.webp',visual:'Custom design concept; not a product photograph',position:'15% center'}
]);
const productImageSizes={'leaf-detail.webp':[1400,2095],'indoor-garden.webp':[1920,1080],'studio-plants.webp':[1400,869],'green-wall.webp':[1920,1080],'complete-garden.webp':[1920,1080]};
function productCard(product){
 const card=document.createElement('article');card.className='product-card';card.dataset.productId=product.id;card.dataset.category=product.category;card.setAttribute('aria-labelledby','product-'+product.id+'-title');
 const photo=document.createElement('div');photo.className='product-photo';
 const image=document.createElement('img');image.src='assets/images/'+product.image;image.alt=product.name+' - '+product.visual;image.loading='lazy';image.decoding='async';const dimensions=productImageSizes[product.image];image.width=dimensions[0];image.height=dimensions[1];image.srcset='assets/images/'+product.image.replace('.webp','-768.webp')+' 768w, assets/images/'+product.image+' '+dimensions[0]+'w';image.sizes='(max-width:767px) calc(100vw - 40px), (max-width:1023px) 50vw, 400px';image.style.objectPosition=product.position;
 const badge=document.createElement('span');badge.className='demo-badge';badge.textContent='DEMONSTRATION';photo.append(image,badge);
 const content=document.createElement('div');content.className='product-copy';
 const category=document.createElement('span');category.className='product-category';category.textContent=productCategories[product.category];
 const heading=document.createElement('h3');heading.id='product-'+product.id+'-title';heading.textContent=product.name;
 const visual=document.createElement('p');visual.className='product-visual';visual.textContent=product.visual;
 const details=document.createElement('details');details.open=true;const summary=document.createElement('summary');summary.textContent='About this concept';const description=document.createElement('p');description.textContent=product.description;details.append(summary,description);
 const link=document.createElement('a');link.className='product-enquiry';link.setAttribute('aria-label','Enquire about this product: '+product.name);link.href='contact.html?type=product&product='+encodeURIComponent(product.id)+'#contactForm';link.textContent='Enquire about this product';const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent=String.fromCharCode(8599);link.append(arrow);
 content.append(category,heading,visual,details,link);card.append(photo,content);return card;
}
document.querySelectorAll('[data-product-grid]').forEach(grid=>{
 // The homepage renders its featured cards in HTML to reserve space before scripts load.
 if(grid.hasAttribute('data-featured')&&grid.querySelector('.product-card'))return;
 const products=grid.hasAttribute('data-featured')?productCatalog.slice(0,3):productCatalog;
 const fragment=document.createDocumentFragment();
 products.forEach(product=>fragment.append(productCard(product)));
 grid.append(fragment);
});
// Catalogue filters retain their cards and disclosure state; the URL is the source of selection.
const catalogueGrid=document.querySelector('.page-products [data-product-grid]');
if(catalogueGrid){
 const filters=document.querySelector('.page-products .product-filters');
 const buttons=Array.from(filters.querySelectorAll('[data-product-filter]'));
 const cards=Array.from(catalogueGrid.querySelectorAll('.product-card'));
 const status=document.querySelector('.page-products .product-status');
 const counts=Object.fromEntries(Object.keys(productCategories).map(category=>[category,0]));
 cards.forEach(card=>counts[card.dataset.category]++);
 let selected=null;
 buttons.forEach(button=>{
  button.disabled=false;
  const category=button.dataset.productFilter;
  const count=category==='all'?cards.length:counts[category];
  button.removeAttribute('aria-label');
  const badge=button.querySelector('.filter-count');
  badge.removeAttribute('aria-hidden');
  if(badge.textContent!==String(count))badge.textContent=String(count);
 });
 function applyCategory(requested,historyMode='replace'){
  const category=Object.hasOwn(productCategories,requested)?requested:'all';
  if(category!==selected){
   buttons.forEach(button=>{
    const pressed=String(button.dataset.productFilter===category);
    if(button.getAttribute('aria-pressed')!==pressed)button.setAttribute('aria-pressed',pressed);
   });
   cards.forEach(card=>{
    const hidden=category!=='all'&&card.dataset.category!==category;
    if(card.hidden!==hidden)card.hidden=hidden;
   });
   const visible=category==='all'?cards.length:counts[category];
   status.textContent=category==='all'?`Showing all ${visible} demonstration concepts`:`Showing ${visible} of ${cards.length} demonstration concepts: ${productCategories[category]}`;
   selected=category;
  }
  // Canonicalize invalid, empty, duplicate or explicit all parameters while retaining other URL data.
  const url=new URL(window.location.href);
  if(category==='all')url.searchParams.delete('category');
  else url.searchParams.set('category',category);
  if(url.href!==window.location.href){
   if(historyMode==='push')history.pushState(history.state,'',url);
   else history.replaceState(history.state,'',url);
  }
 }
 function syncFromUrl(){applyCategory(new URLSearchParams(location.search).get('category'))}
 applyCategory(new URLSearchParams(location.search).get('category'));
 filters.hidden=false;
 filters.addEventListener('click',event=>{
  const button=event.target.closest('button[data-product-filter]');
  if(button&&filters.contains(button))applyCategory(button.dataset.productFilter,'push');
 });
 window.addEventListener('popstate',syncFromUrl);
 window.addEventListener('pageshow',event=>{if(event.persisted)syncFromUrl()});
}
// Google Apps Script HTML-service bridge: no opaque fetch or optimistic success.
const form=document.getElementById('contactForm');
if(form){
 const fields=form.elements,params=new URLSearchParams(location.search);
 const context=document.getElementById('productContext'),status=document.getElementById('formStatus');
 const connection=document.getElementById('connectionStatus'),button=form.querySelector('[type=submit]');
 const draftButton=document.getElementById('prepareEmail'),draftStatus=document.getElementById('emailDraftStatus'),draftRisk=document.getElementById('emailDraftRisk');
 draftButton.disabled=false;
 const controls=Array.from(form.querySelectorAll('input:not([name=website]),select,textarea'));
 let startedAt=Date.now(),busy=false,pending=null,previous=null,bridge=null,channel='',peer=null,timer=null;
 function setArea(){fields.service.value=fields.enquiryType.value==='product'?'Product selection':fields.enquiryType.value==='bulk'?'Bulk / Custom Order':''}
 function applyContext(){
  const type=params.get('type');if(['product','design','bulk'].includes(type))fields.enquiryType.value=type;
  setArea();const selected=productCatalog.find(item=>item.id===params.get('product'));
  if(selected){fields.enquiryType.value='product';fields.service.value='Product selection';fields.product.value=selected.name;context.textContent='Selected demonstration product. Ask about actual options and availability.'}
  const service=params.get('service');if(Array.from(fields.service.options).some(option=>option.value&&option.value===service))fields.service.value=service;
 }
 applyContext();fields.enquiryType.addEventListener('change',setArea);
 controls.forEach(field=>{
  const error=document.createElement('small');error.id=field.id+'Error';error.className='field-error';error.hidden=true;field.after(error);
  field.setAttribute('aria-describedby',[field.getAttribute('aria-describedby'),error.id].filter(Boolean).join(' '));
  field.addEventListener('input',()=>{field.setCustomValidity('');field.removeAttribute('aria-invalid');error.hidden=true});
  field.addEventListener('change',()=>{field.setCustomValidity('');field.removeAttribute('aria-invalid');error.hidden=true});
 });
 function phoneValid(value){
  if(!/^\+?[\d\s().-]+$/.test(value))return false;
  let digits=value.replace(/\D/g,'');
  if(value.trim().startsWith('+91')||value.trim().startsWith('0091')){digits=digits.replace(/^(0091|91)/,'');return /^[6-9]\d{9}$/.test(digits)}
  if(!value.trim().startsWith('+')){if(/^0[6-9]\d{9}$/.test(digits))digits=digits.slice(1);return /^[6-9]\d{9}$/.test(digits)}
  return /^\+[1-9][0-9]{7,14}$/.test('+'+digits)&&value.trim().indexOf('+',1)===-1;
 }
 function validate(){
  let first=null;
  controls.forEach(field=>{
   field.setCustomValidity('');const value=field.value.trim();let message='';
   if(field.required&&!value)message='Please complete this required field.';
   else if(field.name==='phone'&&!phoneValid(value))message='Enter a valid Indian mobile number or an international number with + and country code.';
   else if(field.name==='email'&&(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)||field.validity.typeMismatch))message='Enter a valid email address.';
   else if(field.minLength>0&&value.length<field.minLength)message='Please enter at least '+field.minLength+' characters.';
   else if(field.maxLength>0&&value.length>field.maxLength)message='Please use no more than '+field.maxLength+' characters.';
   field.setCustomValidity(message);field.setAttribute('aria-invalid',String(Boolean(message)));
   const error=document.getElementById(field.id+'Error');error.textContent=message;error.hidden=!message;
   if(message&&!first)first=field;
  });
  if(first){status.textContent='Please correct the highlighted fields.';first.focus();return false}return true;
 }
 function setBusy(value){busy=value;button.disabled=value||!endpoint;draftButton.disabled=value;form.setAttribute('aria-busy',String(value));controls.forEach(field=>field.disabled=value);button.textContent=value?'Sending enquiry...' :'Send Enquiry'}
 function finish(message,success=false){clearTimeout(timer);pending=null;setBusy(false);status.dataset.state=success?'success':'error';status.textContent=message;status.focus()}
 let endpoint=null;
 try{const url=new URL(form.dataset.endpoint);if(url.protocol==='https:'&&url.hostname==='script.google.com'&&/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname)&&!url.search&&!url.hash)endpoint=url}catch(error){/* Unconfigured form remains honest and local. */}
 function connectionFailed(){finish('The enquiry connection failed. Storage is unconfirmed; your earlier request may have been stored. Your details are preserved. Retry unchanged or explicitly prepare an email draft.');peer=null}
 function sendPending(){
  try{peer.source.postMessage({protocol:'casa-enquiry-v1',channel,kind:'submit',payload:pending},peer.origin)}
  catch(error){connectionFailed()}
 }
 function connect(){
  peer=null;if(bridge)bridge.remove();channel=crypto.randomUUID();
  bridge=document.createElement('iframe');bridge.title='Secure enquiry connection';bridge.className='enquiry-bridge';bridge.setAttribute('aria-hidden','true');bridge.tabIndex=-1;bridge.referrerPolicy='no-referrer';
  const url=new URL(endpoint);url.searchParams.set('origin',location.origin);url.searchParams.set('channel',channel);bridge.src=url.href;document.body.append(bridge);
 }
 window.addEventListener('message',event=>{
  const data=event.data;
  if(!endpoint||!data||data.channel!==channel||data.protocol!=='casa-enquiry-v1')return;
  let host;try{const origin=new URL(event.origin);if(origin.protocol!=='https:')return;host=origin.hostname}catch(error){return}
  if(host!=='script.googleusercontent.com'&&!host.endsWith('-script.googleusercontent.com'))return;
  if(data.kind==='ready'&&!peer){peer={source:event.source,origin:event.origin};connection.textContent='Secure enquiry connection ready.';if(pending)sendPending();return}
  if(!peer||event.source!==peer.source||event.origin!==peer.origin||!pending||data.requestId!==pending.requestId||data.kind!=='result')return;
  if(data.ok===true&&data.enquiryId==='CG-'+pending.requestId){
   form.reset();applyContext();previous=null;draftRisk.hidden=true;draftStatus.textContent='';startedAt=Date.now();finish('Your enquiry has been stored. Reference: '+data.enquiryId+'.',true);
  }else finish(typeof data.message==='string'?data.message.slice(0,220):'We could not confirm storage. Your details are still here. Please retry.');
 });
 form.addEventListener('submit',event=>{
  event.preventDefault();if(busy||!validate())return;
  if(!endpoint){status.dataset.state='error';status.textContent='Online submission is not configured yet. Your enquiry has not been sent. You can explicitly choose Prepare Email Draft.';status.focus();return}
  const payload=Object.fromEntries(new FormData(form));Object.keys(payload).forEach(key=>payload[key]=payload[key].trim());
  const fingerprint=JSON.stringify(payload);
  if(!previous||previous.fingerprint!==fingerprint)previous={fingerprint,requestId:crypto.randomUUID()};
  pending={...payload,requestId:previous.requestId,startedAt,origin:location.origin};draftRisk.hidden=false;setBusy(true);status.dataset.state='loading';status.textContent='Sending your enquiry. Please keep this page open.';
  timer=setTimeout(()=>{finish('Storage could not be confirmed. Your details are preserved. Retry unchanged to avoid a duplicate; the earlier request may have been stored.');peer=null},45000);
  try{if(peer)sendPending();else connect()}catch(error){connectionFailed()}
 });
 // An explicit, validated fallback only; no recipient or customer data enters email headers.
 draftButton.addEventListener('click',()=>{
  if(busy||!validate())return;
  const type={product:'Product Enquiry',design:'Design Consultation',bulk:'Bulk / Custom Order'}[fields.enquiryType.value]||'Enquiry';
  const value=name=>fields[name].value.trim().replace(/\r\n?/g,'\n');
  const body=['Hello Casa Greens,','',type,'','Name: '+value('name'),'Email: '+value('email'),'Phone: '+value('phone'),'Selected product / arrangement: '+(value('product')||'Not specified'),'Selected service / area: '+value('service'),'Location / project city: '+(value('location')||'Not specified'),'','Requirements:',value('message'),'','Please reply to the contact details above.'].join('\r\n');
  // Fixed whitelist subject; encode the complete body so &, ?, # and CRLF remain body data.
  const link=document.createElement('a');
  link.href='mailto:?subject='+encodeURIComponent('Casa Greens '+type)+'&body='+encodeURIComponent(body);
  draftStatus.textContent='Email draft requested. Nothing has been sent by this website. Select a recipient and manually send the email. If no app opens, copy your details into your email application.'+(draftRisk.hidden?'':' Online storage is unconfirmed: your enquiry may already have been saved; sending an email may create a duplicate enquiry.');
  try{link.click()}catch(error){draftStatus.textContent='The email application could not be opened. Nothing has been sent. Your details are preserved; copy them into your email application and select a recipient.'+(draftRisk.hidden?'':' Online storage is unconfirmed; sending an email may create a duplicate enquiry.')}
  draftStatus.focus();
 });
 button.disabled=!endpoint;
 if(endpoint)connection.textContent='Online enquiries enabled. A secure connection opens when you submit.';
 else connection.textContent='Online submission is unavailable because it is not configured. Use Prepare Email Draft, select a recipient, and manually send the email.';
}


// Homepage background film: load after the poster, with an accessible static state.
const heroVideo=document.querySelector('.page-index .hero-video');
if(heroVideo){
 const hero=heroVideo.closest('.hero');
 const control=hero.querySelector('.hero-motion-toggle');
 const source=heroVideo.querySelector('source[data-src]');
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const saveData=Boolean(navigator.connection&&navigator.connection.saveData);
 let userPaused=false;
 let heroInView=true;
 let autoplayReady=false;
 let failed=false;
 function showPoster(){hero.classList.remove('is-video-playing');hero.dataset.videoState='poster'}
 function updateControl(){
  control.textContent=heroVideo.paused?'Play video':'Pause video';
  // The visible button text is also its accessible name (speech-control friendly).
  control.removeAttribute('aria-label');
 }
 function failVideo(){
  // Removing the source for reduced motion is intentional, not a playback failure.
  if(failed||!source.hasAttribute('src'))return;
  failed=true;heroVideo.pause();showPoster();hero.dataset.videoState='fallback';control.hidden=true;
  source.removeAttribute('src');heroVideo.load();
 }
 function playVideo(explicit=false){
  if(failed||document.hidden||!heroInView||(!explicit&&(motion.matches||saveData||userPaused)))return;
  if(!source.hasAttribute('src')){source.src=source.dataset.src;heroVideo.load()}
  heroVideo.muted=true;
  const playback=heroVideo.play();
  if(playback)playback.catch(error=>{
   if(error.name==='AbortError')return;
   if(error.name==='NotAllowedError'){showPoster();updateControl()}
   else failVideo();
  });
 }
 control.hidden=false;updateControl();
 heroVideo.addEventListener('playing',()=>{
  if(heroVideo.paused||!source.hasAttribute('src'))return;
  hero.classList.add('is-video-playing');hero.dataset.videoState='playing';updateControl();
 });
 heroVideo.addEventListener('pause',updateControl);
 heroVideo.addEventListener('error',failVideo);
 source.addEventListener('error',failVideo);
 control.addEventListener('click',()=>{
  if(heroVideo.paused){userPaused=false;playVideo(true)}
  else{userPaused=true;heroVideo.pause();hero.dataset.videoState='paused'}
 });
 motion.addEventListener('change',()=>{
  if(motion.matches){heroVideo.pause();showPoster();source.removeAttribute('src');heroVideo.load();updateControl()}
  else playVideo();
 });
 // Stop decoding the background film while the hero is off screen.
 if('IntersectionObserver' in window){
  const heroObserver=new IntersectionObserver(entries=>{
   heroInView=entries[0].isIntersecting;
   if(!heroInView)heroVideo.pause();
   else if(autoplayReady||source.hasAttribute('src'))playVideo();
  });
  heroObserver.observe(hero);
 }
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden)heroVideo.pause();
  else if(autoplayReady||source.hasAttribute('src'))playVideo();
 });
 function scheduleVideo(){
  if(motion.matches||saveData)return;
  const beginPlayback=()=>{autoplayReady=true;playVideo()};
  if('requestIdleCallback' in window)window.requestIdleCallback(beginPlayback,{timeout:1200});
  else window.requestAnimationFrame(beginPlayback);
 }
 if(document.readyState==='complete')scheduleVideo();
 else window.addEventListener('load',scheduleVideo,{once:true});
}
