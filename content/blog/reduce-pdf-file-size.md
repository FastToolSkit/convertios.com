---
category: pdf-documents
type: guide
published: 2026-11-18
order: 166
status: published
cover: 24 MB → 3 MB
tools: compress-image, jpg-to-pdf, split-pdf
related: photos-to-pdf-phone, pdf-brotli-2026
keyword: why is my pdf so large / reduce pdf size
intent: troubleshooting
---
=== en ===
title: Why is my PDF so large? Practical ways to make it smaller
seo_title: Why is my PDF so large? How to make it smaller
description: Most oversized PDFs are caused by images and scans. Find out what makes a PDF heavy and the reliable ways to shrink it before an upload limit stops you.
dek: A ten-page PDF can weigh 300 KB or 30 MB depending on what is inside. Once you know which part is heavy, making the file smaller is usually straightforward.
---
## What actually makes a PDF heavy

Text is cheap. A page of typed text usually needs only a few kilobytes. The size of most large PDFs comes from a few predictable sources:

- **Photos and scans.** A single phone photo can be 3 to 6 MB. A scan made at high resolution in full colour can be larger still, for every page.
- **Embedded fonts.** PDFs include fonts so the document looks the same everywhere. Several complete fonts, especially for languages with large character sets, add up.
- **Duplicated resources.** Some programs store the same logo or background image again on every page.
- **Incremental saves.** Editing and saving a PDF many times can append changes rather than rewrite the file.
- **Attachments and layers.** Embedded files, design layers and high-resolution previews remain inside even if you never see them.

The first point explains most cases. If your PDF came from a scanner or from photos, the images are almost certainly the problem.

## Find the cause in two minutes

1. Divide the file size by the number of pages. Around 50 KB per page or less suggests a text document; 1 MB or more per page points to images.
2. Zoom in on a page. If the text becomes blocky, the page is a picture (a scan) rather than real text.
3. Remove all but one page with [Split PDF](tool:split-pdf) and look at the new size. If one page is several megabytes, that page's images are the issue.

## Ways to make a PDF smaller

### Recreate it at a sensible resolution

The most reliable fix is to go back one step and create the PDF again with better settings:

- **Scanning:** for ordinary documents, around 200 to 300 dpi is usually enough to read and print. Use greyscale or black-and-white instead of full colour when colour does not matter.
- **Exporting from Word, PowerPoint or similar:** many programs offer a smaller export option, often called "minimum size" or "optimise for online", which reduces image resolution.

### Shrink photos before building the PDF

If the PDF is made from photos, compress or resize them first and then create the PDF:

1. Use [Compress Image](tool:compress-image) to bring each photo down to a target size in KB, or reduce pixel dimensions with the Image Resizer. A document page rarely needs more than about 2,000 pixels on its long side.
2. Rebuild the PDF from the smaller images with [JPG to PDF](tool:jpg-to-pdf).

Our guide to [turning phone photos into a PDF](blog:photos-to-pdf-phone) explains the whole workflow.

### Send fewer pages

Upload portals often need only specific pages. Extracting them with [Split PDF](tool:split-pdf) can turn a 20 MB statement into a 1 MB page. You can also split a long document into parts when a system accepts several files of limited size.

### Use a dedicated PDF optimiser

Desktop PDF editors and some operating systems include an optimiser that downsamples images and removes unused objects. Results vary, so compare quality afterwards. Convertios does not currently offer a PDF compressor, and the PDF tools here do not recompress pages: Merge, Split and Rotate copy page content exactly.

## What does not help much

- **Zipping the file.** PDFs and JPGs are already compressed; a ZIP rarely saves much.
- **Converting to Word and back.** This can lose layout and often does not reduce image weight.
- **Printing to PDF repeatedly.** It may rasterise text into images, making the file larger and unsearchable.

## A note on new compression standards

The PDF Association has specified Brotli as an additional compression method for PDF streams. It may make some files smaller in software that supports it, but recipients need a compatible reader. Our news article on [Brotli compression in PDF](blog:pdf-brotli-2026) explains the compatibility limits.

## Quick checklist

- Measure size per page to find the heavy part.
- Rescan or re-export at a reasonable resolution.
- Compress photos before making the PDF.
- Send only the pages that are needed.
- Check readability after every size reduction, especially small print and numbers.

=== es ===
title: ¿Por qué mi PDF pesa tanto? Formas prácticas de reducirlo
seo_title: ¿Por qué mi PDF pesa tanto? Cómo hacerlo más ligero
description: La mayoría de los PDF demasiado grandes lo son por imágenes y escaneos. Descubre qué hace pesado un PDF y cómo reducirlo antes de chocar con un límite de subida.
dek: Un PDF de diez páginas puede pesar 300 KB o 30 MB según lo que contenga. En cuanto sabes qué parte pesa, reducir el archivo suele ser sencillo.
---
## Qué hace realmente pesado un PDF

El texto ocupa poco. Una página de texto escrito suele necesitar solo unos kilobytes. El tamaño de la mayoría de los PDF grandes procede de unas pocas fuentes previsibles:

- **Fotos y escaneos.** Una sola foto del móvil puede ocupar de 3 a 6 MB. Un escaneo en alta resolución y a todo color puede ocupar aún más, en cada página.
- **Fuentes incrustadas.** Los PDF incluyen las fuentes para verse igual en todas partes. Varias fuentes completas, sobre todo en idiomas con muchos caracteres, suman.
- **Recursos duplicados.** Algunos programas guardan el mismo logotipo o fondo una y otra vez en cada página.
- **Guardados incrementales.** Editar y guardar un PDF muchas veces puede añadir cambios al final en lugar de reescribir el archivo.
- **Adjuntos y capas.** Archivos incrustados, capas de diseño y vistas previas en alta resolución siguen dentro aunque no los veas.

El primer punto explica la mayoría de los casos. Si tu PDF viene de un escáner o de fotos, casi seguro que el problema son las imágenes.

## Encuentra la causa en dos minutos

1. Divide el tamaño del archivo entre el número de páginas. Unos 50 KB por página o menos indican un documento de texto; 1 MB o más por página apunta a imágenes.
2. Amplía una página. Si el texto se vuelve pixelado, la página es una imagen (un escaneo) y no texto real.
3. Quédate con una sola página usando [Dividir PDF](tool:split-pdf) y mira el nuevo tamaño. Si una página ocupa varios megas, el problema son sus imágenes.

## Formas de reducir un PDF

### Vuelve a crearlo con una resolución razonable

La solución más fiable es retroceder un paso y crear de nuevo el PDF con mejores ajustes:

- **Escaneo:** para documentos normales, unos 200 a 300 ppp suelen bastar para leer e imprimir. Usa escala de grises o blanco y negro en vez de color cuando el color no importe.
- **Exportar desde Word, PowerPoint o similares:** muchos programas ofrecen una opción de exportación más ligera, a menudo llamada «tamaño mínimo» u «optimizar para publicación en línea», que reduce la resolución de las imágenes.

### Reduce las fotos antes de crear el PDF

Si el PDF se hace con fotos, comprímelas o redimensiónalas primero y después crea el PDF:

1. Usa [Comprimir imagen](tool:compress-image) para llevar cada foto a un tamaño objetivo en KB, o reduce sus dimensiones con el Redimensionador de imágenes. Una página de documento rara vez necesita más de unos 2000 píxeles en su lado largo.
2. Vuelve a crear el PDF con las imágenes más pequeñas en [JPG a PDF](tool:jpg-to-pdf).

Nuestra guía para [convertir fotos del móvil en PDF](blog:photos-to-pdf-phone) explica el proceso completo.

### Envía menos páginas

Los portales de subida a menudo solo necesitan páginas concretas. Extraerlas con [Dividir PDF](tool:split-pdf) puede convertir un extracto de 20 MB en una página de 1 MB. También puedes dividir un documento largo en partes cuando el sistema acepta varios archivos de tamaño limitado.

### Usa un optimizador de PDF

Los editores de PDF de escritorio y algunos sistemas operativos incluyen un optimizador que reduce la resolución de las imágenes y elimina objetos sin uso. Los resultados varían, así que compara la calidad después. Convertios no ofrece por ahora un compresor de PDF, y sus herramientas de PDF no recomprimen páginas: Unir, Dividir y Rotar copian el contenido tal cual.

## Lo que apenas ayuda

- **Comprimir en ZIP.** Los PDF y los JPG ya están comprimidos; un ZIP rara vez ahorra mucho.
- **Convertir a Word y volver a PDF.** Puede perder el diseño y a menudo no reduce el peso de las imágenes.
- **Imprimir a PDF una y otra vez.** Puede convertir el texto en imagen, con lo que el archivo crece y deja de ser buscable.

## Una nota sobre nuevos estándares de compresión

La PDF Association ha especificado Brotli como método de compresión adicional para los flujos de un PDF. Puede reducir algunos archivos en programas compatibles, pero los destinatarios necesitan un lector que lo admita. Nuestra noticia sobre [la compresión Brotli en PDF](blog:pdf-brotli-2026) explica los límites de compatibilidad.

## Lista rápida

- Calcula el tamaño por página para encontrar la parte pesada.
- Vuelve a escanear o exportar con una resolución razonable.
- Comprime las fotos antes de crear el PDF.
- Envía solo las páginas necesarias.
- Comprueba la legibilidad tras cada reducción, sobre todo la letra pequeña y los números.

=== ar ===
title: لماذا حجم ملف PDF كبير جداً؟ طرق عملية لتصغيره
seo_title: لماذا حجم ملف PDF كبير؟ طرق عملية لتصغيره
description: معظم ملفات PDF الضخمة سببها الصور والمسح الضوئي. اعرف ما الذي يثقل الملف والطرق الموثوقة لتصغيره قبل أن يمنعك حد الرفع.
dek: قد يزن ملف PDF من عشر صفحات 300 كيلوبايت أو 30 ميغابايت بحسب محتواه. حين تعرف الجزء الثقيل يصبح تصغير الملف أمراً سهلاً غالباً.
---
## ما الذي يجعل ملف PDF ثقيلاً فعلاً

النص خفيف؛ فالصفحة المكتوبة تحتاج عادةً إلى بضعة كيلوبايتات فقط. ويأتي حجم معظم الملفات الكبيرة من مصادر قليلة متوقعة:

- **الصور والمسح الضوئي.** قد تبلغ صورة واحدة من الهاتف بين 3 و6 ميغابايت، وقد يكون المسح بدقة عالية وبالألوان الكاملة أكبر من ذلك في كل صفحة.
- **الخطوط المضمّنة.** يتضمن PDF الخطوط ليبدو المستند متطابقاً في كل مكان، وتتراكم عدة خطوط كاملة، خصوصاً في اللغات ذات الحروف الكثيرة.
- **الموارد المكررة.** تحفظ بعض البرامج الشعار نفسه أو الخلفية نفسها مرة بعد مرة في كل صفحة.
- **الحفظ التراكمي.** قد يؤدي تعديل الملف وحفظه مرات كثيرة إلى إلحاق التغييرات بآخره بدلاً من إعادة كتابته.
- **المرفقات والطبقات.** تبقى الملفات المضمّنة وطبقات التصميم والمعاينات عالية الدقة داخل الملف حتى لو لم ترها.

البند الأول يفسر معظم الحالات؛ فإن كان ملفك من ماسح ضوئي أو من صور فالمشكلة على الأرجح في الصور.

## اكتشف السبب خلال دقيقتين

1. اقسم حجم الملف على عدد الصفحات. نحو 50 كيلوبايت للصفحة أو أقل يشير إلى مستند نصي، و1 ميغابايت أو أكثر للصفحة يشير إلى صور.
2. كبّر إحدى الصفحات؛ فإذا صار النص مربعاً فالصفحة صورة (مسح ضوئي) لا نص حقيقي.
3. احتفظ بصفحة واحدة فقط بأداة [تقسيم PDF](tool:split-pdf) وانظر إلى الحجم الجديد. إذا كانت الصفحة الواحدة عدة ميغابايتات فصورها هي المشكلة.

## طرق تصغير ملف PDF

### أعد إنشاءه بدقة معقولة

أوثق حل هو العودة خطوة إلى الوراء وإنشاء الملف من جديد بإعدادات أفضل:

- **المسح الضوئي:** في المستندات العادية تكفي غالباً دقة بين 200 و300 نقطة في البوصة للقراءة والطباعة. استخدم التدرج الرمادي أو الأبيض والأسود بدل الألوان الكاملة حين لا يهم اللون.
- **التصدير من Word أو PowerPoint وغيرهما:** تقدم برامج كثيرة خيار تصدير أخف، يُسمى غالباً «الحجم الأدنى» أو «تحسين للنشر عبر الإنترنت»، يقلل دقة الصور.

### صغّر الصور قبل بناء الملف

إذا كان ملف PDF مصنوعاً من صور فاضغطها أو صغّر أبعادها أولاً ثم أنشئ الملف:

1. استخدم [ضغط الصور](tool:compress-image) لتنزل بكل صورة إلى حجم مستهدف بالكيلوبايت، أو قلّل أبعادها بأداة تغيير حجم الصور. نادراً ما تحتاج صفحة المستند إلى أكثر من نحو 2000 بكسل في ضلعها الطويل.
2. أعد بناء ملف PDF من الصور الأصغر بأداة [JPG إلى PDF](tool:jpg-to-pdf).

يشرح دليلنا [لتحويل صور الهاتف إلى PDF](blog:photos-to-pdf-phone) العملية كاملة.

### أرسل صفحات أقل

كثيراً ما تحتاج بوابات الرفع إلى صفحات محددة فقط، واستخراجها بأداة [تقسيم PDF](tool:split-pdf) قد يحوّل كشفاً بحجم 20 ميغابايت إلى صفحة بحجم 1 ميغابايت. ويمكنك أيضاً تقسيم المستند الطويل إلى أجزاء حين يقبل النظام عدة ملفات محدودة الحجم.

### استخدم أداة مخصصة لتحسين PDF

تتضمن محررات PDF المكتبية وبعض أنظمة التشغيل أداة تحسين تخفض دقة الصور وتحذف العناصر غير المستخدمة. تختلف النتائج، لذا قارن الجودة بعدها. لا تقدم Convertios حالياً أداة لضغط PDF، ولا تعيد أدوات PDF لديها ضغط الصفحات؛ فالدمج والتقسيم والتدوير تنسخ محتوى الصفحات كما هو.

## ما لا يفيد كثيراً

- **ضغط الملف بصيغة ZIP.** ملفات PDF وJPG مضغوطة أصلاً، ونادراً ما يوفر ZIP الكثير.
- **التحويل إلى Word ثم العودة.** قد يفقد التخطيط، وغالباً لا يقلل وزن الصور.
- **الطباعة إلى PDF مراراً.** قد تحوّل النص إلى صور فيكبر الملف ويفقد قابلية البحث.

## ملاحظة عن معايير الضغط الجديدة

حددت PDF Association طريقة Brotli كأسلوب ضغط إضافي لتدفقات PDF. قد يصغّر ذلك بعض الملفات في البرامج الداعمة له، لكن المستلمين يحتاجون إلى قارئ متوافق. تشرح مقالتنا الإخبارية عن [ضغط Brotli في PDF](blog:pdf-brotli-2026) حدود التوافق.

## قائمة سريعة

- احسب الحجم لكل صفحة لتعرف الجزء الثقيل.
- أعد المسح أو التصدير بدقة معقولة.
- اضغط الصور قبل صنع ملف PDF.
- أرسل الصفحات المطلوبة فقط.
- تحقّق من وضوح القراءة بعد كل تصغير، خصوصاً الخط الصغير والأرقام.

=== pt-br ===
title: Por que meu PDF está tão grande? Formas práticas de diminuí-lo
seo_title: Por que meu PDF está tão grande? Como diminuir
description: A maioria dos PDFs gigantes fica assim por causa de imagens e digitalizações. Veja o que deixa um PDF pesado e as formas confiáveis de reduzi-lo antes do limite de envio.
dek: Um PDF de dez páginas pode ter 300 KB ou 30 MB, dependendo do que há dentro. Quando você descobre qual parte pesa, diminuir o arquivo costuma ser simples.
---
## O que realmente deixa um PDF pesado

Texto ocupa pouco. Uma página de texto digitado normalmente precisa de poucos kilobytes. O tamanho da maioria dos PDFs grandes vem de algumas fontes previsíveis:

- **Fotos e digitalizações.** Uma única foto de celular pode ter de 3 a 6 MB. Uma digitalização em alta resolução e colorida pode ser ainda maior, em cada página.
- **Fontes incorporadas.** O PDF inclui as fontes para parecer igual em qualquer lugar. Várias fontes completas, principalmente em idiomas com muitos caracteres, somam.
- **Recursos duplicados.** Alguns programas guardam o mesmo logotipo ou fundo de novo em cada página.
- **Salvamentos incrementais.** Editar e salvar um PDF muitas vezes pode acrescentar mudanças ao fim em vez de reescrever o arquivo.
- **Anexos e camadas.** Arquivos incorporados, camadas de design e prévias em alta resolução continuam lá dentro mesmo que você não os veja.

O primeiro item explica a maioria dos casos. Se o seu PDF veio de um scanner ou de fotos, quase certamente o problema são as imagens.

## Descubra a causa em dois minutos

1. Divida o tamanho do arquivo pelo número de páginas. Cerca de 50 KB por página ou menos indica um documento de texto; 1 MB ou mais por página aponta para imagens.
2. Dê zoom em uma página. Se o texto ficar quadriculado, a página é uma imagem (uma digitalização) e não texto de verdade.
3. Deixe só uma página com o [Dividir PDF](tool:split-pdf) e veja o novo tamanho. Se uma página tem vários megas, as imagens dela são o problema.

## Formas de diminuir um PDF

### Gere o arquivo de novo com uma resolução sensata

A solução mais confiável é voltar um passo e criar o PDF de novo com configurações melhores:

- **Digitalização:** para documentos comuns, algo entre 200 e 300 dpi costuma bastar para ler e imprimir. Use tons de cinza ou preto e branco em vez de colorido quando a cor não importar.
- **Exportar do Word, PowerPoint e similares:** muitos programas oferecem uma exportação menor, muitas vezes chamada de "tamanho mínimo" ou "otimizar para publicação online", que reduz a resolução das imagens.

### Diminua as fotos antes de montar o PDF

Se o PDF é feito de fotos, comprima ou redimensione antes e depois crie o PDF:

1. Use o [Comprimir imagem](tool:compress-image) para levar cada foto a um tamanho-alvo em KB, ou reduza as dimensões em pixels com o Redimensionador de imagens. Uma página de documento raramente precisa de mais de uns 2.000 pixels no lado maior.
2. Monte o PDF de novo com as imagens menores no [JPG para PDF](tool:jpg-to-pdf).

Nosso guia para [transformar fotos do celular em PDF](blog:photos-to-pdf-phone) explica o processo completo.

### Envie menos páginas

Portais de envio muitas vezes precisam só de páginas específicas. Extraí-las com o [Dividir PDF](tool:split-pdf) pode transformar um extrato de 20 MB em uma página de 1 MB. Também dá para dividir um documento longo em partes quando o sistema aceita vários arquivos de tamanho limitado.

### Use um otimizador de PDF

Editores de PDF para computador e alguns sistemas operacionais têm um otimizador que reduz a resolução das imagens e remove objetos sem uso. Os resultados variam, então compare a qualidade depois. A Convertios não oferece hoje um compressor de PDF, e as ferramentas de PDF daqui não recomprimem páginas: Juntar, Dividir e Girar copiam o conteúdo exatamente.

## O que quase não ajuda

- **Zipar o arquivo.** PDFs e JPGs já são comprimidos; um ZIP raramente economiza muito.
- **Converter para Word e voltar.** Pode perder o layout e muitas vezes não reduz o peso das imagens.
- **Imprimir em PDF várias vezes.** Pode transformar o texto em imagem, deixando o arquivo maior e sem pesquisa.

## Uma observação sobre novos padrões de compressão

A PDF Association especificou o Brotli como método adicional de compressão para os fluxos de um PDF. Ele pode deixar alguns arquivos menores em programas compatíveis, mas quem recebe precisa de um leitor que o suporte. Nossa notícia sobre [a compressão Brotli no PDF](blog:pdf-brotli-2026) explica os limites de compatibilidade.

## Checklist rápido

- Calcule o tamanho por página para achar a parte pesada.
- Digitalize ou exporte de novo com uma resolução razoável.
- Comprima as fotos antes de montar o PDF.
- Envie só as páginas necessárias.
- Confira a legibilidade depois de cada redução, principalmente letras pequenas e números.
