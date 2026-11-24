/**
 * Casa Greens private-sheet receiver. Deploy as owner, access Anyone.
 * Script properties: SPREADSHEET_ID, ALLOWED_ORIGINS (comma-separated HTTPS origins),
 * optional SHEET_NAME (default Enquiries). Never publish the spreadsheet.
 * Public endpoint: origin checks are browser isolation, NOT authentication.
 * Cache-based hourly limits are best-effort, not bot protection. Monitor quotas/spam.
 * No read/export endpoint; do not log payloads. No doPost/no-cors transport.
 */
const HEADERS_=['Timestamp','Enquiry ID','Customer Name','Email','Mobile','Enquiry Type','Selected Product/Service','Message','Status'];
const SERVICES_=['Product selection','Indoor Artificial Garden Design','Green Wall Installation','Vertical Garden Design','Residential Greenery Solutions','Office and Commercial Greenery','Customized Artificial Landscaping','Bulk / Custom Order','Other'];
const TYPES_={product:'Product Enquiry',design:'Design Consultation',bulk:'Bulk / Custom Order'};
function allowedOrigin_(origin){
 return typeof origin==='string'&&/^https:\/\/[^/]+$/.test(origin)&&String(PropertiesService.getScriptProperties().getProperty('ALLOWED_ORIGINS')||'').split(',').map(s=>s.trim()).includes(origin);
}
function jsonScript_(value){return JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')}
function doGet(e){
 const p=e&&e.parameter||{};
 if(!allowedOrigin_(p.origin)||!/^[0-9a-f-]{36}$/.test(p.channel||''))return HtmlService.createHtmlOutput('Enquiry connection is not configured for this site.');
 const config=jsonScript_({origin:p.origin,channel:p.channel});
 const html='<!doctype html><html><head><meta name="referrer" content="no-referrer"></head><body><script>'+
 'const config='+config+';let busy=false;'+
 'function send(data){window.top.postMessage(Object.assign({protocol:"casa-enquiry-v1",channel:config.channel},data),config.origin)}'+
 'window.addEventListener("message",function(event){const d=event.data;if(event.origin!==config.origin||event.source!==window.top||!d||d.protocol!=="casa-enquiry-v1"||d.channel!==config.channel||d.kind!=="submit"||busy)return;busy=true;const payload=d.payload;'+
 'google.script.run.withSuccessHandler(function(result){busy=false;send(Object.assign({kind:"result",requestId:payload.requestId},result))}).withFailureHandler(function(){busy=false;send({kind:"result",requestId:payload.requestId,ok:false,message:"Storage could not be confirmed. Please retry unchanged; your earlier request may have been stored."})}).submitEnquiry(payload);});'+
 'send({kind:"ready"});</script></body></html>';
 return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function text_(value,min,max){
 if(typeof value!=='string'||value.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))throw Error('VALIDATION');
 const clean=value.trim();if(clean.length<min)throw Error('VALIDATION');return clean;
}
function phoneValid_(value){
 if(!/^\+?[\d\s().-]+$/.test(value))return false;
 let digits=value.replace(/\D/g,'');
 if(value.startsWith('+91')||value.startsWith('0091'))return /^[6-9]\d{9}$/.test(digits.replace(/^(0091|91)/,''));
 if(!value.startsWith('+')){if(/^0[6-9]\d{9}$/.test(digits))digits=digits.slice(1);return /^[6-9]\d{9}$/.test(digits)}
 return /^\+[1-9][0-9]{7,14}$/.test('+'+digits)&&value.indexOf('+',1)===-1;
}
// Prefix dangerous leading characters after whitespace; preserve phone numbers as text too.
function sheetText_(value){return /^[\s]*[=+\-@]/.test(value)?"'"+value:value}
function validate_(p){
 if(!p||typeof p!=='object'||Array.isArray(p)||!allowedOrigin_(p.origin))throw Error('VALIDATION');
 if(typeof p.website!=='string'||p.website.length>200||p.website.trim())throw Error('SPAM');
 if(typeof p.startedAt!=='number'||!Number.isFinite(p.startedAt)||Date.now()-p.startedAt<2500||Date.now()-p.startedAt>86400000)throw Error('SPAM');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(p.requestId||''))throw Error('VALIDATION');
 const name=text_(p.name,2,80),email=text_(p.email,3,254),phone=text_(p.phone,7,24),product=text_(p.product,0,160),service=text_(p.service,1,100),location=text_(p.location,0,120),message=text_(p.message,10,2000);
 if(!Object.prototype.hasOwnProperty.call(TYPES_,p.enquiryType)||!SERVICES_.includes(service)||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!phoneValid_(phone))throw Error('VALIDATION');
 return {id:'CG-'+p.requestId,values:[name,email,phone,TYPES_[p.enquiryType],[service,product].filter(Boolean).join(' / '),message+(location?'\n\nLocation / project city: '+location:'')].map(sheetText_)};
}
function submitEnquiry(payload){
 let lock;
 try{
  const data=validate_(payload),props=PropertiesService.getScriptProperties(),spreadsheetId=props.getProperty('SPREADSHEET_ID');
  if(!spreadsheetId)throw Error('CONFIG');
  lock=LockService.getScriptLock();if(!lock.tryLock(15000))throw Error('BUSY');
  const book=SpreadsheetApp.openById(spreadsheetId),name=props.getProperty('SHEET_NAME')||'Enquiries';
  const sheet=book.getSheetByName(name)||book.insertSheet(name);
  if(sheet.getLastRow()===0)sheet.appendRow(HEADERS_);
  if(JSON.stringify(sheet.getRange(1,1,1,9).getValues()[0])!==JSON.stringify(HEADERS_))throw Error('CONFIG');
  const last=sheet.getLastRow();
  if(last>1){
   const match=sheet.getRange(2,2,last-1,1).createTextFinder(data.id).matchEntireCell(true).findNext();
   if(match){
    // A retry may only acknowledge the identical stored payload; never return customer data.
    const stored=sheet.getRange(match.getRow(),3,1,6).getDisplayValues()[0];
    const normal=v=>String(v).replace(/^'(?=[\s]*[=+\-@])/,'');
    if(JSON.stringify(stored.map(normal))!==JSON.stringify(data.values.map(normal)))throw Error('VALIDATION');
    return {ok:true,enquiryId:data.id};
   }
  }
  // Best-effort rate limits, serialized under the same lock. Cache may evict early.
  const cache=CacheService.getScriptCache(),hour=Math.floor(Date.now()/3600000);
  const digest=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,payload.email.trim().toLowerCase());
  const key='email:'+hour+':'+Utilities.base64EncodeWebSafe(digest),global='total:'+hour;
  const per=Number(cache.get(key)||0),total=Number(cache.get(global)||0);
  if(per>=5||total>=100)throw Error('RATE');
  cache.put(key,String(per+1),3600);cache.put(global,String(total+1),3600);
  const row=sheet.getRange(sheet.getLastRow()+1,1,1,9);
  row.setNumberFormats([['yyyy-mm-dd hh:mm:ss','@','@','@','@','@','@','@','@']]);
  row.setValues([[new Date(),data.id].concat(data.values,['New'])]);SpreadsheetApp.flush();
  return {ok:true,enquiryId:data.id};
 }catch(error){
  const code=String(error&&error.message);
  const messages={VALIDATION:'Please check your enquiry details and try again.',SPAM:'Unable to accept this enquiry. Please wait a moment and try again.',RATE:'Too many enquiries right now. Please try again later.',BUSY:'The enquiry service is busy. Please retry unchanged.',CONFIG:'Online enquiries are temporarily unavailable. Your details have not been confirmed as stored.'};
  // Fixed categories only: no payload, email, sheet ID, request ID or exception text in logs.
  console.warn('Casa Greens enquiry failure: '+(Object.prototype.hasOwnProperty.call(messages,code)?code:'STORAGE'));
  return {ok:false,message:messages[code]||'Storage could not be confirmed. Please retry unchanged; the earlier request may have been stored.'};
 }finally{if(lock&&lock.hasLock())lock.releaseLock()}
}
