(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const STORAGE_KEY = "athanasQrProjectsV1";
  const SETTINGS_KEY = "athanasQrDraftV1";
  const MAX_PROJECTS = 30;

  const typeSchemas = {
    website: {
      label: "Website Link", icon: "🔗", note: "Open a website, lesson, form, video, or online resource.",
      fields: [
        { id: "url", label: "Website address", type: "url", placeholder: "https://athanasinspires.com", full: true, required: true, help: "Include the complete destination. We will add https:// when needed." }
      ]
    },
    text: {
      label: "Plain Text", icon: "📝", note: "Share a message, instruction, code, or short note.",
      fields: [{ id: "text", label: "Text to encode", type: "textarea", placeholder: "Type the message visitors should see...", full: true, required: true }]
    },
    phone: {
      label: "Phone Number", icon: "📞", note: "Let scanners call a phone number immediately.",
      fields: [
        { id: "phone", label: "Phone number", type: "tel", placeholder: "+255 695 110 859", required: true },
        { id: "phoneLabel", label: "Display label", type: "text", placeholder: "Call Athanas Inspires" }
      ]
    },
    email: {
      label: "Email", icon: "✉️", note: "Start a prepared email with recipient, subject, and message.",
      fields: [
        { id: "email", label: "Recipient email", type: "email", placeholder: "info@example.com", required: true },
        { id: "subject", label: "Subject", type: "text", placeholder: "Learning support" },
        { id: "emailBody", label: "Message", type: "textarea", placeholder: "Hello, I would like to...", full: true }
      ]
    },
    whatsapp: {
      label: "WhatsApp", icon: "💬", note: "Open a WhatsApp chat with an optional prepared message.",
      fields: [
        { id: "whatsapp", label: "WhatsApp number", type: "tel", placeholder: "255695110859", required: true, help: "Use country code and number only." },
        { id: "whatsappMessage", label: "Prepared message", type: "textarea", placeholder: "Hello, I found you through the QR code...", full: true }
      ]
    },
    wifi: {
      label: "Wi-Fi", icon: "📶", note: "Help visitors connect without typing the network password.",
      fields: [
        { id: "ssid", label: "Network name (SSID)", type: "text", placeholder: "School Wi-Fi", required: true },
        { id: "wifiPassword", label: "Password", type: "text", placeholder: "Enter Wi-Fi password" },
        { id: "wifiSecurity", label: "Security", type: "select", options: [["WPA","WPA / WPA2"],["WEP","WEP"],["nopass","No password"]] },
        { id: "wifiHidden", label: "Hidden network", type: "select", options: [["false","No"],["true","Yes"]] }
      ]
    },
    contact: {
      label: "Contact Card", icon: "👤", note: "Save a person or organisation directly to contacts.",
      fields: [
        { id: "firstName", label: "First name", type: "text", placeholder: "Athanas", required: true },
        { id: "lastName", label: "Last name", type: "text", placeholder: "Inspires" },
        { id: "organisation", label: "Organisation", type: "text", placeholder: "Athanas Inspires" },
        { id: "jobTitle", label: "Role or title", type: "text", placeholder: "Teacher & Mentor" },
        { id: "contactPhone", label: "Phone", type: "tel", placeholder: "+255..." },
        { id: "contactEmail", label: "Email", type: "email", placeholder: "name@example.com" },
        { id: "contactWebsite", label: "Website", type: "url", placeholder: "https://...", full: true },
        { id: "contactAddress", label: "Address", type: "text", placeholder: "Town, region, country", full: true }
      ]
    },
    sms: {
      label: "SMS", icon: "📱", note: "Open a text message with a number and prepared wording.",
      fields: [
        { id: "smsPhone", label: "Phone number", type: "tel", placeholder: "+255...", required: true },
        { id: "smsMessage", label: "Message", type: "textarea", placeholder: "Type the prepared SMS...", full: true }
      ]
    },
    location: {
      label: "Location", icon: "📍", note: "Open precise coordinates in the scanner's map application.",
      fields: [
        { id: "latitude", label: "Latitude", type: "number", placeholder: "-3.707" , required: true, step: "any"},
        { id: "longitude", label: "Longitude", type: "number", placeholder: "36.463", required: true, step: "any" },
        { id: "locationLabel", label: "Location label", type: "text", placeholder: "Athanas Inspires", full: true }
      ]
    },
    social: {
      label: "Social Media", icon: "🌐", note: "Send visitors to a social profile, channel, group, or page.",
      fields: [
        { id: "socialPlatform", label: "Platform", type: "select", options: [["youtube","YouTube"],["facebook","Facebook"],["instagram","Instagram"],["linkedin","LinkedIn"],["tiktok","TikTok"],["x","X / Twitter"],["telegram","Telegram"],["other","Other"]] },
        { id: "socialUrl", label: "Profile or page link", type: "url", placeholder: "https://...", required: true },
        { id: "socialLabel", label: "Display label", type: "text", placeholder: "Follow Athanas Inspires", full: true }
      ]
    },
    payment: {
      label: "Payment", icon: "💳", note: "Share a verified payment link or clearly written payment instructions.",
      warning: "This QR code only stores the information you enter. Always verify the recipient, amount, and payment provider before paying.",
      fields: [
        { id: "paymentPurpose", label: "Purpose", type: "select", options: [["donation","Donation"],["school-fees","School fees"],["church-giving","Church giving"],["event","Event payment"],["business","Business payment"],["other","Other"]] },
        { id: "paymentLink", label: "Payment link (optional)", type: "url", placeholder: "https://secure-payment-link.example", full: true },
        { id: "recipientName", label: "Recipient or organisation", type: "text", placeholder: "Verified recipient", required: true },
        { id: "amount", label: "Amount (optional)", type: "text", placeholder: "e.g. TSh 10,000" },
        { id: "reference", label: "Reference", type: "text", placeholder: "Invoice, pupil, or event reference" },
        { id: "paymentInstructions", label: "Payment instructions", type: "textarea", placeholder: "Provider, account/till number, and verification instructions...", full: true }
      ]
    }
  };

  const templates = {
    classic: { name: "Classic", desc: "Strong and universal", fg: "#06183a", bg: "#ffffff", accent: "#f6c928", dots: "square", corners: "square", title: "SCAN TO OPEN", cta: "SCAN NOW" },
    premium: { name: "Athanas Premium", desc: "Signature navy and gold", fg: "#06183a", bg: "#ffffff", accent: "#f6c928", dots: "rounded", corners: "extra-rounded", title: "DISCOVER MORE", cta: "SCAN & EXPLORE" },
    business: { name: "Business", desc: "Clean corporate style", fg: "#0b2d5c", bg: "#ffffff", accent: "#2d6fc1", dots: "classy-rounded", corners: "extra-rounded", title: "CONNECT WITH US", cta: "SCAN TO CONNECT" },
    school: { name: "School", desc: "Bright learning design", fg: "#083d77", bg: "#ffffff", accent: "#ffcc33", dots: "rounded", corners: "dot", title: "LEARN MORE", cta: "SCAN FOR DETAILS" },
    church: { name: "Church", desc: "Warm faith setting", fg: "#35245d", bg: "#fffdf8", accent: "#d9ad46", dots: "classy", corners: "extra-rounded", title: "GROW IN FAITH", cta: "SCAN TO CONTINUE" },
    event: { name: "Event", desc: "Bold and energetic", fg: "#171738", bg: "#ffffff", accent: "#ff5f57", dots: "dots", corners: "extra-rounded", title: "YOU ARE INVITED", cta: "SCAN FOR EVENT INFO" },
    wifi: { name: "Wi-Fi", desc: "Fast connection card", fg: "#083344", bg: "#ffffff", accent: "#22c1c3", dots: "rounded", corners: "extra-rounded", title: "CONNECT TO WI-FI", cta: "SCAN TO JOIN" },
    whatsapp: { name: "WhatsApp", desc: "Ready for conversations", fg: "#075e54", bg: "#ffffff", accent: "#25d366", dots: "rounded", corners: "extra-rounded", title: "CHAT WITH US", cta: "SCAN FOR WHATSAPP" },
    payment: { name: "Payment", desc: "Clear and trustworthy", fg: "#12213d", bg: "#ffffff", accent: "#2e9d67", dots: "square", corners: "extra-rounded", title: "PAY SECURELY", cta: "SCAN TO VIEW DETAILS" },
    festive: { name: "Celebration", desc: "Seasonal bright theme", fg: "#742774", bg: "#fffafd", accent: "#ffb703", dots: "dots", corners: "dot", title: "CELEBRATE WITH US", cta: "SCAN TO OPEN" }
  };

  const defaultState = {
    type: "website",
    values: { url: "https://athanasinspires.com" },
    style: { fg: "#06183a", bg: "#ffffff", accent: "#f6c928", dots: "rounded", corners: "extra-rounded", size: 900, margin: 18, errorLevel: "H", logoSize: 28, logoMargin: 5, logoData: "" },
    poster: { title: "DISCOVER ATHANAS INSPIRES", message: "Practical learning, useful tools, faith, and personal growth.", cta: "SCAN TO EXPLORE", footer: "athanasinspires.com", branded: true, layout: "poster" },
    template: "premium"
  };

  let state = JSON.parse(JSON.stringify(defaultState));
  let qrCode = null;
  let renderTimer = null;
  let cameraStream = null;
  let scanFrame = null;
  let cameraBusy = false;
  let bulkRows = [];

  const dom = {};

  function clone(obj){ return JSON.parse(JSON.stringify(obj)); }
  function escapeHtml(value=""){ return String(value).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }
  function safeFileName(value="qr-code"){ return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,55) || "qr-code"; }
  function cleanPhone(value=""){ return value.replace(/[^\d+]/g,"").replace(/^\+/,""); }
  function ensureUrl(value=""){ const v=value.trim(); if(!v) return ""; return /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`; }
  function wifiEscape(value=""){ return String(value).replace(/([\\;,:"])/g,"\\$1"); }

  function init(){
    Object.assign(dom, {
      typePicker: $("#qrTypePicker"), form: $("#qrDynamicFields"), typeTitle: $("#qrSelectedTypeTitle"), typeNote: $("#qrSelectedTypeNote"),
      mount: $("#qrCodeMount"), poster: $("#qrPosterPreview"), posterTitle: $("#qrPosterTitlePreview"), posterMessage: $("#qrPosterMessagePreview"), posterCta: $("#qrPosterCtaPreview"), posterFooter: $("#qrPosterFooterPreview"), posterBrand: $("#qrPosterBrand"),
      libraryWarning: $("#qrLibraryWarning"), scoreRing: $("#qrScoreRing"), scoreNumber: $("#qrScoreNumber"), scoreMeter: $("#qrScoreMeter"), scoreStatus: $("#qrScoreStatus"), scoreList: $("#qrScoreList"),
      projectList: $("#qrProjectList"), bulkList: $("#qrBulkList"), toast: $("#qrToast")
    });

    try{
      const draft = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
      if(draft && draft.type) state = mergeState(defaultState, draft);
    }catch(e){}

    renderTypeCards();
    renderDynamicFields();
    bindStaticControls();
    syncControlsFromState();
    renderTemplates();
    renderProjects();
    updatePosterText();
    initializeQr();
    renderBulkList();
    updateScore();
  }

  function mergeState(base, incoming){
    return { ...clone(base), ...incoming, values:{...base.values,...(incoming.values||{})}, style:{...base.style,...(incoming.style||{})}, poster:{...base.poster,...(incoming.poster||{})} };
  }

  function renderTypeCards(){
    dom.typePicker.innerHTML = Object.entries(typeSchemas).map(([id,schema]) => `
      <button type="button" class="qr-type-card ${state.type===id?"is-active":""}" data-qr-type="${id}" aria-pressed="${state.type===id}">
        <span class="qr-type-icon" aria-hidden="true">${schema.icon}</span><strong>${escapeHtml(schema.label)}</strong><small>${escapeHtml(schema.note.split(".")[0])}</small>
      </button>`).join("");
    $$('[data-qr-type]',dom.typePicker).forEach(btn=>btn.addEventListener("click",()=>selectType(btn.dataset.qrType)));
  }

  function selectType(type){
    if(!typeSchemas[type]) return;
    state.type=type;
    if(!state.values) state.values={};
    const suggestions={wifi:"wifi",whatsapp:"whatsapp",payment:"payment",contact:"business",social:"premium"};
    if(suggestions[type]) applyTemplate(suggestions[type], false);
    renderTypeCards();
    renderDynamicFields();
    scheduleUpdate();
  }

  function fieldHtml(field){
    const value = state.values[field.id] ?? "";
    const attrs = `id="qr_${field.id}" data-qr-field="${field.id}" ${field.required?"required":""} ${field.step?`step="${field.step}"`:""}`;
    let control="";
    if(field.type==="textarea") control=`<textarea class="qr-textarea" ${attrs} placeholder="${escapeHtml(field.placeholder||"")}">${escapeHtml(value)}</textarea>`;
    else if(field.type==="select") control=`<select class="qr-select" ${attrs}>${field.options.map(([v,l])=>`<option value="${escapeHtml(v)}" ${String(value||field.options[0][0])===v?"selected":""}>${escapeHtml(l)}</option>`).join("")}</select>`;
    else control=`<input class="qr-input" type="${field.type||"text"}" ${attrs} value="${escapeHtml(value)}" placeholder="${escapeHtml(field.placeholder||"")}">`;
    return `<div class="qr-field ${field.full?"full":""}"><label for="qr_${field.id}">${escapeHtml(field.label)}${field.required?' <span aria-hidden="true">*</span>':""}</label>${control}${field.help?`<small>${escapeHtml(field.help)}</small>`:""}</div>`;
  }

  function renderDynamicFields(){
    const schema=typeSchemas[state.type];
    dom.typeTitle.textContent=schema.label;
    dom.typeNote.textContent=schema.note;
    dom.form.innerHTML = `<div class="qr-field-grid">${schema.fields.map(fieldHtml).join("")}</div>${schema.warning?`<div class="qr-disclaimer" style="margin-top:15px;color:#694800;background:#fff7dc;border-color:#efd06f"><span aria-hidden="true">⚠</span><div><strong style="color:#553900">Payment safety</strong><br>${escapeHtml(schema.warning)}</div></div>`:""}`;
    $$('[data-qr-field]',dom.form).forEach(input=>{
      input.addEventListener("input",()=>{state.values[input.dataset.qrField]=input.value;scheduleUpdate();});
      input.addEventListener("change",()=>{state.values[input.dataset.qrField]=input.value;scheduleUpdate();});
    });
  }

  function bindStaticControls(){
    $$(".qr-accordion-toggle").forEach(btn=>btn.addEventListener("click",()=>{
      const item=btn.closest(".qr-accordion"); item.classList.toggle("is-open"); btn.setAttribute("aria-expanded",String(item.classList.contains("is-open")));
    }));

    const controlMap={
      qrForeground:["style","fg"],qrBackground:["style","bg"],qrAccent:["style","accent"],qrDots:["style","dots"],qrCorners:["style","corners"],qrSize:["style","size"],qrMargin:["style","margin"],qrErrorLevel:["style","errorLevel"],qrLogoSize:["style","logoSize"],qrLogoMargin:["style","logoMargin"],
      qrPosterTitle:["poster","title"],qrPosterMessage:["poster","message"],qrPosterCta:["poster","cta"],qrPosterFooter:["poster","footer"],qrBrandMode:["poster","branded"],qrLayout:["poster","layout"]
    };
    Object.entries(controlMap).forEach(([id,[group,key]])=>{
      const input=$("#"+id); if(!input) return;
      const handler=()=>{
        let value=input.value;
        if(id==="qrBrandMode") value=value==="branded";
        if(["size","margin","logoSize","logoMargin"].includes(key)) value=Number(value);
        state[group][key]=value;
        const output=$(`[data-range-output="${id}"]`); if(output) output.textContent=id==="qrSize"?`${value}px`:id==="qrLogoSize"?`${value}%`:String(value);
        updatePosterText(); scheduleUpdate();
      };
      input.addEventListener("input",handler); input.addEventListener("change",handler);
    });

    $("#qrLogoInput").addEventListener("change",handleLogo);
    $("#qrRemoveLogo").addEventListener("click",()=>{state.style.logoData="";syncLogoPreview();scheduleUpdate();});
    $("#qrResetBtn").addEventListener("click",resetBuilder);
    $("#qrDownloadPng").addEventListener("click",()=>downloadPoster("png"));
    $("#qrDownloadJpg").addEventListener("click",()=>downloadPoster("jpeg"));
    $("#qrDownloadSvg").addEventListener("click",downloadSvg);
    $("#qrDownloadPdf").addEventListener("click",downloadPdf);
    $("#qrPrintBtn").addEventListener("click",printPoster);
    $("#qrTestBtn").addEventListener("click",testGeneratedCode);
    $("#qrCameraBtn").addEventListener("click",openScanner);
    $("#qrScanUpload").addEventListener("change",scanUploadedImage);
    $("#qrScannerClose").addEventListener("click",closeScanner);
    $("#qrScannerModal").addEventListener("click",e=>{if(e.target.id==="qrScannerModal")closeScanner();});
    $("#qrSaveProject").addEventListener("click",saveProject);
    $("#qrProjectName").addEventListener("keydown",e=>{if(e.key==="Enter")saveProject();});
    $("#qrBulkFile").addEventListener("change",handleBulkFile);
    $("#qrParseBulk").addEventListener("click",parseBulkTextarea);
    $("#qrDownloadBulkZip").addEventListener("click",downloadBulkZip);
    $("#qrDownloadBulkPdf").addEventListener("click",downloadBulkPdf);
    $("#qrClearBulk").addEventListener("click",()=>{bulkRows=[];$("#qrBulkText").value="";renderBulkList();});
    window.addEventListener("beforeunload",saveDraft);
  }

  function syncControlsFromState(){
    const values={qrForeground:state.style.fg,qrBackground:state.style.bg,qrAccent:state.style.accent,qrDots:state.style.dots,qrCorners:state.style.corners,qrSize:state.style.size,qrMargin:state.style.margin,qrErrorLevel:state.style.errorLevel,qrLogoSize:state.style.logoSize,qrLogoMargin:state.style.logoMargin,qrPosterTitle:state.poster.title,qrPosterMessage:state.poster.message,qrPosterCta:state.poster.cta,qrPosterFooter:state.poster.footer,qrBrandMode:state.poster.branded?"branded":"neutral",qrLayout:state.poster.layout};
    Object.entries(values).forEach(([id,value])=>{const el=$("#"+id);if(el)el.value=value;const out=$(`[data-range-output="${id}"]`);if(out)out.textContent=id==="qrSize"?`${value}px`:id==="qrLogoSize"?`${value}%`:String(value);});
    syncLogoPreview();
  }

  function renderTemplates(){
    const root=$("#qrTemplateGrid");
    root.innerHTML=Object.entries(templates).map(([id,t])=>`<button type="button" class="qr-template-btn ${state.template===id?"is-active":""}" data-template="${id}"><span class="qr-template-swatch"><i style="background:${t.fg}"></i><i style="background:${t.bg}"></i><i style="background:${t.accent}"></i></span><strong>${escapeHtml(t.name)}</strong><small>${escapeHtml(t.desc)}</small></button>`).join("");
    $$('[data-template]',root).forEach(btn=>btn.addEventListener("click",()=>applyTemplate(btn.dataset.template,true)));
  }

  function applyTemplate(id, announce=true){
    const t=templates[id]; if(!t)return;
    Object.assign(state.style,{fg:t.fg,bg:t.bg,accent:t.accent,dots:t.dots,corners:t.corners});
    Object.assign(state.poster,{title:t.title,cta:t.cta});
    state.template=id;
    syncControlsFromState(); renderTemplates(); updatePosterText(); scheduleUpdate();
    if(announce) toast(`${t.name} template applied.`,"success");
  }

  function handleLogo(event){
    const file=event.target.files?.[0]; if(!file)return;
    if(!file.type.startsWith("image/")){toast("Please choose an image file.","error");return;}
    if(file.size>2.5*1024*1024){toast("Choose a logo smaller than 2.5 MB.","warning");return;}
    const reader=new FileReader(); reader.onload=()=>{state.style.logoData=String(reader.result);syncLogoPreview();scheduleUpdate();}; reader.readAsDataURL(file);
  }

  function syncLogoPreview(){
    const box=$("#qrLogoPreview"),img=$("#qrLogoImage");
    if(state.style.logoData){img.src=state.style.logoData;box.classList.add("is-visible");}else{img.removeAttribute("src");box.classList.remove("is-visible");}
  }

  function buildData(){
    const v=state.values||{};
    switch(state.type){
      case "website": return ensureUrl(v.url||"");
      case "text": return v.text||"";
      case "phone": return v.phone?`tel:${v.phone.replace(/\s+/g,"")}`:"";
      case "email": return v.email?`mailto:${v.email}?subject=${encodeURIComponent(v.subject||"")}&body=${encodeURIComponent(v.emailBody||"")}`:"";
      case "whatsapp": {const p=cleanPhone(v.whatsapp||"");return p?`https://wa.me/${p}${v.whatsappMessage?`?text=${encodeURIComponent(v.whatsappMessage)}`:""}`:"";}
      case "wifi": return v.ssid?`WIFI:T:${wifiEscape(v.wifiSecurity||"WPA")};S:${wifiEscape(v.ssid)};P:${wifiEscape(v.wifiPassword||"")};H:${v.wifiHidden||"false"};;`:"";
      case "contact": return v.firstName?[
        "BEGIN:VCARD","VERSION:3.0",`N:${v.lastName||""};${v.firstName||""};;;`,`FN:${[v.firstName,v.lastName].filter(Boolean).join(" ")}`,
        v.organisation?`ORG:${v.organisation}`:"",v.jobTitle?`TITLE:${v.jobTitle}`:"",v.contactPhone?`TEL;TYPE=CELL:${v.contactPhone}`:"",v.contactEmail?`EMAIL:${v.contactEmail}`:"",v.contactWebsite?`URL:${ensureUrl(v.contactWebsite)}`:"",v.contactAddress?`ADR:;;${v.contactAddress};;;;`:"","END:VCARD"
      ].filter(Boolean).join("\n"):"";
      case "sms": return v.smsPhone?`SMSTO:${v.smsPhone}:${v.smsMessage||""}`:"";
      case "location": return (v.latitude&&v.longitude)?`geo:${v.latitude},${v.longitude}${v.locationLabel?`?q=${v.latitude},${v.longitude}(${encodeURIComponent(v.locationLabel)})`:""}`:"";
      case "social": return ensureUrl(v.socialUrl||"");
      case "payment": return v.paymentLink?ensureUrl(v.paymentLink):["PAYMENT DETAILS",`Purpose: ${v.paymentPurpose||"Payment"}`,`Recipient: ${v.recipientName||""}`,v.amount?`Amount: ${v.amount}`:"",v.reference?`Reference: ${v.reference}`:"",v.paymentInstructions?`Instructions: ${v.paymentInstructions}`:"","Verify all details before paying."].filter(Boolean).join("\n");
      default:return "";
    }
  }

  function initializeQr(){
    if(typeof window.QRCodeStyling!=="function"){
      dom.libraryWarning.classList.add("is-visible");
      dom.libraryWarning.textContent="The QR engine could not load. Check your internet connection, then refresh the page.";
      return;
    }
    dom.libraryWarning.classList.remove("is-visible");
    qrCode=new window.QRCodeStyling(getQrOptions());
    dom.mount.innerHTML="";
    qrCode.append(dom.mount);
    setTimeout(updateScore,450);
  }

  function getQrOptions(dataOverride){
    const data=(dataOverride ?? buildData()) || "https://athanasinspires.com";
    // Finder-pattern centres must remain dark enough to scan. Decorative accent
    // colours are used only when they retain strong contrast with the background.
    const safeCornerColour=contrast(state.style.accent,state.style.bg)>=3.5?state.style.accent:state.style.fg;
    return {
      width:state.style.size,height:state.style.size,type:"canvas",data,margin:state.style.margin,
      qrOptions:{errorCorrectionLevel:state.style.errorLevel},
      dotsOptions:{color:state.style.fg,type:state.style.dots},
      backgroundOptions:{color:state.style.bg},
      cornersSquareOptions:{color:state.style.fg,type:state.style.corners},
      cornersDotOptions:{color:safeCornerColour,type:state.style.corners==="square"?"square":"dot"},
      image:state.style.logoData||undefined,
      imageOptions:{hideBackgroundDots:true,imageSize:Math.min(.4,state.style.logoSize/100),margin:state.style.logoMargin,crossOrigin:"anonymous",saveAsBlob:true}
    };
  }

  function scheduleUpdate(){
    clearTimeout(renderTimer); renderTimer=setTimeout(updateQr,90); saveDraft();
  }

  function updateQr(){
    updatePosterText();
    if(!qrCode){initializeQr();return;}
    try{qrCode.update(getQrOptions());setTimeout(updateScore,300);}catch(error){toast("The QR preview could not update. Try shorter content.","error");}
  }

  function updatePosterText(){
    dom.posterTitle.textContent=state.poster.title||"SCAN TO OPEN";
    dom.posterMessage.textContent=state.poster.message||"";
    dom.posterCta.textContent=state.poster.cta||"SCAN NOW";
    dom.posterFooter.textContent=state.poster.footer||"";
    dom.poster.classList.toggle("is-neutral",!state.poster.branded);
    dom.poster.style.setProperty("--poster-accent",state.style.accent);
    dom.poster.style.setProperty("--poster-text",state.style.fg);
    const ratios={poster:"4 / 5",square:"1 / 1",story:"9 / 16",business:"1.75 / 1",table:"1.42 / 1",badge:"3 / 4",label:"1.6 / 1",church:"4 / 5"};
    dom.poster.style.aspectRatio=ratios[state.poster.layout]||"4 / 5";
  }

  function hexToRgb(hex){let h=hex.replace("#","");if(h.length===3)h=h.split("").map(x=>x+x).join("");const n=parseInt(h,16);return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};}
  function luminance(hex){const {r,g,b}=hexToRgb(hex);const vals=[r,g,b].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*vals[0]+.7152*vals[1]+.0722*vals[2];}
  function contrast(a,b){const l1=luminance(a),l2=luminance(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);}

  function updateScore(){
    let score=100; const notes=[]; const data=buildData(); const cr=contrast(state.style.fg,state.style.bg);
    if(cr>=7) notes.push(["pass",`Excellent colour contrast (${cr.toFixed(1)}:1).`]);
    else if(cr>=4.5){score-=8;notes.push(["warn",`Good contrast, but darker is safer (${cr.toFixed(1)}:1).`]);}
    else{score-=30;notes.push(["fail",`Low contrast (${cr.toFixed(1)}:1). Darken the QR colour.`]);}
    if(state.style.margin>=14)notes.push(["pass","Clear quiet zone around the code."]);else if(state.style.margin>=8){score-=7;notes.push(["warn","Increase margin for easier scanning."]);}else{score-=18;notes.push(["fail","Quiet zone is too narrow."]);}
    if(state.style.logoData){
      if(state.style.logoSize<=30)notes.push(["pass","Logo coverage is within a safe range."]);else{score-=15;notes.push(["warn","Reduce the centre logo below 30%."]);}
      if(["Q","H"].includes(state.style.errorLevel))notes.push(["pass","Strong error correction supports the logo."]);else{score-=15;notes.push(["fail","Use Q or H error correction with a logo."]);}
    }else notes.push(["pass","No centre logo blocking QR modules."]);
    if(data.length<=180)notes.push(["pass","Low data density for reliable scanning."]);else if(data.length<=500){score-=6;notes.push(["warn","Medium data density; test before printing."]);}else{score-=17;notes.push(["warn","High data density; shorten the content when possible."]);}
    if(!data){score=20;notes.unshift(["fail","Enter the required QR content."]);}

    const canvas=$("canvas",dom.mount);
    if(canvas && typeof window.jsQR==="function" && data){
      try{const ctx=canvas.getContext("2d",{willReadFrequently:true});const img=ctx.getImageData(0,0,canvas.width,canvas.height);const found=window.jsQR(img.data,img.width,img.height,{inversionAttempts:"attemptBoth"});if(found)notes.push(["pass","Generated code passed the browser scan test."]);else{score-=12;notes.push(["warn","Automatic scan was uncertain; use the Test button."]);}}catch(e){}
    }
    score=Math.max(0,Math.min(100,score));
    const color=score>=85?"#1f9d63":score>=65?"#c48a00":"#c0392b";
    dom.scoreRing.style.setProperty("--score",score);dom.scoreRing.style.setProperty("--score-color",color);
    dom.scoreMeter.style.setProperty("--score",`${score}%`);dom.scoreMeter.style.setProperty("--score-color",color);dom.scoreNumber.textContent=score;
    dom.scoreStatus.textContent=score>=85?"Ready to scan":score>=65?"Review warnings":"Needs attention";
    dom.scoreStatus.className=`qr-score-status ${score>=85?"":score>=65?"warning":"danger"}`;
    dom.scoreList.innerHTML=notes.slice(0,6).map(([kind,text])=>`<li class="${kind==='pass'?'':kind}">${escapeHtml(text)}</li>`).join("");
  }

  function canvasLayout(){
    const layouts={poster:[1200,1500],square:[1200,1200],story:[1080,1920],business:[1050,600],table:[1200,850],badge:[900,1200],label:[1200,750],church:[1200,1500]};
    return layouts[state.poster.layout]||layouts.poster;
  }

  async function createPosterCanvas(dataOverride=null, titleOverride=null){
    const [w,h]=canvasLayout(); const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;const ctx=canvas.getContext("2d");
    ctx.fillStyle="#ffffff";ctx.fillRect(0,0,w,h);
    ctx.fillStyle=state.style.accent;ctx.fillRect(0,0,w,Math.max(18,h*.014));
    ctx.strokeStyle=state.style.accent;ctx.lineWidth=Math.max(12,w*.012);ctx.strokeRect(ctx.lineWidth/2,ctx.lineWidth/2,w-ctx.lineWidth,h-ctx.lineWidth);
    const branded=state.poster.branded,landscape=w/h>1.24;
    if(branded){
      const logoSize=Math.max(50,Math.min(76,w*.065));
      try{const logo=await loadImage("assets/images/logo-320.png");ctx.drawImage(logo,w*.055,h*.055,logoSize,logoSize);}catch(e){}
      ctx.fillStyle=state.style.fg;ctx.font=`900 ${Math.round(w*(landscape?.025:.027))}px Arial`;ctx.textAlign="left";ctx.fillText("ATHANAS INSPIRES",w*.055+logoSize+18,h*.083);
      ctx.font=`600 ${Math.round(w*(landscape?.013:.015))}px Arial`;ctx.fillStyle=mixHex(state.style.fg,"#ffffff",.38);ctx.fillText("Learning & Personal Growth Platform",w*.055+logoSize+18,h*.112);
    }
    const temp=document.createElement("div");temp.style.position="fixed";temp.style.left="-9999px";document.body.appendChild(temp);
    const side=Math.round(landscape?Math.min(h*.62,w*.36):Math.min(w*.58,h*.43));
    const tempQr=new window.QRCodeStyling({...getQrOptions(dataOverride||undefined),width:side,height:side});tempQr.append(temp);await wait(170);
    const qrCanvas=$("canvas",temp);const title=titleOverride||state.poster.title||"SCAN TO OPEN";
    if(landscape){
      const qx=Math.round(w*.07),qy=Math.round((h-side)/2+.035*h),textX=Math.round(w*.65),textWidth=Math.round(w*.5);
      if(qrCanvas){ctx.fillStyle="#fff";roundRect(ctx,qx-17,qy-17,side+34,side+34,22,true,false);ctx.drawImage(qrCanvas,qx,qy,side,side);}
      ctx.textAlign="center";ctx.fillStyle=state.style.fg;ctx.font=`900 ${Math.round(w*.046)}px Arial`;drawWrappedText(ctx,title,textX,h*.28,textWidth,Math.round(w*.052),3);
      ctx.fillStyle=mixHex(state.style.fg,"#ffffff",.35);ctx.font=`500 ${Math.round(w*.021)}px Arial`;drawWrappedText(ctx,state.poster.message||"",textX,h*.43,textWidth,Math.round(w*.031),4);
      const bw=w*.4,bh=h*.085,bx=textX-bw/2,by=h*.66;ctx.fillStyle=state.style.accent;roundRect(ctx,bx,by,bw,bh,bh/2,true,false);ctx.fillStyle="#06183a";ctx.font=`900 ${Math.round(w*.022)}px Arial`;ctx.textBaseline="middle";ctx.fillText(state.poster.cta||"SCAN NOW",textX,by+bh/2);
      ctx.textBaseline="alphabetic";ctx.fillStyle=mixHex(state.style.fg,"#ffffff",.38);ctx.font=`600 ${Math.round(w*.017)}px Arial`;drawWrappedText(ctx,state.poster.footer||"",textX,h*.88,textWidth,Math.round(w*.025),2);
    }else{
      ctx.textAlign="center";ctx.fillStyle=state.style.fg;ctx.font=`900 ${Math.round(w*.052)}px Arial`;
      const titleY=branded?h*.19:h*.1;drawWrappedText(ctx,title,w/2,titleY,w*.82,Math.round(w*.06),2);
      ctx.fillStyle=mixHex(state.style.fg,"#ffffff",.35);ctx.font=`500 ${Math.round(w*.023)}px Arial`;drawWrappedText(ctx,state.poster.message||"",w/2,titleY+h*.075,w*.76,Math.round(w*.034),3);
      const qx=(w-side)/2,qy=Math.round(h*.32);if(qrCanvas){ctx.fillStyle="#fff";roundRect(ctx,qx-20,qy-20,side+40,side+40,24,true,false);ctx.drawImage(qrCanvas,qx,qy,side,side);}
      const ctaY=Math.min(h*.82,Math.round(qy+side+h*.05)),bh=Math.max(58,h*.06);ctx.fillStyle=state.style.accent;roundRect(ctx,w*.24,ctaY,w*.52,bh,bh/2,true,false);ctx.fillStyle="#06183a";ctx.font=`900 ${Math.round(w*.025)}px Arial`;ctx.textBaseline="middle";ctx.fillText(state.poster.cta||"SCAN NOW",w/2,ctaY+bh/2);
      ctx.textBaseline="alphabetic";ctx.fillStyle=mixHex(state.style.fg,"#ffffff",.38);ctx.font=`600 ${Math.round(w*.019)}px Arial`;drawWrappedText(ctx,state.poster.footer||"",w/2,h*.93,w*.78,Math.round(w*.028),2);
    }
    temp.remove();return canvas;
  }

  function mixHex(a,b,ratio){const A=hexToRgb(a),B=hexToRgb(b);const c=k=>Math.round(A[k]*(1-ratio)+B[k]*ratio).toString(16).padStart(2,"0");return `#${c("r")}${c("g")}${c("b")}`;}
  function roundRect(ctx,x,y,w,h,r,fill,stroke){if(w<2*r)r=w/2;if(h<2*r)r=h/2;ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();if(fill)ctx.fill();if(stroke)ctx.stroke();}
  function drawWrappedText(ctx,text,x,y,maxWidth,lineHeight,maxLines){const words=String(text).split(/\s+/);let line="",lines=[];for(const word of words){const test=line?`${line} ${word}`:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;}else line=test;}if(line)lines.push(line);lines.slice(0,maxLines).forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));}
  function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  function blobDownload(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}

  async function downloadPoster(extension){
    if(!buildData()){toast("Enter the required content first.","warning");return;}
    try{const canvas=await createPosterCanvas();const mime=extension==="jpeg"?"image/jpeg":"image/png";canvas.toBlob(blob=>{if(blob)blobDownload(blob,`${safeFileName(state.poster.title)}.${extension==='jpeg'?'jpg':'png'}`);},mime,extension==="jpeg"?.94:1);toast(`${extension==='jpeg'?'JPG':'PNG'} export prepared.`,"success");}catch(e){toast("Could not create the image export.","error");}
  }

  function dataUrlBytes(dataUrl){const binary=atob(dataUrl.split(",")[1]||"");const out=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)out[i]=binary.charCodeAt(i);return out;}
  function textBytes(value){return new TextEncoder().encode(String(value));}
  function joinBytes(parts){const size=parts.reduce((n,p)=>n+p.length,0),out=new Uint8Array(size);let offset=0;for(const p of parts){out.set(p,offset);offset+=p.length;}return out;}
  function buildPdfBlob(canvases){
    const header=new Uint8Array([37,80,68,70,45,49,46,52,10,37,226,227,207,211,10]);
    const pageInfo=canvases.map(canvas=>{const ratio=canvas.width/canvas.height;let pw=595,ph=842;if(ratio>1.15){pw=842;ph=595;}else if(ratio>.88){pw=700;ph=700;}const jpeg=dataUrlBytes(canvas.toDataURL("image/jpeg",.92));return {canvas,pw,ph,jpeg};});
    const totalObjects=2+pageInfo.length*3;const kids=pageInfo.map((_,i)=>`${3+i*3} 0 R`).join(" ");const objects=[];
    objects[1]=textBytes(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
    objects[2]=textBytes(`2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pageInfo.length} >>\nendobj\n`);
    pageInfo.forEach((info,i)=>{const pageObj=3+i*3,imageObj=pageObj+1,contentObj=pageObj+2;const content=`q\n${info.pw} 0 0 ${info.ph} 0 0 cm\n/Im0 Do\nQ\n`;objects[pageObj]=textBytes(`${pageObj} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${info.pw} ${info.ph}] /Resources << /XObject << /Im0 ${imageObj} 0 R >> >> /Contents ${contentObj} 0 R >>\nendobj\n`);objects[imageObj]=joinBytes([textBytes(`${imageObj} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${info.canvas.width} /Height ${info.canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${info.jpeg.length} >>\nstream\n`),info.jpeg,textBytes(`\nendstream\nendobj\n`)]);objects[contentObj]=textBytes(`${contentObj} 0 obj\n<< /Length ${textBytes(content).length} >>\nstream\n${content}endstream\nendobj\n`);});
    const parts=[header],offsets=[0];let cursor=header.length;for(let i=1;i<=totalObjects;i++){offsets[i]=cursor;parts.push(objects[i]);cursor+=objects[i].length;}const xrefOffset=cursor;let xref=`xref\n0 ${totalObjects+1}\n0000000000 65535 f \n`;for(let i=1;i<=totalObjects;i++)xref+=`${String(offsets[i]).padStart(10,"0")} 00000 n \n`;xref+=`trailer\n<< /Size ${totalObjects+1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;parts.push(textBytes(xref));return new Blob([joinBytes(parts)],{type:"application/pdf"});
  }

  async function downloadPdf(){
    try{const canvas=await createPosterCanvas();blobDownload(buildPdfBlob([canvas]),`${safeFileName(state.poster.title)}.pdf`);toast("Printable PDF downloaded.","success");}catch(e){toast("Could not create the PDF.","error");}
  }

  async function downloadSvg(){
    if(!qrCode){toast("QR engine is unavailable.","error");return;}
    try{
      const temp=new window.QRCodeStyling({...getQrOptions(),type:"svg",width:850,height:850});const blob=await temp.getRawData("svg");const qrSvg=await blob.text();const inner=qrSvg.replace(/^[\s\S]*?<svg[^>]*>/i,"").replace(/<\/svg>[\s\S]*$/i,"");
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500"><rect width="1200" height="1500" fill="#ffffff"/><rect x="8" y="8" width="1184" height="1484" rx="22" fill="none" stroke="${state.style.accent}" stroke-width="16"/><rect width="1200" height="20" fill="${state.style.accent}"/><text x="600" y="190" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="64" fill="${state.style.fg}">${escapeXml(state.poster.title)}</text><text x="600" y="250" text-anchor="middle" font-family="Arial,sans-serif" font-size="26" fill="${state.style.fg}">${escapeXml(state.poster.message)}</text><svg x="175" y="325" width="850" height="850" viewBox="0 0 850 850">${inner}</svg><rect x="290" y="1225" width="620" height="82" rx="41" fill="${state.style.accent}"/><text x="600" y="1277" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="30" fill="#06183a">${escapeXml(state.poster.cta)}</text><text x="600" y="1405" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="${state.style.fg}">${escapeXml(state.poster.footer)}</text></svg>`;
      blobDownload(new Blob([svg],{type:"image/svg+xml"}),`${safeFileName(state.poster.title)}.svg`);toast("SVG export downloaded.","success");
    }catch(e){toast("Could not create the SVG export.","error");}
  }
  function escapeXml(value=""){return String(value).replace(/[<>&'"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;","'":"&apos;",'"':"&quot;"}[c]));}

  async function printPoster(){
    try{const canvas=await createPosterCanvas();const win=window.open("","_blank");if(!win){toast("Allow pop-ups to open the print view.","warning");return;}win.document.write(`<title>Print QR Design</title><style>body{margin:0;display:grid;place-items:center;background:#eee}img{max-width:100%;max-height:100vh}@media print{body{background:#fff}img{width:100%;max-height:none}}</style><img src="${canvas.toDataURL("image/png")}" onload="window.print()">`);win.document.close();}catch(e){toast("Could not open the print layout.","error");}
  }

  async function decodeCanvas(canvas){
    if(!canvas)return "";
    if(typeof window.jsQR==="function"){try{const ctx=canvas.getContext("2d",{willReadFrequently:true});const img=ctx.getImageData(0,0,canvas.width,canvas.height);return window.jsQR(img.data,img.width,img.height,{inversionAttempts:"attemptBoth"})?.data||"";}catch(e){}}
    if("BarcodeDetector" in window){try{const detector=new BarcodeDetector({formats:["qr_code"]});const found=await detector.detect(canvas);return found[0]?.rawValue||"";}catch(e){}}
    return "";
  }
  async function testGeneratedCode(){
    const data=buildData();if(!data){toast("Enter QR content first.","warning");return;}
    const decoded=await decodeCanvas($("canvas",dom.mount));const result=$("#qrTestResult");result.innerHTML=`<strong>${decoded?"Scan test passed":"Content preview"}</strong><p>${escapeHtml(decoded||data)}</p>${isSafeOpenable(decoded||data)?`<a class="qr-mini-btn accent" href="${escapeHtml(decoded||data)}" target="_blank" rel="noopener noreferrer">Open destination safely</a>`:""}`;result.scrollIntoView({behavior:"smooth",block:"nearest"});toast(decoded?"The generated QR code was decoded successfully.":"The content is ready. Test it with a phone before printing.",decoded?"success":"warning");
  }
  function isSafeOpenable(data){return /^(https?:|mailto:|tel:|sms:|geo:)/i.test(data);}

  async function openScanner(){
    const modal=$("#qrScannerModal");modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");
    const result=$("#qrCameraResult");result.textContent="Point the camera at a QR code.";
    if(!navigator.mediaDevices?.getUserMedia){result.textContent="Camera scanning is not supported in this browser.";return;}
    try{cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});const video=$("#qrCameraVideo");video.srcObject=cameraStream;await video.play();cameraLoop();}catch(e){result.textContent="Camera permission was not granted. Use the image upload option instead.";}
  }
  async function cameraLoop(){
    const video=$("#qrCameraVideo"),result=$("#qrCameraResult");if(!cameraStream)return;
    if(video.readyState>=2&&!cameraBusy){cameraBusy=true;const canvas=$("#qrCameraCanvas"),ctx=canvas.getContext("2d",{willReadFrequently:true});canvas.width=video.videoWidth;canvas.height=video.videoHeight;ctx.drawImage(video,0,0);const decoded=await decodeCanvas(canvas);cameraBusy=false;if(decoded){result.innerHTML=`<strong>QR code found</strong><br>${escapeHtml(decoded)}`;navigator.vibrate?.(120);stopCamera();return;}}
    scanFrame=requestAnimationFrame(cameraLoop);
  }
  function stopCamera(){if(scanFrame)cancelAnimationFrame(scanFrame);scanFrame=null;cameraBusy=false;if(cameraStream){cameraStream.getTracks().forEach(t=>t.stop());cameraStream=null;}}
  function closeScanner(){stopCamera();const modal=$("#qrScannerModal");modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");}

  function scanUploadedImage(event){
    const file=event.target.files?.[0];if(!file)return;
    const reader=new FileReader();reader.onload=async()=>{try{const img=await loadImage(String(reader.result));const canvas=document.createElement("canvas");const scale=Math.min(1600/img.width,1600/img.height,1);canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(img,0,0,canvas.width,canvas.height);const decoded=await decodeCanvas(canvas);const result=$("#qrUploadedScanResult");result.innerHTML=decoded?`<strong>QR code detected</strong><p>${escapeHtml(decoded)}</p>`:`<strong>No QR code detected</strong><p>Try a clearer image with the complete code visible. Your browser may also require the optional scanner library.</p>`;toast(decoded?"QR code decoded successfully.":"No readable QR code was found.",decoded?"success":"warning");}catch(e){toast("Could not read that image.","error");}};reader.readAsDataURL(file);
  }

  function getProjects(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");}catch(e){return[];}}
  function setProjects(items){localStorage.setItem(STORAGE_KEY,JSON.stringify(items.slice(0,MAX_PROJECTS)));renderProjects();}
  function saveProject(){
    const name=$("#qrProjectName").value.trim()||`${typeSchemas[state.type].label} QR`;
    const projects=getProjects();projects.unshift({id:`qr_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,name,created:new Date().toISOString(),favourite:false,state:clone(state)});setProjects(projects);$("#qrProjectName").value="";toast("Project saved privately on this device.","success");
  }
  function renderProjects(){
    const items=getProjects();if(!items.length){dom.projectList.innerHTML='<div class="qr-project-empty">No saved projects yet. Name your design and save it for later editing.</div>';return;}
    dom.projectList.innerHTML=items.map(p=>`<article class="qr-project-item ${p.favourite?"is-favourite":""}"><div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(typeSchemas[p.state?.type]?.label||"QR Project")} · ${new Date(p.created).toLocaleDateString("en-GB")}</small></div><div class="qr-project-actions"><button class="qr-icon-btn" data-project-action="load" data-id="${p.id}" title="Open project">↗</button><button class="qr-icon-btn" data-project-action="duplicate" data-id="${p.id}" title="Duplicate">⧉</button><button class="qr-icon-btn" data-project-action="favourite" data-id="${p.id}" title="Favourite">${p.favourite?"★":"☆"}</button><button class="qr-icon-btn danger" data-project-action="delete" data-id="${p.id}" title="Delete">×</button></div></article>`).join("");
    $$('[data-project-action]',dom.projectList).forEach(btn=>btn.addEventListener("click",()=>projectAction(btn.dataset.projectAction,btn.dataset.id)));
  }
  function projectAction(action,id){const items=getProjects();const idx=items.findIndex(p=>p.id===id);if(idx<0)return;const item=items[idx];if(action==="load"){state=mergeState(defaultState,item.state);renderTypeCards();renderDynamicFields();syncControlsFromState();renderTemplates();updatePosterText();updateQr();window.scrollTo({top:$("#qr-builder").offsetTop-90,behavior:"smooth"});toast("Saved project opened.","success");return;}if(action==="duplicate"){items.unshift({...clone(item),id:`qr_${Date.now()}`,name:`${item.name} Copy`,created:new Date().toISOString()});}if(action==="favourite")items[idx].favourite=!items[idx].favourite;if(action==="delete")items.splice(idx,1);setProjects(items);}

  function saveDraft(){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(state));}catch(e){}}
  function resetBuilder(){state=clone(defaultState);renderTypeCards();renderDynamicFields();syncControlsFromState();renderTemplates();updatePosterText();updateQr();toast("Builder reset to the premium starter design.","success");}

  function normalizeBulkRows(rows){return rows.map((row,i)=>{if(Array.isArray(row))return {name:String(row[0]||`QR ${i+1}`),data:String(row[1]??row[0]??"")};if(typeof row==="object") {const keys=Object.keys(row);return {name:String(row.name||row.title||row.label||row[keys[0]]||`QR ${i+1}`),data:String(row.data||row.url||row.value||row.content||row[keys[1]]||row[keys[0]]||"")};}return {name:`QR ${i+1}`,data:String(row)};}).filter(r=>r.data.trim()).slice(0,100);}
  function parseBulkTextarea(){const text=$("#qrBulkText").value.trim();if(!text){toast("Paste a list first.","warning");return;}const lines=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);bulkRows=normalizeBulkRows(lines.map((line,i)=>{const parts=line.split(/\t|,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(s=>s.replace(/^\"|\"$/g,"").trim());return parts.length>1?parts:[`QR ${i+1}`,parts[0]];}));renderBulkList();toast(`${bulkRows.length} bulk QR item${bulkRows.length===1?"":"s"} prepared.`,"success");}
  function handleBulkFile(event){const file=event.target.files?.[0];if(!file)return;const ext=file.name.split(".").pop().toLowerCase();if(["xlsx","xls"].includes(ext)&&window.XLSX){const reader=new FileReader();reader.onload=()=>{try{const wb=window.XLSX.read(reader.result,{type:"array"});const sheet=wb.Sheets[wb.SheetNames[0]];bulkRows=normalizeBulkRows(window.XLSX.utils.sheet_to_json(sheet,{header:1,defval:""}).filter(r=>r.some(Boolean)));renderBulkList();toast(`${bulkRows.length} rows imported from Excel.`,"success");}catch(e){toast("Could not read that spreadsheet.","error");}};reader.readAsArrayBuffer(file);}else{const reader=new FileReader();reader.onload=()=>{$("#qrBulkText").value=String(reader.result);parseBulkTextarea();};reader.readAsText(file);}}
  function renderBulkList(){const stat=$("#qrBulkCount");stat.textContent=`${bulkRows.length} item${bulkRows.length===1?"":"s"}`;dom.bulkList.innerHTML=bulkRows.length?bulkRows.map((r,i)=>`<article class="qr-bulk-item"><div><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(r.data.slice(0,80))}${r.data.length>80?"…":""}</small></div><span class="qr-range-value">${i+1}</span></article>`).join(""):'<div class="qr-project-empty">Paste a list or upload CSV/Excel. Use two columns: name and QR content.</div>';}

  async function makeBulkCanvas(row){return createPosterCanvas(row.data,row.name);}
  async function downloadBulkZip(){
    if(!bulkRows.length){toast("Prepare bulk items first.","warning");return;}if(!window.JSZip){toast("ZIP engine is unavailable. Refresh while online.","error");return;}const zip=new window.JSZip();toast("Preparing batch images…","success");for(let i=0;i<bulkRows.length;i++){const canvas=await makeBulkCanvas(bulkRows[i]);const blob=await new Promise(r=>canvas.toBlob(r,"image/png"));zip.file(`${String(i+1).padStart(3,"0")}-${safeFileName(bulkRows[i].name)}.png`,blob);}const out=await zip.generateAsync({type:"blob"});blobDownload(out,"athanas-qr-batch.zip");toast("Bulk ZIP downloaded.","success");
  }
  async function downloadBulkPdf(){
    if(!bulkRows.length){toast("Prepare bulk items first.","warning");return;}const canvases=[];toast("Preparing batch PDF…","success");for(let i=0;i<bulkRows.length;i++)canvases.push(await makeBulkCanvas(bulkRows[i]));blobDownload(buildPdfBlob(canvases),"athanas-qr-batch.pdf");toast("Batch PDF downloaded.","success");
  }

  function toast(message,type=""){dom.toast.textContent=message;dom.toast.className=`qr-toast is-visible ${type}`;clearTimeout(toast.timer);toast.timer=setTimeout(()=>dom.toast.classList.remove("is-visible"),3200);}

  document.addEventListener("DOMContentLoaded",init);
})();
