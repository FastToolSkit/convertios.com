---
category: pdf-documents
type: guide
published: 2026-11-18
order: 160
status: published
cover: PDF → DOCX
tools: pdf-to-word, split-pdf, rotate-pdf
related: scanned-pdf-to-word, pdf-vs-docx
keyword: convert pdf to word without losing formatting
intent: how-to
---
=== en ===
title: How to convert PDF to Word without losing formatting
seo_title: Convert PDF to Word without losing formatting
description: Why layouts shift when a PDF becomes a Word file, how to prepare the PDF, and the quick fixes that make a converted DOCX look right again.
dek: A PDF fixes every line in place, while Word reflows text. Knowing where that difference bites lets you prepare the file, choose the right workflow and repair the few things that move.
---
## Why formatting changes at all

A PDF describes where each piece of text and graphics sits on a fixed page: this word at these coordinates, in this font, at this size. Word works the other way around. It stores paragraphs, styles, tables and section settings, and calculates line breaks and page breaks every time you open or edit the document.

Converting from PDF to Word therefore means **reconstructing intent from positions**. The converter has to guess that a block of lines is one paragraph, that aligned text is a table, that the line at the top of every page is a header. Most of the time those guesses are good. When they are wrong, you see shifted columns, odd line breaks or text boxes scattered over the page.

No converter can guarantee a pixel-perfect editable copy of every PDF. What you can do is give the converter a clean input and know what to check afterwards.

## Step 1: check what kind of PDF you have

Try selecting a word in the PDF. If the whole page highlights like an image, the PDF is a scan and conversion will give you page pictures, not editable text. Our article on [why scanned PDFs are not editable](blog:scanned-pdf-to-word) explains what to do in that case: run OCR first.

If you can select and search text, the PDF is text-based, and formatting quality depends mainly on how the file was originally built.

## Step 2: ask whether you really need Word

Sometimes the best way to keep formatting is not to convert at all:

- **You have access to the source.** If a colleague exported the PDF from Word or Google Docs, ask for the original DOCX. It will always be more faithful than any reconstruction.
- **You only need a few sentences.** Copy them from the PDF and paste them as plain text into your document.
- **You need to change the order of pages, not the words.** Use [Split PDF](tool:split-pdf) to extract pages and keep the layout exactly as it is.
- **Pages are sideways.** Fix them with [Rotate PDF](tool:rotate-pdf) before converting, so the converter reads lines in the right direction.

## Step 3: prepare the PDF

A few minutes of preparation often matters more than the converter itself:

1. **Remove pages you do not need.** Cover pages full of graphics, blank pages and appendices with complex charts are the most likely to produce messy output. Extract only the pages you want to edit.
2. **Keep the file under the limit.** The [Convertios PDF to Word tool](tool:pdf-to-word) accepts PDFs up to 25 MB. Splitting a long report also makes each result easier to check.
3. **Avoid password-protected or restricted files.** Remove the protection in the application that created the file, if you are entitled to.

## Step 4: convert and review in a fixed order

The Convertios tool uploads your PDF to the self-hosted Convertios server, rebuilds it with the open-source engine pdf2docx and returns a DOCX. Temporary files are deleted after the request. When the result opens, review it in this order, because each step affects the next:

1. **Fonts.** If the PDF used a font that is not installed on your computer, Word substitutes another one, which changes line lengths everywhere. Check the font names in a few paragraphs and install or replace them consistently.
2. **Page size and margins.** Confirm A4 or Letter matches the original, under Layout → Size and Margins.
3. **Columns and sections.** Multi-column pages are often rebuilt with section breaks. Turn on formatting marks (the ¶ button) to see them.
4. **Tables.** Click inside each table. A real table is easy to edit; text that only looked tabular may have arrived as separate text boxes or tab-aligned lines.
5. **Headers, footers and page numbers.** These may be ordinary text on each page instead of a proper header. Delete the repeated copies and insert a real header once.
6. **Images and charts.** Make sure they are present and not overlapping text.

## Quick fixes for the most common problems

| Problem | Likely cause | Fix |
| --- | --- | --- |
| Every line ends with a hard break | The converter treated lines as paragraphs | Use Replace to turn paragraph marks inside a paragraph into spaces, or retype short passages |
| Text sits in floating boxes | Complex positioning in the PDF | Copy the text out of the box into a normal paragraph |
| Table columns are misaligned | Lines aligned with spaces or tabs | Select the lines and use Insert → Table → Convert Text to Table |
| Spacing looks slightly off everywhere | Font substitution | Apply one consistent font through a style |
| Page numbers appear in the middle of text | Footer text was converted as body text | Delete them and insert page numbers in the footer |

## What to expect from different documents

- **Letters, essays, simple reports:** usually convert very well.
- **CVs and brochures with columns:** often good, but check column order and text boxes.
- **Forms:** field boxes and lines may become drawings. Filling the PDF form directly is often easier.
- **Spreadsheets saved as PDF:** tables may need rebuilding. If possible, ask for the original spreadsheet.
- **Scans:** need OCR before any editable result is possible.

## Before you share the edited document

Compare totals, dates, names and legal wording with the original PDF line by line where it matters. Keep the original PDF as the reference copy, especially for contracts, certificates and official forms, and send the edited version under a new file name so nobody confuses the two.

=== es ===
title: Cómo convertir PDF a Word sin perder el formato
seo_title: Convertir PDF a Word sin perder el formato
description: Por qué se descoloca el diseño cuando un PDF pasa a Word, cómo preparar el archivo y qué arreglos rápidos dejan bien un DOCX convertido.
dek: Un PDF fija cada línea en su sitio, mientras que Word recoloca el texto. Saber dónde choca esa diferencia te permite preparar el archivo, elegir el método adecuado y arreglar lo poco que se mueva.
---
## Por qué cambia el formato

Un PDF describe dónde está cada texto y cada gráfico en una página fija: esta palabra en estas coordenadas, con esta fuente y este tamaño. Word funciona al revés. Guarda párrafos, estilos, tablas y secciones, y calcula los saltos de línea y de página cada vez que abres o editas el documento.

Por eso, convertir de PDF a Word significa **reconstruir la intención a partir de posiciones**. El conversor tiene que deducir que un bloque de líneas es un párrafo, que un texto alineado es una tabla o que la línea superior de cada página es un encabezado. Casi siempre acierta. Cuando no, aparecen columnas desplazadas, saltos de línea extraños o cuadros de texto repartidos por la página.

Ningún conversor puede garantizar una copia editable idéntica al píxel de cualquier PDF. Lo que sí puedes hacer es darle un archivo limpio y saber qué revisar después.

## Paso 1: comprueba qué tipo de PDF tienes

Intenta seleccionar una palabra. Si se marca toda la página como una imagen, el PDF es un escaneo y la conversión te dará imágenes de las páginas, no texto editable. Nuestro artículo sobre [por qué un PDF escaneado no queda editable](blog:scanned-pdf-to-word) explica qué hacer en ese caso: aplicar OCR primero.

Si puedes seleccionar y buscar texto, el PDF es de texto, y la calidad del formato dependerá sobre todo de cómo se creó.

## Paso 2: pregúntate si de verdad necesitas Word

A veces la mejor forma de conservar el formato es no convertir:

- **Tienes acceso al original.** Si alguien exportó el PDF desde Word o Google Docs, pide el DOCX original. Siempre será más fiel que cualquier reconstrucción.
- **Solo necesitas unas frases.** Cópialas del PDF y pégalas como texto sin formato en tu documento.
- **Necesitas cambiar páginas, no palabras.** Usa [Dividir PDF](tool:split-pdf) para extraer páginas y mantener el diseño exactamente igual.
- **Hay páginas giradas.** Corrígelas con [Rotar PDF](tool:rotate-pdf) antes de convertir, para que el conversor lea las líneas en la dirección correcta.

## Paso 3: prepara el PDF

Unos minutos de preparación suelen importar más que el propio conversor:

1. **Quita las páginas que no necesitas.** Las portadas llenas de gráficos, las páginas en blanco y los anexos con diagramas complejos son las que más desorden producen. Extrae solo las páginas que vas a editar.
2. **Respeta el límite de tamaño.** La [herramienta PDF a Word de Convertios](tool:pdf-to-word) acepta archivos de hasta 25 MB. Dividir un informe largo también facilita revisar cada resultado.
3. **Evita archivos protegidos con contraseña o con restricciones.** Si tienes derecho a hacerlo, quita la protección en la aplicación que creó el archivo.

## Paso 4: convierte y revisa en un orden fijo

La herramienta de Convertios sube el PDF al servidor propio de Convertios, lo reconstruye con el motor de código abierto pdf2docx y devuelve un DOCX. Los archivos temporales se borran al terminar la solicitud. Cuando abras el resultado, revísalo en este orden, porque cada paso influye en el siguiente:

1. **Fuentes.** Si el PDF usaba una fuente que no tienes instalada, Word la sustituye por otra y cambia la longitud de todas las líneas. Comprueba el nombre de la fuente en varios párrafos e instálala o sustitúyela de forma coherente.
2. **Tamaño de página y márgenes.** Confirma que A4 o Carta coinciden con el original, en Disposición → Tamaño y Márgenes.
3. **Columnas y secciones.** Las páginas con varias columnas suelen reconstruirse con saltos de sección. Activa las marcas de formato (el botón ¶) para verlos.
4. **Tablas.** Haz clic dentro de cada tabla. Una tabla real se edita fácilmente; un texto que solo parecía una tabla puede haber llegado como cuadros de texto o líneas alineadas con tabuladores.
5. **Encabezados, pies y números de página.** Pueden haber llegado como texto normal en cada página. Borra las copias repetidas e inserta un encabezado real una sola vez.
6. **Imágenes y gráficos.** Comprueba que están todos y que no se superponen al texto.

## Arreglos rápidos para los problemas más comunes

| Problema | Causa probable | Solución |
| --- | --- | --- |
| Cada línea termina con un salto de párrafo | El conversor trató cada línea como un párrafo | Usa Reemplazar para cambiar esas marcas por espacios o vuelve a escribir los fragmentos cortos |
| El texto está en cuadros flotantes | Posicionamiento complejo en el PDF | Copia el texto del cuadro a un párrafo normal |
| Las columnas de una tabla no cuadran | Líneas alineadas con espacios o tabuladores | Selecciona las líneas y usa Insertar → Tabla → Convertir texto en tabla |
| El espaciado se ve algo raro en todo el documento | Sustitución de fuentes | Aplica una sola fuente mediante un estilo |
| Los números de página aparecen en medio del texto | El pie se convirtió como texto del cuerpo | Bórralos e inserta la numeración en el pie de página |

## Qué esperar de cada tipo de documento

- **Cartas, trabajos e informes sencillos:** suelen convertirse muy bien.
- **Currículos y folletos con columnas:** normalmente bien, pero revisa el orden de las columnas y los cuadros de texto.
- **Formularios:** las casillas y líneas pueden convertirse en dibujos. A menudo es más fácil rellenar el formulario PDF directamente.
- **Hojas de cálculo guardadas como PDF:** puede que haya que rehacer las tablas. Si es posible, pide la hoja original.
- **Escaneos:** necesitan OCR antes de poder obtener un resultado editable.

## Antes de compartir el documento editado

Compara totales, fechas, nombres y textos legales con el PDF original, línea por línea donde sea importante. Conserva el PDF original como copia de referencia, sobre todo en contratos, certificados y formularios oficiales, y envía la versión editada con otro nombre de archivo para que nadie confunda las dos.

=== ar ===
title: كيف تحوّل PDF إلى Word دون أن تفقد التنسيق
seo_title: تحويل PDF إلى Word دون فقدان التنسيق
description: لماذا يتغير التنسيق عند تحويل PDF إلى Word، وكيف تجهّز الملف قبل التحويل، وما الإصلاحات السريعة التي تعيد ملف DOCX المحوَّل إلى شكله الصحيح.
dek: يثبّت ملف PDF كل سطر في مكانه، بينما يعيد Word ترتيب النص باستمرار. معرفة مواضع هذا الاختلاف تساعدك على تجهيز الملف واختيار الطريقة المناسبة وإصلاح القليل الذي يتحرك.
---
## لماذا يتغير التنسيق أصلاً

يصف ملف PDF موضع كل نص ورسم على صفحة ثابتة: هذه الكلمة عند هذه الإحداثيات، بهذا الخط وهذا الحجم. أما Word فيعمل بطريقة معاكسة؛ إذ يحفظ الفقرات والأنماط والجداول والأقسام، ثم يحسب نهايات الأسطر والصفحات كلما فتحت المستند أو عدّلته.

لذلك يعني التحويل من PDF إلى Word **استنتاج المقصود من المواضع**. على المحوّل أن يخمّن أن مجموعة أسطر تشكّل فقرة واحدة، وأن النص المحاذى جدول، وأن السطر أعلى كل صفحة رأس صفحة. غالباً ما يصيب، وعندما يخطئ تظهر أعمدة منزاحة أو فواصل أسطر غريبة أو مربعات نص متناثرة.

لا يستطيع أي محوّل أن يضمن نسخة قابلة للتعديل مطابقة تماماً لكل ملف PDF. ما يمكنك فعله هو تقديم ملف نظيف ومعرفة ما يجب مراجعته بعد التحويل.

## الخطوة 1: تحقّق من نوع ملف PDF

جرّب تحديد كلمة في الملف. إذا تحددت الصفحة كلها كصورة فالملف مسح ضوئي، وسينتج التحويل صوراً للصفحات لا نصاً قابلاً للتعديل. تشرح مقالتنا عن [سبب عدم قابلية PDF الممسوح للتعديل](blog:scanned-pdf-to-word) ما تفعله في هذه الحالة: تطبيق OCR أولاً.

أما إذا استطعت تحديد النص والبحث فيه فالملف نصي، وتعتمد جودة التنسيق أساساً على طريقة إنشائه الأصلية.

## الخطوة 2: اسأل نفسك هل تحتاج إلى Word فعلاً

أحياناً تكون أفضل طريقة للحفاظ على التنسيق هي عدم التحويل:

- **لديك المصدر الأصلي.** إذا صدّر أحد زملائك الملف من Word أو Google Docs فاطلب ملف DOCX الأصلي، فهو أدق دائماً من أي إعادة بناء.
- **تحتاج إلى جمل قليلة فقط.** انسخها من PDF والصقها كنص عادي في مستندك.
- **تريد تغيير الصفحات لا الكلمات.** استخدم [تقسيم PDF](tool:split-pdf) لاستخراج الصفحات مع بقاء التخطيط كما هو تماماً.
- **بعض الصفحات مقلوبة أو جانبية.** صحّحها بأداة [تدوير PDF](tool:rotate-pdf) قبل التحويل حتى يقرأ المحوّل الأسطر في الاتجاه الصحيح.

## الخطوة 3: جهّز ملف PDF

دقائق قليلة من التحضير تفيد غالباً أكثر من المحوّل نفسه:

1. **احذف الصفحات التي لا تحتاجها.** صفحات الغلاف المليئة بالرسومات والصفحات الفارغة والملاحق ذات المخططات المعقدة هي الأكثر إنتاجاً للفوضى. استخرج الصفحات التي ستعدّلها فقط.
2. **التزم بحد الحجم.** تقبل [أداة PDF إلى Word من Convertios](tool:pdf-to-word) ملفات حتى 25 ميغابايت، وتقسيم التقرير الطويل يسهّل أيضاً مراجعة كل نتيجة.
3. **تجنّب الملفات المحمية بكلمة مرور أو بقيود.** أزل الحماية من التطبيق الذي أنشأ الملف إن كان يحق لك ذلك.

## الخطوة 4: حوّل الملف وراجعه بترتيب ثابت

ترفع أداة Convertios الملف إلى خادم Convertios الخاص، وتعيد بناءه بالمحرك مفتوح المصدر pdf2docx، ثم تعيد إليك ملف DOCX وتحذف الملفات المؤقتة بعد انتهاء الطلب. عندما تفتح النتيجة راجعها بهذا الترتيب، لأن كل خطوة تؤثر في التالية:

1. **الخطوط.** إذا استخدم الملف خطاً غير مثبت على جهازك فسيستبدله Word بخط آخر، فيتغير طول الأسطر في كل مكان. تحقّق من اسم الخط في عدة فقرات وثبّته أو استبدله بشكل موحّد.
2. **حجم الصفحة والهوامش.** تأكد من تطابق A4 أو Letter مع الأصل من قائمة التخطيط ← الحجم والهوامش.
3. **الأعمدة والأقسام.** تُبنى الصفحات متعددة الأعمدة غالباً بفواصل أقسام. فعّل علامات التنسيق (زر ¶) لتراها.
4. **الجداول.** انقر داخل كل جدول. الجدول الحقيقي سهل التعديل، أما النص الذي يبدو جدولاً فقد يصل كمربعات نص أو أسطر محاذاة بمفتاح Tab.
5. **الرؤوس والتذييلات وأرقام الصفحات.** قد تصل كنص عادي في كل صفحة بدلاً من رأس صفحة حقيقي. احذف النسخ المكررة وأدرج رأساً حقيقياً مرة واحدة.
6. **الصور والمخططات.** تأكد من وجودها كلها وعدم تداخلها مع النص.

## إصلاحات سريعة لأكثر المشكلات شيوعاً

| المشكلة | السبب المرجّح | الحل |
| --- | --- | --- |
| كل سطر ينتهي بفاصل فقرة | عامل المحوّل كل سطر كفقرة | استخدم الاستبدال لتحويل هذه العلامات إلى مسافات، أو أعد كتابة المقاطع القصيرة |
| النص داخل مربعات عائمة | تموضع معقد في ملف PDF | انسخ النص من المربع إلى فقرة عادية |
| أعمدة الجدول غير متناسقة | أسطر محاذاة بمسافات أو Tab | حدّد الأسطر واستخدم إدراج ← جدول ← تحويل النص إلى جدول |
| التباعد غير مضبوط في كل المستند | استبدال الخطوط | طبّق خطاً واحداً من خلال نمط |
| أرقام الصفحات تظهر وسط النص | تحوّل التذييل إلى نص عادي | احذفها وأدرج الترقيم في تذييل الصفحة |

## ماذا تتوقع من أنواع المستندات المختلفة

- **الرسائل والأبحاث والتقارير البسيطة:** تتحول عادةً بشكل ممتاز.
- **السير الذاتية والكتيبات متعددة الأعمدة:** جيدة غالباً، لكن راجع ترتيب الأعمدة ومربعات النص.
- **النماذج:** قد تتحول المربعات والخطوط إلى رسومات، وكثيراً ما يكون ملء نموذج PDF مباشرة أسهل.
- **جداول البيانات المحفوظة كـ PDF:** قد تحتاج إلى إعادة بناء الجداول، فاطلب الملف الأصلي إن أمكن.
- **المسح الضوئي:** يحتاج إلى OCR قبل الحصول على أي نتيجة قابلة للتعديل.

## قبل مشاركة المستند المعدَّل

قارن المجاميع والتواريخ والأسماء والصياغات القانونية بملف PDF الأصلي سطراً بسطر حيث يكون ذلك مهماً. احتفظ بالأصل كنسخة مرجعية، خصوصاً في العقود والشهادات والنماذج الرسمية، وأرسل النسخة المعدّلة باسم ملف جديد حتى لا يخلط أحد بين الاثنتين.

=== pt-br ===
title: Como converter PDF em Word sem perder a formatação
seo_title: Converter PDF em Word sem perder a formatação
description: Por que o layout muda quando um PDF vira Word, como preparar o arquivo e quais ajustes rápidos deixam um DOCX convertido com a aparência certa.
dek: O PDF prende cada linha no lugar, enquanto o Word reorganiza o texto o tempo todo. Entender onde essa diferença pesa ajuda a preparar o arquivo, escolher o caminho certo e consertar o pouco que sair do lugar.
---
## Por que a formatação muda

Um PDF descreve onde cada trecho de texto e cada gráfico fica em uma página fixa: esta palavra nestas coordenadas, com esta fonte e este tamanho. O Word funciona ao contrário. Ele guarda parágrafos, estilos, tabelas e seções, e calcula as quebras de linha e de página toda vez que você abre ou edita o documento.

Por isso, converter PDF em Word significa **reconstruir a intenção a partir de posições**. O conversor precisa deduzir que um bloco de linhas é um parágrafo, que um texto alinhado é uma tabela e que a linha no topo de cada página é um cabeçalho. Na maioria das vezes ele acerta. Quando erra, aparecem colunas deslocadas, quebras de linha estranhas ou caixas de texto espalhadas.

Nenhum conversor garante uma cópia editável idêntica, pixel por pixel, de qualquer PDF. O que você pode fazer é entregar um arquivo limpo e saber o que conferir depois.

## Passo 1: descubra que tipo de PDF você tem

Tente selecionar uma palavra. Se a página inteira for selecionada como imagem, o PDF é uma digitalização e a conversão vai gerar imagens das páginas, não texto editável. Nosso artigo sobre [por que um PDF digitalizado não fica editável](blog:scanned-pdf-to-word) explica o que fazer nesse caso: aplicar OCR primeiro.

Se dá para selecionar e pesquisar o texto, o PDF é de texto, e a qualidade da formatação depende principalmente de como ele foi criado.

## Passo 2: pergunte se você precisa mesmo do Word

Às vezes, a melhor forma de manter a formatação é não converter:

- **Você tem acesso ao original.** Se alguém exportou o PDF do Word ou do Google Docs, peça o DOCX original. Ele sempre será mais fiel do que qualquer reconstrução.
- **Você só precisa de algumas frases.** Copie do PDF e cole como texto sem formatação no seu documento.
- **Você precisa mudar páginas, não palavras.** Use o [Dividir PDF](tool:split-pdf) para extrair páginas e manter o layout exatamente igual.
- **Há páginas de lado.** Corrija com o [Girar PDF](tool:rotate-pdf) antes de converter, para que o conversor leia as linhas na direção certa.

## Passo 3: prepare o PDF

Alguns minutos de preparação costumam fazer mais diferença do que o próprio conversor:

1. **Tire as páginas de que você não precisa.** Capas cheias de gráficos, páginas em branco e anexos com diagramas complexos são as que mais bagunçam o resultado. Extraia só as páginas que você vai editar.
2. **Respeite o limite de tamanho.** A [ferramenta PDF para Word da Convertios](tool:pdf-to-word) aceita arquivos de até 25 MB. Dividir um relatório longo também facilita conferir cada parte.
3. **Evite arquivos com senha ou restrições.** Se você tem direito, remova a proteção no aplicativo que criou o arquivo.

## Passo 4: converta e revise sempre na mesma ordem

A ferramenta da Convertios envia o PDF ao servidor próprio da Convertios, reconstrói o documento com o mecanismo de código aberto pdf2docx e devolve um DOCX. Os arquivos temporários são apagados ao fim da solicitação. Quando abrir o resultado, revise nesta ordem, porque cada etapa afeta a seguinte:

1. **Fontes.** Se o PDF usava uma fonte que não está instalada no seu computador, o Word coloca outra no lugar, e o comprimento de todas as linhas muda. Confira o nome da fonte em alguns parágrafos e instale ou substitua de forma consistente.
2. **Tamanho da página e margens.** Confirme se A4 ou Carta corresponde ao original, em Layout → Tamanho e Margens.
3. **Colunas e seções.** Páginas com várias colunas costumam ser recriadas com quebras de seção. Ative as marcas de formatação (o botão ¶) para vê-las.
4. **Tabelas.** Clique dentro de cada tabela. Uma tabela de verdade é fácil de editar; um texto que só parecia tabela pode ter chegado como caixas de texto ou linhas alinhadas com tabulação.
5. **Cabeçalhos, rodapés e números de página.** Eles podem ter virado texto comum em cada página. Apague as cópias repetidas e insira um cabeçalho de verdade uma única vez.
6. **Imagens e gráficos.** Confira se estão todos lá e se não estão por cima do texto.

## Ajustes rápidos para os problemas mais comuns

| Problema | Causa provável | Solução |
| --- | --- | --- |
| Cada linha termina com quebra de parágrafo | O conversor tratou cada linha como um parágrafo | Use Substituir para trocar essas marcas por espaços ou redigite trechos curtos |
| O texto está em caixas flutuantes | Posicionamento complexo no PDF | Copie o texto da caixa para um parágrafo normal |
| As colunas da tabela não batem | Linhas alinhadas com espaços ou tabulação | Selecione as linhas e use Inserir → Tabela → Converter texto em tabela |
| O espaçamento parece estranho no documento todo | Substituição de fontes | Aplique uma única fonte por meio de um estilo |
| Números de página no meio do texto | O rodapé foi convertido como texto do corpo | Apague e insira a numeração no rodapé |

## O que esperar de cada tipo de documento

- **Cartas, trabalhos e relatórios simples:** costumam converter muito bem.
- **Currículos e folhetos com colunas:** geralmente bons, mas confira a ordem das colunas e as caixas de texto.
- **Formulários:** caixas e linhas podem virar desenhos. Muitas vezes é mais fácil preencher o formulário em PDF diretamente.
- **Planilhas salvas como PDF:** talvez seja preciso refazer as tabelas. Se possível, peça a planilha original.
- **Digitalizações:** precisam de OCR antes de qualquer resultado editável.

## Antes de compartilhar o documento editado

Compare totais, datas, nomes e textos jurídicos com o PDF original, linha por linha onde isso importa. Guarde o PDF original como cópia de referência, principalmente em contratos, certificados e formulários oficiais, e envie a versão editada com outro nome de arquivo para ninguém confundir as duas.
