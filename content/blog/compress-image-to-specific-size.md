---
category: images-formats
type: tutorial
published: 2026-11-18
order: 181
status: published
cover_image: compress-image-to-specific-size
cover: ≤ 100 KB
tools: compress-image-to-100kb, compress-image-to-50kb, compress-image-to-20kb
related: reduce-image-size-without-losing-quality, image-dpi-and-print-size
keyword: compress image to 100kb / 50kb / 20kb
intent: how-to
---
=== en ===
cover_alt: A press reduces a mountain photograph to a target size
title: How to compress an image to 100 KB, 50 KB or 20 KB for a form
seo_title: Compress an image to 100KB, 50KB or 20KB
description: Application portals often cap photos and signatures at 100, 50 or 20 KB. Learn how to hit the limit precisely while keeping faces and text readable.
dek: Exam registrations, visa portals and job sites often reject anything above a strict size. Getting under the limit is easy; staying readable while you do it takes a little order.
---
## Why forms use such small limits

Online forms collect thousands of photos, signatures and document scans. Strict limits such as 100 KB, 50 KB or 20 KB keep their storage and review systems manageable. The forms usually state a file type (often JPG), a size range in KB and sometimes exact pixel dimensions.

Read all three requirements before you start. A file that meets the KB limit but not the pixel size or format will still be rejected.

## How much picture fits in each limit

| Limit | Typical use | Realistic result |
| --- | --- | --- |
| 100 KB | Application photos, listings, CMS uploads | A photo around 800 to 1200 pixels wide can stay sharp |
| 50 KB | Passport-style photos, ID images | A head-and-shoulders photo of roughly 400 to 600 pixels |
| 20 KB | Signatures, small thumbnails | A signature or very small photo, often 200 to 400 pixels wide |

These are typical ranges, not rules: a simple image with plain background compresses much better than a busy one.

## Step by step with Convertios

Convertios has preset pages for the most requested limits: [Compress Image to 100KB](tool:compress-image-to-100kb), [Compress Image to 50KB](tool:compress-image-to-50kb) and [Compress Image to 20KB](tool:compress-image-to-20kb). They use the same compressor as the general [image compressor](tool:compress-image), which also accepts any other target. Everything runs in your browser; images are not uploaded.

1. **Crop first.** If the form wants a head-and-shoulders photo, remove the extra background with the Image Resizer's crop option. Every pixel you remove is weight you do not have to compress away.
2. **Resize if the form specifies dimensions.** Enter the exact width and height requested.
3. **Open the preset page** for your limit, add the image and choose JPG unless the form says otherwise.
4. **Press Compress and read the result line.** It shows the final size, dimensions and quality used.
5. **Check the image at 100% zoom** before uploading.

The compressor searches for the highest quality that fits. If quality alone cannot reach the target, it reduces pixel dimensions a little at a time instead of making the picture blocky. It keeps JPG and WebP quality at 60% or higher before reducing dimensions, and never shrinks the shorter side below 160 pixels.

## When the target cannot be reached

The result message tells you if the file is only close to the limit. Then:

- **Switch to JPG or WebP.** PNG is lossless, so a detailed photo saved as PNG may never get near 100 KB. Screenshots and simple graphics often fit as PNG; photos rarely do.
- **Crop tighter or reduce dimensions** with the Image Resizer, then compress again.
- **Simplify the background.** A plain wall compresses far better than a patterned one.
- **For signatures,** scan or photograph in good light so the background is pure white; a grey, uneven background wastes bytes.

## Keeping it acceptable to reviewers

- Faces must stay recognisable and text readable. If small print in a document becomes unreadable at the limit, upload pages separately if allowed, or ask the organisation for an alternative.
- Do not stretch an image to meet minimum pixel dimensions; it will look blurry. Start from a larger original.
- Some forms check both minimum and maximum size. If a file is too small, increase quality slightly.

## Privacy note

Re-encoded images do not keep the original EXIF details, such as GPS location. If an image is already below the target and its format is unchanged, the original file is returned with its metadata intact. See [what photo metadata reveals](blog:image-metadata-exif-privacy).

For general web and email use, where there is no hard limit, follow our broader guide to [reducing image size without losing visible quality](blog:reduce-image-size-without-losing-quality).

=== es ===
cover_alt: Una prensa reduce una foto de montaña
title: Cómo comprimir una imagen a 100 KB, 50 KB o 20 KB para un formulario
seo_title: Comprimir una imagen a 100 KB, 50 KB o 20 KB
description: Los portales de solicitudes suelen limitar fotos y firmas a 100, 50 o 20 KB. Aprende a ajustar el límite con precisión manteniendo legibles caras y textos.
dek: Inscripciones a exámenes, portales de visados y webs de empleo rechazan cualquier archivo por encima de un tamaño estricto. Bajar del límite es fácil; seguir siendo legible exige un poco de orden.
---
## Por qué los formularios usan límites tan pequeños

Los formularios en línea reciben miles de fotos, firmas y documentos escaneados. Límites estrictos como 100 KB, 50 KB o 20 KB mantienen manejables sus sistemas de almacenamiento y revisión. Suelen indicar un tipo de archivo (a menudo JPG), un rango de tamaño en KB y a veces unas dimensiones exactas en píxeles.

Lee los tres requisitos antes de empezar. Un archivo que cumple el límite de KB pero no las dimensiones o el formato también será rechazado.

## Cuánta imagen cabe en cada límite

| Límite | Uso habitual | Resultado realista |
| --- | --- | --- |
| 100 KB | Fotos para solicitudes, anuncios, gestores de contenido | Una foto de unos 800 a 1200 píxeles de ancho puede seguir nítida |
| 50 KB | Fotos tipo carné, imágenes de identificación | Una foto de busto de unos 400 a 600 píxeles |
| 20 KB | Firmas, miniaturas | Una firma o una foto muy pequeña, a menudo de 200 a 400 píxeles |

Son rangos habituales, no reglas: una imagen sencilla con fondo liso se comprime mucho mejor que una recargada.

## Paso a paso con Convertios

Convertios tiene páginas preparadas para los límites más pedidos: [Comprimir imagen a 100 KB](tool:compress-image-to-100kb), [Comprimir imagen a 50 KB](tool:compress-image-to-50kb) y [Comprimir imagen a 20 KB](tool:compress-image-to-20kb). Usan el mismo motor que el [compresor de imágenes](tool:compress-image) general, que admite cualquier otro objetivo. Todo funciona en tu navegador; las imágenes no se suben.

1. **Recorta primero.** Si el formulario pide una foto de busto, quita el fondo sobrante con la opción de recorte del Redimensionador de imágenes. Cada píxel que eliminas es peso que no tendrás que comprimir.
2. **Redimensiona si el formulario indica dimensiones.** Escribe el ancho y el alto exactos que piden.
3. **Abre la página del límite** que necesitas, añade la imagen y elige JPG salvo que el formulario diga otra cosa.
4. **Pulsa Comprimir y lee la línea de resultado.** Muestra el tamaño final, las dimensiones y la calidad usada.
5. **Revisa la imagen al 100 %** antes de subirla.

El compresor busca la mayor calidad que cabe. Si con la calidad no basta, reduce poco a poco las dimensiones en lugar de pixelar la imagen. Mantiene la calidad de JPG y WebP en el 60 % o más antes de reducir dimensiones y nunca baja el lado corto de 160 píxeles.

## Cuando no se alcanza el objetivo

El mensaje de resultado te avisa si el archivo solo se ha quedado cerca del límite. En ese caso:

- **Cambia a JPG o WebP.** PNG no tiene pérdida, así que una foto detallada en PNG quizá nunca se acerque a 100 KB. Las capturas y gráficos sencillos sí suelen caber en PNG; las fotos, rara vez.
- **Recorta más o reduce las dimensiones** con el Redimensionador de imágenes y vuelve a comprimir.
- **Simplifica el fondo.** Una pared lisa se comprime mucho mejor que una con dibujo.
- **Para firmas,** escanea o fotografía con buena luz para que el fondo sea blanco puro; un fondo gris e irregular desperdicia bytes.

## Para que lo acepten quienes revisan

- Las caras deben reconocerse y el texto leerse. Si la letra pequeña de un documento deja de leerse con el límite, sube las páginas por separado si se permite o pide una alternativa a la entidad.
- No estires una imagen para cumplir unas dimensiones mínimas; se verá borrosa. Parte de un original más grande.
- Algunos formularios comprueban tanto un tamaño mínimo como uno máximo. Si el archivo se queda corto, sube un poco la calidad.

## Nota de privacidad

Las imágenes recodificadas no conservan los datos EXIF originales, como la ubicación GPS. Si una imagen ya está por debajo del objetivo y su formato no cambia, se devuelve el archivo original con sus metadatos intactos. Consulta [qué revelan los metadatos de una foto](blog:image-metadata-exif-privacy).

Para uso general en webs o correo, sin un límite estricto, sigue nuestra guía para [reducir el peso de una imagen sin perder calidad visible](blog:reduce-image-size-without-losing-quality).

=== ar ===
cover_alt: مكبس يصغر صورة جبل إلى حجم محدد
title: كيف تضغط صورة إلى 100 أو 50 أو 20 كيلوبايت لنموذج إلكتروني
seo_title: ضغط صورة إلى 100 أو 50 أو 20 كيلوبايت
description: تحدد بوابات التقديم غالباً حجم الصور والتواقيع بـ100 أو 50 أو 20 كيلوبايت. تعلّم كيف تصل إلى الحد بدقة مع بقاء الوجوه والنصوص واضحة.
dek: تسجيل الامتحانات وبوابات التأشيرات ومواقع التوظيف ترفض كل ما يتجاوز حجماً صارماً. النزول تحت الحد سهل، أما البقاء واضحاً أثناء ذلك فيحتاج إلى قليل من الترتيب.
---
## لماذا تستخدم النماذج حدوداً صغيرة كهذه

تستقبل النماذج الإلكترونية آلاف الصور والتواقيع والمستندات الممسوحة، والحدود الصارمة مثل 100 أو 50 أو 20 كيلوبايت تبقي أنظمة التخزين والمراجعة لديها قابلة للإدارة. وعادةً ما تحدد نوع الملف (غالباً JPG)، ونطاق الحجم بالكيلوبايت، وأحياناً أبعاداً دقيقة بالبكسل.

اقرأ المتطلبات الثلاثة قبل البدء؛ فالملف الذي يلتزم بحد الكيلوبايت دون الأبعاد أو الصيغة سيُرفض أيضاً.

## كم من الصورة يتسع في كل حد

| الحد | الاستخدام المعتاد | النتيجة الواقعية |
| --- | --- | --- |
| 100 KB | صور طلبات التقديم والإعلانات وأنظمة المحتوى | صورة بعرض 800 إلى 1200 بكسل تقريباً تبقى حادة |
| 50 KB | صور بمقاس جواز السفر وصور الهوية | صورة للرأس والكتفين بين 400 و600 بكسل تقريباً |
| 20 KB | التواقيع والصور المصغرة | توقيع أو صورة صغيرة جداً، غالباً بعرض 200 إلى 400 بكسل |

هذه نطاقات معتادة لا قواعد ثابتة؛ فالصورة البسيطة ذات الخلفية الموحدة تنضغط أفضل بكثير من الصورة المزدحمة.

## خطوة بخطوة مع Convertios

لدى Convertios صفحات جاهزة لأكثر الحدود طلباً: [ضغط الصورة إلى 100KB](tool:compress-image-to-100kb) و[ضغط الصورة إلى 50KB](tool:compress-image-to-50kb) و[ضغط الصورة إلى 20KB](tool:compress-image-to-20kb). تستخدم المحرك نفسه الذي يستخدمه [ضاغط الصور](tool:compress-image) العام الذي يقبل أي هدف آخر. يجري كل شيء داخل متصفحك ولا تُرفع الصور.

1. **قصّ الصورة أولاً.** إذا طلب النموذج صورة للرأس والكتفين فأزل الخلفية الزائدة بخيار القص في أداة تغيير حجم الصور، فكل بكسل تزيله وزن لن تحتاج إلى ضغطه.
2. **غيّر الأبعاد إذا حددها النموذج.** أدخل العرض والارتفاع المطلوبين بالضبط.
3. **افتح الصفحة الخاصة بحدّك،** وأضف الصورة، واختر JPG ما لم يطلب النموذج غيرها.
4. **اضغط زر الضغط واقرأ سطر النتيجة،** فهو يعرض الحجم النهائي والأبعاد والجودة المستخدمة.
5. **راجع الصورة بتكبير 100%** قبل رفعها.

يبحث الضاغط عن أعلى جودة تناسب الحد، وإن لم تكفِ الجودة وحدها يقلل الأبعاد تدريجياً بدلاً من تحويل الصورة إلى مربعات. يحافظ على جودة JPG وWebP عند 60% أو أكثر قبل تقليل الأبعاد، ولا ينزل بالضلع القصير تحت 160 بكسل.

## عندما لا يمكن بلوغ الهدف

تخبرك رسالة النتيجة إن كان الملف قريباً من الحد فقط، وعندها:

- **انتقل إلى JPG أو WebP.** صيغة PNG بلا فقدان، فقد لا تقترب صورة مفصلة بصيغة PNG من 100 كيلوبايت أبداً. لقطات الشاشة والرسوم البسيطة تتسع غالباً بصيغة PNG، أما الصور الفوتوغرافية فنادراً.
- **قصّ أكثر أو قلّل الأبعاد** بأداة تغيير حجم الصور ثم أعد الضغط.
- **بسّط الخلفية.** الجدار الموحد ينضغط أفضل بكثير من الجدار المزخرف.
- **للتواقيع:** امسح أو صوّر في إضاءة جيدة لتكون الخلفية بيضاء تماماً، فالخلفية الرمادية غير المتساوية تهدر البايتات.

## لكي يقبلها المراجعون

- يجب أن تبقى الوجوه معروفة والنصوص مقروءة. إذا صار الخط الصغير في مستند غير مقروء عند الحد فارفع الصفحات منفصلة إن سُمح بذلك، أو اطلب بديلاً من الجهة.
- لا تمطّ الصورة لتبلغ الحد الأدنى للأبعاد، فستبدو ضبابية. ابدأ من أصل أكبر.
- تتحقق بعض النماذج من حد أدنى وحد أقصى معاً، فإذا كان الملف أصغر من المطلوب فارفع الجودة قليلاً.

## ملاحظة عن الخصوصية

لا تحتفظ الصور المعاد ترميزها ببيانات EXIF الأصلية مثل موقع GPS. أما إذا كانت الصورة أصلاً تحت الحجم المستهدف ولم تتغير صيغتها فيُعاد الملف الأصلي ببياناته كما هي. راجع [ما الذي تكشفه البيانات الوصفية للصور](blog:image-metadata-exif-privacy).

للاستخدام العام في المواقع والبريد حيث لا يوجد حد صارم، اتبع دليلنا الأشمل [لتقليل حجم الصورة دون خسارة جودة مرئية](blog:reduce-image-size-without-losing-quality).

=== pt-br ===
cover_alt: Prensa reduz uma foto de montanha
title: Como comprimir uma imagem para 100 KB, 50 KB ou 20 KB para um formulário
seo_title: Comprimir imagem para 100 KB, 50 KB ou 20 KB
description: Portais de inscrição costumam limitar fotos e assinaturas a 100, 50 ou 20 KB. Aprenda a atingir o limite com precisão mantendo rostos e textos legíveis.
dek: Inscrições em concursos, portais de visto e sites de vagas recusam qualquer arquivo acima de um tamanho rígido. Ficar abaixo do limite é fácil; continuar legível exige um pouco de ordem.
---
## Por que os formulários usam limites tão pequenos

Formulários online recebem milhares de fotos, assinaturas e documentos digitalizados. Limites rígidos como 100 KB, 50 KB ou 20 KB mantêm os sistemas de armazenamento e análise sob controle. Eles costumam indicar um tipo de arquivo (muitas vezes JPG), uma faixa de tamanho em KB e às vezes dimensões exatas em pixels.

Leia os três requisitos antes de começar. Um arquivo que cumpre o limite em KB, mas não as dimensões ou o formato, também será recusado.

## Quanto de imagem cabe em cada limite

| Limite | Uso comum | Resultado realista |
| --- | --- | --- |
| 100 KB | Fotos para inscrições, anúncios, gerenciadores de conteúdo | Uma foto com cerca de 800 a 1.200 pixels de largura continua nítida |
| 50 KB | Fotos 3x4, imagens de documentos | Uma foto de rosto e ombros com uns 400 a 600 pixels |
| 20 KB | Assinaturas, miniaturas | Uma assinatura ou foto bem pequena, muitas vezes de 200 a 400 pixels |

São faixas comuns, não regras: uma imagem simples com fundo liso comprime muito melhor do que uma cheia de detalhes.

## Passo a passo com a Convertios

A Convertios tem páginas prontas para os limites mais pedidos: [Comprimir imagem para 100 KB](tool:compress-image-to-100kb), [Comprimir imagem para 50 KB](tool:compress-image-to-50kb) e [Comprimir imagem para 20 KB](tool:compress-image-to-20kb). Elas usam o mesmo mecanismo do [compressor de imagens](tool:compress-image) geral, que aceita qualquer outro alvo. Tudo roda no navegador; as imagens não são enviadas.

1. **Recorte primeiro.** Se o formulário pede uma foto de rosto e ombros, tire o fundo sobrando com a opção de recorte do Redimensionador de imagens. Cada pixel que você remove é peso que não precisará ser comprimido.
2. **Redimensione se o formulário indicar dimensões.** Digite a largura e a altura exatas pedidas.
3. **Abra a página do seu limite,** adicione a imagem e escolha JPG, a menos que o formulário peça outro formato.
4. **Clique em Comprimir e leia a linha de resultado.** Ela mostra o tamanho final, as dimensões e a qualidade usada.
5. **Confira a imagem com zoom de 100%** antes de enviar.

O compressor procura a maior qualidade que cabe. Se só a qualidade não bastar, ele reduz as dimensões aos poucos em vez de deixar a imagem quadriculada. Mantém a qualidade de JPG e WebP em 60% ou mais antes de reduzir dimensões e nunca deixa o lado menor abaixo de 160 pixels.

## Quando o alvo não é atingido

A mensagem de resultado avisa se o arquivo só chegou perto do limite. Nesse caso:

- **Troque para JPG ou WebP.** O PNG é sem perdas, então uma foto detalhada em PNG talvez nunca chegue perto de 100 KB. Capturas de tela e gráficos simples costumam caber em PNG; fotos, raramente.
- **Recorte mais ou reduza as dimensões** com o Redimensionador de imagens e comprima de novo.
- **Simplifique o fundo.** Uma parede lisa comprime muito melhor do que uma estampada.
- **Para assinaturas,** digitalize ou fotografe com boa luz para o fundo ficar branco puro; um fundo cinza e irregular desperdiça bytes.

## Para ser aceito por quem analisa

- Rostos precisam continuar reconhecíveis e textos legíveis. Se a letra pequena de um documento ficar ilegível no limite, envie as páginas separadas se for permitido ou peça uma alternativa à instituição.
- Não estique uma imagem para atingir dimensões mínimas; ela vai ficar borrada. Comece de um original maior.
- Alguns formulários verificam tamanho mínimo e máximo. Se o arquivo ficar pequeno demais, aumente um pouco a qualidade.

## Observação sobre privacidade

Imagens recodificadas não mantêm os dados EXIF originais, como a localização GPS. Se a imagem já estiver abaixo do alvo e o formato não mudar, o arquivo original é devolvido com os metadados intactos. Veja [o que os metadados de uma foto revelam](blog:image-metadata-exif-privacy).

Para uso geral em sites e e-mail, sem limite rígido, siga nosso guia mais amplo para [diminuir o tamanho da imagem sem perder qualidade visível](blog:reduce-image-size-without-losing-quality).
