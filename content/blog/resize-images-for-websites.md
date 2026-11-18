---
category: images-formats
type: guide
published: 2026-11-18
order: 189
status: published
cover_image: resize-images-for-websites
cover: 4000px → 1600px
tools: image-resizer, compress-image, image-converter
related: reduce-image-size-without-losing-quality, social-media-image-sizes
keyword: resize images for website
intent: how-to
---
=== en ===
cover_alt: Mountain photograph resized across three screen sizes
title: How to resize images for a website without making it slow
seo_title: How to resize images for a website
description: Choose the right pixel width for content, hero and thumbnail images, account for high-density screens and avoid the oversized photos that slow pages down.
dek: Uploading camera originals is the most common reason small websites load slowly. A few pixel-width rules, plus attention to high-density screens, make pages faster without making images look worse.
---
## Why image size decides page speed

Images are usually the heaviest part of a web page. A single unresized phone photo can weigh more than all the page's text, styles and scripts combined. Visitors on mobile data wait for every byte, and search engines measure how quickly the main content appears.

The browser will happily shrink a 4000-pixel photo to fit a 800-pixel column, but the visitor still downloads all 4000 pixels. Resizing before uploading removes that waste.

## Find the width the image is actually shown at

Measure the space in your layout:

- **Content images** inside an article column are often 650 to 900 CSS pixels wide on desktop.
- **Full-width hero images** may span 1200 to 1600 CSS pixels or more.
- **Thumbnails and cards** are often 300 to 400 CSS pixels wide.
- **Logos** are usually small, and often better as SVG. See [SVG versus PNG](blog:svg-vs-png).

To measure, right-click the image area in your browser and choose Inspect; the displayed width appears next to the element. Or check the theme's documentation for its content width.

## Account for high-density screens

Phones and many laptops have screens with two or three device pixels per CSS pixel. An image displayed 800 CSS pixels wide looks sharpest on those screens when it has about 1600 real pixels. A practical rule:

**Resize to about twice the displayed width, but rarely beyond 2000 to 2400 pixels.**

| Placement | Displayed width | Good file width |
| --- | --- | --- |
| Article image | 800 px | 1600 px |
| Hero banner | 1400 px | 2000 to 2400 px |
| Card thumbnail | 360 px | 720 px |
| Avatar | 96 px | 192 to 256 px |

If your platform supports responsive images (the `srcset` attribute, which many content management systems generate automatically), upload one good large version and let the system create smaller ones.

## Resize with Convertios

The [Image Resizer](tool:image-resizer) runs in your browser, so images are not uploaded:

1. Choose an image.
2. Enter a width in pixels with **Keep aspect ratio** turned on, or use **Scale (%)**.
3. Optionally crop by dragging a box on the preview, or rotate the image.
4. Pick an output format: same as original, JPG, PNG (keeps transparency) or WebP (keeps transparency).
5. Download and check the result.

Do not enlarge small images to fill a larger space. Upscaling makes them soft; choose a different layout or a better source image instead.

## Then compress

Resizing removes surplus pixels; compression removes surplus detail. For photos, export JPG or WebP and use the [image compressor](tool:compress-image) with a target size. For many content images, 100 to 300 KB is a reasonable target after resizing. Our guide to [reducing image size without losing visible quality](blog:reduce-image-size-without-losing-quality) explains how to judge the result.

WebP usually gives smaller files than JPG for the same visual quality and is supported by modern browsers. The [Image Converter](tool:image-converter) can create WebP versions.

## Other habits that keep pages fast

- **Set width and height** on images in your HTML or page builder, so the layout does not jump while images load.
- **Lazy-load images below the fold** so they download only when visitors scroll near them. Most platforms offer this.
- **Use descriptive file names and alt text,** for example `blue-ceramic-mug.jpg` and alt text that describes the image for people who cannot see it.
- **Avoid text inside images** where possible; real text is sharper, translatable and accessible.

## Quick checklist

- Measure displayed width; resize to about 2×.
- Keep the aspect ratio locked unless you intend to crop.
- JPG or WebP for photos, PNG or SVG for graphics.
- Compress after resizing and check at real size.
- Social platforms have their own sizes; see [social media image sizes](blog:social-media-image-sizes).

=== es ===
cover_alt: Foto de montaña adaptada a tres pantallas
title: Cómo redimensionar imágenes para una web sin hacerla lenta
seo_title: Cómo redimensionar imágenes para una web
description: Elige el ancho en píxeles adecuado para imágenes de contenido, cabeceras y miniaturas, ten en cuenta las pantallas de alta densidad y evita fotos enormes.
dek: Subir los originales de la cámara es el motivo más común de que una web pequeña cargue despacio. Unas reglas de ancho en píxeles y atención a las pantallas de alta densidad aceleran las páginas sin empeorar las imágenes.
---
## Por qué el tamaño de la imagen decide la velocidad

Las imágenes suelen ser lo más pesado de una página. Una sola foto del móvil sin redimensionar puede pesar más que todo el texto, los estilos y los scripts juntos. Quien navega con datos móviles espera cada byte, y los buscadores miden lo rápido que aparece el contenido principal.

El navegador reducirá sin problema una foto de 4000 píxeles para que quepa en una columna de 800, pero el visitante descarga igualmente los 4000 píxeles. Redimensionar antes de subir elimina ese desperdicio.

## Averigua el ancho real al que se muestra

Mide el espacio en tu diseño:

- **Imágenes de contenido** dentro de la columna de un artículo: suelen medir de 650 a 900 píxeles CSS en escritorio.
- **Cabeceras a ancho completo:** pueden ocupar de 1200 a 1600 píxeles CSS o más.
- **Miniaturas y tarjetas:** suelen tener de 300 a 400 píxeles CSS.
- **Logotipos:** normalmente pequeños, y a menudo mejor en SVG. Consulta [SVG frente a PNG](blog:svg-vs-png).

Para medir, haz clic derecho sobre la imagen en el navegador y elige Inspeccionar; el ancho mostrado aparece junto al elemento. También puedes consultar el ancho de contenido en la documentación de tu plantilla.

## Ten en cuenta las pantallas de alta densidad

Los móviles y muchos portátiles tienen pantallas con dos o tres píxeles físicos por cada píxel CSS. Una imagen mostrada a 800 píxeles CSS se ve más nítida en ellas si tiene unos 1600 píxeles reales. Una regla práctica:

**Redimensiona a aproximadamente el doble del ancho mostrado, pero rara vez por encima de 2000 a 2400 píxeles.**

| Ubicación | Ancho mostrado | Ancho del archivo |
| --- | --- | --- |
| Imagen de artículo | 800 px | 1600 px |
| Cabecera | 1400 px | 2000 a 2400 px |
| Miniatura de tarjeta | 360 px | 720 px |
| Avatar | 96 px | 192 a 256 px |

Si tu plataforma admite imágenes adaptables (el atributo `srcset`, que muchos gestores de contenido generan solos), sube una buena versión grande y deja que el sistema cree las pequeñas.

## Redimensiona con Convertios

El [Redimensionador de imágenes](tool:image-resizer) funciona en tu navegador, así que las imágenes no se suben:

1. Elige una imagen.
2. Escribe un ancho en píxeles con **Mantener proporción** activado, o usa **Escala (%)**.
3. Si quieres, recorta arrastrando un recuadro en la vista previa, o gira la imagen.
4. Elige el formato de salida: igual que el original, JPG, PNG (conserva la transparencia) o WebP (conserva la transparencia).
5. Descarga y revisa el resultado.

No amplíes imágenes pequeñas para llenar un espacio mayor. Agrandarlas las vuelve borrosas; mejor cambia el diseño o busca una imagen de origen mejor.

## Después, comprime

Redimensionar elimina píxeles sobrantes; comprimir elimina detalle sobrante. Para fotos, exporta en JPG o WebP y usa el [compresor de imágenes](tool:compress-image) con un tamaño objetivo. Para muchas imágenes de contenido, entre 100 y 300 KB es un objetivo razonable tras redimensionar. Nuestra guía para [reducir el peso de una imagen sin perder calidad visible](blog:reduce-image-size-without-losing-quality) explica cómo valorar el resultado.

WebP suele dar archivos más pequeños que JPG con la misma calidad visual y los navegadores modernos lo admiten. El [Conversor de imágenes](tool:image-converter) puede crear versiones WebP.

## Otros hábitos que mantienen la web rápida

- **Indica ancho y alto** de las imágenes en el HTML o en el editor de páginas, para que el diseño no salte mientras cargan.
- **Carga diferida para imágenes bajo el pliegue,** de modo que se descarguen solo cuando el visitante se acerque. La mayoría de plataformas lo ofrecen.
- **Usa nombres de archivo y texto alternativo descriptivos,** por ejemplo `taza-ceramica-azul.jpg` y un texto alternativo que describa la imagen a quien no puede verla.
- **Evita poner texto dentro de las imágenes** cuando puedas; el texto real es más nítido, traducible y accesible.

## Lista rápida

- Mide el ancho mostrado y redimensiona a unas 2 veces.
- Mantén la proporción bloqueada salvo que quieras recortar.
- JPG o WebP para fotos, PNG o SVG para gráficos.
- Comprime después de redimensionar y revisa a tamaño real.
- Las redes sociales tienen sus propios tamaños; consulta [tamaños de imagen para redes sociales](blog:social-media-image-sizes).

=== ar ===
cover_alt: صورة جبل تتكيف مع ثلاث شاشات مختلفة
title: كيف تغيّر حجم الصور لموقعك دون أن تجعله بطيئاً
seo_title: كيف تغيّر حجم الصور لموقع ويب
description: اختر العرض المناسب بالبكسل لصور المحتوى والواجهات والصور المصغرة، وراعِ الشاشات عالية الكثافة، وتجنب الصور الضخمة التي تبطئ الصفحات.
dek: رفع الصور الأصلية من الكاميرا هو أكثر أسباب بطء المواقع الصغيرة شيوعاً. قواعد قليلة لعرض الصور بالبكسل مع مراعاة الشاشات عالية الكثافة تجعل الصفحات أسرع دون أن تسوء الصور.
---
## لماذا يحدد حجم الصورة سرعة الصفحة

الصور عادةً أثقل ما في صفحة الويب، وقد تزن صورة هاتف واحدة دون تغيير حجمها أكثر من كل نصوص الصفحة وأنماطها وبرامجها مجتمعة. ينتظر الزائر على بيانات الجوال كل بايت، وتقيس محركات البحث سرعة ظهور المحتوى الرئيسي.

سيصغّر المتصفح صورة بعرض 4000 بكسل لتناسب عموداً بعرض 800، لكن الزائر يظل ينزّل الـ4000 بكسل كاملة. تغيير الحجم قبل الرفع يزيل هذا الهدر.

## اعرف العرض الذي تُعرض به الصورة فعلاً

قِس المساحة في تصميمك:

- **صور المحتوى** داخل عمود المقال: غالباً بين 650 و900 بكسل CSS على الحاسوب.
- **صور الواجهة بعرض كامل:** قد تمتد بين 1200 و1600 بكسل CSS أو أكثر.
- **الصور المصغرة والبطاقات:** غالباً بين 300 و400 بكسل CSS.
- **الشعارات:** صغيرة عادةً، وكثيراً ما تكون أفضل بصيغة SVG. راجع [مقارنة SVG مع PNG](blog:svg-vs-png).

للقياس انقر بزر الفأرة الأيمن على الصورة في المتصفح واختر «فحص»، فيظهر العرض المعروض بجانب العنصر، أو راجع عرض المحتوى في وثائق القالب.

## راعِ الشاشات عالية الكثافة

تحتوي الهواتف وكثير من الحواسيب المحمولة على شاشات فيها بكسلان أو ثلاثة بكسلات فعلية لكل بكسل CSS، فالصورة المعروضة بعرض 800 بكسل CSS تبدو أوضح عليها إذا احتوت نحو 1600 بكسل حقيقي. القاعدة العملية:

**غيّر الحجم إلى ضعف العرض المعروض تقريباً، ونادراً ما تتجاوز 2000 إلى 2400 بكسل.**

| الموضع | العرض المعروض | عرض الملف المناسب |
| --- | --- | --- |
| صورة مقال | 800 px | 1600 px |
| صورة واجهة | 1400 px | من 2000 إلى 2400 px |
| صورة بطاقة مصغرة | 360 px | 720 px |
| صورة رمزية | 96 px | من 192 إلى 256 px |

إذا كانت منصتك تدعم الصور المتجاوبة (السمة `srcset` التي تولدها كثير من أنظمة إدارة المحتوى تلقائياً) فارفع نسخة كبيرة جيدة ودع النظام ينشئ النسخ الأصغر.

## غيّر الحجم باستخدام Convertios

تعمل [أداة تغيير حجم الصور](tool:image-resizer) داخل متصفحك فلا تُرفع الصور:

1. اختر صورة.
2. أدخل العرض بالبكسل مع تفعيل **الحفاظ على نسبة الأبعاد**، أو استخدم **النسبة (%)**.
3. يمكنك القص بسحب مربع على المعاينة، أو تدوير الصورة.
4. اختر صيغة الإخراج: كالأصل، أو JPG، أو PNG (تحافظ على الشفافية)، أو WebP (تحافظ على الشفافية).
5. نزّل النتيجة وراجعها.

لا تكبّر الصور الصغيرة لتملأ مساحة أكبر، فالتكبير يجعلها ضبابية. غيّر التصميم أو ابحث عن صورة مصدر أفضل.

## ثم اضغط الصورة

تغيير الحجم يزيل البكسلات الزائدة، والضغط يزيل التفاصيل الزائدة. للصور الفوتوغرافية صدّر بصيغة JPG أو WebP واستخدم [ضاغط الصور](tool:compress-image) بحجم مستهدف. لكثير من صور المحتوى يعدّ هدف بين 100 و300 كيلوبايت معقولاً بعد تغيير الحجم. يشرح دليلنا [لتقليل حجم الصورة دون خسارة جودة مرئية](blog:reduce-image-size-without-losing-quality) كيف تحكم على النتيجة.

تعطي WebP عادةً ملفات أصغر من JPG بالجودة المرئية نفسها، وتدعمها المتصفحات الحديثة، ويستطيع [محوّل الصور](tool:image-converter) إنشاء نسخ WebP.

## عادات أخرى تبقي الصفحات سريعة

- **حدد العرض والارتفاع** للصور في HTML أو في أداة بناء الصفحات حتى لا يقفز التخطيط أثناء التحميل.
- **حمّل الصور أسفل الشاشة تحميلاً مؤجلاً** فلا تُنزّل إلا عند اقتراب الزائر منها، وتوفر معظم المنصات ذلك.
- **استخدم أسماء ملفات ونصوصاً بديلة وصفية،** مثل `blue-ceramic-mug.jpg` ونص بديل يصف الصورة لمن لا يستطيع رؤيتها.
- **تجنب وضع النص داخل الصور** متى أمكن، فالنص الحقيقي أوضح وقابل للترجمة ومتاح للجميع.

## قائمة سريعة

- قِس العرض المعروض وغيّر الحجم إلى ضعفه تقريباً.
- أبقِ التناسب مثبتاً إلا إذا كنت تقصد القص.
- JPG أو WebP للصور الفوتوغرافية، وPNG أو SVG للرسوم.
- اضغط بعد تغيير الحجم وراجع بالحجم الحقيقي.
- للشبكات الاجتماعية مقاساتها الخاصة؛ راجع [مقاسات صور الشبكات الاجتماعية](blog:social-media-image-sizes).

=== pt-br ===
cover_alt: Foto de montanha adaptada a três telas
title: Como redimensionar imagens para um site sem deixá-lo lento
seo_title: Como redimensionar imagens para um site
description: Escolha a largura em pixels certa para imagens de conteúdo, banners e miniaturas, considere telas de alta densidade e evite fotos enormes que deixam a página lenta.
dek: Subir os originais da câmera é o motivo mais comum de sites pequenos carregarem devagar. Algumas regras de largura em pixels, com atenção às telas de alta densidade, deixam as páginas mais rápidas sem piorar as imagens.
---
## Por que o tamanho da imagem define a velocidade

As imagens costumam ser a parte mais pesada de uma página. Uma única foto de celular sem redimensionar pode pesar mais do que todo o texto, os estilos e os scripts juntos. Quem navega com dados móveis espera cada byte, e os buscadores medem a rapidez com que o conteúdo principal aparece.

O navegador encolhe sem problema uma foto de 4.000 pixels para caber em uma coluna de 800, mas o visitante baixa os 4.000 pixels do mesmo jeito. Redimensionar antes de subir elimina esse desperdício.

## Descubra a largura em que a imagem aparece de fato

Meça o espaço no seu layout:

- **Imagens de conteúdo** dentro da coluna de um artigo costumam ter de 650 a 900 pixels CSS no computador.
- **Banners de largura total** podem ocupar de 1.200 a 1.600 pixels CSS ou mais.
- **Miniaturas e cards** costumam ter de 300 a 400 pixels CSS.
- **Logotipos** normalmente são pequenos, e muitas vezes ficam melhores em SVG. Veja [SVG ou PNG](blog:svg-vs-png).

Para medir, clique com o botão direito na imagem no navegador e escolha Inspecionar; a largura exibida aparece ao lado do elemento. Ou consulte a largura de conteúdo na documentação do seu tema.

## Considere as telas de alta densidade

Celulares e muitos notebooks têm telas com dois ou três pixels físicos para cada pixel CSS. Uma imagem exibida com 800 pixels CSS fica mais nítida nessas telas quando tem cerca de 1.600 pixels reais. Uma regra prática:

**Redimensione para cerca do dobro da largura exibida, mas raramente acima de 2.000 a 2.400 pixels.**

| Posição | Largura exibida | Largura do arquivo |
| --- | --- | --- |
| Imagem de artigo | 800 px | 1.600 px |
| Banner principal | 1.400 px | 2.000 a 2.400 px |
| Miniatura de card | 360 px | 720 px |
| Avatar | 96 px | 192 a 256 px |

Se a sua plataforma aceita imagens responsivas (o atributo `srcset`, que muitos gerenciadores de conteúdo geram sozinhos), envie uma versão grande e boa e deixe o sistema criar as menores.

## Redimensione com a Convertios

O [Redimensionador de imagens](tool:image-resizer) funciona no navegador, então as imagens não são enviadas:

1. Escolha uma imagem.
2. Digite a largura em pixels com **Manter proporção** ativado, ou use **Escala (%)**.
3. Se quiser, recorte arrastando uma caixa na prévia, ou gire a imagem.
4. Escolha o formato de saída: igual ao original, JPG, PNG (mantém transparência) ou WebP (mantém transparência).
5. Baixe e confira o resultado.

Não aumente imagens pequenas para preencher um espaço maior. Ampliar deixa tudo borrado; prefira mudar o layout ou buscar uma imagem de origem melhor.

## Depois, comprima

Redimensionar tira pixels sobrando; comprimir tira detalhes sobrando. Para fotos, exporte em JPG ou WebP e use o [compressor de imagens](tool:compress-image) com um tamanho-alvo. Para muitas imagens de conteúdo, algo entre 100 e 300 KB é um alvo razoável depois de redimensionar. Nosso guia para [diminuir o tamanho da imagem sem perder qualidade visível](blog:reduce-image-size-without-losing-quality) explica como avaliar o resultado.

O WebP costuma gerar arquivos menores que o JPG com a mesma qualidade visual, e os navegadores modernos o suportam. O [Conversor de imagens](tool:image-converter) cria versões em WebP.

## Outros hábitos que mantêm a página rápida

- **Defina largura e altura** das imagens no HTML ou no construtor de páginas, para o layout não pular enquanto elas carregam.
- **Use carregamento tardio (lazy loading) para imagens abaixo da dobra,** para que só baixem quando o visitante chegar perto. A maioria das plataformas oferece isso.
- **Use nomes de arquivo e texto alternativo descritivos,** como `caneca-ceramica-azul.jpg` e um texto alternativo que descreva a imagem para quem não pode vê-la.
- **Evite texto dentro de imagens** quando puder; texto de verdade é mais nítido, traduzível e acessível.

## Checklist rápido

- Meça a largura exibida e redimensione para cerca de 2×.
- Mantenha a proporção travada, a menos que queira recortar.
- JPG ou WebP para fotos, PNG ou SVG para gráficos.
- Comprima depois de redimensionar e confira no tamanho real.
- As redes sociais têm tamanhos próprios; veja [tamanhos de imagem para redes sociais](blog:social-media-image-sizes).
