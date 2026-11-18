---
category: productivity
type: guide
published: 2026-11-18
order: 183
status: published
cover: 📎 too large
tools: compress-image, split-pdf, video-converter
related: reduce-pdf-file-size, reduce-video-size-for-sharing
keyword: file too large to email
intent: troubleshooting
---
=== en ===
title: File too large to email? Practical ways to send it anyway
seo_title: File too large to email? What to do
description: Email attachment limits are lower than they look. How to shrink photos, PDFs, audio and video, split documents, or share a link instead, without ruining quality.
dek: A message bounces because the attachment is "too large", minutes before a deadline. Knowing why email limits bite and which file type to tackle first usually solves it in a few minutes.
---
## Why email limits are lower than they seem

Most email services limit the total size of a message, commonly somewhere around 20 to 25 MB for personal accounts, and company mail servers can be stricter. The limit applies to the whole message, and attachments are encoded for transport, which makes them roughly a third larger than the files on your disk. A 20 MB attachment can therefore push a message over a 25 MB limit.

The recipient's server matters too. Even if your provider accepts a large message, the receiving organisation may reject it.

## Step 1: find what is heavy

Look at the size of each attachment. Usually one file is the problem:

- **Photos** from phones: several megabytes each.
- **Scanned PDFs:** large because each page is an image.
- **Video:** even a short clip can exceed every email limit.
- **WAV recordings:** around 10 MB per minute of CD-quality stereo.

## Step 2: shrink the right way for each type

### Photos

Resize to a sensible size, then compress. For email, about 1600 pixels on the long side is plenty for viewing. The [image compressor](tool:compress-image) can target a size in KB and runs in your browser. Our guide to [reducing image size without losing visible quality](blog:reduce-image-size-without-losing-quality) explains the details.

### PDFs

Send only the pages needed by extracting them with [Split PDF](tool:split-pdf). For scanned or photo-based PDFs, recreate them at a lower resolution; see [why PDFs get so large](blog:reduce-pdf-file-size).

### Audio

Convert WAV recordings to MP3 or trim the silence. A 192 kbps MP3 is roughly a seventh of the size of a CD-quality WAV and is plenty for speech. See [trimming voice recordings](blog:trim-voice-recordings).

### Video

Video usually needs a different approach: share a link to a cloud copy, or reduce resolution and length before sending. The [Video Converter](tool:video-converter) changes formats on the Convertios backend for files up to 50 MB; our guide to [reducing video size for sharing](blog:reduce-video-size-for-sharing) explains what actually makes video files smaller.

## Step 3: if it is still too big

- **Split into several emails,** clearly labelled "part 1 of 3".
- **Share a link** from cloud storage your organisation approves. Check the sharing permissions: "anyone with the link" is convenient but public.
- **Ask the recipient** whether they have an upload portal for large files.

Zipping files rarely helps with photos, PDFs or video, because they are already compressed.

## Before you hit send

- Open each shrunken file to confirm it is still readable.
- Name attachments clearly so the recipient knows what they are; see our guide to [naming and organising files](blog:file-naming-and-organizing).
- Mention in the email body what is attached, especially if you split it into parts.
- Keep a copy of the originals; the smaller versions are for sending, not archiving.

## Why the limit is lower than the number you see

Email sends attachments as text using an encoding called Base64, which makes them about a third larger in transit. A 20 MB PDF can therefore count as roughly 27 MB against the limit. If a file is close to the advertised maximum, aim noticeably below it rather than exactly at it.

=== es ===
title: ¿Archivo demasiado grande para enviarlo por correo? Formas prácticas de enviarlo
seo_title: ¿Archivo demasiado grande para el correo? Qué hacer
description: Los límites de adjuntos son más bajos de lo que parecen. Cómo reducir fotos, PDF, audio y vídeo, dividir documentos o compartir un enlace sin estropear la calidad.
dek: Un correo rebota porque el adjunto es «demasiado grande», minutos antes de un plazo. Saber por qué fallan los límites y qué tipo de archivo atacar primero suele resolverlo en unos minutos.
---
## Por qué los límites del correo son más bajos de lo que parecen

La mayoría de servicios de correo limitan el tamaño total de un mensaje, a menudo en torno a 20 o 25 MB en cuentas personales, y los servidores de empresa pueden ser más estrictos. El límite se aplica al mensaje completo, y los adjuntos se codifican para el envío, lo que los hace aproximadamente un tercio más grandes que los archivos de tu disco. Por eso un adjunto de 20 MB puede hacer que un mensaje supere un límite de 25 MB.

El servidor del destinatario también cuenta. Aunque tu proveedor acepte un mensaje grande, la organización que lo recibe puede rechazarlo.

## Paso 1: localiza lo que pesa

Mira el tamaño de cada adjunto. Normalmente el problema es un solo archivo:

- **Fotos** del móvil: varios megas cada una.
- **PDF escaneados:** pesan porque cada página es una imagen.
- **Vídeo:** incluso un clip corto puede superar cualquier límite de correo.
- **Grabaciones WAV:** unos 10 MB por minuto en estéreo calidad CD.

## Paso 2: reduce cada tipo como corresponde

### Fotos

Redimensiona a un tamaño razonable y luego comprime. Para el correo, unos 1600 píxeles en el lado largo bastan para verlas. El [compresor de imágenes](tool:compress-image) puede apuntar a un tamaño en KB y funciona en tu navegador. Nuestra guía para [reducir el peso de una imagen sin perder calidad visible](blog:reduce-image-size-without-losing-quality) da los detalles.

### PDF

Envía solo las páginas necesarias extrayéndolas con [Dividir PDF](tool:split-pdf). Si el PDF es escaneado o de fotos, vuelve a crearlo con menos resolución; consulta [por qué los PDF pesan tanto](blog:reduce-pdf-file-size).

### Audio

Convierte las grabaciones WAV a MP3 o recorta los silencios. Un MP3 a 192 kbps ocupa aproximadamente una séptima parte de un WAV con calidad CD y basta de sobra para la voz. Consulta [cómo recortar grabaciones de voz](blog:trim-voice-recordings).

### Vídeo

El vídeo suele requerir otro enfoque: compartir un enlace a una copia en la nube, o reducir la resolución y la duración antes de enviarlo. El [Convertidor de vídeo](tool:video-converter) cambia formatos en el servidor de Convertios para archivos de hasta 50 MB; nuestra guía para [reducir el tamaño de un vídeo para compartirlo](blog:reduce-video-size-for-sharing) explica qué hace realmente más pequeño un vídeo.

## Paso 3: si sigue siendo demasiado grande

- **Divídelo en varios correos,** bien etiquetados como «parte 1 de 3».
- **Comparte un enlace** desde un almacenamiento en la nube que tu organización apruebe. Revisa los permisos: «cualquiera con el enlace» es cómodo, pero público.
- **Pregunta al destinatario** si tiene un portal de subida para archivos grandes.

Comprimir en ZIP rara vez ayuda con fotos, PDF o vídeo, porque ya están comprimidos.

## Antes de pulsar enviar

- Abre cada archivo reducido para confirmar que sigue legible.
- Pon nombres claros a los adjuntos para que el destinatario sepa qué son; consulta nuestra guía para [nombrar y organizar archivos](blog:file-naming-and-organizing).
- Indica en el cuerpo del correo qué adjuntas, sobre todo si lo has dividido en partes.

=== ar ===
title: الملف أكبر من أن يُرسل بالبريد؟ طرق عملية لإرساله رغم ذلك
seo_title: الملف كبير جداً للبريد الإلكتروني؟ ماذا تفعل
description: حدود المرفقات أقل مما تبدو. كيف تصغّر الصور وملفات PDF والصوت والفيديو، أو تقسم المستندات، أو تشارك رابطاً بدلاً منها دون إفساد الجودة.
dek: ترتد رسالة لأن المرفق «كبير جداً» قبل الموعد النهائي بدقائق. معرفة سبب حدود البريد وأي نوع ملفات تعالجه أولاً تحل المشكلة غالباً في دقائق.
---
## لماذا تكون حدود البريد أقل مما تبدو

تحدد معظم خدمات البريد الحجم الكلي للرسالة، وغالباً ما يكون في حدود 20 إلى 25 ميغابايت للحسابات الشخصية، وقد تكون خوادم الشركات أشد صرامة. ينطبق الحد على الرسالة كاملة، وتُرمَّز المرفقات للنقل فتصبح أكبر بنحو الثلث من حجمها على قرصك؛ لذلك قد يدفع مرفق بحجم 20 ميغابايت الرسالة إلى تجاوز حد 25 ميغابايت.

ويهم خادم المستلم أيضاً؛ فحتى لو قبل مزودك رسالة كبيرة فقد ترفضها الجهة المستقبلة.

## الخطوة 1: اعرف ما الثقيل

انظر إلى حجم كل مرفق، وغالباً ما يكون ملف واحد هو المشكلة:

- **صور الهاتف:** عدة ميغابايتات لكل صورة.
- **ملفات PDF الممسوحة:** كبيرة لأن كل صفحة صورة.
- **الفيديو:** حتى المقطع القصير قد يتجاوز كل حدود البريد.
- **تسجيلات WAV:** نحو 10 ميغابايت لكل دقيقة ستيريو بجودة CD.

## الخطوة 2: صغّر كل نوع بالطريقة المناسبة

### الصور

غيّر الأبعاد إلى حجم معقول ثم اضغط. للبريد يكفي نحو 1600 بكسل في الضلع الطويل للعرض. يستطيع [ضاغط الصور](tool:compress-image) استهداف حجم بالكيلوبايت ويعمل داخل متصفحك، ويشرح دليلنا [لتقليل حجم الصورة دون خسارة جودة مرئية](blog:reduce-image-size-without-losing-quality) التفاصيل.

### ملفات PDF

أرسل الصفحات المطلوبة فقط باستخراجها بأداة [تقسيم PDF](tool:split-pdf). وإذا كان الملف ممسوحاً أو مصنوعاً من صور فأعد إنشاءه بدقة أقل؛ راجع [سبب كبر حجم ملفات PDF](blog:reduce-pdf-file-size).

### الصوت

حوّل تسجيلات WAV إلى MP3 أو قصّ الصمت. ملف MP3 بمعدل 192 kbps يبلغ نحو سُبع حجم WAV بجودة CD وهو أكثر من كافٍ للكلام. راجع [قص التسجيلات الصوتية](blog:trim-voice-recordings).

### الفيديو

يحتاج الفيديو غالباً إلى نهج مختلف: شارك رابطاً لنسخة سحابية، أو قلل الدقة والمدة قبل الإرسال. يغيّر [محوّل صيغ الفيديو](tool:video-converter) الصيغ على خادم Convertios لملفات حتى 50 ميغابايت، ويشرح دليلنا [لتصغير حجم الفيديو للمشاركة](blog:reduce-video-size-for-sharing) ما الذي يصغّر الفيديو فعلاً.

## الخطوة 3: إن بقي كبيراً جداً

- **قسّمه على عدة رسائل** بعناوين واضحة مثل «الجزء 1 من 3».
- **شارك رابطاً** من خدمة تخزين سحابي توافق عليها جهتك، وتحقق من صلاحيات المشاركة؛ فخيار «أي شخص لديه الرابط» مريح لكنه عام.
- **اسأل المستلم** هل لديه بوابة رفع للملفات الكبيرة.

نادراً ما يفيد ضغط الملفات بصيغة ZIP مع الصور وPDF والفيديو لأنها مضغوطة أصلاً.

## قبل أن تضغط إرسال

- افتح كل ملف مصغّر للتأكد أنه ما زال مقروءاً.
- سمِّ المرفقات بوضوح ليعرف المستلم محتواها؛ راجع دليلنا [لتسمية الملفات وتنظيمها](blog:file-naming-and-organizing).
- اذكر في نص الرسالة ما أرفقته، خصوصاً إذا قسمته إلى أجزاء.

=== pt-br ===
title: Arquivo grande demais para mandar por e-mail? Formas práticas de enviar mesmo assim
seo_title: Arquivo grande demais para o e-mail? O que fazer
description: Os limites de anexo são menores do que parecem. Como diminuir fotos, PDFs, áudio e vídeo, dividir documentos ou compartilhar um link sem estragar a qualidade.
dek: Um e-mail volta porque o anexo é "grande demais", minutos antes do prazo. Entender por que os limites pegam e qual tipo de arquivo atacar primeiro costuma resolver em poucos minutos.
---
## Por que os limites de e-mail são menores do que parecem

A maioria dos serviços de e-mail limita o tamanho total da mensagem, muitas vezes por volta de 20 a 25 MB em contas pessoais, e servidores de empresas podem ser mais rígidos. O limite vale para a mensagem inteira, e os anexos são codificados para o envio, o que os deixa cerca de um terço maiores do que no seu disco. Por isso, um anexo de 20 MB pode fazer a mensagem passar de um limite de 25 MB.

O servidor de quem recebe também conta. Mesmo que o seu provedor aceite uma mensagem grande, a organização que recebe pode recusá-la.

## Passo 1: descubra o que pesa

Veja o tamanho de cada anexo. Normalmente o problema é um arquivo só:

- **Fotos** do celular: vários megas cada uma.
- **PDFs digitalizados:** pesados porque cada página é uma imagem.
- **Vídeo:** até um trecho curto pode passar de qualquer limite de e-mail.
- **Gravações WAV:** cerca de 10 MB por minuto em estéreo com qualidade de CD.

## Passo 2: diminua cada tipo do jeito certo

### Fotos

Redimensione para um tamanho sensato e depois comprima. Para e-mail, cerca de 1.600 pixels no lado maior é suficiente para ver. O [compressor de imagens](tool:compress-image) pode mirar um tamanho em KB e funciona no navegador. Nosso guia para [diminuir o tamanho da imagem sem perder qualidade visível](blog:reduce-image-size-without-losing-quality) explica os detalhes.

### PDFs

Envie só as páginas necessárias, extraindo com o [Dividir PDF](tool:split-pdf). Se o PDF for digitalizado ou feito de fotos, gere de novo com resolução menor; veja [por que PDFs ficam tão grandes](blog:reduce-pdf-file-size).

### Áudio

Converta gravações WAV em MP3 ou corte os silêncios. Um MP3 a 192 kbps tem cerca de um sétimo do tamanho de um WAV com qualidade de CD e é mais do que suficiente para voz. Veja [como cortar gravações de voz](blog:trim-voice-recordings).

### Vídeo

Vídeo normalmente pede outra abordagem: compartilhe um link para uma cópia na nuvem ou reduza resolução e duração antes de enviar. O [Conversor de formatos de vídeo](tool:video-converter) troca formatos no servidor da Convertios para arquivos de até 50 MB; nosso guia para [diminuir o tamanho de um vídeo para compartilhar](blog:reduce-video-size-for-sharing) explica o que realmente deixa um vídeo menor.

## Passo 3: se ainda estiver grande demais

- **Divida em vários e-mails,** com nomes claros como "parte 1 de 3".
- **Compartilhe um link** de um armazenamento em nuvem aprovado pela sua organização. Confira as permissões: "qualquer pessoa com o link" é prático, mas público.
- **Pergunte a quem vai receber** se existe um portal de envio para arquivos grandes.

Zipar raramente ajuda com fotos, PDFs ou vídeo, porque eles já são comprimidos.

## Antes de clicar em enviar

- Abra cada arquivo reduzido para confirmar que continua legível.
- Dê nomes claros aos anexos para quem recebe saber o que são; veja nosso guia para [nomear e organizar arquivos](blog:file-naming-and-organizing).
- Diga no corpo do e-mail o que está anexado, principalmente se você dividiu em partes.
