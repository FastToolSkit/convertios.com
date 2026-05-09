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
