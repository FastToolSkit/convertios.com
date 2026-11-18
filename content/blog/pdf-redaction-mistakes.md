---
category: pdf-documents
type: guide
published: 2026-11-18
order: 149
status: published
cover: ████ PDF
tools: pdf-to-jpg, jpg-to-pdf, split-pdf
related: split-pdf-extract-pages, pdf-vs-docx
keyword: how to redact a pdf properly
intent: informational / how-to
---
=== en ===
title: PDF redaction mistakes that leave private information exposed
seo_title: PDF redaction mistakes and how to avoid them
description: A black box drawn over text does not always remove it. Learn how real redaction works, how to test a redacted PDF and what to do when you lack a redaction tool.
dek: Covering a number with a black rectangle looks safe, but the text underneath can often still be copied, searched or recovered. Proper redaction removes the content itself, and you can check that in a minute.
---
## Why black boxes fail

A PDF page is built in layers: text, images, drawings and annotations stacked on top of each other. When you draw a black rectangle over an account number, many editors simply add one more layer on top. The number is still there underneath. Anyone can:

- select the hidden area and copy the text into another document,
- search the PDF for the number and find it,
- delete or move the rectangle in an editor,
- extract all text with a converter, which ignores the box entirely.

The same applies to highlighting text in black, setting the font colour to white, or placing a picture over a signature. These change what you see, not what the file contains.

## What real redaction does

Proper redaction tools work in two steps. First you mark the areas to remove. Then you **apply** the redaction, which deletes the text, image pixels and drawing instructions in those areas and usually leaves a solid box in their place. After applying, the information is no longer in the file, not merely hidden.

Look for a feature explicitly called *Redact* with an *Apply* step in a dedicated PDF editor. A drawing or comment tool is not a redaction tool, even if it can make black boxes.

## Hidden places sensitive data hides

Even with correct redaction on the visible page, information can remain elsewhere in the file:

- **Document properties:** author, title, company, original file name.
- **Comments and annotations** from earlier review rounds.
- **Bookmarks and form fields** that repeat a name or reference number.
- **Earlier versions** in files saved with incremental updates.
- **Image layers:** a scanned page may have an invisible OCR text layer containing the words you covered on the picture.
- **Attachments** embedded in the PDF.

Good redaction tools offer a "sanitise" or "remove hidden information" option. Use it after redacting.

## How to test a redacted PDF in one minute

Always test the final file, not the one you edited:

1. Open the redacted PDF in a different reader from the one you used to edit it.
2. Use search (Ctrl+F or Cmd+F) for a few of the redacted words or digits. There should be no results.
3. Drag-select across a redacted area, copy and paste into a plain text editor. Nothing sensitive should appear.
4. Check the document properties for names and file paths.

If any test reveals the information, the redaction has not been applied.

## A workaround when you have no redaction tool

If you only need to share a few pages and have no proper redaction feature, you can turn pages into pictures, which removes every hidden text layer:

1. Extract only the pages you need with [Split PDF](tool:split-pdf).
2. Export those pages as images with [PDF to JPG](tool:pdf-to-jpg).
3. In an image editor, paint over the sensitive areas with solid black, and save the edited JPG. Zoom in to make sure no edges of digits remain visible.
4. Rebuild a PDF from the edited images with [JPG to PDF](tool:jpg-to-pdf).

All three Convertios tools run in your browser, so the pages are not uploaded. The trade-off is that the result contains images rather than text, so it is not searchable and may be less accessible for screen-reader users. For legal filings or official records, use the redaction process your organisation or court requires.

## Habits that prevent leaks

- **Share less in the first place.** Removing whole pages with [Split PDF](tool:split-pdf) is often enough. See [how to extract pages from a PDF](blog:split-pdf-extract-pages).
- **Redact the source when possible.** Deleting a number in the original Word file before exporting to PDF is cleaner than redacting the PDF afterwards.
- **Do not trust the screen.** Test search and copy every time.
- **Keep an unredacted original in a secure place,** separate from the version you share.

=== es ===
title: Errores al censurar un PDF que dejan información privada a la vista
seo_title: Errores al censurar un PDF y cómo evitarlos
description: Un recuadro negro sobre un texto no siempre lo elimina. Aprende cómo funciona la censura real, cómo comprobar un PDF censurado y qué hacer sin herramienta específica.
dek: Tapar un número con un rectángulo negro parece seguro, pero el texto que hay debajo a menudo se puede copiar, buscar o recuperar. Una censura correcta elimina el contenido, y puedes comprobarlo en un minuto.
---
## Por qué fallan los recuadros negros

Una página PDF se construye por capas: texto, imágenes, dibujos y anotaciones apilados. Cuando dibujas un rectángulo negro sobre un número de cuenta, muchos editores simplemente añaden otra capa encima. El número sigue debajo. Cualquiera puede:

- seleccionar la zona oculta y copiar el texto en otro documento,
- buscar el número en el PDF y encontrarlo,
- borrar o mover el rectángulo con un editor,
- extraer todo el texto con un conversor, que ignora el recuadro por completo.

Lo mismo ocurre si resaltas el texto en negro, cambias el color de la letra a blanco o colocas una imagen encima de una firma. Eso cambia lo que ves, no lo que contiene el archivo.

## Qué hace una censura real

Las herramientas de censura (a menudo llamadas *Redactar* o *Censurar*) funcionan en dos pasos. Primero marcas las zonas que quieres eliminar. Después **aplicas** la censura, que borra el texto, los píxeles de las imágenes y las instrucciones de dibujo de esas zonas, y normalmente deja un recuadro sólido en su lugar. Tras aplicarla, la información ya no está en el archivo; no está solo oculta.

Busca en un editor de PDF específico una función que se llame expresamente así y que tenga un paso de *Aplicar*. Una herramienta de dibujo o de comentarios no censura, aunque pueda hacer recuadros negros.

## Lugares ocultos donde quedan datos sensibles

Aunque la página visible esté bien censurada, la información puede seguir en otras partes del archivo:

- **Propiedades del documento:** autor, título, empresa, nombre del archivo original.
- **Comentarios y anotaciones** de revisiones anteriores.
- **Marcadores y campos de formulario** que repiten un nombre o una referencia.
- **Versiones anteriores** en archivos guardados con actualizaciones incrementales.
- **Capas de imagen:** una página escaneada puede tener una capa invisible de texto OCR con las palabras que tapaste en la imagen.
- **Archivos adjuntos** incrustados en el PDF.

Las buenas herramientas de censura ofrecen una opción para «limpiar» o «eliminar información oculta». Úsala después de censurar.

## Cómo comprobar un PDF censurado en un minuto

Comprueba siempre el archivo final, no el que editaste:

1. Abre el PDF censurado en un lector distinto del que usaste para editarlo.
2. Busca (Ctrl+F o Cmd+F) algunas de las palabras o cifras censuradas. No debería aparecer ningún resultado.
3. Selecciona arrastrando sobre una zona censurada, copia y pega en un editor de texto plano. No debería aparecer nada sensible.
4. Revisa las propiedades del documento en busca de nombres y rutas de archivo.

Si alguna prueba revela la información, la censura no se ha aplicado.

## Una alternativa si no tienes herramienta de censura

Si solo necesitas compartir unas pocas páginas y no tienes una función de censura adecuada, puedes convertir las páginas en imágenes, lo que elimina cualquier capa de texto oculta:

1. Extrae solo las páginas que necesitas con [Dividir PDF](tool:split-pdf).
2. Exporta esas páginas como imágenes con [PDF a JPG](tool:pdf-to-jpg).
3. En un editor de imágenes, pinta de negro sólido las zonas sensibles y guarda el JPG editado. Amplía para asegurarte de que no se ven bordes de las cifras.
4. Vuelve a crear un PDF con las imágenes editadas usando [JPG a PDF](tool:jpg-to-pdf).

Las tres herramientas de Convertios funcionan en tu navegador, así que las páginas no se suben. A cambio, el resultado contiene imágenes en lugar de texto: no se puede buscar y puede ser menos accesible para quien usa lector de pantalla. En escritos judiciales o registros oficiales, usa el proceso de censura que exija tu organización o el tribunal.

## Hábitos que evitan filtraciones

- **Comparte menos desde el principio.** Quitar páginas enteras con [Dividir PDF](tool:split-pdf) suele bastar. Consulta [cómo extraer páginas de un PDF](blog:split-pdf-extract-pages).
- **Censura en el original cuando puedas.** Borrar un número en el Word original antes de exportar a PDF es más limpio que censurar el PDF después.
- **No te fíes de la pantalla.** Prueba la búsqueda y la copia siempre.
- **Guarda el original sin censurar en un lugar seguro,** separado de la versión que compartes.

=== ar ===
title: أخطاء حجب المعلومات في PDF التي تترك بياناتك الخاصة مكشوفة
seo_title: أخطاء حجب المعلومات في PDF وكيف تتجنبها
description: المربع الأسود فوق النص لا يحذفه دائماً. تعرّف إلى طريقة الحجب الحقيقي، وكيف تختبر ملف PDF بعد الحجب، وماذا تفعل إن لم تملك أداة حجب.
dek: تغطية رقم بمستطيل أسود تبدو آمنة، لكن النص تحته كثيراً ما يبقى قابلاً للنسخ أو البحث أو الاسترجاع. الحجب الصحيح يحذف المحتوى نفسه، ويمكنك التحقق من ذلك خلال دقيقة.
---
## لماذا تفشل المربعات السوداء

تُبنى صفحة PDF من طبقات: نصوص وصور ورسومات وتعليقات فوق بعضها. عندما ترسم مستطيلاً أسود فوق رقم حساب، تضيف كثير من المحررات طبقة جديدة فوقه فقط، ويبقى الرقم موجوداً تحتها. يستطيع أي شخص:

- تحديد المنطقة المخفية ونسخ النص إلى مستند آخر،
- البحث عن الرقم داخل الملف والعثور عليه،
- حذف المستطيل أو تحريكه في أي محرر،
- استخراج النص كله بمحوّل يتجاهل المربع تماماً.

وينطبق الأمر نفسه على تظليل النص بالأسود أو جعل لون الخط أبيض أو وضع صورة فوق التوقيع؛ فهذه تغيّر ما تراه لا ما يحتويه الملف.

## ما الذي يفعله الحجب الحقيقي

تعمل أدوات الحجب (Redact) على خطوتين: تحدد أولاً المناطق المراد إزالتها، ثم **تطبّق** الحجب فيحذف النصوص وبكسلات الصور وتعليمات الرسم في تلك المناطق، ويضع عادةً مربعاً مصمتاً مكانها. بعد التطبيق لا تعود المعلومة موجودة في الملف، لا أنها مخفية فحسب.

ابحث في محرر PDF مخصص عن ميزة تحمل اسم الحجب صراحةً وفيها خطوة *تطبيق*. أداة الرسم أو التعليقات ليست أداة حجب حتى لو صنعت مربعات سوداء.

## أماكن خفية تبقى فيها البيانات الحساسة

حتى مع الحجب الصحيح في الصفحة المرئية، قد تبقى المعلومات في مواضع أخرى من الملف:

- **خصائص المستند:** المؤلف والعنوان والشركة واسم الملف الأصلي.
- **التعليقات والملاحظات** من جولات مراجعة سابقة.
- **الإشارات المرجعية وحقول النماذج** التي تكرر اسماً أو رقماً مرجعياً.
- **الإصدارات السابقة** في الملفات المحفوظة بتحديثات تراكمية.
- **طبقات الصور:** قد تحتوي الصفحة الممسوحة على طبقة نص OCR غير مرئية فيها الكلمات التي غطيتها في الصورة.
- **المرفقات** المضمّنة داخل ملف PDF.

توفر أدوات الحجب الجيدة خياراً «لتنظيف» الملف أو «إزالة المعلومات المخفية»، فاستخدمه بعد الحجب.

## كيف تختبر الملف المحجوب خلال دقيقة

اختبر دائماً الملف النهائي لا الملف الذي عدّلته:

1. افتح الملف المحجوب في قارئ غير الذي استخدمته في التعديل.
2. ابحث (Ctrl+F أو Cmd+F) عن بعض الكلمات أو الأرقام المحجوبة، ويجب ألا تظهر أي نتيجة.
3. حدد بالسحب منطقة محجوبة وانسخها والصقها في محرر نصوص عادي، ويجب ألا يظهر شيء حساس.
4. راجع خصائص المستند بحثاً عن أسماء ومسارات ملفات.

إذا كشف أي اختبار المعلومة فهذا يعني أن الحجب لم يُطبَّق.

## حل بديل إن لم تملك أداة حجب

إذا كنت تحتاج إلى مشاركة صفحات قليلة ولا تملك ميزة حجب حقيقية، يمكنك تحويل الصفحات إلى صور، وهذا يزيل أي طبقة نص مخفية:

1. استخرج الصفحات المطلوبة فقط بأداة [تقسيم PDF](tool:split-pdf).
2. صدّر هذه الصفحات كصور بأداة [PDF إلى JPG](tool:pdf-to-jpg).
3. في محرر صور، لوّن المناطق الحساسة بالأسود المصمت واحفظ ملف JPG المعدّل، وكبّر الصورة لتتأكد من عدم ظهور أطراف الأرقام.
4. أعد إنشاء ملف PDF من الصور المعدلة بأداة [JPG إلى PDF](tool:jpg-to-pdf).

تعمل أدوات Convertios الثلاث داخل متصفحك فلا تُرفع الصفحات. في المقابل تحتوي النتيجة صوراً لا نصاً، فلا يمكن البحث فيها وقد تكون أقل إتاحة لمستخدمي قارئات الشاشة. في المستندات القضائية أو السجلات الرسمية اتبع إجراءات الحجب التي تشترطها جهتك أو المحكمة.

## عادات تمنع التسريب

- **شارك أقل من البداية.** حذف صفحات كاملة بأداة [تقسيم PDF](tool:split-pdf) يكفي غالباً. راجع [طريقة استخراج صفحات من PDF](blog:split-pdf-extract-pages).
- **احجب في المصدر متى أمكن.** حذف الرقم من ملف Word الأصلي قبل التصدير إلى PDF أنظف من حجبه في PDF لاحقاً.
- **لا تثق بالشاشة.** اختبر البحث والنسخ في كل مرة.
- **احتفظ بالأصل غير المحجوب في مكان آمن** بعيداً عن النسخة التي تشاركها.

=== pt-br ===
title: Erros ao tarjar um PDF que deixam informações privadas expostas
seo_title: Erros ao tarjar um PDF e como evitá-los
description: Um retângulo preto sobre o texto nem sempre o remove. Veja como a tarja de verdade funciona, como testar um PDF tarjado e o que fazer sem uma ferramenta própria.
dek: Cobrir um número com um retângulo preto parece seguro, mas o texto por baixo muitas vezes ainda pode ser copiado, pesquisado ou recuperado. A tarja correta remove o conteúdo, e você consegue conferir isso em um minuto.
---
## Por que retângulos pretos falham

Uma página de PDF é montada em camadas: texto, imagens, desenhos e anotações empilhados. Quando você desenha um retângulo preto sobre um número de conta, muitos editores apenas acrescentam mais uma camada por cima. O número continua lá embaixo. Qualquer pessoa pode:

- selecionar a área escondida e copiar o texto para outro documento,
- pesquisar o número no PDF e encontrá-lo,
- apagar ou mover o retângulo em um editor,
- extrair todo o texto com um conversor, que ignora o retângulo por completo.

O mesmo vale para marcar o texto de preto, mudar a cor da fonte para branco ou colocar uma imagem sobre uma assinatura. Isso muda o que você vê, não o que o arquivo contém.

## O que a tarja de verdade faz

Ferramentas de tarja (muitas vezes chamadas de *Redigir* ou *Redact*) trabalham em duas etapas. Primeiro você marca as áreas a remover. Depois você **aplica** a tarja, que apaga o texto, os pixels das imagens e as instruções de desenho dessas áreas e normalmente deixa um retângulo sólido no lugar. Depois de aplicada, a informação não está mais no arquivo; não está só escondida.

Procure em um editor de PDF dedicado uma função com esse nome explícito e com uma etapa de *Aplicar*. Uma ferramenta de desenho ou de comentários não tarja, mesmo que consiga fazer retângulos pretos.

## Lugares escondidos onde dados sensíveis ficam

Mesmo com a página visível tarjada corretamente, a informação pode continuar em outras partes do arquivo:

- **Propriedades do documento:** autor, título, empresa, nome do arquivo original.
- **Comentários e anotações** de revisões anteriores.
- **Marcadores e campos de formulário** que repetem um nome ou um número de referência.
- **Versões anteriores** em arquivos salvos com atualizações incrementais.
- **Camadas de imagem:** uma página digitalizada pode ter uma camada invisível de texto de OCR com as palavras que você cobriu na imagem.
- **Anexos** incorporados ao PDF.

Boas ferramentas de tarja oferecem uma opção de "higienizar" ou "remover informações ocultas". Use depois de tarjar.

## Como testar um PDF tarjado em um minuto

Teste sempre o arquivo final, não o que você editou:

1. Abra o PDF tarjado em um leitor diferente do que você usou para editar.
2. Pesquise (Ctrl+F ou Cmd+F) algumas das palavras ou números tarjados. Não deve aparecer nenhum resultado.
3. Selecione arrastando sobre uma área tarjada, copie e cole em um editor de texto simples. Nada sensível deve aparecer.
4. Confira as propriedades do documento em busca de nomes e caminhos de arquivo.

Se algum teste revelar a informação, a tarja não foi aplicada.

## Uma alternativa se você não tem ferramenta de tarja

Se você só precisa compartilhar algumas páginas e não tem uma função de tarja adequada, pode transformar as páginas em imagens, o que elimina qualquer camada de texto escondida:

1. Extraia só as páginas necessárias com o [Dividir PDF](tool:split-pdf).
2. Exporte essas páginas como imagens com o [PDF para JPG](tool:pdf-to-jpg).
3. Em um editor de imagens, pinte de preto sólido as áreas sensíveis e salve o JPG editado. Dê zoom para garantir que nenhuma borda dos números ficou visível.
4. Monte um novo PDF com as imagens editadas usando o [JPG para PDF](tool:jpg-to-pdf).

As três ferramentas da Convertios funcionam no seu navegador, então as páginas não são enviadas. A contrapartida é que o resultado tem imagens em vez de texto: não é pesquisável e pode ser menos acessível para quem usa leitor de tela. Em processos judiciais ou registros oficiais, use o procedimento de tarja exigido pela sua organização ou pelo tribunal.

## Hábitos que evitam vazamentos

- **Compartilhe menos desde o começo.** Remover páginas inteiras com o [Dividir PDF](tool:split-pdf) muitas vezes basta. Veja [como extrair páginas de um PDF](blog:split-pdf-extract-pages).
- **Tarje na origem quando puder.** Apagar um número no Word original antes de exportar para PDF é mais limpo do que tarjar o PDF depois.
- **Não confie na tela.** Teste a pesquisa e a cópia todas as vezes.
- **Guarde o original sem tarja em um lugar seguro,** separado da versão que você compartilha.
