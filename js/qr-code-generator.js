(()=>{
  "use strict";

  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const SAMPLE_DATA="https://athanasinspires.com";
  const SAMPLE_LABEL="athanasinspires.com";

  const TYPES={
    website:{label:"Website link",short:"Website",icon:"↗",note:"Open a website, lesson, article or online resource."},
    whatsapp:{label:"WhatsApp message",short:"WhatsApp",icon:"◉",note:"Start a WhatsApp conversation with an optional ready-written message."},
    wifi:{label:"Wi-Fi access",short:"Wi-Fi",icon:"⌁",note:"Help visitors connect to a Wi-Fi network without typing the password."},
    text:{label:"Plain text",short:"Text",icon:"T",note:"Display a short note, instruction, code or other plain text."},
    email:{label:"Email message",short:"Email",icon:"@",note:"Open a new email with an address, subject and optional message."},
    phone:{label:"Phone call",short:"Phone",icon:"☎",note:"Make it easy for someone to call a phone number."},
    sms:{label:"SMS message",short:"SMS",icon:"✉",note:"Open a text message to a selected phone number."},
    contact:{label:"Digital contact card",short:"Contact",icon:"＋",note:"Share a person's name, phone number and email as a contact card."},
    location:{label:"Map location",short:"Location",icon:"⌖",note:"Open a precise location using latitude and longitude."},
    social:{label:"Social media profile",short:"Social",icon:"#",note:"Open a social media page, channel or profile."},
    payment:{label:"Payment information",short:"Payment",icon:"$",note:"Open a trusted payment page or payment request link."}
  };
  const LABEL_TO_TYPE=Object.fromEntries(Object.entries(TYPES).map(([key,value])=>[value.label.toLowerCase(),key]));
  const STEPS=["type","content","poster","design","logo","download"];
  const STEP_COPY={
    type:["STEP 1 OF 6","What should your QR code do?","Type to search or open the professional QR type list."],
    content:["STEP 2 OF 6","Add the necessary details","Only the information required for this QR type is shown."],
    poster:["STEP 3 OF 6","Add optional poster text","Use smart suggestions above and below the QR code, or turn either line off."],
    design:["STEP 4 OF 6","Choose a clean QR design","Use strong colours and a clear pattern that remains easy to scan."],
    logo:["STEP 5 OF 6","Add your logo","Upload a logo, then choose a square, rounded or circular shape."],
    download:["STEP 6 OF 6","Save your finished QR code","Download a premium A4 poster or a clean QR-only PNG."]
  };

  const state={
    step:"type",
    type:"website",
    values:{},
    style:{fg:"#06183a",bg:"#ffffff",dots:"rounded",corners:"extra-rounded"},
    logo:{source:"",processed:"",shape:"rounded",size:26},
    poster:{showTop:true,showBottom:true,showWebsite:true,topText:"Scan to open athanasinspires.com",bottomText:"Learn. Believe. Grow. Build.",topDirty:false,bottomDirty:false},
    touched:new Set(),
    visited:new Set(["type"])
  };

  let qrCode=null;
  let renderTimer=0;
  let toastTimer=0;
  let mobileExpanded=false;

  const dom={};

  function init(){
    cacheDom();
    bindNavigation();
    bindTypePicker();
    bindPosterControls();
    bindDesignControls();
    bindLogoControls();
    bindDownloadControls();
    bindHelp();
    bindPreview();
    renderDynamicFields();
    initializeQr();
    setStep("type",false);
    updateEverything();
  }

  function cacheDom(){
    Object.assign(dom,{
      studio:$("#qrStudio"),
      warning:$("#qrLibraryWarning"),
      typeCombobox:$("#qrTypeCombobox"),
      typeSearch:$("#qrTypeSearch"),
      typeToggle:$("#qrTypeToggle"),
      typeList:$("#qrTypeList"),
      typeError:$("#qrTypeError"),
      typeIcon:$("#qrTypeIcon"),
      typeTitle:$("#qrTypeSummaryTitle"),
      typeNote:$("#qrTypeSummaryNote"),
      dynamicFields:$("#qrDynamicFields"),
      stepEyebrow:$("#qrStepEyebrow"),
      stepTitle:$("#qrStepTitle"),
      stepDescription:$("#qrStepDescription"),
      mount:$("#qrCodeMount"),
      posterSheet:$("#qrPosterSheet"),
      posterTop:$("#qrPosterTop"),
      posterBottom:$("#qrPosterBottom"),
      posterWebsite:$("#qrPosterWebsite"),
      showTop:$("#qrShowTop"),
      showBottom:$("#qrShowBottom"),
      showWebsite:$("#qrShowWebsite"),
      topText:$("#qrTopText"),
      bottomText:$("#qrBottomText"),
      topTextField:$("#qrTopTextField"),
      bottomTextField:$("#qrBottomTextField"),
      previewPanel:$("#qrPreviewPanel"),
      previewToggle:$("#qrPreviewToggle"),
      previewStatus:$("#qrPreviewStatus"),
      previewType:$("#qrPreviewType"),
      previewValue:$("#qrPreviewValue"),
      testResult:$("#qrTestResult"),
      checkContent:$("#qrCheckContent"),
      checkContrast:$("#qrCheckContrast"),
      foreground:$("#qrForeground"),
      foregroundHex:$("#qrForegroundHex"),
      background:$("#qrBackground"),
      backgroundHex:$("#qrBackgroundHex"),
      dots:$("#qrDots"),
      corners:$("#qrCorners"),
      contrastNote:$("#qrContrastNote"),
      logoInput:$("#qrLogoInput"),
      logoControls:$("#qrLogoControls"),
      logoImage:$("#qrLogoImage"),
      logoShape:$("#qrLogoShape"),
      logoSize:$("#qrLogoSize"),
      logoSizeOutput:$("#qrLogoSizeOutput"),
      posterFormat:$("#qrPosterFormat"),
      downloadPoster:$("#qrDownloadPoster"),
      downloadQrOnly:$("#qrDownloadQrOnly"),
      downloadSummary:$("#qrDownloadSummary"),
      toast:$("#qrToast"),
      helpBtn:$("#qrHelpBtn"),
      helpMenu:$("#qrHelpMenu")
    });
  }

  function bindNavigation(){
    $$(".qr-step-button").forEach(button=>button.addEventListener("click",()=>setStep(button.dataset.step,true)));
    const openHashStep=()=>{
      const raw=location.hash.replace(/^#/,"");
      const aliases={"qr-type":"type","qr-content":"content","qr-poster":"poster","poster-text":"poster","qr-design":"design","qr-logo":"logo","qr-download":"download"};
      const step=aliases[raw]||raw;
      if(STEPS.includes(step))setStep(step,false);
    };
    window.setTimeout(openHashStep,0);
    window.addEventListener("hashchange",openHashStep);
    $("#qrResetBtn").addEventListener("click",resetBuilder);
  }

  function setStep(step,scroll=true){
    if(!STEPS.includes(step))return;
    state.step=step;
    state.visited.add(step);
    const copy=STEP_COPY[step];
    dom.stepEyebrow.textContent=copy[0];
    dom.stepTitle.textContent=copy[1];
    dom.stepDescription.textContent=copy[2];
    $$(".qr-step-panel").forEach(panel=>panel.classList.toggle("is-active",panel.dataset.panel===step));
    $$(".qr-step-button").forEach(button=>{
      const active=button.dataset.step===step;
      button.classList.toggle("is-active",active);
      if(active)button.setAttribute("aria-current","step");else button.removeAttribute("aria-current");
    });
    updateStepCompletion();
    if(scroll&&window.innerWidth<=760){
      const editor=$(".qr-editor");
      const offset=(dom.previewPanel?.offsetHeight||0)+58;
      const top=editor.getBoundingClientRect().top+window.scrollY-offset;
      window.scrollTo({top:Math.max(0,top),behavior:"smooth"});
    }
  }

  function bindTypePicker(){
    let activeIndex=-1;

    const setExpanded=expanded=>{
      dom.typeList.hidden=!expanded;
      dom.typeSearch.setAttribute("aria-expanded",String(expanded));
      dom.typeToggle.setAttribute("aria-expanded",String(expanded));
      dom.typeCombobox.classList.toggle("is-open",expanded);
      if(!expanded){activeIndex=-1;dom.typeSearch.removeAttribute("aria-activedescendant");}
    };

    const renderOptions=(query="")=>{
      const clean=query.trim().toLowerCase();
      const entries=Object.entries(TYPES).filter(([,type])=>!clean||`${type.label} ${type.short} ${type.note}`.toLowerCase().includes(clean));
      if(!entries.length){
        dom.typeList.innerHTML='<li class="qr-type-empty">No matching QR type. Try “Website” or “WhatsApp”.</li>';
        activeIndex=-1;
        return;
      }
      dom.typeList.innerHTML=entries.map(([key,type],index)=>`<li id="qr-type-option-${key}" role="option" aria-selected="${state.type===key}" data-type-key="${key}" data-option-index="${index}"><span>${escapeHtml(type.icon)}</span><div><strong>${escapeHtml(type.label)}</strong><small>${escapeHtml(type.note)}</small></div><i aria-hidden="true">${state.type===key?"✓":""}</i></li>`).join("");
      activeIndex=-1;
    };

    const highlight=index=>{
      const options=$$("[data-type-key]",dom.typeList);
      if(!options.length)return;
      activeIndex=Math.max(0,Math.min(index,options.length-1));
      options.forEach((option,i)=>option.classList.toggle("is-active",i===activeIndex));
      const active=options[activeIndex];
      dom.typeSearch.setAttribute("aria-activedescendant",active.id);
      active.scrollIntoView({block:"nearest"});
    };

    const selectType=key=>{
      if(!TYPES[key])return;
      const changed=state.type!==key;
      state.type=key;
      dom.typeSearch.value=TYPES[key].label;
      dom.typeError.hidden=true;
      setExpanded(false);
      if(changed){
        state.touched.clear();
        renderDynamicFields();
        dom.testResult.hidden=true;
        state.poster.topDirty=false;
        updateSmartPosterSuggestion(true);
      }
      updateTypeSummary();
      updateEverything();
    };

    dom.typeSearch.addEventListener("focus",()=>{renderOptions("");setExpanded(true);});
    dom.typeSearch.addEventListener("click",()=>{renderOptions(dom.typeSearch.value===TYPES[state.type].label?"":dom.typeSearch.value);setExpanded(true);});
    dom.typeSearch.addEventListener("input",()=>{
      dom.typeError.hidden=true;
      renderOptions(dom.typeSearch.value);
      setExpanded(true);
      const exact=LABEL_TO_TYPE[dom.typeSearch.value.trim().toLowerCase()];
      if(exact)selectType(exact);
    });
    dom.typeSearch.addEventListener("keydown",event=>{
      const open=!dom.typeList.hidden;
      const options=$$("[data-type-key]",dom.typeList);
      if(event.key==="ArrowDown"){
        event.preventDefault();
        if(!open){renderOptions("");setExpanded(true);}
        highlight(activeIndex+1);
      }else if(event.key==="ArrowUp"){
        event.preventDefault();
        if(!open){renderOptions("");setExpanded(true);}
        highlight(activeIndex<=0?options.length-1:activeIndex-1);
      }else if(event.key==="Enter"){
        if(open&&activeIndex>=0&&options[activeIndex]){event.preventDefault();selectType(options[activeIndex].dataset.typeKey);}
        else{
          const exact=LABEL_TO_TYPE[dom.typeSearch.value.trim().toLowerCase()];
          if(exact){event.preventDefault();selectType(exact);}
        }
      }else if(event.key==="Escape"){
        setExpanded(false);
        dom.typeSearch.value=TYPES[state.type].label;
      }
    });
    dom.typeToggle.addEventListener("click",()=>{
      const open=!dom.typeList.hidden;
      if(open)setExpanded(false);
      else{dom.typeSearch.focus();renderOptions("");setExpanded(true);}
    });
    dom.typeList.addEventListener("mousedown",event=>{
      const option=event.target.closest("[data-type-key]");
      if(option){event.preventDefault();selectType(option.dataset.typeKey);}
    });
    dom.typeSearch.addEventListener("blur",()=>window.setTimeout(()=>{
      if(!dom.typeCombobox.contains(document.activeElement)){
        const exact=LABEL_TO_TYPE[dom.typeSearch.value.trim().toLowerCase()];
        if(exact)selectType(exact);
        else{
          dom.typeError.hidden=false;
          dom.typeSearch.value=TYPES[state.type].label;
          setExpanded(false);
        }
      }
    },120));
    document.addEventListener("click",event=>{if(!event.target.closest("#qrTypeCombobox"))setExpanded(false);});
    renderOptions("");
  }

  function updateTypeSummary(){
    const type=TYPES[state.type];
    dom.typeIcon.textContent=type.icon;
    dom.typeTitle.textContent=type.label;
    dom.typeNote.textContent=type.note;
  }

  function field(name,label,options={}){
    const value=state.values[name]??options.value??"";
    const full=options.full!==false?" full":"";
    const required=options.required?" required":"";
    const autocomplete=options.autocomplete?` autocomplete="${options.autocomplete}"`:"";
    const inputmode=options.inputmode?` inputmode="${options.inputmode}"`:"";
    const placeholder=escapeHtml(options.placeholder||"");
    let control="";
    if(options.type==="textarea"){
      control=`<textarea id="qr-${name}" data-value-key="${name}" placeholder="${placeholder}"${required}>${escapeHtml(value)}</textarea>`;
    }else if(options.type==="select"){
      control=`<select id="qr-${name}" data-value-key="${name}"${required}>${options.options.map(([v,t])=>`<option value="${escapeHtml(v)}"${String(value)===String(v)?" selected":""}>${escapeHtml(t)}</option>`).join("")}</select>`;
    }else{
      control=`<input id="qr-${name}" data-value-key="${name}" type="${options.type||"text"}" value="${escapeHtml(value)}" placeholder="${placeholder}"${required}${autocomplete}${inputmode}>`;
    }
    return `<div class="qr-field${full}"><label for="qr-${name}">${escapeHtml(label)}${options.optional?"<em>Optional</em>":""}</label>${control}${options.help?`<small class="qr-field-help">${escapeHtml(options.help)}</small>`:""}<p class="qr-inline-error" data-error-for="${name}" hidden></p></div>`;
  }

  function renderDynamicFields(){
    let html="";
    switch(state.type){
      case "website":
        html=field("url","Website address",{type:"url",required:true,placeholder:"https://example.com",help:"Include https:// at the beginning.",autocomplete:"url"});
        break;
      case "whatsapp":
        html=field("whatsapp","WhatsApp number",{required:true,placeholder:"+255 695 110 859",help:"Include the country code, such as +255.",autocomplete:"tel",inputmode:"tel"})+
             field("whatsappMessage","Ready-written message",{type:"textarea",optional:true,placeholder:"Hello, I would like to know more..."});
        break;
      case "wifi":
        html=field("ssid","Wi-Fi network name",{required:true,placeholder:"Network name"})+
             field("wifiPassword","Wi-Fi password",{optional:true,placeholder:"Password"})+
             field("wifiSecurity","Security type",{type:"select",required:true,full:false,value:"WPA",options:[["WPA","WPA / WPA2"],["WEP","WEP"],["nopass","No password"]]});
        break;
      case "text":
        html=field("text","Text to display",{type:"textarea",required:true,placeholder:"Enter a short message or instruction."});
        break;
      case "email":
        html=field("email","Email address",{type:"email",required:true,placeholder:"name@example.com",autocomplete:"email"})+
             field("subject","Email subject",{optional:true,placeholder:"How can we help?"})+
             field("emailBody","Email message",{type:"textarea",optional:true,placeholder:"Write an optional message."});
        break;
      case "phone":
        html=field("phone","Phone number",{required:true,placeholder:"+255 695 110 859",help:"Include the country code.",autocomplete:"tel",inputmode:"tel"});
        break;
      case "sms":
        html=field("smsPhone","Phone number",{required:true,placeholder:"+255 695 110 859",autocomplete:"tel",inputmode:"tel"})+
             field("smsMessage","Text message",{type:"textarea",optional:true,placeholder:"Enter an optional message."});
        break;
      case "contact":
        html=field("firstName","First name",{required:true,placeholder:"First name",full:false,autocomplete:"given-name"})+
             field("lastName","Last name",{optional:true,placeholder:"Last name",full:false,autocomplete:"family-name"})+
             field("contactPhone","Phone number",{optional:true,placeholder:"+255...",full:false,autocomplete:"tel",inputmode:"tel"})+
             field("contactEmail","Email address",{type:"email",optional:true,placeholder:"name@example.com",full:false,autocomplete:"email"});
        break;
      case "location":
        html=field("latitude","Latitude",{required:true,placeholder:"-3.365",full:false,inputmode:"decimal"})+
             field("longitude","Longitude",{required:true,placeholder:"36.626",full:false,inputmode:"decimal"})+
             field("locationLabel","Location name",{optional:true,placeholder:"School, office or meeting point"});
        break;
      case "social":
        html=field("socialUrl","Profile or channel link",{type:"url",required:true,placeholder:"https://youtube.com/@yourchannel",help:"Paste the complete public profile link.",autocomplete:"url"});
        break;
      case "payment":
        html=field("paymentLink","Trusted payment link",{type:"url",required:true,placeholder:"https://secure-payment-link.example",help:"Confirm the destination carefully before sharing.",autocomplete:"url"})+
             field("paymentLabel","Payment purpose",{optional:true,placeholder:"School fees, donation or order payment"});
        break;
    }
    dom.dynamicFields.innerHTML=`<div class="qr-dynamic-grid">${html}</div>`;
    $$('[data-value-key]',dom.dynamicFields).forEach(input=>{
      input.addEventListener("input",()=>{
        state.values[input.dataset.valueKey]=input.value;
        if(input.value.trim())state.touched.add(input.dataset.valueKey);
        validateFields(false);
        updateSmartPosterSuggestion(false);
        scheduleUpdate();
      });
      input.addEventListener("change",()=>{
        state.values[input.dataset.valueKey]=input.value;
        state.touched.add(input.dataset.valueKey);
        validateFields(false);
        updateSmartPosterSuggestion(false);
        scheduleUpdate();
      });
      input.addEventListener("blur",()=>{
        state.touched.add(input.dataset.valueKey);
        validateFields(false);
      });
    });
    validateFields(false);
  }

  function bindPosterControls(){
    const toggle=(input,field,key)=>{
      input.addEventListener("change",()=>{
        state.poster[key]=input.checked;
        field.classList.toggle("is-disabled",!input.checked);
        field.querySelector("input").disabled=!input.checked;
        scheduleUpdate();
      });
    };
    toggle(dom.showTop,dom.topTextField,"showTop");
    toggle(dom.showBottom,dom.bottomTextField,"showBottom");
    dom.showWebsite.addEventListener("change",()=>{state.poster.showWebsite=dom.showWebsite.checked;scheduleUpdate();});
    dom.topText.addEventListener("input",()=>{
      state.poster.topText=dom.topText.value;
      state.poster.topDirty=true;
      scheduleUpdate();
    });
    dom.bottomText.addEventListener("input",()=>{
      state.poster.bottomText=dom.bottomText.value;
      state.poster.bottomDirty=true;
      scheduleUpdate();
    });
  }

  function updateSmartPosterSuggestion(force=false){
    if(force||!state.poster.topDirty){
      state.poster.topText=getSuggestedTopText();
      if(dom.topText)dom.topText.value=state.poster.topText;
    }
    if(force||!state.poster.bottomDirty){
      state.poster.bottomText="Learn. Believe. Grow. Build.";
      if(dom.bottomText)dom.bottomText.value=state.poster.bottomText;
    }
  }

  function getSuggestedTopText(){
    const v=state.values;
    switch(state.type){
      case "website":return `Scan to open ${friendlyHost(v.url)||"athanasinspires.com"}`;
      case "whatsapp":return "Scan to chat with us on WhatsApp";
      case "wifi":return `Scan to connect${v.ssid?` to ${v.ssid}`:" to Wi-Fi"}`;
      case "text":return "Scan to read this message";
      case "email":return "Scan to send an email";
      case "phone":return "Scan to make a phone call";
      case "sms":return "Scan to send a text message";
      case "contact":return "Scan to save this contact";
      case "location":return `Scan to open${v.locationLabel?` ${v.locationLabel}`:" this location"}`;
      case "social":return "Scan to view this profile";
      case "payment":return "Scan to open secure payment details";
      default:return "Scan this QR code";
    }
  }

  function friendlyHost(value){
    try{return new URL(String(value||"")).hostname.replace(/^www\./,"");}
    catch(error){return "";}
  }

  function bindDesignControls(){
    bindColourPair(dom.foreground,dom.foregroundHex,"fg");
    bindColourPair(dom.background,dom.backgroundHex,"bg");
    dom.dots.addEventListener("change",()=>{state.style.dots=dom.dots.value;scheduleUpdate();});
    dom.corners.addEventListener("change",()=>{state.style.corners=dom.corners.value;scheduleUpdate();});
  }

  function bindColourPair(picker,text,key){
    picker.addEventListener("input",()=>{
      state.style[key]=picker.value.toLowerCase();
      text.value=picker.value.toUpperCase();
      scheduleUpdate();
    });
    text.addEventListener("input",()=>{
      const value=normaliseHex(text.value);
      if(value){
        state.style[key]=value.toLowerCase();
        picker.value=value;
        scheduleUpdate();
      }
    });
    text.addEventListener("blur",()=>{text.value=state.style[key].toUpperCase();});
  }

  function bindLogoControls(){
    dom.logoInput.addEventListener("change",handleLogoUpload);
    dom.logoShape.addEventListener("change",async()=>{
      state.logo.shape=dom.logoShape.value;
      if(state.logo.source)await processLogo();
    });
    dom.logoSize.addEventListener("input",()=>{
      state.logo.size=Number(dom.logoSize.value);
      dom.logoSizeOutput.textContent=`${state.logo.size}%`;
      scheduleUpdate();
    });
    $("#qrRemoveLogo").addEventListener("click",removeLogo);
  }

  async function handleLogoUpload(event){
    const file=event.target.files?.[0];
    if(!file)return;
    if(!file.type.startsWith("image/")){toast("Please choose an image file.","error");return;}
    if(file.size>2.5*1024*1024){toast("Choose a logo smaller than 2.5 MB.","warning");return;}
    try{
      state.logo.source=await readFileAsDataUrl(file);
      await processLogo();
      dom.logoControls.hidden=false;
      toast("Logo added to your QR code.","success");
    }catch(error){toast("The logo could not be processed.","error");}
  }

  async function processLogo(){
    const image=await loadImage(state.logo.source);
    const size=600;
    const canvas=document.createElement("canvas");
    canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext("2d");
    ctx.save();
    if(state.logo.shape==="circle"){
      ctx.beginPath();ctx.arc(size/2,size/2,size/2,0,Math.PI*2);ctx.clip();
    }else if(state.logo.shape==="rounded"){
      roundedPath(ctx,0,0,size,size,105);ctx.clip();
    }
    ctx.fillStyle="#ffffff";ctx.fillRect(0,0,size,size);
    const padding=46;
    const available=size-padding*2;
    const ratio=Math.min(available/image.width,available/image.height);
    const width=image.width*ratio,height=image.height*ratio;
    ctx.drawImage(image,(size-width)/2,(size-height)/2,width,height);
    ctx.restore();
    state.logo.processed=canvas.toDataURL("image/png");
    dom.logoImage.src=state.logo.processed;
    scheduleUpdate();
  }

  function removeLogo(){
    state.logo.source="";state.logo.processed="";
    dom.logoInput.value="";
    dom.logoImage.removeAttribute("src");
    dom.logoControls.hidden=true;
    scheduleUpdate();
    toast("Logo removed.","success");
  }

  function bindDownloadControls(){
    dom.posterFormat.addEventListener("change",updateDownloadText);
    dom.downloadPoster.addEventListener("click",()=>downloadPoster(dom.posterFormat.value));
    dom.downloadQrOnly.addEventListener("click",downloadQrOnly);
    $("#qrQuickDownload").addEventListener("click",()=>downloadPoster("pdf"));
  }

  function updateDownloadText(){
    const format=dom.posterFormat.value.toUpperCase();
    dom.downloadPoster.innerHTML=`<span aria-hidden="true">↓</span> Download A4 Poster ${format}`;
    dom.downloadSummary.textContent=`A4 portrait poster · ${format==="PDF"?"recommended for professional printing":"high-resolution image for digital sharing"}.`;
  }

  function bindHelp(){
    dom.helpBtn.addEventListener("click",event=>{
      event.stopPropagation();
      const open=dom.helpMenu.hidden;
      dom.helpMenu.hidden=!open;
      dom.helpBtn.setAttribute("aria-expanded",String(open));
    });
    $$('[data-help-step]').forEach(button=>button.addEventListener("click",()=>{
      dom.helpMenu.hidden=true;dom.helpBtn.setAttribute("aria-expanded","false");setStep(button.dataset.helpStep,true);
    }));
    document.addEventListener("click",event=>{
      if(!event.target.closest(".qr-help-wrap")){dom.helpMenu.hidden=true;dom.helpBtn.setAttribute("aria-expanded","false");}
    });
  }

  function bindPreview(){
    $("#qrTestBtn").addEventListener("click",testGeneratedCode);
    dom.previewToggle.addEventListener("click",()=>{
      mobileExpanded=!mobileExpanded;
      dom.previewPanel.classList.toggle("is-expanded",mobileExpanded);
      dom.previewPanel.classList.toggle("is-compact",!mobileExpanded);
      dom.previewToggle.setAttribute("aria-expanded",String(mobileExpanded));
    });
    const syncMobilePreview=()=>{
      if(window.innerWidth>760){
        dom.previewPanel.classList.remove("is-compact","is-expanded");
        dom.previewToggle.setAttribute("aria-expanded","true");
        return;
      }
      const threshold=(dom.studio?.offsetTop||0)+100;
      if(window.scrollY>threshold&&!mobileExpanded)dom.previewPanel.classList.add("is-compact");
      else if(!mobileExpanded)dom.previewPanel.classList.remove("is-compact");
    };
    window.addEventListener("scroll",syncMobilePreview,{passive:true});
    window.addEventListener("resize",syncMobilePreview);
    syncMobilePreview();
  }

  function initializeQr(){
    if(typeof window.QRCodeStyling!=="function"){
      dom.warning.textContent="The QR engine could not load. Check your internet connection, then refresh this page.";
      dom.warning.classList.add("is-visible");
      return;
    }
    dom.warning.classList.remove("is-visible");
    qrCode=new window.QRCodeStyling(getQrOptions(SAMPLE_DATA));
    dom.mount.innerHTML="";
    qrCode.append(dom.mount);
  }

  function scheduleUpdate(){
    clearTimeout(renderTimer);
    renderTimer=setTimeout(updateEverything,80);
  }

  function updateEverything(){
    updateTypeSummary();
    validateFields(false);
    updateContrast();
    updatePreview();
    updatePosterPreview();
    updateStepCompletion();
    updateDownloadText();
  }

  function updatePreview(){
    const valid=isContentValid();
    const data=valid?buildData():SAMPLE_DATA;
    const contrastGood=getContrast(state.style.fg,state.style.bg)>=3.5;
    if(qrCode){
      try{qrCode.update(getQrOptions(data));}
      catch(error){toast("The QR preview could not update. Try shorter content.","error");}
    }
    const type=TYPES[state.type];
    dom.previewType.textContent=type.label.toUpperCase();
    dom.previewValue.textContent=valid?getPreviewValue():SAMPLE_LABEL;
    dom.previewStatus.classList.toggle("is-waiting",!valid||!contrastGood);
    dom.previewStatus.innerHTML=`<i aria-hidden="true"></i> ${valid?(contrastGood?"Ready to scan":"Improve contrast"):"Add details"}`;
    dom.checkContent.className=valid?"":"is-waiting";
    dom.checkContent.innerHTML=`<span>${valid?"✓":"○"}</span> ${valid?"Required details complete":"Required details"}`;
    dom.testResult.hidden=true;
  }

  function updatePosterPreview(){
    dom.posterTop.textContent=state.poster.topText||"";
    dom.posterBottom.textContent=state.poster.bottomText||"";
    dom.posterTop.hidden=!state.poster.showTop||!state.poster.topText.trim();
    dom.posterBottom.hidden=!state.poster.showBottom||!state.poster.bottomText.trim();
    dom.posterWebsite.hidden=!state.poster.showWebsite;
    dom.posterSheet.classList.toggle("without-top",dom.posterTop.hidden);
    dom.posterSheet.classList.toggle("without-bottom",dom.posterBottom.hidden);
    dom.posterSheet.classList.toggle("without-website",dom.posterWebsite.hidden);
  }

  function getQrOptions(data){
    const safeCorner=getContrast("#f6c928",state.style.bg)>=3.5?"#f6c928":state.style.fg;
    return {
      width:900,
      height:900,
      type:"canvas",
      data:data||SAMPLE_DATA,
      margin:28,
      qrOptions:{errorCorrectionLevel:state.logo.processed?"H":"Q"},
      dotsOptions:{color:state.style.fg,type:state.style.dots},
      backgroundOptions:{color:state.style.bg},
      cornersSquareOptions:{color:state.style.fg,type:state.style.corners},
      cornersDotOptions:{color:safeCorner,type:state.style.corners==="square"?"square":"dot"},
      image:state.logo.processed||undefined,
      imageOptions:{hideBackgroundDots:true,imageSize:Math.min(.36,state.logo.size/100),margin:6,crossOrigin:"anonymous",saveAsBlob:true}
    };
  }

  function buildData(){
    const v=state.values;
    switch(state.type){
      case "website":return (v.url||"").trim();
      case "whatsapp":{
        const phone=cleanPhone(v.whatsapp||"");
        return phone?`https://wa.me/${phone}${v.whatsappMessage?`?text=${encodeURIComponent(v.whatsappMessage)}`:""}`:"";
      }
      case "wifi":return v.ssid?`WIFI:T:${wifiEscape(v.wifiSecurity||"WPA")};S:${wifiEscape(v.ssid)};P:${wifiEscape(v.wifiPassword||"")};;`:"";
      case "text":return (v.text||"").trim();
      case "email":return v.email?`mailto:${v.email.trim()}?subject=${encodeURIComponent(v.subject||"")}&body=${encodeURIComponent(v.emailBody||"")}`:"";
      case "phone":return v.phone?`tel:${v.phone.replace(/\s+/g,"")}`:"";
      case "sms":return v.smsPhone?`SMSTO:${v.smsPhone.replace(/\s+/g,"")}:${v.smsMessage||""}`:"";
      case "contact":return v.firstName?["BEGIN:VCARD","VERSION:3.0",`N:${v.lastName||""};${v.firstName};;;`,`FN:${[v.firstName,v.lastName].filter(Boolean).join(" ")}`,v.contactPhone?`TEL;TYPE=CELL:${v.contactPhone}`:"",v.contactEmail?`EMAIL:${v.contactEmail}`:"","END:VCARD"].filter(Boolean).join("\n"):"";
      case "location":return v.latitude&&v.longitude?`geo:${v.latitude},${v.longitude}${v.locationLabel?`?q=${v.latitude},${v.longitude}(${encodeURIComponent(v.locationLabel)})`:""}`:"";
      case "social":return (v.socialUrl||"").trim();
      case "payment":return (v.paymentLink||"").trim();
      default:return "";
    }
  }

  function getPreviewValue(){
    const v=state.values;
    const values={
      website:v.url,
      whatsapp:v.whatsapp,
      wifi:v.ssid,
      text:v.text,
      email:v.email,
      phone:v.phone,
      sms:v.smsPhone,
      contact:[v.firstName,v.lastName].filter(Boolean).join(" "),
      location:v.locationLabel||`${v.latitude}, ${v.longitude}`,
      social:v.socialUrl,
      payment:v.paymentLabel||v.paymentLink
    };
    const value=String(values[state.type]||SAMPLE_LABEL).replace(/\s+/g," ").trim();
    return value.length>64?`${value.slice(0,61)}…`:value;
  }

  function getValidationErrors(){
    const v=state.values;
    const errors={};
    const required=(key,message)=>{if(!String(v[key]||"").trim())errors[key]=message;};
    const validUrl=value=>{try{const u=new URL(String(value));return ["http:","https:"].includes(u.protocol)&&Boolean(u.hostname);}catch(e){return false;}};
    const validPhone=value=>/^\+?[0-9][0-9\s()\-]{6,}$/.test(String(value||"").trim());
    switch(state.type){
      case "website":required("url","Enter a website address.");if(v.url&&!validUrl(v.url))errors.url="Enter a complete address beginning with https://";break;
      case "whatsapp":required("whatsapp","Enter a WhatsApp number.");if(v.whatsapp&&!validPhone(v.whatsapp))errors.whatsapp="Enter a valid number with the country code, such as +255.";break;
      case "wifi":required("ssid","Enter the Wi-Fi network name.");break;
      case "text":required("text","Enter the text you want the QR code to display.");break;
      case "email":required("email","Enter an email address.");if(v.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))errors.email="Enter a valid email address.";break;
      case "phone":required("phone","Enter a phone number.");if(v.phone&&!validPhone(v.phone))errors.phone="Enter a valid phone number with the country code.";break;
      case "sms":required("smsPhone","Enter a phone number.");if(v.smsPhone&&!validPhone(v.smsPhone))errors.smsPhone="Enter a valid phone number with the country code.";break;
      case "contact":required("firstName","Enter the contact's first name.");if(v.contactEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.contactEmail))errors.contactEmail="Enter a valid email address.";break;
      case "location":required("latitude","Enter the latitude.");required("longitude","Enter the longitude.");if(v.latitude&&(isNaN(Number(v.latitude))||Number(v.latitude)<-90||Number(v.latitude)>90))errors.latitude="Latitude must be between -90 and 90.";if(v.longitude&&(isNaN(Number(v.longitude))||Number(v.longitude)<-180||Number(v.longitude)>180))errors.longitude="Longitude must be between -180 and 180.";break;
      case "social":required("socialUrl","Enter the social profile link.");if(v.socialUrl&&!validUrl(v.socialUrl))errors.socialUrl="Enter a complete link beginning with https://";break;
      case "payment":required("paymentLink","Enter the trusted payment link.");if(v.paymentLink&&!validUrl(v.paymentLink))errors.paymentLink="Enter a complete secure link beginning with https://";break;
    }
    return errors;
  }

  function validateFields(showAll){
    const errors=getValidationErrors();
    $$('[data-error-for]',dom.dynamicFields).forEach(errorNode=>{
      const key=errorNode.dataset.errorFor;
      const message=errors[key];
      const shouldShow=Boolean(message)&&(showAll||state.touched.has(key));
      errorNode.textContent=message||"";
      errorNode.hidden=!shouldShow;
      const input=$(`[data-value-key="${key}"]`,dom.dynamicFields);
      if(input)input.setAttribute("aria-invalid",shouldShow?"true":"false");
    });
    return Object.keys(errors).length===0;
  }

  function isContentValid(){return Object.keys(getValidationErrors()).length===0&&Boolean(buildData());}

  function updateStepCompletion(){
    const completion={type:true,content:isContentValid(),poster:state.visited.has("poster"),design:state.visited.has("design"),logo:state.visited.has("logo"),download:false};
    $$(".qr-step-button").forEach(button=>button.classList.toggle("is-complete",Boolean(completion[button.dataset.step])));
  }

  function updateContrast(){
    const ratio=getContrast(state.style.fg,state.style.bg);
    const good=ratio>=3.5;
    dom.contrastNote.classList.toggle("is-warning",!good);
    dom.contrastNote.innerHTML=good?`<span aria-hidden="true">✓</span><div><strong>Strong scan contrast</strong><small>Your colour combination is clear and scan-friendly.</small></div>`:`<span aria-hidden="true">!</span><div><strong>Contrast is too low</strong><small>Choose a darker QR colour or a lighter background.</small></div>`;
    dom.checkContrast.className=good?"":"is-danger";
    dom.checkContrast.innerHTML=`<span>${good?"✓":"!"}</span> ${good?"Strong colour contrast":"Improve colour contrast"}`;
  }

  async function testGeneratedCode(){
    if(!isContentValid()){
      state.touched=new Set(Object.keys(state.values));
      validateFields(true);
      setStep("content",true);
      toast("Complete the required details before testing.","warning");
      return;
    }
    const data=buildData();
    const canvas=$("canvas",dom.mount);
    let decoded="";
    if(canvas&&typeof window.jsQR==="function"){
      try{
        const ctx=canvas.getContext("2d",{willReadFrequently:true});
        const image=ctx.getImageData(0,0,canvas.width,canvas.height);
        decoded=window.jsQR(image.data,image.width,image.height,{inversionAttempts:"attemptBoth"})?.data||"";
      }catch(error){}
    }
    const result=decoded||data;
    const openable=/^(https?:|mailto:|tel:|sms:|geo:)/i.test(result);
    dom.testResult.innerHTML=`<strong>${decoded?"Scan test passed":"QR content is ready"}</strong>${escapeHtml(result)}${openable?`<br><a href="${escapeHtml(result)}" target="_blank" rel="noopener noreferrer">Open the destination safely ↗</a>`:""}`;
    dom.testResult.hidden=false;
    if(window.innerWidth<=760){mobileExpanded=true;dom.previewPanel.classList.add("is-expanded");dom.previewPanel.classList.remove("is-compact");}
    toast(decoded?"The QR code was decoded successfully.":"The QR content is ready. Test it with a phone before printing.",decoded?"success":"warning");
  }

  async function downloadQrOnly(){
    if(!ensureDownloadReady())return;
    if(typeof window.QRCodeStyling!=="function"){toast("The QR engine is unavailable.","error");return;}
    try{
      const temp=new window.QRCodeStyling({...getQrOptions(buildData()),width:1600,height:1600,type:"canvas"});
      const blob=await temp.getRawData("png");
      blobDownload(blob,`${safeFileName(TYPES[state.type].short)}-qr-code.png`);
      toast("QR-only PNG downloaded successfully.","success");
    }catch(error){
      console.error(error);
      toast("The QR code could not be prepared. Please try again.","error");
    }
  }

  async function downloadPoster(format="pdf"){
    if(!ensureDownloadReady())return;
    try{
      const canvas=await createPosterCanvas();
      const name=`${safeFileName(TYPES[state.type].short)}-qr-poster-a4`;
      if(format==="png"){
        const blob=await canvasToBlob(canvas,"image/png",1);
        blobDownload(blob,`${name}.png`);
      }else{
        blobDownload(buildPdfBlob(canvas,595.28,841.89),`${name}.pdf`);
      }
      toast(`Premium A4 poster ${format.toUpperCase()} downloaded successfully.`,"success");
    }catch(error){
      console.error(error);
      toast("The premium poster could not be prepared. Please try again.","error");
    }
  }

  function ensureDownloadReady(){
    if(!isContentValid()){
      state.touched=new Set(Object.keys(state.values));
      validateFields(true);
      setStep("content",true);
      toast("Complete the required details before downloading.","warning");
      return false;
    }
    return true;
  }

  async function createPosterCanvas(){
    if(typeof window.QRCodeStyling!=="function")throw new Error("QR engine unavailable");
    const canvas=document.createElement("canvas");
    canvas.width=2480;
    canvas.height=3508;
    const ctx=canvas.getContext("2d");
    ctx.fillStyle="#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const panel={x:440,y:604,w:1600,h:2300,r:72};
    ctx.save();
    ctx.shadowColor="rgba(6,24,58,.16)";
    ctx.shadowBlur=72;
    ctx.shadowOffsetY=28;
    roundedPath(ctx,panel.x,panel.y,panel.w,panel.h,panel.r);
    ctx.fillStyle="#ffffff";
    ctx.fill();
    ctx.restore();
    roundedPath(ctx,panel.x,panel.y,panel.w,panel.h,panel.r);
    ctx.strokeStyle="#dbe2ec";
    ctx.lineWidth=4;
    ctx.stroke();

    const accentW=230;
    ctx.fillStyle="#f6c928";
    roundedPath(ctx,panel.x+(panel.w-accentW)/2,panel.y+76,accentW,14,7);
    ctx.fill();

    const qrSize=1160;
    const topSpace=state.poster.showTop&&state.poster.topText.trim()?330:170;
    const qrX=panel.x+(panel.w-qrSize)/2;
    const qrY=panel.y+topSpace;

    if(state.poster.showTop&&state.poster.topText.trim()){
      ctx.fillStyle="#06183a";
      ctx.font="700 72px Arial, Helvetica, sans-serif";
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      drawWrappedText(ctx,state.poster.topText,panel.x+panel.w/2,panel.y+205,panel.w-240,90,2);
    }

    const temp=new window.QRCodeStyling({...getQrOptions(buildData()),width:qrSize,height:qrSize,type:"canvas",margin:48});
    const qrBlob=await temp.getRawData("png");
    const qrImage=await blobToImage(qrBlob);
    ctx.drawImage(qrImage,qrX,qrY,qrSize,qrSize);

    let footerY=qrY+qrSize+150;
    if(state.poster.showBottom&&state.poster.bottomText.trim()){
      ctx.fillStyle="#06183a";
      ctx.font="600 58px Arial, Helvetica, sans-serif";
      ctx.textAlign="center";
      ctx.textBaseline="middle";
      drawWrappedText(ctx,state.poster.bottomText,panel.x+panel.w/2,footerY,panel.w-240,74,2);
      footerY+=175;
    }
    if(state.poster.showWebsite){
      ctx.fillStyle="#68758a";
      ctx.font="700 38px Arial, Helvetica, sans-serif";
      ctx.textAlign="center";
      ctx.fillText("athanasinspires.com",panel.x+panel.w/2,Math.min(panel.y+panel.h-120,footerY));
    }
    return canvas;
  }

  function drawWrappedText(ctx,text,x,y,maxWidth,lineHeight,maxLines=2){
    const words=String(text).trim().split(/\s+/);
    const lines=[];
    let line="";
    for(const word of words){
      const test=line?`${line} ${word}`:word;
      if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;}
      else line=test;
    }
    if(line)lines.push(line);
    const visible=lines.slice(0,maxLines);
    if(lines.length>maxLines){
      let last=visible[maxLines-1];
      while(last&&ctx.measureText(`${last}…`).width>maxWidth)last=last.slice(0,-1);
      visible[maxLines-1]=`${last}…`;
    }
    const startY=y-((visible.length-1)*lineHeight)/2;
    visible.forEach((value,index)=>ctx.fillText(value,x,startY+index*lineHeight));
  }

  function resetBuilder(){
    state.step="type";
    state.type="website";
    state.values={};
    state.style={fg:"#06183a",bg:"#ffffff",dots:"rounded",corners:"extra-rounded"};
    state.logo={source:"",processed:"",shape:"rounded",size:26};
    state.poster={showTop:true,showBottom:true,showWebsite:true,topText:"Scan to open athanasinspires.com",bottomText:"Learn. Believe. Grow. Build.",topDirty:false,bottomDirty:false};
    state.touched.clear();
    state.visited=new Set(["type"]);
    dom.foreground.value=state.style.fg;dom.foregroundHex.value=state.style.fg.toUpperCase();
    dom.background.value=state.style.bg;dom.backgroundHex.value=state.style.bg.toUpperCase();
    dom.dots.value=state.style.dots;dom.corners.value=state.style.corners;
    dom.logoInput.value="";dom.logoControls.hidden=true;dom.logoImage.removeAttribute("src");
    dom.logoShape.value="rounded";dom.logoSize.value="26";dom.logoSizeOutput.textContent="26%";
    dom.typeSearch.value=TYPES.website.label;
    dom.showTop.checked=true;dom.showBottom.checked=true;dom.showWebsite.checked=true;
    dom.topText.value=state.poster.topText;dom.bottomText.value=state.poster.bottomText;
    dom.topText.disabled=false;dom.bottomText.disabled=false;
    dom.topTextField.classList.remove("is-disabled");dom.bottomTextField.classList.remove("is-disabled");
    dom.posterFormat.value="pdf";
    dom.testResult.hidden=true;
    updateTypeSummary();renderDynamicFields();setStep("type",false);updateEverything();
    toast("The QR builder has been reset.","success");
  }

  function cleanPhone(value){return String(value).replace(/\D/g,"");}
  function wifiEscape(value){return String(value).replace(/([\\;,:"])/g,"\\$1");}
  function normaliseHex(value){const clean=String(value).trim();return /^#[0-9a-f]{6}$/i.test(clean)?clean.toLowerCase():"";}
  function escapeHtml(value=""){return String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));}
  function safeFileName(value="qr-code"){return String(value).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"qr-code";}
  function readFileAsDataUrl(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(file);});}
  function loadImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src;});}
  function roundedPath(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}

  function hexToRgb(hex){let value=hex.replace("#","");if(value.length===3)value=value.split("").map(c=>c+c).join("");const n=parseInt(value,16);return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};}
  function luminance(hex){const {r,g,b}=hexToRgb(hex);const values=[r,g,b].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*values[0]+.7152*values[1]+.0722*values[2];}
  function getContrast(a,b){const l1=luminance(a),l2=luminance(b);return (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);}

  function blobDownload(blob,name){const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  async function blobToCanvas(blob){const image=await blobToImage(blob);const canvas=document.createElement("canvas");canvas.width=image.naturalWidth||1200;canvas.height=image.naturalHeight||1200;const ctx=canvas.getContext("2d");ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0);return canvas;}
  async function blobToImage(blob){const url=URL.createObjectURL(blob);try{return await loadImage(url);}finally{window.setTimeout(()=>URL.revokeObjectURL(url),0);}}
  function canvasToBlob(canvas,type,quality){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("Canvas export failed")),type,quality));}
  function dataUrlBytes(dataUrl){const binary=atob(dataUrl.split(",")[1]||"");const output=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)output[i]=binary.charCodeAt(i);return output;}
  function textBytes(value){return new TextEncoder().encode(String(value));}
  function joinBytes(parts){const size=parts.reduce((total,part)=>total+part.length,0);const output=new Uint8Array(size);let offset=0;parts.forEach(part=>{output.set(part,offset);offset+=part.length;});return output;}
  function buildPdfBlob(canvas,pageWidth=595.28,pageHeight=841.89){
    const header=new Uint8Array([37,80,68,70,45,49,46,52,10,37,226,227,207,211,10]);
    const jpeg=dataUrlBytes(canvas.toDataURL("image/jpeg",.95));
    const content=`q
${pageWidth} 0 0 ${pageHeight} 0 0 cm
/Im0 Do
Q
`;
    const objects=[];
    objects[1]=textBytes("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    objects[2]=textBytes("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
    objects[3]=textBytes(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
    objects[4]=joinBytes([textBytes(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`),jpeg,textBytes("\nendstream\nendobj\n")]);
    objects[5]=textBytes(`5 0 obj\n<< /Length ${textBytes(content).length} >>\nstream\n${content}endstream\nendobj\n`);
    const parts=[header],offsets=[0];let cursor=header.length;
    for(let i=1;i<=5;i++){offsets[i]=cursor;parts.push(objects[i]);cursor+=objects[i].length;}
    const xrefOffset=cursor;
    let xref="xref\n0 6\n0000000000 65535 f \n";
    for(let i=1;i<=5;i++)xref+=`${String(offsets[i]).padStart(10,"0")} 00000 n \n`;
    xref+=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    parts.push(textBytes(xref));
    return new Blob([joinBytes(parts)],{type:"application/pdf"});
  }

  function toast(message,type=""){
    clearTimeout(toastTimer);
    dom.toast.textContent=message;
    dom.toast.className=`qr-toast is-visible ${type}`.trim();
    toastTimer=setTimeout(()=>dom.toast.classList.remove("is-visible"),3200);
  }

  document.addEventListener("DOMContentLoaded",init);
})();
