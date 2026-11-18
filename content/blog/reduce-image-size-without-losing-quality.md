---
category: images-formats
type: guide
published: 2026-11-18
order: 199
status: published
cover: 4.2 MB → 380 KB
tools: compress-image, image-resizer, image-converter
related: compress-image-to-specific-size, lossy-vs-lossless-compression
keyword: reduce image file size without losing quality
intent: how-to
---
=== en ===
title: How to reduce image file size without losing visible quality
seo_title: Reduce image file size without losing quality
description: Shrink photos and screenshots for email, forms and websites by resizing first, choosing the right format and compressing only as far as the eye cannot see.
dek: Most images are far heavier than they need to be. The trick is to remove what nobody will ever see: surplus pixels, an unsuitable format and invisible detail, in that order.
---
## Why images are bigger than they need to be

A modern phone photo is often 4000 × 3000 pixels and several megabytes. Yet it is usually viewed on a screen a few hundred to about 1500 pixels wide, or attached to a form that allows 1 MB. Most of that file is detail nobody will ever see.

"Without losing quality" therefore means **without losing visible quality at the size the image will actually be seen**. Every method below follows that principle.

## Step 1: resize to the size you need

Pixel dimensions affect file size more than anything else. Halving the width and height leaves a quarter of the pixels, and usually a much smaller file, without any compression artefacts.

Typical targets:

| Use | Long side in pixels |
| --- | --- |
| Email attachment or chat | 1200 to 1600 |
| Website content image | 1200 to 2000, depending on layout width |
| Document page photographed for a form | about 2000 |
| Profile picture | 400 to 800 |
| Printing a 10 × 15 cm photo | about 1800 |

Use the [Image Resizer](tool:image-resizer) to set exact dimensions or a percentage, with the aspect ratio locked. It runs in your browser. Do not enlarge small images: scaling up only makes them softer. Our guide to [resizing images for websites](blog:resize-images-for-websites) covers layout widths and high-density screens.

## Step 2: choose a sensible format

- **Photos:** JPG or WebP. Photos saved as PNG are often several times larger with no visible benefit.
- **Screenshots, text, logos:** PNG keeps edges crisp; JPG can blur text.
- **Transparency needed:** PNG or WebP.

If you are unsure, our comparison of [JPG, PNG and WebP](blog:jpg-png-webp-guide) has a decision table. The [Image Converter](tool:image-converter) changes formats in the browser.

## Step 3: compress, but stop before it shows

JPG and WebP have a quality setting. Between roughly 75 and 90, most photos look identical to the original at normal viewing size, while the file shrinks dramatically. Below that range, artefacts start to appear around edges and in smooth gradients such as skies.

The [Convertios image compressor](tool:compress-image) offers two ways to work:

- **Target size (KB).** Enter the limit you were given, for example 200 KB. The tool searches for the highest quality that fits under it. If quality alone is not enough, it reduces the pixel dimensions a little at a time instead of making the picture blocky. It keeps JPG and WebP quality at 60% or higher before it starts reducing dimensions and never shrinks the shorter side below 160 pixels, which keeps photos readable.
- **Manual quality.** Leave the target empty and use the quality slider when appearance matters more than an exact number.

The result line tells you whether the target was reached, the final size, the dimensions and the quality used. Compression runs in your browser, so photos are not uploaded.

## How to check that quality is still fine

1. View the compressed image at the size it will be used, not zoomed to 400%.
2. Look at the areas that degrade first: fine text, sharp edges, faces, and smooth gradients like sky.
3. Compare with the original side by side if the image matters, such as a product photo or portfolio piece.

If you see blocky patches or halos, increase quality slightly or resize a little more instead.

## A note on metadata

Photos often carry hidden metadata such as camera model, date and sometimes GPS location. When the compressor re-encodes an image, the original EXIF details are not kept, which also removes location data. If the image is already below your target and the format is unchanged, the original file is returned with its metadata intact. Our guide to [photo metadata and privacy](blog:image-metadata-exif-privacy) explains what is inside and why it matters.

## Quick recipe

1. Resize to the largest size the image will actually be displayed.
2. Pick JPG or WebP for photos, PNG for screenshots and graphics.
3. Compress to a target size or quality between about 75 and 90.
4. Check at real viewing size.

For hard limits like 100 KB or 20 KB on application forms, see [how to compress an image to a specific size](blog:compress-image-to-specific-size).

=== es ===
title: Cómo reducir el peso de una imagen sin perder calidad visible
seo_title: Reducir el peso de una imagen sin perder calidad
description: Aligera fotos y capturas para correo, formularios y webs: primero redimensiona, elige el formato adecuado y comprime solo hasta donde el ojo no lo note.
dek: La mayoría de las imágenes pesan mucho más de lo necesario. La clave es quitar lo que nadie verá nunca: píxeles sobrantes, un formato poco adecuado y detalles invisibles, en ese orden.
---
## Por qué las imágenes pesan más de lo necesario

Una foto actual de móvil suele medir 4000 × 3000 píxeles y ocupar varios megas. Sin embargo, normalmente se ve en una pantalla de unos cientos a unos 1500 píxeles de ancho, o se adjunta a un formulario que admite 1 MB. Casi todo el archivo son detalles que nadie llegará a ver.

Por eso, «sin perder calidad» significa **sin perder calidad visible al tamaño al que realmente se verá la imagen**. Todos los métodos siguientes parten de esa idea.

## Paso 1: redimensiona al tamaño que necesitas

Las dimensiones en píxeles influyen en el peso más que nada. Reducir a la mitad el ancho y el alto deja una cuarta parte de los píxeles y, normalmente, un archivo mucho más pequeño, sin ningún artefacto de compresión.

Medidas orientativas:

| Uso | Lado largo en píxeles |
| --- | --- |
| Adjunto de correo o chat | 1200 a 1600 |
| Imagen de contenido en una web | 1200 a 2000, según el ancho del diseño |
| Página de documento fotografiada para un formulario | unos 2000 |
| Foto de perfil | 400 a 800 |
| Imprimir una foto de 10 × 15 cm | unos 1800 |

Usa el [Redimensionador de imágenes](tool:image-resizer) para fijar dimensiones exactas o un porcentaje con la proporción bloqueada. Funciona en tu navegador. No amplíes imágenes pequeñas: agrandarlas solo las vuelve más borrosas. Nuestra guía para [redimensionar imágenes para webs](blog:resize-images-for-websites) trata los anchos de diseño y las pantallas de alta densidad.

## Paso 2: elige un formato adecuado

- **Fotos:** JPG o WebP. Las fotos guardadas como PNG suelen pesar varias veces más sin ninguna ventaja visible.
- **Capturas, texto, logotipos:** PNG mantiene los bordes nítidos; JPG puede emborronar el texto.
- **Si necesitas transparencia:** PNG o WebP.

Si dudas, nuestra comparativa de [JPG, PNG y WebP](blog:jpg-png-webp-guide) incluye una tabla de decisión. El [Conversor de imágenes](tool:image-converter) cambia de formato en el navegador.

## Paso 3: comprime, pero para antes de que se note

JPG y WebP tienen un ajuste de calidad. Entre aproximadamente 75 y 90, la mayoría de las fotos se ven idénticas al original a tamaño normal, mientras el archivo se reduce muchísimo. Por debajo de ese rango empiezan a aparecer artefactos en los bordes y en degradados suaves como el cielo.

El [compresor de imágenes de Convertios](tool:compress-image) ofrece dos formas de trabajar:

- **Tamaño objetivo (KB).** Escribe el límite que te han dado, por ejemplo 200 KB. La herramienta busca la mayor calidad que cabe por debajo. Si con la calidad no basta, reduce poco a poco las dimensiones en lugar de pixelar la imagen. Mantiene la calidad de JPG y WebP en el 60 % o más antes de empezar a reducir dimensiones y nunca baja el lado corto de 160 píxeles, para que las fotos sigan siendo legibles.
- **Calidad manual.** Deja el objetivo vacío y usa el control de calidad cuando importa más el aspecto que una cifra exacta.

La línea de resultado indica si se alcanzó el objetivo, el tamaño final, las dimensiones y la calidad usada. La compresión se hace en tu navegador, así que las fotos no se suben.

## Cómo comprobar que la calidad sigue bien

1. Mira la imagen comprimida al tamaño en que se usará, no ampliada al 400 %.
2. Fíjate en las zonas que se degradan primero: texto fino, bordes nítidos, caras y degradados suaves como el cielo.
3. Si la imagen es importante, como una foto de producto o de portafolio, compárala con el original una al lado de otra.

Si ves bloques o halos, sube un poco la calidad o reduce un poco más las dimensiones.

## Una nota sobre los metadatos

Las fotos suelen llevar metadatos ocultos como el modelo de cámara, la fecha y a veces la ubicación GPS. Cuando el compresor vuelve a codificar una imagen, no conserva los datos EXIF originales, con lo que también desaparece la ubicación. Si la imagen ya está por debajo del objetivo y el formato no cambia, se devuelve el archivo original con sus metadatos intactos. Nuestra guía sobre [metadatos de las fotos y privacidad](blog:image-metadata-exif-privacy) explica qué contienen y por qué importa.

## Receta rápida

1. Redimensiona al mayor tamaño al que se mostrará realmente la imagen.
2. Elige JPG o WebP para fotos y PNG para capturas y gráficos.
3. Comprime hasta un tamaño objetivo o con una calidad de entre 75 y 90 aproximadamente.
4. Comprueba al tamaño real de visualización.

Para límites estrictos como 100 KB o 20 KB en formularios, consulta [cómo comprimir una imagen a un tamaño concreto](blog:compress-image-to-specific-size).

=== ar ===
title: كيف تقلل حجم الصورة دون خسارة جودة مرئية
seo_title: تقليل حجم الصورة دون خسارة الجودة
description: صغّر الصور ولقطات الشاشة للبريد والنماذج والمواقع: غيّر الأبعاد أولاً، واختر الصيغة المناسبة، واضغط فقط إلى الحد الذي لا تلاحظه العين.
dek: معظم الصور أثقل بكثير مما تحتاج إليه. السر هو إزالة ما لن يراه أحد أبداً: البكسلات الزائدة، والصيغة غير المناسبة، والتفاصيل غير المرئية، بهذا الترتيب.
---
## لماذا تكون الصور أكبر مما يلزم

كثيراً ما تبلغ صورة الهاتف الحديثة 4000 × 3000 بكسل وعدة ميغابايتات، بينما تُعرض عادةً على شاشة يتراوح عرضها بين بضع مئات ونحو 1500 بكسل، أو تُرفق بنموذج يسمح بـ1 ميغابايت. معظم الملف تفاصيل لن يراها أحد.

لذلك يعني «دون خسارة الجودة» **دون خسارة جودة مرئية بالحجم الذي ستُعرض به الصورة فعلاً**، وكل الطرق التالية تقوم على هذا المبدأ.

## الخطوة 1: غيّر الأبعاد إلى ما تحتاجه

تؤثر الأبعاد بالبكسل في الحجم أكثر من أي شيء آخر. تنصيف العرض والارتفاع يُبقي ربع البكسلات، وغالباً ملفاً أصغر بكثير، دون أي تشوهات ضغط.

أبعاد إرشادية:

| الاستخدام | الضلع الطويل بالبكسل |
| --- | --- |
| مرفق بريد أو محادثة | من 1200 إلى 1600 |
| صورة محتوى في موقع | من 1200 إلى 2000 حسب عرض التصميم |
| صفحة مستند مصوّرة لنموذج | نحو 2000 |
| صورة ملف شخصي | من 400 إلى 800 |
| طباعة صورة 10 × 15 سم | نحو 1800 |

استخدم [أداة تغيير حجم الصور](tool:image-resizer) لتحديد أبعاد دقيقة أو نسبة مئوية مع تثبيت التناسب، وهي تعمل داخل متصفحك. لا تكبّر الصور الصغيرة، فالتكبير يجعلها أكثر ضبابية فقط. يتناول دليلنا [لتغيير حجم الصور للمواقع](blog:resize-images-for-websites) عروض التصاميم والشاشات عالية الكثافة.

## الخطوة 2: اختر صيغة مناسبة

- **الصور الفوتوغرافية:** JPG أو WebP، فالصور المحفوظة بصيغة PNG تكون غالباً أكبر بعدة أضعاف دون فائدة مرئية.
- **لقطات الشاشة والنصوص والشعارات:** PNG تحافظ على حدة الحواف، بينما قد تطمس JPG النص.
- **إن احتجت إلى الشفافية:** PNG أو WebP.

إن ترددت فإن مقارنتنا بين [JPG وPNG وWebP](blog:jpg-png-webp-guide) تتضمن جدول قرار، ويغيّر [محوّل الصور](tool:image-converter) الصيغة داخل المتصفح.

## الخطوة 3: اضغط وتوقف قبل أن يظهر الأثر

لصيغتي JPG وWebP إعداد للجودة. بين 75 و90 تقريباً تبدو معظم الصور مطابقة للأصل بالحجم العادي بينما يصغر الملف كثيراً، وتحت هذا النطاق تبدأ التشوهات بالظهور عند الحواف وفي التدرجات الناعمة مثل السماء.

يوفر [ضاغط الصور في Convertios](tool:compress-image) طريقتين للعمل:

- **حجم الملف المطلوب (KB).** أدخل الحد المطلوب منك، مثل 200 كيلوبايت، فتبحث الأداة عن أعلى جودة تناسبه. وإذا لم تكفِ الجودة وحدها تقلل الأبعاد قليلاً قليلاً بدلاً من تحويل الصورة إلى مربعات. تحافظ على جودة JPG وWebP عند 60% أو أكثر قبل البدء بتقليل الأبعاد، ولا تنزل بالضلع القصير تحت 160 بكسل، حتى تبقى الصور مقروءة.
- **الجودة اليدوية.** اترك الحقل فارغاً واستخدم شريط الجودة حين يكون المظهر أهم من رقم محدد.

يخبرك سطر النتيجة هل تحقق الهدف، وما الحجم النهائي والأبعاد والجودة المستخدمة. يجري الضغط داخل متصفحك فلا تُرفع صورك.

## كيف تتأكد أن الجودة ما زالت جيدة

1. شاهد الصورة المضغوطة بالحجم الذي ستُستخدم به، لا مكبرة إلى 400%.
2. انظر إلى المناطق التي تتأثر أولاً: النص الدقيق، والحواف الحادة، والوجوه، والتدرجات الناعمة مثل السماء.
3. إن كانت الصورة مهمة، كصورة منتج أو عمل في معرض أعمال، فقارنها بالأصل جنباً إلى جنب.

إذا رأيت بقعاً مربعة أو هالات فارفع الجودة قليلاً أو قلل الأبعاد قليلاً بدلاً من ذلك.

## ملاحظة عن البيانات الوصفية

تحمل الصور غالباً بيانات وصفية مخفية مثل طراز الكاميرا والتاريخ وأحياناً موقع GPS. عندما يعيد الضاغط ترميز الصورة لا يحتفظ ببيانات EXIF الأصلية، فيزول الموقع أيضاً. أما إذا كانت الصورة أصلاً تحت الحجم المستهدف ولم تتغير الصيغة فيُعاد الملف الأصلي ببياناته كما هي. يشرح دليلنا عن [بيانات الصور الوصفية والخصوصية](blog:image-metadata-exif-privacy) ما تحتويه ولماذا يهم.

## وصفة سريعة

1. غيّر الأبعاد إلى أكبر حجم ستُعرض به الصورة فعلاً.
2. اختر JPG أو WebP للصور الفوتوغرافية، وPNG للقطات الشاشة والرسوم.
3. اضغط إلى حجم مستهدف أو بجودة بين 75 و90 تقريباً.
4. تحقق بالحجم الحقيقي للعرض.

للحدود الصارمة مثل 100 أو 20 كيلوبايت في نماذج التقديم، راجع [كيف تضغط صورة إلى حجم محدد](blog:compress-image-to-specific-size).

=== pt-br ===
title: Como diminuir o tamanho de uma imagem sem perder qualidade visível
seo_title: Diminuir o tamanho da imagem sem perder qualidade
description: Deixe fotos e capturas de tela mais leves para e-mail, formulários e sites: redimensione primeiro, escolha o formato certo e comprima só até onde o olho não percebe.
dek: A maioria das imagens pesa muito mais do que precisa. O segredo é tirar o que ninguém nunca vai ver: pixels sobrando, um formato inadequado e detalhes invisíveis, nessa ordem.
---
## Por que as imagens são maiores do que precisam

Uma foto de celular atual costuma ter 4.000 × 3.000 pixels e vários megas. Mas ela normalmente é vista em uma tela de algumas centenas até uns 1.500 pixels de largura, ou anexada a um formulário que aceita 1 MB. Quase todo o arquivo é detalhe que ninguém vai enxergar.

Por isso, "sem perder qualidade" significa **sem perder qualidade visível no tamanho em que a imagem realmente será vista**. Todos os métodos abaixo seguem essa ideia.

## Passo 1: redimensione para o tamanho de que você precisa

As dimensões em pixels influenciam o tamanho do arquivo mais do que qualquer outra coisa. Reduzir largura e altura pela metade deixa um quarto dos pixels e, normalmente, um arquivo bem menor, sem nenhum artefato de compressão.

Medidas de referência:

| Uso | Lado maior em pixels |
| --- | --- |
| Anexo de e-mail ou conversa | 1.200 a 1.600 |
| Imagem de conteúdo em site | 1.200 a 2.000, conforme a largura do layout |
| Página de documento fotografada para formulário | cerca de 2.000 |
| Foto de perfil | 400 a 800 |
| Impressão de foto 10 × 15 cm | cerca de 1.800 |

Use o [Redimensionador de imagens](tool:image-resizer) para definir dimensões exatas ou uma porcentagem com a proporção travada. Ele funciona no navegador. Não aumente imagens pequenas: ampliar só deixa tudo mais borrado. Nosso guia para [redimensionar imagens para sites](blog:resize-images-for-websites) trata de larguras de layout e telas de alta densidade.

## Passo 2: escolha um formato adequado

- **Fotos:** JPG ou WebP. Fotos salvas em PNG costumam ser várias vezes maiores sem nenhum ganho visível.
- **Capturas de tela, texto, logotipos:** o PNG mantém as bordas nítidas; o JPG pode borrar o texto.
- **Precisa de transparência:** PNG ou WebP.

Na dúvida, nossa comparação entre [JPG, PNG e WebP](blog:jpg-png-webp-guide) tem uma tabela de decisão. O [Conversor de imagens](tool:image-converter) troca o formato no navegador.

## Passo 3: comprima, mas pare antes que apareça

JPG e WebP têm um ajuste de qualidade. Entre mais ou menos 75 e 90, a maioria das fotos parece idêntica ao original no tamanho normal, enquanto o arquivo diminui muito. Abaixo disso, começam a surgir artefatos nas bordas e em degradês suaves, como o céu.

O [compressor de imagens da Convertios](tool:compress-image) oferece dois modos:

- **Tamanho desejado (KB).** Digite o limite que pediram, por exemplo 200 KB. A ferramenta procura a maior qualidade que cabe abaixo dele. Se só a qualidade não bastar, ela reduz as dimensões aos poucos em vez de deixar a imagem quadriculada. Mantém a qualidade de JPG e WebP em 60% ou mais antes de começar a reduzir dimensões e nunca deixa o lado menor abaixo de 160 pixels, para a foto continuar legível.
- **Qualidade manual.** Deixe o alvo vazio e use o controle de qualidade quando a aparência importar mais do que um número exato.

A linha de resultado mostra se o alvo foi atingido, o tamanho final, as dimensões e a qualidade usada. A compressão acontece no navegador, então as fotos não são enviadas.

## Como conferir se a qualidade continua boa

1. Veja a imagem comprimida no tamanho em que ela será usada, não ampliada a 400%.
2. Observe as áreas que pioram primeiro: texto fino, bordas nítidas, rostos e degradês suaves como o céu.
3. Se a imagem for importante, como uma foto de produto ou de portfólio, compare lado a lado com o original.

Se aparecerem blocos ou halos, aumente um pouco a qualidade ou reduza um pouco mais as dimensões.

## Uma observação sobre metadados

Fotos costumam carregar metadados escondidos, como modelo da câmera, data e às vezes a localização GPS. Quando o compressor recodifica uma imagem, os dados EXIF originais não são mantidos, o que também remove a localização. Se a imagem já estiver abaixo do alvo e o formato não mudar, o arquivo original é devolvido com os metadados intactos. Nosso guia sobre [metadados de fotos e privacidade](blog:image-metadata-exif-privacy) explica o que há neles e por que isso importa.

## Receita rápida

1. Redimensione para o maior tamanho em que a imagem será de fato exibida.
2. Escolha JPG ou WebP para fotos e PNG para capturas e gráficos.
3. Comprima até um tamanho-alvo ou com qualidade entre 75 e 90, aproximadamente.
4. Confira no tamanho real de exibição.

Para limites rígidos como 100 KB ou 20 KB em formulários, veja [como comprimir uma imagem para um tamanho específico](blog:compress-image-to-specific-size).
