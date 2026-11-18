---
category: images-formats
type: guide
published: 2026-11-18
order: 153
status: published
cover_image: image-dpi-and-print-size
cover: 300 DPI?
tools: image-resizer, ai-image-enhancer, compress-image
related: ai-upscaling-vs-resizing, resize-images-for-websites
keyword: dpi vs pixels for printing
intent: informational
---
=== en ===
cover_alt: Photographic prints and a magnifying lens
title: DPI vs pixels: how big can you print an image?
seo_title: DPI vs pixels: how big can you print a photo?
description: The DPI value stored in a file rarely matters; pixel dimensions do. How to calculate print size, what resolution prints need and why changing DPI alone fails.
dek: A print shop asks for "300 DPI" and suddenly a perfectly good photo seems inadequate. In practice, the number of pixels decides how large an image can be printed sharply, and a simple calculation tells you.
---
## Pixels are what count

A digital image is a grid of pixels, for example 3000 × 2000. That is the only resolution information that really describes how much detail it contains.

**DPI** (dots per inch), or more precisely PPI (pixels per inch) for images, describes how densely those pixels will be spread when printed. Many files store a DPI value in their metadata, often 72 or 300, but it is only a suggestion. Changing it from 72 to 300 without changing the pixels does not add any detail; it only changes the default print size some programs choose.

## The calculation

**Print size in inches = pixels ÷ PPI.** For centimetres, multiply inches by 2.54.

A 3000 × 2000 photo printed at 300 PPI:

- 3000 ÷ 300 = 10 inches wide (25.4 cm)
- 2000 ÷ 300 = 6.67 inches tall (16.9 cm)

The same photo at 150 PPI would be 20 × 13.3 inches (50.8 × 33.9 cm), at half the pixel density.

## How much resolution do you need?

| Print | Viewing distance | Typical PPI | Pixels needed for 10 × 15 cm / 4 × 6 in |
| --- | --- | --- | --- |
| Photo prints, magazines | Hand-held | 300 | about 1200 × 1800 |
| Flyers, documents | Hand-held | 200–300 | about 800–1200 × 1200–1800 |
| Posters | 1–2 metres | 100–150 | depends on poster size |
| Banners and billboards | Several metres | 20–75 | depends on size |

The further away people stand, the lower the resolution can be. A large poster at 150 PPI viewed from a metre away looks sharp; the same density in a hand-held photo looks soft.

## Practical examples

- **A4 page at 300 PPI** (8.27 × 11.69 in): about 2480 × 3508 pixels.
- **Business card QR code**, 2.5 cm wide at 300 PPI: about 300 pixels. A vector SVG avoids the question entirely; see [QR codes as PNG or SVG](blog:qr-code-png-vs-svg).
- **Phone photo of 4000 × 3000** pixels: about 33.9 × 25.4 cm at 300 PPI, or larger at lower densities.

## When the image has too few pixels

1. **Find a larger original.** Photos sent through messaging apps and downloaded from social networks are usually reduced.
2. **Print smaller,** or choose a format viewed from further away.
3. **Consider AI upscaling for appearance.** The [AI Image Enhancer](tool:ai-image-enhancer) uploads images to the Convertios server and Cloudinary for restoration, and upscales small images 4×. The added detail is generated rather than recovered; read [AI upscaling versus resizing](blog:ai-upscaling-vs-resizing) before using it for prints where accuracy matters.

Ordinary enlargement with an image resizer creates more pixels but not more detail.

## When the image has too many pixels

For printing, extra pixels do no harm, though very large files can be slow to upload. For screens and email, resizing down makes sense: the [Image Resizer](tool:image-resizer) sets exact pixel dimensions, and our guide to [resizing images for websites](blog:resize-images-for-websites) covers screen sizes.

## Checklist before sending to print

- Check pixel dimensions, not just the DPI field.
- Calculate the print size at the PPI your printer recommends.
- Ask whether the printer wants JPG, PNG, PDF or a specific colour profile.
- Avoid heavy compression for print files; quality above file size.

=== es ===
cover_alt: Copias fotográficas y una lupa
title: PPP frente a píxeles: ¿a qué tamaño puedes imprimir una imagen?
seo_title: PPP o píxeles: ¿a qué tamaño puedes imprimir una foto?
description: El valor de PPP de un archivo casi nunca importa; los píxeles sí. Cómo calcular el tamaño de impresión y qué resolución necesita cada uso.
dek: Una imprenta pide «300 ppp» y de repente una foto perfectamente buena parece insuficiente. En la práctica, el número de píxeles decide a qué tamaño puede imprimirse nítida una imagen, y un cálculo sencillo te lo dice.
---
## Lo que cuenta son los píxeles

Una imagen digital es una cuadrícula de píxeles, por ejemplo de 3000 × 2000. Es el único dato de resolución que describe de verdad cuánto detalle contiene.

Los **PPP** (puntos por pulgada, en inglés DPI) o, con más precisión para imágenes, píxeles por pulgada (PPI), describen con qué densidad se reparten esos píxeles al imprimir. Muchos archivos guardan un valor de PPP en sus metadatos, a menudo 72 o 300, pero solo es una sugerencia. Cambiarlo de 72 a 300 sin cambiar los píxeles no añade detalle; solo cambia el tamaño de impresión que eligen por defecto algunos programas.

## El cálculo

**Tamaño de impresión en pulgadas = píxeles ÷ PPI.** Para centímetros, multiplica las pulgadas por 2,54.

Una foto de 3000 × 2000 impresa a 300 PPI:

- 3000 ÷ 300 = 10 pulgadas de ancho (25,4 cm)
- 2000 ÷ 300 = 6,67 pulgadas de alto (16,9 cm)

La misma foto a 150 PPI mediría 20 × 13,3 pulgadas (50,8 × 33,9 cm), con la mitad de densidad de píxeles.

## ¿Cuánta resolución necesitas?

| Impresión | Distancia de visión | PPI habitual | Píxeles para 10 × 15 cm |
| --- | --- | --- | --- |
| Fotos impresas, revistas | En la mano | 300 | unos 1200 × 1800 |
| Folletos, documentos | En la mano | 200–300 | unos 800–1200 × 1200–1800 |
| Carteles | 1–2 metros | 100–150 | depende del tamaño del cartel |
| Pancartas y vallas | Varios metros | 20–75 | depende del tamaño |

Cuanto más lejos se mire, menor puede ser la resolución. Un cartel grande a 150 PPI visto a un metro se ve nítido; esa misma densidad en una foto en la mano se ve blanda.

## Ejemplos prácticos

- **Página A4 a 300 PPI** (21 × 29,7 cm): unos 2480 × 3508 píxeles.
- **Código QR en una tarjeta de visita**, de 2,5 cm de ancho a 300 PPI: unos 300 píxeles. Un SVG vectorial evita la cuestión por completo; consulta [QR en PNG o SVG](blog:qr-code-png-vs-svg).
- **Foto de móvil de 4000 × 3000** píxeles: unos 33,9 × 25,4 cm a 300 PPI, o más con densidades menores.

## Cuando la imagen tiene pocos píxeles

1. **Busca un original más grande.** Las fotos enviadas por mensajería o descargadas de redes sociales suelen estar reducidas.
2. **Imprime más pequeño,** o elige un formato que se vea desde más lejos.
3. **Plantéate el escalado con IA para mejorar el aspecto.** El [Mejorador de imágenes con IA](tool:ai-image-enhancer) sube las imágenes al servidor de Convertios y a Cloudinary para restaurarlas, y amplía 4× las imágenes pequeñas. El detalle añadido se genera, no se recupera; lee [escalado con IA frente a redimensionado](blog:ai-upscaling-vs-resizing) antes de usarlo en impresiones donde importe la exactitud.

Ampliar con un redimensionador normal crea más píxeles, pero no más detalle.

## Cuando la imagen tiene demasiados píxeles

Para imprimir, los píxeles de más no hacen daño, aunque los archivos muy grandes pueden tardar en subir. Para pantallas y correo, conviene reducir: el [Redimensionador de imágenes](tool:image-resizer) fija dimensiones exactas en píxeles, y nuestra guía para [redimensionar imágenes para webs](blog:resize-images-for-websites) trata los tamaños de pantalla.

## Lista antes de enviar a imprenta

- Comprueba las dimensiones en píxeles, no solo el campo de PPP.
- Calcula el tamaño de impresión con los PPI que recomienda tu imprenta.
- Pregunta si quieren JPG, PNG, PDF o un perfil de color concreto.
- Evita la compresión fuerte en archivos para imprimir; prima la calidad sobre el peso.

=== ar ===
cover_alt: مطبوعات فوتوغرافية وعدسة مكبرة
title: الدقة النقطية DPI مقابل البكسلات: إلى أي حجم يمكنك طباعة الصورة؟
seo_title: DPI أم البكسلات: إلى أي حجم يمكنك طباعة صورة؟
description: نادراً ما يهم رقم DPI المحفوظ في الملف، أما الأبعاد بالبكسل فتهم. تعلّم حساب حجم الطباعة والدقة المطلوبة لكل نوع، ولماذا لا يفيد تغيير DPI وحده.
dek: تطلب المطبعة «300 DPI» فتبدو صورة جيدة تماماً غير كافية فجأة. في الواقع، عدد البكسلات هو ما يحدد أكبر حجم تُطبع به الصورة بوضوح، وحساب بسيط يخبرك به.
---
## البكسلات هي ما يهم

الصورة الرقمية شبكة من البكسلات، مثل 3000 × 2000، وهذه هي معلومة الدقة الوحيدة التي تصف فعلاً مقدار التفاصيل فيها.

أما **DPI** (نقطة في البوصة)، أو بدقة أكبر PPI (بكسل في البوصة) للصور، فيصف مدى كثافة توزيع هذه البكسلات عند الطباعة. تحفظ ملفات كثيرة قيمة DPI في بياناتها الوصفية، غالباً 72 أو 300، لكنها مجرد اقتراح. تغييرها من 72 إلى 300 دون تغيير البكسلات لا يضيف أي تفاصيل، بل يغيّر فقط حجم الطباعة الافتراضي الذي تختاره بعض البرامج.

## طريقة الحساب

**حجم الطباعة بالبوصة = عدد البكسلات ÷ PPI.** وللسنتيمترات اضرب البوصات في 2.54.

صورة بحجم 3000 × 2000 مطبوعة بكثافة 300 PPI:

- 3000 ÷ 300 = 10 بوصات عرضاً (25.4 سم)
- 2000 ÷ 300 = 6.67 بوصات ارتفاعاً (16.9 سم)

والصورة نفسها بكثافة 150 PPI تصبح 20 × 13.3 بوصة (50.8 × 33.9 سم) بنصف كثافة البكسلات.

## كم دقة تحتاج؟

| نوع الطباعة | مسافة المشاهدة | PPI المعتاد | البكسلات اللازمة لمقاس 10 × 15 سم |
| --- | --- | --- | --- |
| الصور المطبوعة والمجلات | في اليد | 300 | نحو 1200 × 1800 |
| المطويات والمستندات | في اليد | 200–300 | نحو 800–1200 × 1200–1800 |
| الملصقات | 1–2 متر | 100–150 | حسب حجم الملصق |
| اللافتات واللوحات الإعلانية | عدة أمتار | 20–75 | حسب الحجم |

كلما ابتعد المشاهد أمكن خفض الدقة؛ فالملصق الكبير بكثافة 150 PPI يبدو حاداً من مسافة متر، بينما تبدو الكثافة نفسها ناعمة في صورة تُمسك باليد.

## أمثلة عملية

- **صفحة A4 بكثافة 300 PPI** (21 × 29.7 سم): نحو 2480 × 3508 بكسل.
- **رمز QR على بطاقة عمل** بعرض 2.5 سم وبكثافة 300 PPI: نحو 300 بكسل، وملف SVG المتجه يتجنب المسألة كلياً؛ راجع [رمز QR بصيغة PNG أو SVG](blog:qr-code-png-vs-svg).
- **صورة هاتف بحجم 4000 × 3000** بكسل: نحو 33.9 × 25.4 سم بكثافة 300 PPI، أو أكبر بكثافات أقل.

## عندما تكون البكسلات قليلة

1. **ابحث عن أصل أكبر.** الصور المرسلة عبر تطبيقات المراسلة أو المنزّلة من الشبكات الاجتماعية تكون عادةً مصغرة.
2. **اطبع بحجم أصغر،** أو اختر صيغة تُشاهد من مسافة أبعد.
3. **فكّر في التكبير بالذكاء الاصطناعي لتحسين المظهر.** ترفع أداة [تحسين الصور بالذكاء الاصطناعي](tool:ai-image-enhancer) الصور إلى خادم Convertios وإلى Cloudinary لاستعادتها، وتكبّر الصور الصغيرة أربع مرات. التفاصيل المضافة مولَّدة لا مستعادة، فاقرأ [التكبير بالذكاء الاصطناعي مقابل تغيير الحجم](blog:ai-upscaling-vs-resizing) قبل استخدامها في مطبوعات تهم فيها الدقة.

التكبير العادي بأداة تغيير الحجم ينشئ بكسلات أكثر لكنه لا يضيف تفاصيل.

## عندما تكون البكسلات كثيرة

في الطباعة لا تضر البكسلات الزائدة، وإن كانت الملفات الكبيرة جداً بطيئة في الرفع. أما للشاشات والبريد فالتصغير منطقي: تحدد [أداة تغيير حجم الصور](tool:image-resizer) أبعاداً دقيقة بالبكسل، ويتناول دليلنا [لتغيير حجم الصور للمواقع](blog:resize-images-for-websites) أحجام الشاشات.

## قائمة قبل الإرسال إلى المطبعة

- تحقق من الأبعاد بالبكسل لا من حقل DPI فقط.
- احسب حجم الطباعة بالكثافة التي توصي بها المطبعة.
- اسأل هل تريد المطبعة JPG أو PNG أو PDF أو ملف تعريف ألوان معيناً.
- تجنب الضغط الشديد في ملفات الطباعة، فالجودة أهم من الحجم.

=== pt-br ===
cover_alt: Impressões fotográficas e uma lupa
title: DPI ou pixels: de que tamanho você pode imprimir uma imagem?
seo_title: DPI ou pixels: de que tamanho dá para imprimir uma foto?
description: O DPI gravado no arquivo raramente importa; os pixels, sim. Como calcular o tamanho de impressão e qual resolução cada uso precisa.
dek: A gráfica pede "300 DPI" e de repente uma foto perfeitamente boa parece insuficiente. Na prática, o número de pixels define até que tamanho uma imagem pode ser impressa com nitidez, e uma conta simples mostra isso.
---
## O que conta são os pixels

Uma imagem digital é uma grade de pixels, por exemplo 3000 × 2000. Essa é a única informação de resolução que realmente descreve quanto detalhe ela tem.

O **DPI** (pontos por polegada), ou mais precisamente PPI (pixels por polegada) no caso de imagens, descreve com que densidade esses pixels serão distribuídos na impressão. Muitos arquivos guardam um valor de DPI nos metadados, muitas vezes 72 ou 300, mas é só uma sugestão. Trocar de 72 para 300 sem mudar os pixels não acrescenta detalhe nenhum; só muda o tamanho de impressão que alguns programas escolhem por padrão.

## A conta

**Tamanho de impressão em polegadas = pixels ÷ PPI.** Para centímetros, multiplique as polegadas por 2,54.

Uma foto de 3000 × 2000 impressa a 300 PPI:

- 3000 ÷ 300 = 10 polegadas de largura (25,4 cm)
- 2000 ÷ 300 = 6,67 polegadas de altura (16,9 cm)

A mesma foto a 150 PPI teria 20 × 13,3 polegadas (50,8 × 33,9 cm), com metade da densidade de pixels.

## Quanta resolução você precisa?

| Impressão | Distância de visualização | PPI comum | Pixels para 10 × 15 cm |
| --- | --- | --- | --- |
| Fotos impressas, revistas | Na mão | 300 | cerca de 1200 × 1800 |
| Panfletos, documentos | Na mão | 200–300 | cerca de 800–1200 × 1200–1800 |
| Cartazes | 1–2 metros | 100–150 | depende do tamanho do cartaz |
| Banners e outdoors | Vários metros | 20–75 | depende do tamanho |

Quanto mais longe as pessoas ficam, menor pode ser a resolução. Um cartaz grande a 150 PPI visto a um metro parece nítido; a mesma densidade em uma foto na mão parece mole.

## Exemplos práticos

- **Página A4 a 300 PPI** (21 × 29,7 cm): cerca de 2480 × 3508 pixels.
- **QR Code em cartão de visita,** com 2,5 cm de largura a 300 PPI: cerca de 300 pixels. Um SVG vetorial elimina a questão; veja [QR Code em PNG ou SVG](blog:qr-code-png-vs-svg).
- **Foto de celular de 4000 × 3000** pixels: cerca de 33,9 × 25,4 cm a 300 PPI, ou maior com densidades menores.

## Quando a imagem tem poucos pixels

1. **Procure um original maior.** Fotos enviadas por apps de mensagem ou baixadas de redes sociais costumam estar reduzidas.
2. **Imprima menor,** ou escolha um formato visto de mais longe.
3. **Considere a ampliação com IA para melhorar a aparência.** O [Melhorador de imagens com IA](tool:ai-image-enhancer) envia as imagens ao servidor da Convertios e à Cloudinary para restauração e amplia 4× as imagens pequenas. O detalhe acrescentado é gerado, não recuperado; leia [ampliação com IA versus redimensionamento](blog:ai-upscaling-vs-resizing) antes de usar em impressões em que a exatidão importa.

Ampliar com um redimensionador comum cria mais pixels, mas não mais detalhe.

## Quando a imagem tem pixels demais

Para impressão, pixels a mais não atrapalham, embora arquivos muito grandes possam demorar para enviar. Para telas e e-mail, reduzir faz sentido: o [Redimensionador de imagens](tool:image-resizer) define dimensões exatas em pixels, e nosso guia para [redimensionar imagens para sites](blog:resize-images-for-websites) trata dos tamanhos de tela.

## Checklist antes de mandar para a gráfica

- Confira as dimensões em pixels, não só o campo de DPI.
- Calcule o tamanho de impressão com o PPI que a gráfica recomenda.
- Pergunte se a gráfica quer JPG, PNG, PDF ou um perfil de cor específico.
- Evite compressão forte em arquivos para impressão; qualidade acima do tamanho.
