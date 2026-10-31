'use strict';
const toggle=document.querySelector('.menu-toggle');
const nav=document.getElementById('main-nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu')});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu')}});document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu')}})}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));document.body.classList.add('js-motion')}
// Keep inspiration categories accessible without changing the underlying gallery links.
const galleryFilters=document.querySelectorAll('[data-filter]');
const projectTiles=document.querySelectorAll('.project-tile[data-category]');
galleryFilters.forEach(button=>button.addEventListener('click',()=>{
 const category=button.dataset.filter;
 galleryFilters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 let count=0;
 projectTiles.forEach(tile=>{tile.hidden=category!=='all'&&tile.dataset.category!==category;if(!tile.hidden)count++});
 const status=document.querySelector('.gallery-status');
 if(status)status.textContent=category==='all'?`Showing all ${count} inspirations`:`Showing ${count} ${category} inspiration${count===1?'':'s'}`;
}));


// Demonstration catalogue: stable IDs and separate content fields can later map to a verified catalogue.
// No commercial data is inferred from these examples or their inspiration images.
const productCategories={plants:'Artificial Indoor Plants',trees:'Artificial Trees',planters:'Decorative Planters',hanging:'Hanging Artificial Plants',panels:'Artificial Green Wall Panels',arrangements:'Customized Botanical Arrangements'};
const productCatalog=Object.freeze([
 {id:'broad-leaf-example',category:'plants',name:'Broad-leaf Plant Concept',description:'Explore a lifelike leafy accent for a side table, living room or workspace. Ask about actual artificial plant options.',image:'leaf-detail.webp',visual:'Stock foliage inspiration; living plant shown',position:'50% 55%'},
 {id:'statement-tree-example',category:'trees',name:'Statement Tree Concept',description:'A starting point for a sculptural artificial tree arrangement. Discuss the look and placement for your interior.',image:'indoor-garden.jpg',visual:'Interior design concept; not a product photograph',position:'12% center'},
 {id:'decorative-planter-example',category:'planters',name:'Decorative Planter Concept',description:'Explore a coordinated planter direction for artificial foliage. Confirm actual designs and finishes with us.',image:'studio-plants.webp',visual:'Stock planter inspiration; living plants shown',position:'48% center'},
 {id:'trailing-greenery-example',category:'hanging',name:'Trailing Greenery Concept',description:'Consider hanging artificial foliage and cascading arrangements to soften shelves, ceilings or partitions.',image:'green-wall.jpg',visual:'Greenery design concept; not a product photograph',position:'50% 28%'},
 {id:'green-wall-example',category:'panels',name:'Green Wall Panel Concept',description:'Explore layered artificial foliage panels for a feature wall. Enquire about a product selection or an installation.',image:'green-wall.jpg',visual:'Installation design concept; not a product photograph',position:'50% 65%'},
 {id:'botanical-arrangement-example',category:'arrangements',name:'Botanical Arrangement Concept',description:'Discuss a custom combination of artificial foliage and planters for your home, business or a larger order.',image:'complete-garden.jpg',visual:'Custom design concept; not a product photograph',position:'15% center'}
]);
function productCard(product){
 const card=document.createElement('article');card.className='product-card';card.dataset.productId=product.id;card.dataset.category=product.category;
 const photo=document.createElement('div');photo.className='product-photo';
 const image=document.createElement('img');image.src='assets/images/'+product.image;image.alt=product.name+' - '+product.visual;image.loading='lazy';image.decoding='async';image.width=700;image.height=875;image.style.objectPosition=product.position;
 const badge=document.createElement('span');badge.className='demo-badge';badge.textContent='DEMONSTRATION';photo.append(image,badge);
 const content=document.createElement('div');content.className='product-copy';
 const category=document.createElement('span');category.className='product-category';category.textContent=productCategories[product.category];
 const heading=document.createElement('h3');heading.textContent=product.name;
 const visual=document.createElement('p');visual.className='product-visual';visual.textContent=product.visual;
 const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='About this example';const description=document.createElement('p');description.textContent=product.description;details.append(summary,description);
 const link=document.createElement('a');link.className='product-enquiry';link.setAttribute('aria-label','Enquire about '+product.name);link.href='contact.html?type=product&product='+encodeURIComponent(product.id)+'#contactForm';link.textContent='Enquire about this product';const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent=String.fromCharCode(8599);link.append(arrow);
 content.append(category,heading,visual,details,link);card.append(photo,content);return card;
}
document.querySelectorAll('[data-product-grid]').forEach(grid=>{
 const products=grid.hasAttribute('data-featured')?productCatalog.slice(0,3):productCatalog;
 products.forEach(product=>grid.append(productCard(product)));
});
const productFilters=document.querySelectorAll('[data-product-filter]');
function filterProducts(category,updateUrl=false){
 if(category!=='all'&&!Object.hasOwn(productCategories,category))category='all';
 productFilters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.productFilter===category)));
 let visible=0;document.querySelectorAll('.page-products .product-card').forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category;if(!card.hidden)visible++});
 const status=document.querySelector('.product-status');if(status)status.textContent=category==='all'?`Showing all ${visible} demonstration products`:`${productCategories[category]}: ${visible} demonstration product${visible===1?'':'s'}`;
 if(updateUrl){const url=new URL(window.location.href);if(category==='all')url.searchParams.delete('category');else url.searchParams.set('category',category);history.replaceState(null,'',url)}
}
if(productFilters.length){
 filterProducts(new URLSearchParams(location.search).get('category')||'all');
 productFilters.forEach(button=>button.addEventListener('click',()=>filterProducts(button.dataset.productFilter,true)));
 window.addEventListener('popstate',()=>filterProducts(new URLSearchParams(location.search).get('category')||'all'));
}
const form=document.getElementById('contactForm');
if(form){
 const params=new URLSearchParams(location.search);const enquiryType=form.elements.enquiryType;const service=form.elements.service;const product=form.elements.product;const context=document.getElementById('productContext');
 const requestedType=params.get('type');if(['product','design','bulk'].includes(requestedType))enquiryType.value=requestedType;
 function setArea(){if(enquiryType.value==='product')service.value='Product selection';else if(enquiryType.value==='bulk')service.value='Bulk / Custom Order';else service.value=''}
 setArea();enquiryType.addEventListener('change',setArea);
 const selected=productCatalog.find(item=>item.id===params.get('product'));
 if(selected){enquiryType.value='product';service.value='Product selection';product.value=selected.name;context.textContent='Selected demonstration product. Ask us about actual options and availability.'}
 const requestedService=params.get('service');if([...service.options].some(option=>option.value===requestedService))service.value=requestedService;
 form.addEventListener('submit',event=>{
  event.preventDefault();const status=document.getElementById('formStatus');
  if(!form.reportValidity()){status.textContent='Please complete the required fields correctly.';return}
  const data=new FormData(form);const type=enquiryType.selectedOptions[0].textContent;
  const subject='Casa Greens '+type+' - '+(data.get('product')||data.get('service'));
  const message=['Hello Casa Greens,','',type,'','Name: '+data.get('name'),'Phone: '+data.get('phone'),'Email: '+data.get('email'),'Product / arrangement: '+(data.get('product')||'Not specified'),'Area of interest: '+data.get('service'),'Location: '+data.get('location'),'Requirements: '+data.get('message'),'','Thank you.'].join('\n');
  status.textContent='Your email app will open with a prepared enquiry. Please choose a recipient and send it; the website has not submitted anything.';
  window.location.href='mailto:?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(message);
 });
}
