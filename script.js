(function(){
  function closeDropdown(dropdown){
    const trigger=dropdown.querySelector('.dropdown-trigger,[data-dropdown-trigger]');
    dropdown.classList.remove('open');
    if(trigger) trigger.setAttribute('aria-expanded','false');
  }

  function openDropdown(dropdown){
    const trigger=dropdown.querySelector('.dropdown-trigger,[data-dropdown-trigger]');
    dropdown.classList.add('open');
    if(trigger) trigger.setAttribute('aria-expanded','true');
  }

  function getLanguageCounterpartPath(pathname,targetLang){
    const cleanPath=(pathname||'/').split('#')[0].split('?')[0];
    const normalized=cleanPath.startsWith('/') ? cleanPath : '/'+cleanPath;
    const pathWithoutLanguage=normalized.replace(/^\/(?:ar|es)(?=\/|$)/,'') || '/';

    if(targetLang==='ar') return pathWithoutLanguage==='/' ? '/ar/' : '/ar'+pathWithoutLanguage;
    if(targetLang==='es') return pathWithoutLanguage==='/' ? '/es/' : '/es'+pathWithoutLanguage;
    return pathWithoutLanguage || '/';
  }

  function getCurrentLanguage(pathname){
    const normalized=(pathname||'/').startsWith('/') ? (pathname||'/') : '/'+pathname;
    if(normalized==='/ar' || normalized.startsWith('/ar/')) return 'ar';
    if(normalized==='/es' || normalized.startsWith('/es/')) return 'es';
    return 'en';
  }

  function languageLabel(language){
    if(language==='ar') return 'العربية';
    if(language==='es') return 'Español';
    return 'English';
  }

  function languageAriaLabel(language){
    if(language==='ar') return 'اختيار اللغة';
    if(language==='es') return 'Cambiar idioma';
    return 'Change language';
  }

  function inferTargetLanguage(link,currentLanguage){
    const text=(link.textContent||'').trim().toLowerCase();
    const hreflang=(link.getAttribute('hreflang')||'').toLowerCase();
    const lang=(link.getAttribute('lang')||'').toLowerCase();

    if(hreflang==='ar' || lang==='ar' || text==='ar' || text.includes('العربية')) return 'ar';
    if(hreflang==='es' || lang==='es' || text==='es' || text.includes('español')) return 'es';
    if(hreflang==='en' || lang==='en' || text==='en' || text.includes('english') || text.includes('الإنجليزية')) return 'en';

    return currentLanguage;
  }

  function isExternalNonConvertios(href){
    if(!/^https?:\/\//i.test(href)) return false;
    try{
      return !/convertios\.com$/i.test(new URL(href).hostname);
    }catch(_err){
      return true;
    }
  }



  function ensureHeaderLanguageSwitcher(){
    const pathname=window.location.pathname || '/';
    const currentLanguage=getCurrentLanguage(pathname);
    const currentIsArabic=currentLanguage==='ar';
    const existingHeaders=document.querySelectorAll('.header-language-switch');

    existingHeaders.forEach(function(container){
      if(container.closest('.language-selector')) return;
      if(container.tagName.toLowerCase()==='details' && container.classList.contains('language-selector')) return;

      const links=container.querySelectorAll('a');
      if(links.length<2) return;

      const details=document.createElement('details');
      details.className=currentIsArabic ? 'language-selector ar-language-selector' : 'language-selector';

      const summary=document.createElement('summary');
      summary.setAttribute('aria-label',languageAriaLabel(currentLanguage));
      summary.innerHTML='<span class="language-selector__globe" aria-hidden="true">🌐</span><span class="language-selector__label">'+languageLabel(currentLanguage)+'</span>';

      const menu=document.createElement('div');
      menu.className='language-selector__menu';
      menu.setAttribute('role','menu');
      menu.setAttribute('aria-label','Language options');

      const enLink=links[0].cloneNode(true);
      const arLink=links[1].cloneNode(true);

      arLink.setAttribute('lang','ar');
      arLink.setAttribute('dir','rtl');
      enLink.setAttribute('hreflang','en');
      enLink.textContent='English';
      arLink.textContent='العربية';
      enLink.removeAttribute('aria-current');
      arLink.removeAttribute('aria-current');
      enLink.setAttribute('role','menuitem');
      arLink.setAttribute('role','menuitem');

      menu.appendChild(arLink);
      menu.appendChild(enLink);
      details.appendChild(summary);
      details.appendChild(menu);
      container.replaceWith(details);
    });


    if(!document.querySelector('.site-header .language-selector')){
      const host=document.querySelector('.site-header .faq-wrapper') || document.querySelector('.site-header .nav-icon') || document.querySelector('.site-header');
      if(host){
        const details=document.createElement('details');
        details.className=currentIsArabic ? 'language-selector ar-language-selector' : 'language-selector';

        const summary=document.createElement('summary');
        summary.setAttribute('aria-label',languageAriaLabel(currentLanguage));
        summary.innerHTML='<span class="language-selector__globe" aria-hidden="true">🌐</span><span class="language-selector__label">'+languageLabel(currentLanguage)+'</span>';

        const menu=document.createElement('div');
        menu.className='language-selector__menu';
        menu.setAttribute('role','menu');
        menu.setAttribute('aria-label','Language options');

        const arLink=document.createElement('a');
        arLink.href='/ar/';
        arLink.lang='ar';
        arLink.dir='rtl';
        arLink.textContent='العربية';
        arLink.setAttribute('role','menuitem');

        const enLink=document.createElement('a');
        enLink.href='/';
        enLink.hreflang='en';
        enLink.textContent='English';
        enLink.setAttribute('role','menuitem');

        menu.appendChild(arLink);
        menu.appendChild(enLink);
        details.appendChild(summary);
        details.appendChild(menu);

        if(host.classList.contains('faq-wrapper') || host.classList.contains('nav-icon')) host.appendChild(details);
        else host.insertBefore(details,host.firstChild);
      }
    }

  }

  function normalizeLanguageSelectorLabels(){
    const pathname=window.location.pathname || '/';
    const currentLanguage=getCurrentLanguage(pathname);
    const currentIsArabic=currentLanguage==='ar';
    const labelText=languageLabel(currentLanguage);
    const ariaLabel=languageAriaLabel(currentLanguage);

    document.querySelectorAll('.language-selector').forEach(function(selector){
      selector.classList.toggle('ar-language-selector',currentIsArabic);
      const summary=selector.querySelector('summary');
      if(!summary) return;
      summary.setAttribute('aria-label',ariaLabel);
      const label=summary.querySelector('.language-selector__label');
      if(label) label.textContent=labelText;
    });
  }

  function updateLanguageSwitcherLinks(){
    const pathname=window.location.pathname || '/';
    const currentLanguage=getCurrentLanguage(pathname);
    const selectors=['.header-language-switch a','.language-selector__menu a','.lang-switch a'];

    document.querySelectorAll(selectors.join(',')).forEach(function(link){
      const href=link.getAttribute('href')||'';
      if(!href || isExternalNonConvertios(href)) return;

      const targetLang=inferTargetLanguage(link,currentLanguage);
      const targetPath=getLanguageCounterpartPath(pathname,targetLang);

      if(/^https?:\/\//i.test(href)){
        try{
          const url=new URL(href);
          url.pathname=targetPath;
          url.search='';
          url.hash='';
          link.setAttribute('href',url.toString());
        }catch(_err){
          link.setAttribute('href',targetPath);
        }
      }else{
        link.setAttribute('href',targetPath);
      }

      if(targetLang==='ar'){
        link.setAttribute('lang','ar');
        link.setAttribute('dir','rtl');
      }
    });
  }



  function initHomepageToolSearch(){
    const searchInput=document.getElementById('toolSearch');
    const resultsBox=document.getElementById('searchResults');
    if(!searchInput || !resultsBox) return;

    const toolsData=[
      { name: 'PDF to Word', url: '/pdf-to-word/', keywords: 'pdf word document' },
      { name: 'PDF to JPG', url: '/pdf-to-jpg/', keywords: 'pdf image jpg' },
      { name: 'JPG to PDF', url: '/jpg-to-pdf/', keywords: 'jpg pdf image' },
      { name: 'Merge PDF', url: '/merge-pdf/', keywords: 'merge pdf combine' },
      { name: 'Split PDF', url: '/split-pdf/', keywords: 'split pdf separate' },
      { name: 'Rotate PDF', url: '/rotate-pdf/', keywords: 'rotate pdf' },
      { name: 'PNG to JPG', url: '/png-to-jpg/', keywords: 'png jpg image convert' },
      { name: 'JPG to PNG', url: '/jpg-to-png/', keywords: 'jpg png image' },
      { name: 'WEBP to PNG', url: '/webp-to-png/', keywords: 'webp png image' },
      { name: 'Image Converter', url: '/image-converter/', keywords: 'image convert' },
      { name: 'Image Resizer', url: '/image-resizer/', keywords: 'resize image' },
      { name: 'Compress Image', url: '/compress-image/', keywords: 'compress image reduce size' },
      { name: 'Remove Background', url: '/remove-bg/', keywords: 'remove background image' },
      { name: 'MP3 Cutter', url: '/mp3-cutter/', keywords: 'mp3 audio cut trim' },
      { name: 'Audio Converter', url: '/audio-converter/', keywords: 'audio convert mp3 wav' },
      { name: 'Audio Speed Changer', url: '/audio-speed-changer/', keywords: 'audio speed change' },
      { name: 'QR Code Generator', url: '/qr-generator/', keywords: 'qr code generator' },
      { name: 'Link Shortener', url: '/link-shortener/', keywords: 'shorten link url' },
      { name: 'Password Generator', url: '/password-generator/', keywords: 'generate password' },
      { name: 'Word Counter', url: '/word-counter/', keywords: 'count words text' },
      { name: 'Text Formatter', url: '/text-formatter/', keywords: 'format text clean' },
      { name: 'Unit Converter', url: '/unit-converter/', keywords: 'convert units' },
      { name: 'Meme Generator', url: '/meme-generator/', keywords: 'meme generator create' }
    ];

    const spanishPages=new Set([
      'all-tools','image-tools','png-to-jpg','jpg-to-png','webp-to-png',
      'image-converter','image-resizer','compress-image','remove-bg','mp3-cutter',
      'ai-image-enhancer','social-media-image-resizer','compress-image-to-20kb',
      'compress-image-to-50kb','compress-image-to-100kb'
    ]);

    function localizedToolUrl(url){
      if(getCurrentLanguage(window.location.pathname)!=='es') return url;
      const slug=(url||'').replace(/^\//,'').split('/')[0];
      return spanishPages.has(slug) ? '/es/'+slug+'/' : url;
    }

    searchInput.addEventListener('input',function(){
      const value=this.value.toLowerCase().trim();
      resultsBox.innerHTML='';
      if(!value){ resultsBox.style.display='none'; return; }
      const filtered=toolsData.filter(tool => tool.name.toLowerCase().includes(value) || tool.keywords.toLowerCase().includes(value));
      if(!filtered.length){ resultsBox.style.display='none'; return; }
      filtered.forEach(tool => {
        const div=document.createElement('div');
        div.className='search-item';
        div.textContent=tool.name;
        div.addEventListener('click',() => { window.location.href=localizedToolUrl(tool.url); });
        resultsBox.appendChild(div);
      });
      resultsBox.style.display='block';
    });

    document.addEventListener('click',function(e){
      const wrapper=document.querySelector('.hero-search');
      if(wrapper && !wrapper.contains(e.target)) resultsBox.style.display='none';
    });
  }

  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('.nav-item.dropdown').forEach(function(dropdown,index){
      const menu=dropdown.querySelector('.dropdown-menu');
      const trigger=dropdown.querySelector(':scope > span, :scope > button');
      if(!menu || !trigger) return;

      const menuId=menu.id || 'dropdown-menu-'+index;
      menu.id=menuId;
      trigger.classList.add('dropdown-trigger');
      trigger.setAttribute('role','button');
      trigger.setAttribute('tabindex','0');
      trigger.setAttribute('aria-haspopup','true');
      trigger.setAttribute('aria-controls',menuId);
      trigger.setAttribute('aria-expanded','false');
      trigger.dataset.dropdownTrigger='true';

      trigger.addEventListener('click',function(event){
        event.preventDefault();
        dropdown.classList.contains('open') ? closeDropdown(dropdown) : openDropdown(dropdown);
      });

      trigger.addEventListener('keydown',function(event){
        if(event.key==='Enter' || event.key===' '){
          event.preventDefault();
          dropdown.classList.contains('open') ? closeDropdown(dropdown) : openDropdown(dropdown);
        }
        if(event.key==='Escape'){
          closeDropdown(dropdown);
          trigger.focus();
        }
      });

      menu.addEventListener('keydown',function(event){
        if(event.key==='Escape'){
          closeDropdown(dropdown);
          trigger.focus();
        }
      });
    });

    document.addEventListener('click',function(event){
      document.querySelectorAll('.nav-item.dropdown.open').forEach(function(dropdown){
        if(!dropdown.contains(event.target)) closeDropdown(dropdown);
      });
    });

    ensureHeaderLanguageSwitcher();
    normalizeLanguageSelectorLabels();
    updateLanguageSwitcherLinks();
    initHomepageToolSearch();

    document.querySelectorAll('.dropzone').forEach(function(dropzone){
      if(!dropzone.hasAttribute('tabindex')) dropzone.setAttribute('tabindex','0');
      if(!dropzone.hasAttribute('role')) dropzone.setAttribute('role','button');
      if(!dropzone.hasAttribute('aria-label')) dropzone.setAttribute('aria-label','Choose or drop a file');
      dropzone.addEventListener('keydown',function(event){
        if(event.key==='Enter' || event.key===' '){
          const input=dropzone.querySelector('input[type="file"]') || document.querySelector('input[type="file"]');
          if(input){
            event.preventDefault();
            input.click();
          }
        }
      });
    });
  });
})();
