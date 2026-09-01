(function(){
  const root=document.body;
  const mode=root.dataset.videoMode;
  if(!mode) return;

  const locale=root.dataset.locale || 'en';
  const text={
    en:{tooLarge:'The file is larger than 50 MB.',working:'Uploading and converting… Larger videos can take several minutes.',cold:' A sleeping free server may take up to a minute to wake.',failed:'Conversion failed. Please try a smaller or different video.',successMp3:'MP3 created successfully.',successVideo:'Video converted successfully.'},
    ar:{tooLarge:'حجم الملف أكبر من 50 ميجابايت.',working:'جارٍ رفع الفيديو وتحويله… قد تستغرق الملفات الكبيرة عدة دقائق.',cold:' قد يحتاج الخادم المجاني إلى دقيقة ليعمل.',failed:'فشل التحويل. جرّب فيديو أصغر أو بصيغة مختلفة.',successMp3:'تم إنشاء ملف MP3 بنجاح.',successVideo:'تم تحويل الفيديو بنجاح.'},
    es:{tooLarge:'El archivo supera los 50 MB.',working:'Subiendo y convirtiendo… Los vídeos grandes pueden tardar varios minutos.',cold:' El servidor gratuito puede tardar hasta un minuto en activarse.',failed:'La conversión ha fallado. Prueba con un vídeo más pequeño o diferente.',successMp3:'MP3 creado correctamente.',successVideo:'Vídeo convertido correctamente.'}
  }[locale];
  const formats=[
    ['mp4','MP4'],['webm','WEBM'],['mov','MOV'],['mkv','MKV'],['avi','AVI'],['m4v','M4V'],
    ['mpg','MPG'],['mpeg','MPEG'],['flv','FLV'],['wmv','WMV'],['3gp','3GP'],['ogv','OGV'],['ts','TS']
  ];
  const backend='https://convertios-backend-sn5u.onrender.com';
  const file=document.getElementById('videoFile');
  const button=document.getElementById('videoConvert');
  const status=document.getElementById('videoStatus');
  const note=document.getElementById('videoFileNote');
  const dropzone=document.getElementById('videoDropzone');
  const progress=document.getElementById('videoProgress');
  const format=document.getElementById('videoFormat');

  if(format) formats.forEach(([value,label])=>format.add(new Option(label,value)));
  function select(chosen){
    if(!chosen) return;
    if(chosen.size>50*1024*1024){status.textContent=text.tooLarge;file.value='';button.disabled=true;return;}
    note.textContent=chosen.name+' · '+(chosen.size/1048576).toFixed(1)+' MB';
    status.textContent='';button.disabled=false;
  }
  file.addEventListener('change',()=>select(file.files[0]));
  ['dragenter','dragover'].forEach(name=>dropzone.addEventListener(name,event=>{event.preventDefault();dropzone.classList.add('is-dragging');}));
  ['dragleave','drop'].forEach(name=>dropzone.addEventListener(name,event=>{event.preventDefault();dropzone.classList.remove('is-dragging');}));
  dropzone.addEventListener('drop',event=>{const chosen=event.dataTransfer.files[0];if(!chosen)return;const transfer=new DataTransfer();transfer.items.add(chosen);file.files=transfer.files;select(chosen);});
  button.addEventListener('click',async()=>{
    const chosen=file.files[0];if(!chosen)return;
    button.disabled=true;progress.style.display='block';status.textContent=text.working+text.cold;
    try{
      const data=new FormData();data.append('file',chosen);if(mode==='video')data.append('format',format.value);
      const endpoint=mode==='mp3'?'/convert/video-to-mp3':'/convert/video';
      const response=await fetch(backend+endpoint,{method:'POST',body:data});
      if(!response.ok) throw new Error(text.failed);
      const blob=await response.blob();
      const extension=mode==='mp3'?'mp3':format.value;
      const url=URL.createObjectURL(blob);const anchor=document.createElement('a');
      anchor.href=url;anchor.download=chosen.name.replace(/\.[^.]+$/,'')+'.'+extension;anchor.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      status.textContent=mode==='mp3'?text.successMp3:text.successVideo;
    }catch(error){status.textContent=error.message||text.failed;}
    finally{progress.style.display='none';button.disabled=false;}
  });
})();
