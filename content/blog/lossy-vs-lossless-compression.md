---
category: images-formats
type: comparison
published: 2026-11-18
order: 193
status: published
cover_image: lossy-vs-lossless-compression
cover: Lossy vs Lossless
tools: compress-image, audio-converter, image-converter
related: jpg-png-webp-guide, mp3-vs-wav
keyword: lossy vs lossless compression
intent: informational / comparison
---
=== en ===
cover_alt: Two compressed kingfisher photographs compared
title: Lossy vs lossless compression: what you lose and when it matters
seo_title: Lossy vs lossless compression explained
description: Lossless compression keeps every bit; lossy compression discards detail to save space. See how JPG, PNG, MP3, WAV, ZIP and video codecs use each approach.
dek: Every compressed file makes one of two promises: you will get the original back exactly, or you will get something close enough. Knowing which promise a format makes prevents most quality surprises.
---
## Two kinds of compression

**Lossless compression** finds patterns and repetition in data and stores them more efficiently. When the file is opened, the original is rebuilt bit for bit. Nothing is lost. ZIP archives, PNG images, FLAC audio and the text inside most PDFs work this way.

**Lossy compression** goes further. It deliberately discards information that people are unlikely to notice, then compresses what remains. The file can be dramatically smaller, but the discarded detail is gone for good. JPG photos, MP3 and AAC audio and almost all streaming video work this way.

## A simple analogy

Imagine describing a wall of identical blue tiles. A lossless description says "200 blue tiles" instead of listing each tile. Anyone can rebuild the exact wall.

A lossy description of a painted landscape might say "sky, gradually lighter towards the horizon" instead of recording every brush stroke. The result looks right from across the room, but the individual strokes cannot be recovered.

## Where each approach is used

| Type of file | Lossless formats | Lossy formats |
| --- | --- | --- |
| Images | PNG, lossless WebP, GIF (limited colours), TIFF | JPG, lossy WebP, AVIF (usually) |
| Audio | WAV (uncompressed), FLAC, ALAC | MP3, AAC/M4A, Ogg Vorbis, Opus |
| Video | Rare outside professional editing | MP4 with H.264/H.265, WebM with VP9/AV1 |
| Documents and archives | ZIP, PDF text streams | Images embedded inside a PDF may be lossy |

Some formats, such as WebP, can do either; the setting decides.

## What lossy compression costs

At sensible settings, lossy compression is close to invisible or inaudible. Problems appear when:

- **Quality is set too low.** Photos show blocky squares and halos around edges; music sounds watery or loses crisp cymbals.
- **Files are re-compressed repeatedly.** Every save of a JPG or every MP3-to-MP3 conversion throws away a bit more. This is called generation loss.
- **The content is a poor fit.** Text, line drawings and screenshots have hard edges that lossy image formats handle badly.

## What lossless compression costs

Only space. A lossless photo or a WAV recording is much larger than its lossy equivalent: a three-minute song is roughly 30 MB as uncompressed WAV and a few megabytes as MP3. Lossless compression also cannot shrink data that is already compressed: zipping a JPG barely changes its size.

## Practical rules

1. **Keep a lossless or original master** for anything you will edit later: the camera original, a PNG of a design, a WAV recording.
2. **Export lossy copies for sharing,** once, at the end. Do not edit and re-save lossy files over and over.
3. **Converting lossy to lossless does not restore quality.** Turning an MP3 into WAV or a JPG into PNG stops further loss, but the file only gets bigger. Our [MP3 versus WAV comparison](blog:mp3-vs-wav) explains this for audio.
4. **Match the format to the content:** lossy for photos and music, lossless for screenshots, text, logos and archives. Our [JPG, PNG and WebP guide](blog:jpg-png-webp-guide) shows how this works for images.

## How Convertios tools handle it

- The [image compressor](tool:compress-image) uses lossy JPG or WebP encoding, searching for the highest quality that fits a target size, or lossless PNG when you choose it.
- The [Image Converter](tool:image-converter) switches between JPG, PNG, WebP, BMP and GIF in the browser; whether quality is lost depends on the output format.
- The [Audio Converter](tool:audio-converter) changes MP3 to WAV and WAV to MP3 in the browser. WAV to MP3 is lossy; MP3 to WAV keeps the MP3's existing sound in an uncompressed container.

=== es ===
cover_alt: Comparación de dos fotos comprimidas de un martín pescador
title: Compresión con pérdida y sin pérdida: qué se pierde y cuándo importa
seo_title: Compresión con pérdida y sin pérdida explicada
description: La compresión sin pérdida conserva cada bit; la que tiene pérdida descarta detalles para ahorrar espacio. Mira cómo la usan JPG, PNG, MP3, WAV, ZIP y el vídeo.
dek: Todo archivo comprimido hace una de dos promesas: recuperarás exactamente el original o algo lo bastante parecido. Saber qué promete cada formato evita la mayoría de las sorpresas de calidad.
---
## Dos tipos de compresión

La **compresión sin pérdida** busca patrones y repeticiones en los datos y los guarda de forma más eficiente. Al abrir el archivo, el original se reconstruye bit a bit. No se pierde nada. Los ZIP, las imágenes PNG, el audio FLAC y el texto de la mayoría de los PDF funcionan así.

La **compresión con pérdida** va más allá. Descarta a propósito información que difícilmente notaremos y luego comprime lo que queda. El archivo puede ser muchísimo más pequeño, pero el detalle eliminado desaparece para siempre. Las fotos JPG, el audio MP3 y AAC y casi todo el vídeo en streaming funcionan así.

## Una analogía sencilla

Imagina describir una pared de azulejos azules idénticos. Una descripción sin pérdida dice «200 azulejos azules» en lugar de enumerarlos uno por uno. Cualquiera puede reconstruir exactamente la misma pared.

Una descripción con pérdida de un paisaje pintado podría decir «cielo que se aclara hacia el horizonte» en vez de registrar cada pincelada. Desde el otro lado de la sala parece correcto, pero las pinceladas no se pueden recuperar.

## Dónde se usa cada una

| Tipo de archivo | Formatos sin pérdida | Formatos con pérdida |
| --- | --- | --- |
| Imágenes | PNG, WebP sin pérdida, GIF (colores limitados), TIFF | JPG, WebP con pérdida, AVIF (normalmente) |
| Audio | WAV (sin comprimir), FLAC, ALAC | MP3, AAC/M4A, Ogg Vorbis, Opus |
| Vídeo | Poco habitual fuera de la edición profesional | MP4 con H.264/H.265, WebM con VP9/AV1 |
| Documentos y archivos | ZIP, flujos de texto de un PDF | Las imágenes incrustadas en un PDF pueden ser con pérdida |

Algunos formatos, como WebP, pueden hacer ambas cosas; lo decide el ajuste.

## Lo que cuesta la compresión con pérdida

Con ajustes razonables, la compresión con pérdida es casi invisible o inaudible. Los problemas aparecen cuando:

- **La calidad es demasiado baja.** Las fotos muestran bloques y halos en los bordes; la música suena «acuosa» o pierde el brillo de los platillos.
- **Se recomprime una y otra vez.** Cada guardado de un JPG o cada conversión de MP3 a MP3 tira un poco más. Es la llamada pérdida generacional.
- **El contenido no encaja.** El texto, los dibujos de líneas y las capturas tienen bordes duros que los formatos de imagen con pérdida manejan mal.

## Lo que cuesta la compresión sin pérdida

Solo espacio. Una foto sin pérdida o una grabación WAV ocupan mucho más que su equivalente con pérdida: una canción de tres minutos ronda los 30 MB en WAV sin comprimir y unos pocos megas en MP3. Además, la compresión sin pérdida no puede reducir datos que ya están comprimidos: meter un JPG en un ZIP apenas cambia su tamaño.

## Reglas prácticas

1. **Guarda un original sin pérdida** de todo lo que vayas a editar más adelante: el original de la cámara, un PNG del diseño, una grabación WAV.
2. **Exporta copias con pérdida para compartir,** una vez y al final. No edites y guardes una y otra vez archivos con pérdida.
3. **Pasar de con pérdida a sin pérdida no recupera calidad.** Convertir un MP3 en WAV o un JPG en PNG frena nuevas pérdidas, pero el archivo solo crece. Nuestra [comparativa de MP3 y WAV](blog:mp3-vs-wav) lo explica para el audio.
4. **Ajusta el formato al contenido:** con pérdida para fotos y música, sin pérdida para capturas, texto, logotipos y archivos. Nuestra [guía de JPG, PNG y WebP](blog:jpg-png-webp-guide) muestra cómo se aplica a las imágenes.

## Cómo lo gestionan las herramientas de Convertios

- El [compresor de imágenes](tool:compress-image) usa codificación JPG o WebP con pérdida, buscando la mayor calidad que encaja en un tamaño objetivo, o PNG sin pérdida si lo eliges.
- El [Conversor de imágenes](tool:image-converter) cambia entre JPG, PNG, WebP, BMP y GIF en el navegador; que se pierda calidad o no depende del formato de salida.
- El [Conversor de audio](tool:audio-converter) cambia de MP3 a WAV y de WAV a MP3 en el navegador. De WAV a MP3 hay pérdida; de MP3 a WAV se conserva el sonido que ya tenía el MP3 dentro de un contenedor sin comprimir.

=== ar ===
cover_alt: مقارنة صورتين مضغوطتين لطائر الرفراف
title: الضغط مع فقدان وبلا فقدان: ماذا تخسر ومتى يهم ذلك
seo_title: شرح الضغط مع فقدان والضغط بلا فقدان
description: يحتفظ الضغط بلا فقدان بكل بت، بينما يتخلص الضغط مع فقدان من تفاصيل لتوفير المساحة. تعرّف إلى استخدام JPG وPNG وMP3 وWAV وZIP والفيديو لكل منهما.
dek: كل ملف مضغوط يقدم أحد وعدين: ستستعيد الأصل كما هو تماماً، أو ستحصل على شيء قريب بما يكفي. معرفة وعد كل صيغة تمنع معظم مفاجآت الجودة.
---
## نوعان من الضغط

**الضغط بلا فقدان** يبحث عن الأنماط والتكرار في البيانات ويخزنها بكفاءة أكبر، وعند فتح الملف يُعاد بناء الأصل بتاً بتاً دون خسارة شيء. تعمل بهذه الطريقة ملفات ZIP وصور PNG وصوت FLAC والنصوص داخل معظم ملفات PDF.

أما **الضغط مع فقدان** فيذهب أبعد من ذلك؛ إذ يتخلص عمداً من معلومات يصعب على الناس ملاحظتها ثم يضغط ما تبقى. قد يصبح الملف أصغر بكثير، لكن التفاصيل المحذوفة تضيع إلى الأبد. تعمل بهذه الطريقة صور JPG وصوت MP3 وAAC ومعظم الفيديو المبثوث.

## تشبيه بسيط

تخيّل وصف جدار من البلاط الأزرق المتطابق. الوصف بلا فقدان يقول «200 بلاطة زرقاء» بدلاً من تعداد كل بلاطة، ويستطيع أي شخص إعادة بناء الجدار نفسه تماماً.

أما الوصف مع فقدان لمنظر طبيعي مرسوم فقد يقول «سماء تفتح تدريجياً نحو الأفق» بدلاً من تسجيل كل ضربة فرشاة. تبدو النتيجة صحيحة من الطرف الآخر للغرفة، لكن لا يمكن استعادة ضربات الفرشاة.

## أين يُستخدم كل نوع

| نوع الملف | صيغ بلا فقدان | صيغ مع فقدان |
| --- | --- | --- |
| الصور | PNG، وWebP بلا فقدان، وGIF (ألوان محدودة)، وTIFF | JPG، وWebP مع فقدان، وAVIF (عادةً) |
| الصوت | WAV (غير مضغوط)، وFLAC، وALAC | MP3، وAAC/M4A، وOgg Vorbis، وOpus |
| الفيديو | نادر خارج التحرير الاحترافي | MP4 بترميز H.264/H.265، وWebM بترميز VP9/AV1 |
| المستندات والأرشيفات | ZIP، وتدفقات النص في PDF | قد تكون الصور المضمّنة في PDF مضغوطة مع فقدان |

بعض الصيغ مثل WebP تستطيع الأمرين، والإعداد هو ما يحدد.

## ما الذي يكلفه الضغط مع فقدان

مع الإعدادات المعقولة يكاد الضغط مع فقدان لا يُرى ولا يُسمع، وتظهر المشكلات عندما:

- **تكون الجودة منخفضة جداً.** تظهر في الصور مربعات وهالات حول الحواف، ويبدو صوت الموسيقى «مائياً» أو يفقد وضوح الصنج.
- **يُعاد ضغط الملف مراراً.** كل حفظ لملف JPG أو كل تحويل من MP3 إلى MP3 يرمي المزيد، وهذا ما يسمى فقدان الأجيال.
- **لا يناسب المحتوى الصيغة.** للنصوص والرسوم الخطية ولقطات الشاشة حواف حادة تتعامل معها صيغ الصور المضغوطة مع فقدان بشكل سيئ.

## ما الذي يكلفه الضغط بلا فقدان

المساحة فقط. الصورة بلا فقدان أو التسجيل بصيغة WAV أكبر بكثير من النسخة المضغوطة مع فقدان؛ فالأغنية ذات الدقائق الثلاث تبلغ نحو 30 ميغابايت بصيغة WAV غير المضغوطة وبضعة ميغابايتات بصيغة MP3. كما لا يستطيع الضغط بلا فقدان تصغير بيانات مضغوطة أصلاً، فوضع ملف JPG في ZIP لا يغيّر حجمه تقريباً.

## قواعد عملية

1. **احتفظ بأصل بلا فقدان** لكل ما ستعدّله لاحقاً: أصل الكاميرا، أو ملف PNG للتصميم، أو تسجيل WAV.
2. **صدّر نسخاً مضغوطة مع فقدان للمشاركة** مرة واحدة وفي النهاية، ولا تعدّل الملفات المضغوطة مع فقدان وتحفظها مراراً.
3. **التحويل من صيغة مع فقدان إلى صيغة بلا فقدان لا يعيد الجودة.** تحويل MP3 إلى WAV أو JPG إلى PNG يوقف الفقدان اللاحق، لكن الملف يكبر فقط. تشرح [مقارنتنا بين MP3 وWAV](blog:mp3-vs-wav) ذلك في الصوت.
4. **طابق الصيغة مع المحتوى:** مع فقدان للصور الفوتوغرافية والموسيقى، وبلا فقدان للقطات الشاشة والنصوص والشعارات والأرشيفات. يوضح [دليلنا عن JPG وPNG وWebP](blog:jpg-png-webp-guide) تطبيق ذلك على الصور.

## كيف تتعامل أدوات Convertios مع ذلك

- يستخدم [ضاغط الصور](tool:compress-image) ترميز JPG أو WebP مع فقدان باحثاً عن أعلى جودة تناسب الحجم المستهدف، أو PNG بلا فقدان إن اخترتها.
- يحوّل [محوّل الصور](tool:image-converter) بين JPG وPNG وWebP وBMP وGIF داخل المتصفح، وفقدان الجودة من عدمه يعتمد على صيغة الإخراج.
- يحوّل [محوّل الصوت](tool:audio-converter) من MP3 إلى WAV ومن WAV إلى MP3 داخل المتصفح. التحويل من WAV إلى MP3 مع فقدان، أما من MP3 إلى WAV فيحتفظ بالصوت الموجود في MP3 داخل حاوية غير مضغوطة.

=== pt-br ===
cover_alt: Comparação de duas fotos comprimidas de um martim-pescador
title: Compressão com perdas e sem perdas: o que se perde e quando importa
seo_title: Compressão com perdas e sem perdas explicada
description: A compressão sem perdas mantém cada bit; a com perdas descarta detalhes para economizar espaço. Veja como JPG, PNG, MP3, WAV, ZIP e vídeo usam cada uma.
dek: Todo arquivo comprimido faz uma de duas promessas: você terá o original de volta exatamente ou algo parecido o bastante. Saber o que cada formato promete evita a maioria das surpresas de qualidade.
---
## Dois tipos de compressão

A **compressão sem perdas** encontra padrões e repetições nos dados e os guarda de forma mais eficiente. Ao abrir o arquivo, o original é reconstruído bit a bit. Nada se perde. Arquivos ZIP, imagens PNG, áudio FLAC e o texto da maioria dos PDFs funcionam assim.

A **compressão com perdas** vai além. Ela descarta de propósito informações que dificilmente notamos e depois comprime o que sobra. O arquivo pode ficar muito menor, mas o detalhe descartado some para sempre. Fotos JPG, áudio MP3 e AAC e quase todo vídeo em streaming funcionam assim.

## Uma comparação simples

Imagine descrever uma parede de azulejos azuis idênticos. Uma descrição sem perdas diz "200 azulejos azuis" em vez de listar um por um. Qualquer pessoa consegue reconstruir exatamente a mesma parede.

Uma descrição com perdas de uma paisagem pintada poderia dizer "céu que clareia em direção ao horizonte" em vez de registrar cada pincelada. De longe parece certo, mas as pinceladas não podem ser recuperadas.

## Onde cada uma é usada

| Tipo de arquivo | Formatos sem perdas | Formatos com perdas |
| --- | --- | --- |
| Imagens | PNG, WebP sem perdas, GIF (cores limitadas), TIFF | JPG, WebP com perdas, AVIF (normalmente) |
| Áudio | WAV (sem compressão), FLAC, ALAC | MP3, AAC/M4A, Ogg Vorbis, Opus |
| Vídeo | Raro fora da edição profissional | MP4 com H.264/H.265, WebM com VP9/AV1 |
| Documentos e arquivos | ZIP, fluxos de texto de um PDF | Imagens dentro de um PDF podem ter perdas |

Alguns formatos, como o WebP, fazem as duas coisas; a configuração decide.

## O que a compressão com perdas custa

Com ajustes razoáveis, a compressão com perdas é quase invisível ou inaudível. Os problemas aparecem quando:

- **A qualidade está baixa demais.** Fotos mostram blocos e halos nas bordas; a música soa "aguada" ou perde o brilho dos pratos.
- **O arquivo é recomprimido várias vezes.** Cada salvamento de um JPG ou cada conversão de MP3 para MP3 joga fora mais um pouco. É a chamada perda de geração.
- **O conteúdo não combina.** Texto, desenhos de linhas e capturas de tela têm bordas duras que formatos de imagem com perdas tratam mal.

## O que a compressão sem perdas custa

Só espaço. Uma foto sem perdas ou uma gravação WAV ocupa muito mais do que a versão com perdas: uma música de três minutos tem cerca de 30 MB em WAV sem compressão e poucos megas em MP3. E a compressão sem perdas não consegue diminuir dados que já estão comprimidos: zipar um JPG quase não muda o tamanho.

## Regras práticas

1. **Guarde um original sem perdas** de tudo que você vai editar depois: o original da câmera, um PNG do design, uma gravação WAV.
2. **Exporte cópias com perdas para compartilhar,** uma vez só, no fim. Não edite e salve arquivos com perdas várias vezes.
3. **Passar de com perdas para sem perdas não recupera qualidade.** Converter um MP3 em WAV ou um JPG em PNG impede novas perdas, mas o arquivo só cresce. Nossa [comparação entre MP3 e WAV](blog:mp3-vs-wav) explica isso no áudio.
4. **Combine o formato com o conteúdo:** com perdas para fotos e música, sem perdas para capturas, texto, logotipos e arquivos guardados. Nosso [guia de JPG, PNG e WebP](blog:jpg-png-webp-guide) mostra como isso funciona nas imagens.

## Como as ferramentas da Convertios lidam com isso

- O [compressor de imagens](tool:compress-image) usa codificação JPG ou WebP com perdas, buscando a maior qualidade que cabe no tamanho-alvo, ou PNG sem perdas quando você escolhe.
- O [Conversor de imagens](tool:image-converter) alterna entre JPG, PNG, WebP, BMP e GIF no navegador; se há perda ou não depende do formato de saída.
- O [Conversor de áudio](tool:audio-converter) converte MP3 em WAV e WAV em MP3 no navegador. De WAV para MP3 há perdas; de MP3 para WAV, o som que o MP3 já tinha é mantido dentro de um contêiner sem compressão.
