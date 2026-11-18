---
category: ai-technology
type: guide
published: 2026-11-18
order: 192
status: published
cover_image: ocr-explained
cover: OCR
tools: pdf-to-word, pdf-to-jpg, image-resizer
related: scanned-pdf-to-word, convert-pdf-to-word-keep-formatting
keyword: how does ocr work
intent: informational
---
=== en ===
cover_alt: Conceptual illustration of a digital document with text and accessibility controls on a laptop.
title: How OCR works, and why it still makes mistakes
seo_title: How OCR works and why it makes mistakes
description: Optical character recognition turns pictures of text into real text. Learn how it works, what affects accuracy and how to check OCR output before you rely on it.
dek: OCR is the step that turns a photographed or scanned page into words you can search, copy and edit. It is remarkably good today, and still a set of educated guesses that deserve a proofread.
---
## What OCR actually does

A scanned page or a phone photo of a document is just a grid of coloured pixels. Your eyes see letters; the computer sees light and dark dots. Optical character recognition (OCR) is software that looks at those pixels and produces real characters, so that "Total: 1,250.00" becomes text you can search, copy into a spreadsheet or edit in Word.

Without OCR, converting a scan to another document format only moves the picture around. That is why a scanned PDF converted to Word usually gives you page images rather than editable text, as explained in our guide to [why scanned PDFs are not editable](blog:scanned-pdf-to-word).

## The main steps inside an OCR engine

Different engines work differently, but most follow a similar sequence:

1. **Clean-up.** The image is straightened (deskewed), converted to high-contrast black and white, and cleaned of specks and shadows.
2. **Layout analysis.** The engine finds blocks of text, columns, tables and images, and decides the reading order.
3. **Line and character recognition.** Older engines matched individual character shapes against patterns. Modern engines typically use neural networks that read whole lines or words at once, which copes better with joined letters and unusual fonts.
4. **Language modelling.** The engine uses knowledge of the language, such as common words and spelling, to choose between similar-looking options. "rn" versus "m" is often settled this way.
5. **Output.** The result can be plain text, a searchable PDF (the original image with an invisible text layer on top), or a document format.

The searchable PDF is worth knowing about: the page still looks exactly like the scan, but you can now select and search words, and a PDF-to-Word converter has text to work with.

## Why OCR makes mistakes

Recognition is interpretation, so errors are normal. The most frequent causes:

- **Low resolution.** Small text photographed from far away has too few pixels per letter. For ordinary printed documents, around 300 dpi scanning, or a sharp phone photo filling the frame, gives the engine much more to work with.
- **Blur, shadows and curved pages.** A book photographed at an angle has curved lines and uneven lighting.
- **Unusual fonts, handwriting and stamps.** Printed text is far easier than handwriting. Signatures, stamps and decorative fonts often produce nonsense.
- **Complex layouts.** Multi-column pages, sidebars and tables can be read in the wrong order even when every word is recognised.
- **Mixed languages and scripts.** A page combining Arabic and English, or a technical page full of codes, needs an engine configured for both.

### The errors that matter most

Most OCR errors are easy to spot because they produce strange words. The dangerous ones look plausible: **5 and 6, 1 and 7, 0 and O, a missing decimal point, a minus sign read as a dash**. In invoices, bank statements and medical or legal documents, a single wrong digit can change the meaning completely.

## How to get better OCR results

1. **Start with the best image you can.** Flat page, even daylight, phone held parallel to the paper, no zoom. Retaking a photo is faster than correcting a bad result.
2. **Rotate and crop first.** Sideways or upside-down pages confuse layout analysis. If your scan is a PDF, fix orientation before running OCR.
3. **Do not shrink the image too much.** Resizing a photo to save space before OCR removes the detail the engine needs. If you must resize for an upload limit, do it after recognition. The [Image Resizer](tool:image-resizer) shows the exact pixel dimensions you end up with.
4. **Choose the right language.** Most OCR applications let you select the document language. This improves accuracy noticeably.
5. **Process difficult pages separately.** Tables, forms and handwritten notes often need manual retyping anyway.

## How to check OCR output

- Search the result for a few words you can see on the page. If they are found, the text layer exists.
- Compare every number in totals, dates, account references and quantities with the image.
- Read headings and the first line of each paragraph to catch reading-order problems.
- For important documents, keep the original image or scanned PDF next to the recognised version.

## Where OCR fits with Convertios tools

Convertios does not currently offer an OCR tool, and its [PDF to Word converter](tool:pdf-to-word) does not perform OCR. The practical workflow is to run OCR in an application that offers it, such as a PDF editor, an office suite or a phone scanning app, and then use Convertios for the next step: converting the searchable PDF to Word, or [exporting individual pages as JPG](tool:pdf-to-jpg) when you need images instead of text.

> OCR turns pictures of text into text, but it guesses. Treat every OCR result as a draft until the numbers and names have been checked against the original.

=== es ===
cover_alt: Ilustración conceptual de un documento digital con controles de texto y accesibilidad en un portátil.
title: Cómo funciona el OCR y por qué todavía se equivoca
seo_title: Cómo funciona el OCR y por qué se equivoca
description: El reconocimiento óptico de caracteres convierte imágenes de texto en texto real. Aprende cómo funciona, qué afecta a su precisión y cómo revisar el resultado.
dek: El OCR es el paso que convierte una página escaneada o fotografiada en palabras que puedes buscar, copiar y editar. Hoy funciona muy bien, pero sigue siendo un conjunto de suposiciones razonadas que conviene revisar.
---
## Qué hace realmente el OCR

Una página escaneada o la foto de un documento hecha con el móvil es solo una cuadrícula de píxeles de colores. Tus ojos ven letras; el ordenador ve puntos claros y oscuros. El reconocimiento óptico de caracteres (OCR) es el software que analiza esos píxeles y genera caracteres reales, de modo que «Total: 1.250,00» se convierte en texto que puedes buscar, copiar en una hoja de cálculo o editar en Word.

Sin OCR, convertir un escaneo a otro formato solo cambia la imagen de sitio. Por eso un PDF escaneado convertido a Word suele dar imágenes de las páginas en lugar de texto editable, como explica nuestra guía sobre [por qué un PDF escaneado no queda editable](blog:scanned-pdf-to-word).

## Los pasos principales de un motor de OCR

Cada motor trabaja a su manera, pero la mayoría sigue una secuencia parecida:

1. **Limpieza.** La imagen se endereza, se convierte a blanco y negro de alto contraste y se limpia de manchas y sombras.
2. **Análisis del diseño.** El motor localiza bloques de texto, columnas, tablas e imágenes, y decide el orden de lectura.
3. **Reconocimiento de líneas y caracteres.** Los motores antiguos comparaban cada letra con patrones. Los modernos suelen usar redes neuronales que leen líneas o palabras completas, lo que funciona mejor con letras unidas y fuentes poco comunes.
4. **Modelo del idioma.** El motor usa conocimientos del idioma, como palabras frecuentes y ortografía, para elegir entre opciones parecidas. La duda entre «rn» y «m» suele resolverse así.
5. **Resultado.** Puede ser texto plano, un PDF con texto buscable (la imagen original con una capa de texto invisible encima) o un documento editable.

El PDF buscable merece atención: la página sigue viéndose exactamente como el escaneo, pero ahora puedes seleccionar y buscar palabras, y un conversor de PDF a Word ya tiene texto con el que trabajar.

## Por qué se equivoca el OCR

Reconocer es interpretar, así que los errores son normales. Las causas más frecuentes son:

- **Poca resolución.** Un texto pequeño fotografiado desde lejos tiene muy pocos píxeles por letra. Para documentos impresos normales, escanear a unos 300 ppp, o hacer una foto nítida que llene el encuadre, le da al motor mucha más información.
- **Desenfoque, sombras y páginas curvas.** Un libro fotografiado en ángulo tiene líneas curvadas y una iluminación desigual.
- **Fuentes raras, escritura a mano y sellos.** El texto impreso es mucho más fácil que la letra manuscrita. Firmas, sellos y tipografías decorativas suelen producir resultados sin sentido.
- **Diseños complejos.** Las páginas con varias columnas, recuadros laterales y tablas pueden leerse en el orden equivocado aunque cada palabra se reconozca bien.
- **Idiomas y alfabetos mezclados.** Una página que combina árabe e inglés, o una página técnica llena de códigos, necesita un motor configurado para ambos.

### Los errores que más importan

La mayoría de los errores de OCR se detectan fácilmente porque generan palabras extrañas. Los peligrosos son los que parecen correctos: **5 y 6, 1 y 7, 0 y O, una coma decimal que desaparece, un signo menos leído como guion**. En facturas, extractos bancarios o documentos médicos y legales, un solo dígito equivocado puede cambiarlo todo.

## Cómo obtener mejores resultados

1. **Parte de la mejor imagen posible.** Página plana, luz natural uniforme, móvil paralelo al papel y sin zoom. Repetir la foto es más rápido que corregir un mal resultado.
2. **Gira y recorta antes.** Las páginas de lado o al revés confunden el análisis del diseño. Si el escaneo es un PDF, corrige la orientación antes de aplicar OCR.
3. **No reduzcas demasiado la imagen.** Achicar una foto para ahorrar espacio antes del OCR elimina el detalle que necesita el motor. Si tienes que reducirla por un límite de subida, hazlo después del reconocimiento. El [Redimensionador de imágenes](tool:image-resizer) muestra las dimensiones exactas en píxeles que obtienes.
4. **Elige el idioma correcto.** La mayoría de las aplicaciones de OCR permiten seleccionar el idioma del documento, y eso mejora bastante la precisión.
5. **Trata por separado las páginas difíciles.** Tablas, formularios y notas manuscritas suelen acabar necesitando una transcripción manual.

## Cómo revisar el resultado

- Busca en el resultado algunas palabras que veas en la página. Si aparecen, la capa de texto existe.
- Compara con la imagen todos los números de totales, fechas, referencias y cantidades.
- Lee los títulos y la primera línea de cada párrafo para detectar problemas de orden de lectura.
- En documentos importantes, guarda la imagen original o el PDF escaneado junto a la versión reconocida.

## Dónde encaja el OCR con las herramientas de Convertios

Convertios no ofrece actualmente una herramienta de OCR, y su [conversor de PDF a Word](tool:pdf-to-word) no realiza OCR. El flujo práctico es aplicar el OCR en una aplicación que lo incluya, como un editor de PDF, un paquete ofimático o una app de escaneo, y usar Convertios para el paso siguiente: convertir el PDF buscable a Word o [exportar páginas sueltas como JPG](tool:pdf-to-jpg) cuando necesites imágenes en lugar de texto.

> El OCR convierte imágenes de texto en texto, pero adivina. Trata cada resultado de OCR como un borrador hasta comprobar los números y los nombres con el original.

=== ar ===
cover_alt: رسم توضيحي لمستند رقمي مع أدوات نص وإمكانية وصول على حاسوب محمول.
title: كيف يعمل OCR ولماذا ما زال يخطئ
seo_title: كيف يعمل OCR ولماذا يخطئ أحياناً
description: يحوّل التعرف الضوئي على الحروف صور النصوص إلى نص حقيقي. تعرّف إلى طريقة عمله وما يؤثر في دقته وكيف تراجع نتائجه قبل الاعتماد عليها.
dek: OCR هو الخطوة التي تحوّل صفحة ممسوحة أو مصوَّرة إلى كلمات يمكنك البحث فيها ونسخها وتعديلها. أصبح دقيقاً جداً اليوم، لكنه يبقى مجموعة تخمينات مدروسة تستحق المراجعة.
---
## ما الذي يفعله OCR فعلاً

الصفحة الممسوحة ضوئياً أو صورة المستند الملتقطة بالهاتف ليست سوى شبكة من البكسلات الملونة. ترى عيناك حروفاً، بينما يرى الحاسوب نقاطاً فاتحة وداكنة. التعرف الضوئي على الحروف (OCR) برنامج يحلل هذه البكسلات وينتج حروفاً حقيقية، فتصبح عبارة «الإجمالي: 1,250.00» نصاً يمكنك البحث فيه أو نسخه إلى جدول بيانات أو تعديله في Word.

من دون OCR، لا يفعل تحويل المسح الضوئي إلى صيغة أخرى سوى نقل الصورة من مكان إلى آخر. لهذا يعطي تحويل PDF ممسوح إلى Word صوراً للصفحات بدلاً من نص قابل للتعديل، كما يشرح دليلنا عن [سبب عدم قابلية PDF الممسوح للتعديل](blog:scanned-pdf-to-word).

## المراحل الرئيسية داخل محرك OCR

تختلف المحركات في أسلوبها، لكن معظمها يتبع تسلسلاً متقارباً:

1. **التنظيف.** تُعدَّل استقامة الصورة، وتُحوَّل إلى أبيض وأسود عالي التباين، وتُزال منها البقع والظلال.
2. **تحليل التخطيط.** يحدد المحرك كتل النص والأعمدة والجداول والصور، ويقرر ترتيب القراءة.
3. **التعرف على الأسطر والحروف.** كانت المحركات القديمة تطابق شكل كل حرف مع أنماط محفوظة، أما الحديثة فتستخدم غالباً شبكات عصبية تقرأ السطر أو الكلمة كاملة، وهذا أفضل مع الحروف المتصلة كما في العربية ومع الخطوط غير المعتادة.
4. **نموذج اللغة.** يستعين المحرك بمعرفته باللغة، كالكلمات الشائعة والإملاء، للاختيار بين احتمالات متشابهة الشكل.
5. **الناتج.** قد يكون نصاً عادياً، أو PDF قابلاً للبحث (الصورة الأصلية وفوقها طبقة نص غير مرئية)، أو مستنداً قابلاً للتعديل.

يستحق ملف PDF القابل للبحث الانتباه: تبقى الصفحة مطابقة تماماً للمسح، لكنك تستطيع الآن تحديد الكلمات والبحث فيها، ويجد محوّل PDF إلى Word نصاً يعمل عليه.

## لماذا يخطئ OCR

التعرف تفسير، لذلك فالأخطاء طبيعية. أكثر أسبابها شيوعاً:

- **الدقة المنخفضة.** النص الصغير المصوَّر من بعيد لا يحتوي بكسلات كافية لكل حرف. في المستندات المطبوعة العادية يمنح المسح بدقة 300 نقطة في البوصة تقريباً، أو صورة حادة تملأ الإطار، المحرك معلومات أكثر بكثير.
- **الضبابية والظلال والصفحات المنحنية.** الكتاب المصوَّر بزاوية تكون أسطره منحنية وإضاءته غير متساوية.
- **الخطوط غير المألوفة والكتابة اليدوية والأختام.** النص المطبوع أسهل بكثير من خط اليد، وغالباً ما تنتج التواقيع والأختام والخطوط الزخرفية نتائج بلا معنى.
- **التخطيطات المعقدة.** قد تُقرأ الصفحات متعددة الأعمدة والإطارات الجانبية والجداول بترتيب خاطئ حتى لو تم التعرف على كل كلمة.
- **خلط اللغات والأبجديات.** الصفحة التي تجمع العربية والإنجليزية، أو الصفحة التقنية المليئة بالرموز، تحتاج إلى محرك مهيأ للغتين.

### الأخطاء الأخطر

يسهل اكتشاف معظم أخطاء OCR لأنها تنتج كلمات غريبة. أما الخطيرة فهي التي تبدو معقولة: **5 و6، و1 و7، و0 والحرف O، واختفاء الفاصلة العشرية، وقراءة علامة السالب كشرطة**. في الفواتير وكشوف الحسابات والمستندات الطبية أو القانونية قد يغيّر رقم واحد خاطئ المعنى كلياً.

## كيف تحصل على نتائج أفضل

1. **ابدأ بأفضل صورة ممكنة.** صفحة مستوية، وإضاءة نهارية متساوية، وهاتف موازٍ للورقة بلا تكبير. إعادة التصوير أسرع من تصحيح نتيجة سيئة.
2. **دوّر الصفحة واقتصّها أولاً.** الصفحات الجانبية أو المقلوبة تربك تحليل التخطيط. إذا كان المسح ملف PDF فصحّح اتجاهه قبل OCR.
3. **لا تصغّر الصورة كثيراً.** تصغير الصورة لتوفير المساحة قبل OCR يحذف التفاصيل التي يحتاجها المحرك. إذا اضطررت إلى تصغيرها بسبب حد الرفع فافعل ذلك بعد التعرف. تعرض [أداة تغيير حجم الصور](tool:image-resizer) الأبعاد الدقيقة بالبكسل التي تحصل عليها.
4. **اختر اللغة الصحيحة.** تتيح معظم تطبيقات OCR اختيار لغة المستند، وهذا يحسّن الدقة بوضوح.
5. **عالج الصفحات الصعبة وحدها.** الجداول والنماذج والملاحظات المكتوبة باليد تحتاج غالباً إلى إعادة كتابة يدوية في النهاية.

## كيف تراجع نتيجة OCR

- ابحث في النتيجة عن كلمات تراها في الصفحة، فإن ظهرت فطبقة النص موجودة.
- قارن كل الأرقام في المجاميع والتواريخ والمراجع والكميات بالصورة.
- اقرأ العناوين والسطر الأول من كل فقرة لتكتشف مشكلات ترتيب القراءة.
- في المستندات المهمة احتفظ بالصورة الأصلية أو PDF الممسوح بجانب النسخة المتعرَّف عليها.

## أين يقع OCR بالنسبة إلى أدوات Convertios

لا تقدم Convertios حالياً أداة OCR، ولا يجري [محوّل PDF إلى Word](tool:pdf-to-word) لديها أي تعرف ضوئي على الحروف. الطريقة العملية هي تطبيق OCR في برنامج يوفره، مثل محرر PDF أو حزمة مكتبية أو تطبيق مسح على الهاتف، ثم استخدام Convertios في الخطوة التالية: تحويل PDF القابل للبحث إلى Word، أو [تصدير صفحات منفردة بصيغة JPG](tool:pdf-to-jpg) عندما تحتاج صوراً بدلاً من النص.

> يحوّل OCR صور النصوص إلى نص، لكنه يخمّن. تعامل مع كل نتيجة OCR كمسودة حتى تتحقق من الأرقام والأسماء مقارنةً بالأصل.

=== pt-br ===
cover_alt: Ilustração conceitual de um documento digital com controles de texto e acessibilidade em um notebook.
title: Como o OCR funciona e por que ainda erra
seo_title: Como o OCR funciona e por que ele erra
description: O reconhecimento óptico de caracteres transforma imagens de texto em texto de verdade. Veja como funciona, o que afeta a precisão e como revisar o resultado.
dek: O OCR é a etapa que transforma uma página digitalizada ou fotografada em palavras que você pode pesquisar, copiar e editar. Ele está muito bom hoje, mas continua sendo um conjunto de palpites bem informados que merecem revisão.
---
## O que o OCR faz de verdade

Uma página digitalizada ou a foto de um documento tirada com o celular é só uma grade de pixels coloridos. Seus olhos enxergam letras; o computador enxerga pontos claros e escuros. O reconhecimento óptico de caracteres (OCR) é o software que analisa esses pixels e gera caracteres reais, para que "Total: 1.250,00" vire texto que você pode pesquisar, copiar para uma planilha ou editar no Word.

Sem OCR, converter uma digitalização para outro formato só muda a imagem de lugar. É por isso que um PDF digitalizado convertido em Word costuma trazer imagens das páginas em vez de texto editável, como explica nosso guia sobre [por que um PDF digitalizado não fica editável](blog:scanned-pdf-to-word).

## As principais etapas de um mecanismo de OCR

Cada mecanismo tem seu jeito, mas a maioria segue uma sequência parecida:

1. **Limpeza.** A imagem é endireitada, convertida para preto e branco com alto contraste e limpa de manchas e sombras.
2. **Análise do layout.** O mecanismo encontra blocos de texto, colunas, tabelas e imagens, e decide a ordem de leitura.
3. **Reconhecimento de linhas e caracteres.** Mecanismos antigos comparavam cada letra com padrões. Os modernos costumam usar redes neurais que leem linhas ou palavras inteiras, o que funciona melhor com letras emendadas e fontes incomuns.
4. **Modelo de idioma.** O mecanismo usa conhecimento do idioma, como palavras frequentes e ortografia, para escolher entre opções parecidas. A dúvida entre "rn" e "m" costuma ser resolvida assim.
5. **Resultado.** Pode ser texto simples, um PDF pesquisável (a imagem original com uma camada de texto invisível por cima) ou um documento editável.

Vale conhecer o PDF pesquisável: a página continua idêntica à digitalização, mas agora você consegue selecionar e pesquisar palavras, e um conversor de PDF para Word passa a ter texto para trabalhar.

## Por que o OCR erra

Reconhecer é interpretar, então erros são normais. As causas mais comuns:

- **Resolução baixa.** Texto pequeno fotografado de longe tem poucos pixels por letra. Para documentos impressos comuns, digitalizar em cerca de 300 dpi, ou tirar uma foto nítida que preencha o enquadramento, dá ao mecanismo muito mais informação.
- **Desfoque, sombras e páginas curvas.** Um livro fotografado de lado tem linhas curvadas e luz irregular.
- **Fontes incomuns, letra de mão e carimbos.** Texto impresso é muito mais fácil do que letra cursiva. Assinaturas, carimbos e fontes decorativas costumam gerar resultados sem sentido.
- **Layouts complexos.** Páginas com várias colunas, boxes laterais e tabelas podem ser lidas na ordem errada mesmo quando cada palavra é reconhecida.
- **Idiomas e alfabetos misturados.** Uma página que mistura árabe e inglês, ou uma página técnica cheia de códigos, precisa de um mecanismo configurado para os dois.

### Os erros que mais importam

A maioria dos erros de OCR é fácil de perceber porque gera palavras estranhas. Os perigosos são os que parecem certos: **5 e 6, 1 e 7, 0 e O, uma vírgula decimal que some, um sinal de menos lido como hífen**. Em notas fiscais, extratos bancários e documentos médicos ou jurídicos, um único dígito errado pode mudar tudo.

## Como conseguir resultados melhores

1. **Comece com a melhor imagem possível.** Página plana, luz natural uniforme, celular paralelo ao papel e sem zoom. Tirar outra foto é mais rápido do que corrigir um resultado ruim.
2. **Gire e recorte antes.** Páginas de lado ou de cabeça para baixo confundem a análise do layout. Se a digitalização for um PDF, corrija a orientação antes do OCR.
3. **Não reduza demais a imagem.** Diminuir a foto para economizar espaço antes do OCR elimina os detalhes de que o mecanismo precisa. Se tiver de reduzir por causa de um limite de envio, faça isso depois do reconhecimento. O [Redimensionador de imagens](tool:image-resizer) mostra as dimensões exatas em pixels que você obtém.
4. **Escolha o idioma certo.** A maioria dos aplicativos de OCR permite selecionar o idioma do documento, o que melhora bastante a precisão.
5. **Trate as páginas difíceis separadamente.** Tabelas, formulários e anotações à mão muitas vezes acabam precisando de digitação manual.

## Como revisar o resultado

- Pesquise no resultado algumas palavras que você vê na página. Se forem encontradas, a camada de texto existe.
- Compare com a imagem todos os números de totais, datas, referências e quantidades.
- Leia os títulos e a primeira linha de cada parágrafo para pegar problemas na ordem de leitura.
- Em documentos importantes, guarde a imagem original ou o PDF digitalizado ao lado da versão reconhecida.

## Onde o OCR entra com as ferramentas da Convertios

A Convertios não oferece hoje uma ferramenta de OCR, e o [conversor de PDF para Word](tool:pdf-to-word) dela não faz OCR. O caminho prático é aplicar o OCR em um aplicativo que tenha esse recurso, como um editor de PDF, um pacote de escritório ou um app de digitalização, e usar a Convertios na etapa seguinte: converter o PDF pesquisável em Word ou [exportar páginas avulsas como JPG](tool:pdf-to-jpg) quando você precisar de imagens em vez de texto.

> O OCR transforma imagens de texto em texto, mas ele adivinha. Trate todo resultado de OCR como rascunho até conferir números e nomes com o original.
