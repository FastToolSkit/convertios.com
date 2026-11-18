---
category: qr-web
type: comparison
published: 2026-11-11
updated: 2026-11-18
order: 11
status: published
cover: QR PNG / SVG
tools: qr-generator, link-shortener, image-resizer
related: svg-vs-png, retail-qr-2027
keyword: qr code png or svg
intent: comparison
---
=== en ===
title: QR code as PNG or SVG: which should you download?
seo_title: QR code PNG or SVG: which download to choose
description: PNG and SVG encode the same QR data but behave differently when resized and printed. Which to use for screens, documents, flyers and signs, and how to test.
dek: A QR code contains the text or link you encode. PNG and SVG can represent exactly the same code, but they react very differently when you enlarge, print or place them in a layout.
---
## Same code, two kinds of file

A QR code is a grid of black and white squares, called modules, arranged according to the QR standard. The data, for example your website address, is defined by which modules are dark. Both download formats describe that same grid:

- **PNG** stores it as pixels at one fixed size.
- **SVG** stores it as shapes: a set of squares that can be drawn at any size.

Scanners do not care which file you used. What matters is how sharp, large and high-contrast the printed or displayed code is.

## What the Convertios QR Code Generator produces

The [QR Code Generator](tool:qr-generator) creates codes in your browser from links or text, with UTF-8 encoding and medium error correction. It offers two downloads:

- a **1024 × 1024 pixel PNG** with the white quiet zone the QR specification requires (four modules on each side), and
- a **scalable SVG** with crisp edges, intended for print.

Both are black modules on a white background, the combination scanners read most reliably.

## When to choose PNG

- **Websites, emails and presentations.** PNG is accepted everywhere and 1024 pixels is plenty for screens.
- **Word documents and office software** that may not handle SVG well.
- **Small printed items** such as business cards, where 1024 pixels already gives more than 300 dots per inch at typical sizes.

Do not enlarge a PNG far beyond its size for a poster: edges become soft, and very blurry modules can make scanning less reliable.

## When to choose SVG

- **Large prints:** posters, banners, shop windows, vehicle graphics.
- **Professional printing** where the designer places the code in vector software.
- **Layouts that change size,** because the same file works at any dimension.

Some print services and online editors do not accept SVG; in that case export a large PNG from the SVG or use the PNG at its native size. Our comparison of [SVG and PNG](blog:svg-vs-png) covers the general trade-offs.

## Rules that matter more than the file type

1. **Keep the quiet zone.** The white border is part of the code. Do not crop it or place the code against a busy background.
2. **Keep strong contrast.** Dark modules on a light background. Inverted or pastel colour schemes fail on many phones.
3. **Print it large enough.** The longer the link, the more modules and the larger the code must be. Shorter content makes simpler codes; for long addresses, consider the [Link Shortener](tool:link-shortener), keeping in mind that short links depend on an external service.
4. **Do not distort it.** Scale proportionally; never stretch a QR code in one direction. If you resize a PNG for a layout, keep the aspect ratio locked in the [Image Resizer](tool:image-resizer).
5. **Test before printing in bulk.** Print one copy at final size and scan it with several phones, in the lighting where it will be used.

## Static codes and changing destinations

Codes from the Convertios generator are static: the destination is stored directly in the pattern. If the link changes later, you need a new code. Before printing thousands of flyers, make sure the address is final and the page works well on phones.

For product packaging scanned at checkout, ordinary URL QR codes are different from the GS1 barcodes retailers use; see our news article on [GS1's 2027 retail barcode goal](blog:retail-qr-2027).

=== es ===
title: Código QR en PNG o SVG: ¿cuál deberías descargar?
seo_title: Código QR en PNG o SVG: qué descarga elegir
description: PNG y SVG guardan los mismos datos QR, pero se comportan distinto al ampliar e imprimir. Cuál usar en pantallas, documentos, folletos y carteles.
dek: Un código QR contiene el texto o enlace que codificas. PNG y SVG pueden representar exactamente el mismo código, pero reaccionan muy distinto cuando lo amplías, lo imprimes o lo colocas en un diseño.
---
## El mismo código, dos tipos de archivo

Un código QR es una cuadrícula de cuadrados blancos y negros, llamados módulos, ordenados según el estándar QR. Los datos, por ejemplo la dirección de tu web, se definen por qué módulos son oscuros. Los dos formatos de descarga describen esa misma cuadrícula:

- **PNG** la guarda como píxeles con un tamaño fijo.
- **SVG** la guarda como formas: un conjunto de cuadrados que se pueden dibujar a cualquier tamaño.

A los lectores de QR no les importa qué archivo usaste. Lo que cuenta es lo nítido, grande y contrastado que se ve el código impreso o en pantalla.

## Qué genera el Generador de códigos QR de Convertios

El [Generador de códigos QR](tool:qr-generator) crea códigos en tu navegador a partir de enlaces o texto, con codificación UTF-8 y corrección de errores media. Ofrece dos descargas:

- un **PNG de 1024 × 1024 píxeles** con el margen blanco que exige la especificación QR (cuatro módulos por lado), y
- un **SVG escalable** con bordes nítidos, pensado para imprimir.

Ambos tienen módulos negros sobre fondo blanco, la combinación que los lectores leen con más fiabilidad.

## Cuándo elegir PNG

- **Webs, correos y presentaciones.** PNG se acepta en todas partes y 1024 píxeles sobran para pantallas.
- **Documentos de Word y programas ofimáticos** que quizá no manejen bien el SVG.
- **Impresos pequeños** como tarjetas de visita, donde 1024 píxeles ya dan más de 300 puntos por pulgada a los tamaños habituales.

No amplíes un PNG muy por encima de su tamaño para un cartel: los bordes se suavizan y unos módulos muy borrosos pueden hacer menos fiable la lectura.

## Cuándo elegir SVG

- **Impresiones grandes:** carteles, pancartas, escaparates, rotulación de vehículos.
- **Imprenta profesional,** donde el diseñador coloca el código en un programa vectorial.
- **Diseños que cambian de tamaño,** porque el mismo archivo sirve a cualquier dimensión.

Algunas imprentas y editores en línea no aceptan SVG; en ese caso exporta un PNG grande desde el SVG o usa el PNG a su tamaño original. Nuestra comparativa de [SVG y PNG](blog:svg-vs-png) trata las diferencias generales.

## Reglas que importan más que el tipo de archivo

1. **Respeta el margen blanco.** El borde blanco forma parte del código. No lo recortes ni pongas el código sobre un fondo recargado.
2. **Mantén un contraste fuerte.** Módulos oscuros sobre fondo claro. Las combinaciones invertidas o en tonos pastel fallan en muchos móviles.
3. **Imprímelo lo bastante grande.** Cuanto más largo el enlace, más módulos y mayor debe ser el código. Un contenido corto genera códigos más simples; para direcciones largas, plantéate el [Acortador de enlaces](tool:link-shortener), teniendo en cuenta que los enlaces cortos dependen de un servicio externo.
4. **No lo deformes.** Escala de forma proporcional; nunca estires un QR en una sola dirección. Si redimensionas un PNG para un diseño, mantén bloqueada la proporción en el [Redimensionador de imágenes](tool:image-resizer).
5. **Pruébalo antes de imprimir en cantidad.** Imprime una copia al tamaño final y escanéala con varios móviles, con la luz del lugar donde se usará.

## Códigos estáticos y destinos que cambian

Los códigos del generador de Convertios son estáticos: el destino se guarda directamente en el patrón. Si el enlace cambia más adelante, necesitarás un código nuevo. Antes de imprimir miles de folletos, asegúrate de que la dirección es definitiva y de que la página funciona bien en el móvil.

En los envases que se escanean en caja, los QR con enlace son distintos de los códigos GS1 que usan los comercios; consulta nuestra noticia sobre [el objetivo de GS1 para el comercio en 2027](blog:retail-qr-2027).

=== ar ===
title: رمز QR بصيغة PNG أم SVG: أيهما تنزّل؟
seo_title: رمز QR بصيغة PNG أم SVG: أي تنزيل تختار؟
description: تحمل PNG وSVG بيانات QR نفسها لكنهما تتصرفان بشكل مختلف عند تكبيرهما وطباعتهما. اعرف أيهما يناسب المواقع والمستندات والمطويات واللافتات الكبيرة، وكيف تختبر النتيجة.
dek: يحتوي رمز QR على النص أو الرابط الذي ترمّزه. تستطيع PNG وSVG تمثيل الرمز نفسه تماماً، لكنهما تتصرفان بشكل مختلف جداً عند التكبير أو الطباعة أو وضعهما في تصميم.
---
## الرمز نفسه في نوعين من الملفات

رمز QR شبكة من المربعات السوداء والبيضاء تسمى الوحدات، مرتبة وفق معيار QR. تحدد البيانات، مثل عنوان موقعك، أي الوحدات داكنة. وكلتا صيغتي التنزيل تصف الشبكة نفسها:

- **PNG** تحفظها كبكسلات بحجم ثابت واحد.
- **SVG** تحفظها كأشكال: مجموعة مربعات يمكن رسمها بأي حجم.

لا يهتم الماسح بالملف الذي استخدمته، بل بمدى حدة الرمز المطبوع أو المعروض وحجمه وتباينه.

## ما الذي ينتجه مولد رموز QR في Convertios

ينشئ [مولد رموز QR](tool:qr-generator) الرموز داخل متصفحك من الروابط أو النصوص، بترميز UTF-8 ومستوى متوسط لتصحيح الأخطاء، ويوفر تنزيلين:

- **ملف PNG بحجم 1024 × 1024 بكسل** مع الهامش الأبيض الذي يشترطه معيار QR (أربع وحدات من كل جانب)،
- **ملف SVG قابل للتكبير** بحواف حادة، مخصص للطباعة.

وكلاهما وحدات سوداء على خلفية بيضاء، وهو المزيج الذي تقرؤه الماسحات بأعلى موثوقية.

## متى تختار PNG

- **المواقع والبريد والعروض التقديمية.** تُقبل PNG في كل مكان، و1024 بكسل أكثر من كافية للشاشات.
- **مستندات Word وبرامج المكتب** التي قد لا تتعامل جيداً مع SVG.
- **المطبوعات الصغيرة** مثل بطاقات العمل، حيث تعطي 1024 بكسل أكثر من 300 نقطة في البوصة بالأحجام المعتادة.

لا تكبّر ملف PNG كثيراً فوق حجمه لملصق كبير، فالحواف تصبح ناعمة، والوحدات شديدة الضبابية قد تقلل موثوقية المسح.

## متى تختار SVG

- **المطبوعات الكبيرة:** الملصقات واللافتات وواجهات المحلات والرسوم على المركبات.
- **الطباعة الاحترافية** حين يضع المصمم الرمز في برنامج متجهات.
- **التصاميم متغيرة الحجم،** لأن الملف نفسه يعمل بأي أبعاد.

لا تقبل بعض المطابع والمحررات الإلكترونية صيغة SVG، وفي هذه الحالة صدّر ملف PNG كبيراً من SVG أو استخدم ملف PNG بحجمه الأصلي. تتناول مقارنتنا بين [SVG وPNG](blog:svg-vs-png) الفروق العامة.

## قواعد أهم من نوع الملف

1. **حافظ على الهامش الأبيض.** الحد الأبيض جزء من الرمز، فلا تقصه ولا تضع الرمز على خلفية مزدحمة.
2. **حافظ على تباين قوي.** وحدات داكنة على خلفية فاتحة، فالألوان المعكوسة أو الباستيل تفشل في هواتف كثيرة.
3. **اطبعه بحجم كافٍ.** كلما طال الرابط زادت الوحدات ووجب أن يكبر الرمز. المحتوى القصير يصنع رموزاً أبسط، وللعناوين الطويلة فكّر في [اختصار الروابط](tool:link-shortener)، مع العلم أن الروابط المختصرة تعتمد على خدمة خارجية.
4. **لا تشوّهه.** كبّر بتناسب ولا تمط الرمز في اتجاه واحد. إذا غيّرت حجم PNG لتصميم ما فأبقِ نسبة الأبعاد مثبتة في [أداة تغيير حجم الصور](tool:image-resizer).
5. **اختبره قبل الطباعة بكميات.** اطبع نسخة بالحجم النهائي وامسحها بعدة هواتف وفي الإضاءة التي سيُستخدم فيها.

## الرموز الثابتة والوجهات المتغيرة

الرموز التي ينتجها مولد Convertios ثابتة، أي أن الوجهة محفوظة مباشرة في النمط. إذا تغيّر الرابط لاحقاً فستحتاج إلى رمز جديد، لذا تأكد قبل طباعة آلاف المطويات أن العنوان نهائي وأن الصفحة تعمل جيداً على الهاتف.

أما في عبوات المنتجات التي تُمسح عند الدفع فرموز QR ذات الروابط تختلف عن رموز GS1 التي يستخدمها تجار التجزئة؛ راجع خبرنا عن [هدف GS1 للبيع بالتجزئة في 2027](blog:retail-qr-2027).

=== pt-br ===
title: QR Code em PNG ou SVG: qual você deve baixar?
seo_title: QR Code em PNG ou SVG: qual download escolher
description: PNG e SVG guardam os mesmos dados do QR, mas se comportam de forma diferente ao ampliar e imprimir. Qual usar em telas, documentos, panfletos e placas.
dek: Um QR Code contém o texto ou link que você codifica. PNG e SVG podem representar exatamente o mesmo código, mas reagem de jeitos bem diferentes quando você amplia, imprime ou encaixa o código em um layout.
---
## O mesmo código, dois tipos de arquivo

Um QR Code é uma grade de quadradinhos pretos e brancos, chamados módulos, organizados segundo o padrão QR. Os dados, como o endereço do seu site, são definidos por quais módulos são escuros. Os dois formatos de download descrevem essa mesma grade:

- O **PNG** guarda a grade como pixels em um tamanho fixo.
- O **SVG** guarda como formas: um conjunto de quadrados que podem ser desenhados em qualquer tamanho.

O leitor de QR não se importa com o arquivo usado. O que importa é quão nítido, grande e contrastado o código está impresso ou na tela.

## O que o Gerador de QR Code da Convertios produz

O [Gerador de QR Code](tool:qr-generator) cria códigos no navegador a partir de links ou textos, com codificação UTF-8 e correção de erros média. Ele oferece dois downloads:

- um **PNG de 1024 × 1024 pixels** com a margem branca que a especificação QR exige (quatro módulos de cada lado), e
- um **SVG escalável** com bordas nítidas, pensado para impressão.

Os dois têm módulos pretos sobre fundo branco, a combinação que os leitores leem com mais confiabilidade.

## Quando escolher PNG

- **Sites, e-mails e apresentações.** O PNG é aceito em todo lugar e 1024 pixels sobram para telas.
- **Documentos do Word e programas de escritório** que talvez não lidem bem com SVG.
- **Impressos pequenos,** como cartões de visita, em que 1024 pixels já dão mais de 300 pontos por polegada nos tamanhos comuns.

Não amplie um PNG muito além do tamanho dele para um cartaz: as bordas ficam suaves e módulos muito borrados podem deixar a leitura menos confiável.

## Quando escolher SVG

- **Impressões grandes:** cartazes, banners, vitrines, adesivos de veículos.
- **Gráfica profissional,** quando o designer posiciona o código em um programa vetorial.
- **Layouts que mudam de tamanho,** porque o mesmo arquivo serve para qualquer dimensão.

Algumas gráficas e editores online não aceitam SVG; nesse caso, exporte um PNG grande a partir do SVG ou use o PNG no tamanho original. Nossa comparação entre [SVG e PNG](blog:svg-vs-png) trata das diferenças gerais.

## Regras que importam mais do que o tipo de arquivo

1. **Respeite a margem branca.** A borda branca faz parte do código. Não recorte nem coloque o código sobre um fundo poluído.
2. **Mantenha contraste forte.** Módulos escuros sobre fundo claro. Cores invertidas ou em tons pastel falham em muitos celulares.
3. **Imprima grande o bastante.** Quanto mais longo o link, mais módulos e maior o código precisa ser. Conteúdos curtos geram códigos mais simples; para endereços longos, considere o [Encurtador de links](tool:link-shortener), lembrando que links curtos dependem de um serviço externo.
4. **Não distorça.** Redimensione proporcionalmente; nunca estique um QR em uma só direção. Se redimensionar um PNG para um layout, mantenha a proporção travada no [Redimensionador de imagens](tool:image-resizer).
5. **Teste antes de imprimir em quantidade.** Imprima uma cópia no tamanho final e leia com vários celulares, na iluminação do lugar onde o código vai ficar.

## Códigos estáticos e destinos que mudam

Os códigos do gerador da Convertios são estáticos: o destino fica gravado diretamente no padrão. Se o link mudar depois, você vai precisar de um código novo. Antes de imprimir milhares de panfletos, garanta que o endereço é definitivo e que a página funciona bem no celular.

Em embalagens lidas no caixa, QR Codes com links são diferentes dos códigos GS1 usados pelo varejo; veja nossa notícia sobre [a meta da GS1 para o varejo em 2027](blog:retail-qr-2027).
