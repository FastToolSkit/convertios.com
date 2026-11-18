---
category: audio-video
type: guide
published: 2026-11-18
order: 154
status: published
cover_image: reduce-video-size-for-sharing
cover: 4K → 1080p · MB ↓
tools: video-converter, video-to-mp3
related: email-attachment-size-limits, video-formats-compared
keyword: reduce video file size
intent: how-to
---
=== en ===
cover_alt: A film reel feeds a smaller video frame
title: How to reduce video file size for sharing without ruining it
seo_title: Reduce video file size for sharing
description: Why phone videos are so large, which settings actually shrink them (resolution, bitrate, codec, length) and when to share a link instead of the file.
dek: A one-minute 4K clip from a phone can be several hundred megabytes. Knowing which of four factors drives that size tells you what to change, and what you can leave alone.
---
## What makes a video file large

Video file size is roughly **bitrate × duration**. Bitrate, the amount of data used per second, depends mainly on:

- **Resolution:** 4K (3840×2160) has four times the pixels of 1080p (1920×1080).
- **Frame rate:** 60 frames per second needs more data than 30.
- **Codec and settings:** how efficiently the frames are compressed. Phones often record at high bitrates so the original keeps maximum detail.
- **Audio:** usually a small share of the total, unless the video is very short or the audio is uncompressed.

So the four practical levers are: shorten it, lower the resolution, lower the frame rate, or re-encode at a lower bitrate with an efficient codec.

## Start with the cheapest fix: length

Cutting a three-minute recording down to the 40 seconds that matter reduces the file by roughly three quarters without touching quality. Most phone gallery apps can trim a clip before sharing.

## Lower the resolution for small screens

Most people watch shared clips on a phone. 1080p, or even 720p, looks fine there, and dropping from 4K to 1080p usually reduces the size dramatically. Many phones let you choose the recording resolution in camera settings; recording at 1080p from the start avoids the problem for everyday clips.

## Re-encode with a standard codec

Re-encoding (converting) a video compresses it again. H.264 in an MP4 container is the most compatible choice: it plays on almost every phone, computer and messaging app. Newer codecs such as H.265 (HEVC), VP9 and AV1 compress better but are not supported everywhere; see our [video formats comparison](blog:video-formats-compared).

The Convertios [Video Converter](tool:video-converter) sends your file to our server, where FFmpeg converts it. Choosing MP4 produces H.264 video with AAC audio at a standard quality setting. For a high-bitrate phone recording this often gives a smaller file, but it is not a target-size tool: it does not change resolution, and a video that is already efficiently compressed may not get smaller. Uploads are limited to 50 MB.

## If only the sound matters

For a recorded talk, lecture or voice message, the audio alone may be enough. [Video to MP3](tool:video-to-mp3) extracts the soundtrack as a 192 kbps MP3, which is far smaller than the video.

## When to share a link instead

Email providers commonly cap attachments around 20–25 MB, and messaging apps may compress videos heavily or limit their size; see [email attachment limits](blog:email-attachment-size-limits). For long or high-quality videos, uploading to a cloud drive or video platform and sending a link is usually better than shrinking the file until it looks poor.

## Quality checks before you send

- Watch the result on a phone, the way the recipient will.
- Check that text on screen, such as slides, is still readable.
- Listen for audio sync problems.
- Keep the original; every re-encode loses some detail, so always convert from the best copy you have.

=== es ===
cover_alt: Un carrete alimenta un fotograma más pequeño
title: Cómo reducir el tamaño de un vídeo para compartirlo sin estropearlo
seo_title: Reducir el tamaño de un vídeo para compartir
description: Por qué los vídeos del móvil pesan tanto, qué ajustes los reducen de verdad (resolución, bitrate, códec y duración) y cuándo conviene enviar un enlace.
dek: Un clip 4K de un minuto grabado con el móvil puede ocupar varios cientos de megabytes. Saber cuál de cuatro factores determina ese tamaño te dice qué cambiar y qué dejar como está.
---
## Qué hace que un vídeo pese tanto

El tamaño de un vídeo es, aproximadamente, **bitrate × duración**. El bitrate, la cantidad de datos por segundo, depende sobre todo de:

- **Resolución:** el 4K (3840×2160) tiene cuatro veces los píxeles del 1080p (1920×1080).
- **Fotogramas por segundo:** 60 fps necesitan más datos que 30.
- **Códec y ajustes:** la eficiencia con la que se comprimen los fotogramas. Los móviles suelen grabar con bitrates altos para conservar el máximo detalle.
- **Audio:** normalmente una parte pequeña del total.

Por tanto, las cuatro palancas prácticas son: acortarlo, bajar la resolución, bajar los fotogramas por segundo o recodificarlo a un bitrate menor con un códec eficiente.

## Empieza por lo más fácil: la duración

Recortar una grabación de tres minutos a los 40 segundos importantes reduce el archivo en torno a tres cuartas partes sin tocar la calidad. La mayoría de galerías del móvil permiten recortar antes de compartir.

## Baja la resolución para pantallas pequeñas

Casi todo el mundo ve los clips compartidos en el móvil, donde 1080p o incluso 720p se ven bien. Pasar de 4K a 1080p suele reducir mucho el tamaño. Muchos móviles permiten elegir la resolución de grabación en los ajustes de la cámara; grabar en 1080p desde el principio evita el problema en los clips del día a día.

## Recodifica con un códec estándar

Recodificar (convertir) un vídeo lo comprime de nuevo. H.264 dentro de un MP4 es la opción más compatible: se reproduce en casi cualquier móvil, ordenador y aplicación de mensajería. Códecs más nuevos como H.265 (HEVC), VP9 o AV1 comprimen mejor, pero no funcionan en todas partes; consulta nuestra [comparativa de formatos de vídeo](blog:video-formats-compared).

El [Conversor de vídeo](tool:video-converter) de Convertios envía tu archivo a nuestro servidor, donde FFmpeg lo convierte. Si eliges MP4, obtienes vídeo H.264 con audio AAC a una calidad estándar. Con una grabación del móvil de bitrate alto, el resultado suele pesar menos, pero no es una herramienta de tamaño objetivo: no cambia la resolución y un vídeo ya bien comprimido puede no reducirse. El límite de subida es de 50 MB.

## Si solo importa el sonido

Para una charla, una clase o un mensaje de voz grabado, puede bastar con el audio. [Vídeo a MP3](tool:video-to-mp3) extrae la pista de sonido como MP3 a 192 kbps, mucho más ligero que el vídeo.

## Cuándo enviar un enlace

Los proveedores de correo suelen limitar los adjuntos a unos 20–25 MB, y las aplicaciones de mensajería pueden comprimir mucho los vídeos o limitar su tamaño; consulta los [límites de adjuntos de correo](blog:email-attachment-size-limits). Para vídeos largos o de alta calidad, suele ser mejor subirlos a una nube o plataforma de vídeo y enviar un enlace que reducirlos hasta que se vean mal.

## Comprobaciones antes de enviar

- Mira el resultado en un móvil, como lo verá quien lo reciba.
- Comprueba que los textos en pantalla, como diapositivas, siguen siendo legibles.
- Escucha si el audio va sincronizado.
- Conserva el original: cada recodificación pierde algo de detalle, así que convierte siempre desde la mejor copia.

=== ar ===
cover_alt: بكرة فيلم تغذي إطار فيديو أصغر
title: كيف تقلل حجم الفيديو لمشاركته دون إفساده
seo_title: تقليل حجم ملف الفيديو للمشاركة
description: لماذا تكون فيديوهات الهاتف كبيرة، وأي الإعدادات تصغّرها فعلاً (الدقة ومعدل البت والترميز والمدة)، ومتى يكون إرسال رابط أفضل من إرسال الملف.
dek: قد يبلغ مقطع 4K مدته دقيقة واحدة من الهاتف مئات الميغابايت. معرفة أي العوامل الأربعة يحدد هذا الحجم تخبرك بما يجب تغييره وما يمكن تركه.
---
## ما الذي يجعل ملف الفيديو كبيراً

حجم الفيديو يساوي تقريباً **معدل البت × المدة**. ومعدل البت، أي كمية البيانات في الثانية، يعتمد أساساً على:

- **الدقة:** فيها 4K (3840×2160) أربعة أضعاف بكسلات 1080p (1920×1080).
- **معدل الإطارات:** يحتاج 60 إطاراً في الثانية إلى بيانات أكثر من 30.
- **الترميز وإعداداته:** مدى كفاءة ضغط الإطارات. وكثيراً ما تسجل الهواتف بمعدل بت مرتفع للحفاظ على أكبر قدر من التفاصيل.
- **الصوت:** عادة جزء صغير من الحجم الكلي.

إذن الوسائل العملية أربع: تقصير المقطع، أو خفض الدقة، أو خفض معدل الإطارات، أو إعادة الترميز بمعدل بت أقل وبترميز فعال.

## ابدأ بالحل الأسهل: المدة

قصّ تسجيل مدته ثلاث دقائق إلى الأربعين ثانية المهمة يقلل الملف بنحو ثلاثة أرباع دون المساس بالجودة. ومعظم تطبيقات المعرض في الهواتف تسمح بقص المقطع قبل مشاركته.

## اخفض الدقة للشاشات الصغيرة

يشاهد معظم الناس المقاطع المرسلة على الهاتف، وتبدو دقة 1080p أو حتى 720p جيدة عليه. والانتقال من 4K إلى 1080p يقلل الحجم عادة بشكل كبير. وتتيح هواتف كثيرة اختيار دقة التسجيل من إعدادات الكاميرا، فالتسجيل بدقة 1080p من البداية يجنبك المشكلة في المقاطع اليومية.

## أعد الترميز بترميز قياسي

إعادة ترميز الفيديو (تحويله) تضغطه مرة أخرى. ويُعد H.264 داخل حاوية MP4 الخيار الأكثر توافقاً، إذ يعمل على أغلب الهواتف والحواسيب وتطبيقات المراسلة. أما الترميزات الأحدث مثل H.265 (HEVC) وVP9 وAV1 فتضغط أفضل لكنها غير مدعومة في كل مكان؛ راجع [مقارنة صيغ الفيديو](blog:video-formats-compared).

يرسل [محوّل الفيديو](tool:video-converter) في Convertios ملفك إلى خادمنا حيث يحوله FFmpeg. واختيار MP4 ينتج فيديو H.264 مع صوت AAC بإعداد جودة قياسي. وفي تسجيلات الهاتف ذات معدل البت المرتفع ينتج ذلك غالباً ملفاً أصغر، لكنها ليست أداة لحجم مستهدف: فهي لا تغيّر الدقة، وقد لا يصغر فيديو مضغوط بكفاءة أصلاً. والحد الأقصى للرفع 50 ميغابايت.

## إذا كان الصوت هو المهم فقط

في محاضرة أو درس أو رسالة صوتية مسجلة قد يكفي الصوت وحده. تستخرج أداة [تحويل الفيديو إلى MP3](tool:video-to-mp3) المسار الصوتي بصيغة MP3 بمعدل 192 كيلوبت في الثانية، وهو أصغر بكثير من الفيديو.

## متى ترسل رابطاً بدلاً من الملف

كثيراً ما يحدد مزودو البريد المرفقات بنحو 20 إلى 25 ميغابايت، وقد تضغط تطبيقات المراسلة الفيديو بشدة أو تقيّد حجمه؛ راجع [حدود حجم مرفقات البريد](blog:email-attachment-size-limits). وفي الفيديوهات الطويلة أو عالية الجودة يكون رفعها إلى خدمة سحابية أو منصة فيديو وإرسال رابط أفضل عادة من تصغيرها حتى تسوء.

## فحوص قبل الإرسال

- شاهد النتيجة على هاتف كما سيشاهدها المستلم.
- تأكد أن النصوص الظاهرة، مثل الشرائح، ما زالت مقروءة.
- استمع للتأكد من تزامن الصوت.
- احتفظ بالأصل؛ فكل إعادة ترميز تفقد شيئاً من التفاصيل، لذا حوّل دائماً من أفضل نسخة لديك.

=== pt-br ===
cover_alt: Um rolo de filme alimenta um quadro menor
title: Como reduzir o tamanho de um vídeo para compartilhar sem estragar
seo_title: Reduzir o tamanho de vídeo para compartilhar
description: Por que vídeos de celular são tão grandes, quais ajustes realmente diminuem o arquivo (resolução, bitrate, codec e duração) e quando mandar um link.
dek: Um clipe 4K de um minuto gravado no celular pode ter centenas de megabytes. Saber qual de quatro fatores define esse tamanho mostra o que mudar e o que pode ficar como está.
---
## O que deixa um vídeo grande

O tamanho de um vídeo é, aproximadamente, **bitrate × duração**. O bitrate, a quantidade de dados por segundo, depende principalmente de:

- **Resolução:** 4K (3840×2160) tem quatro vezes os pixels de 1080p (1920×1080).
- **Taxa de quadros:** 60 quadros por segundo precisam de mais dados que 30.
- **Codec e ajustes:** a eficiência com que os quadros são comprimidos. Celulares costumam gravar com bitrate alto para manter o máximo de detalhe.
- **Áudio:** normalmente uma parte pequena do total.

Então as quatro alavancas práticas são: encurtar, baixar a resolução, baixar a taxa de quadros ou recodificar com bitrate menor e um codec eficiente.

## Comece pelo mais fácil: a duração

Cortar uma gravação de três minutos para os 40 segundos que importam reduz o arquivo em cerca de três quartos sem mexer na qualidade. A maioria das galerias de celular permite cortar o clipe antes de compartilhar.

## Baixe a resolução para telas pequenas

Quase todo mundo assiste clipes compartilhados no celular, onde 1080p ou até 720p ficam bons. Passar de 4K para 1080p costuma reduzir muito o tamanho. Muitos celulares deixam escolher a resolução de gravação nas configurações da câmera; gravar em 1080p desde o início evita o problema nos clipes do dia a dia.

## Recodifique com um codec padrão

Recodificar (converter) um vídeo comprime de novo. H.264 dentro de um MP4 é a opção mais compatível: toca em quase todo celular, computador e aplicativo de mensagens. Codecs mais novos como H.265 (HEVC), VP9 e AV1 comprimem melhor, mas não funcionam em todo lugar; veja nossa [comparação de formatos de vídeo](blog:video-formats-compared).

O [Conversor de vídeo](tool:video-converter) da Convertios envia o arquivo ao nosso servidor, onde o FFmpeg faz a conversão. Escolhendo MP4, você recebe vídeo H.264 com áudio AAC em uma qualidade padrão. Para gravações de celular com bitrate alto, o resultado costuma ficar menor, mas não é uma ferramenta de tamanho-alvo: ela não muda a resolução, e um vídeo já bem comprimido pode não diminuir. O limite de envio é de 50 MB.

## Se só o som importa

Para uma palestra, aula ou mensagem de voz gravada, o áudio pode bastar. O [Vídeo para MP3](tool:video-to-mp3) extrai a trilha sonora como MP3 de 192 kbps, muito menor que o vídeo.

## Quando mandar um link

Provedores de e-mail costumam limitar anexos a cerca de 20–25 MB, e aplicativos de mensagens podem comprimir bastante os vídeos ou limitar o tamanho; veja os [limites de anexos de e-mail](blog:email-attachment-size-limits). Para vídeos longos ou de alta qualidade, geralmente é melhor subir para uma nuvem ou plataforma de vídeo e mandar o link do que reduzir até ficar ruim.

## Verificações antes de enviar

- Assista ao resultado no celular, como quem vai receber.
- Confira se textos na tela, como slides, continuam legíveis.
- Ouça para ver se o áudio está sincronizado.
- Guarde o original: cada recodificação perde algum detalhe, então sempre converta a partir da melhor cópia.
