---
category: pdf-documents
type: tutorial
published: 2026-11-18
order: 176
status: published
cover: ↻ 90°
tools: rotate-pdf, split-pdf, merge-pdf
related: split-pdf-extract-pages, merge-pdf-files
keyword: rotate pdf pages permanently
intent: how-to
---
=== en ===
title: How to rotate PDF pages permanently, page by page
seo_title: How to rotate PDF pages permanently
description: Fix sideways and upside-down scans so they display and print correctly for everyone, not just in your own viewer, without losing quality.
dek: Turning a page in your PDF viewer only changes your view. Rotating the page in the file fixes it for every reader and printer, and it takes a few clicks per page.
---
## View rotation versus saved rotation

Almost every PDF reader has a rotate button. In most of them it only changes how the page looks on your screen right now. Close the file, send it to someone, or print it from another program, and the page is sideways again.

To fix a document for everyone, the rotation has to be saved in the PDF itself. Each page in a PDF carries an instruction that tells readers which way to display it. Changing that instruction is what "rotating permanently" means.

## Why pages end up sideways

- **Scanners and scanning apps** sometimes guess the orientation wrong, especially for pages with little text.
- **Landscape pages** such as wide tables and charts are often inserted into portrait reports.
- **Phone photos** turned into PDFs can keep the wrong orientation if the camera's orientation data was missing.
- **Double-sided scans** can flip every second page upside down.

## How to rotate pages with Convertios

The [Rotate PDF tool](tool:rotate-pdf) opens your document in the browser, so the file is not uploaded to a server.

1. Open [Rotate PDF](tool:rotate-pdf) and choose your PDF. Every page appears as a thumbnail with its own Rotate button.
2. Click **Rotate** under each page that needs fixing. Each click turns that page 90° clockwise:
   - one click for a page lying on its left side,
   - two clicks for an upside-down page,
   - three clicks to turn a page 90° counter-clockwise.
3. Watch the thumbnails; they update immediately, so you can check every page.
4. Download `rotated.pdf`.

Only the pages you click are changed. All other pages stay exactly as they were.

## Does rotating reduce quality?

No. The page content is not redrawn or recompressed; only the direction in which it is displayed changes. Text that was searchable stays searchable, and scanned images keep their original resolution.

## A sensible order for cleaning up a scan

When a scanned document has several problems, fix them in this order:

1. **Remove pages you do not need** with [Split PDF](tool:split-pdf). There is no point rotating blank pages. See [how to extract pages](blog:split-pdf-extract-pages).
2. **Rotate** the remaining sideways or upside-down pages.
3. **Combine** the corrected file with other documents using [Merge PDF](tool:merge-pdf), if needed.

Rotating before converting a PDF to Word also helps: converters read text lines more reliably when pages are upright.

## Landscape pages in portrait documents

A wide table placed on a landscape page is correct in the original, even if it looks sideways in a thumbnail strip. Before rotating it, ask how the reader will view it. On screen, an upright landscape page is easiest to read. In print, many reports deliberately keep landscape pages rotated so that the binding edge stays on the same side. If you are unsure, leave pages as the author intended and rotate only those that are genuinely upside down or misread by a scanner.

## Quick checklist

- Rotate in the file, not just in your viewer, before sharing.
- Count clicks: one for left-lying pages, two for upside down, three for right-lying pages.
- Check every thumbnail before downloading.
- Open the downloaded file in a different reader to confirm the fix.

=== es ===
title: Cómo rotar páginas de un PDF de forma permanente, página a página
seo_title: Cómo rotar páginas de un PDF de forma permanente
description: Corrige escaneos de lado o al revés para que se vean e impriman bien para todos, no solo en tu visor, y sin perder calidad.
dek: Girar una página en el visor de PDF solo cambia lo que ves tú. Rotarla dentro del archivo la corrige para cualquier lector e impresora, y solo lleva unos clics por página.
---
## Rotación de vista frente a rotación guardada

Casi todos los lectores de PDF tienen un botón para girar. En la mayoría solo cambia cómo ves la página en ese momento. Cierra el archivo, envíalo a otra persona o imprímelo desde otro programa, y la página vuelve a estar de lado.

Para corregir un documento para todos, la rotación tiene que guardarse en el propio PDF. Cada página de un PDF lleva una instrucción que indica a los lectores en qué dirección mostrarla. Cambiar esa instrucción es lo que significa «rotar de forma permanente».

## Por qué las páginas acaban de lado

- **Escáneres y apps de escaneo** a veces se equivocan con la orientación, sobre todo en páginas con poco texto.
- **Páginas horizontales** como tablas y gráficos anchos se insertan a menudo en informes verticales.
- **Fotos del móvil** convertidas en PDF pueden conservar una orientación errónea si faltaban los datos de orientación de la cámara.
- **Escaneos a doble cara** pueden dejar boca abajo una de cada dos páginas.

## Cómo rotar páginas con Convertios

La herramienta [Girar PDF](tool:rotate-pdf) abre el documento en tu navegador, así que el archivo no se sube a ningún servidor.

1. Abre [Girar PDF](tool:rotate-pdf) y elige tu PDF. Cada página aparece como miniatura con su propio botón Girar.
2. Haz clic en **Girar** bajo cada página que necesite corregirse. Cada clic gira esa página 90° en el sentido de las agujas del reloj:
   - un clic para una página tumbada sobre su lado izquierdo,
   - dos clics para una página al revés,
   - tres clics para girar una página 90° en sentido contrario.
3. Fíjate en las miniaturas: se actualizan al instante, así que puedes revisar cada página.
4. Descarga `rotated.pdf`.

Solo cambian las páginas en las que haces clic. Todas las demás se quedan exactamente igual.

## ¿Rotar reduce la calidad?

No. El contenido de la página no se vuelve a dibujar ni a comprimir; solo cambia la dirección en la que se muestra. El texto buscable sigue siéndolo y las imágenes escaneadas conservan su resolución original.

## Un orden lógico para limpiar un escaneo

Cuando un documento escaneado tiene varios problemas, corrígelos en este orden:

1. **Quita las páginas que no necesitas** con [Dividir PDF](tool:split-pdf). No tiene sentido girar páginas en blanco. Consulta [cómo extraer páginas](blog:split-pdf-extract-pages).
2. **Rota** las páginas que sigan de lado o al revés.
3. **Combina** el archivo corregido con otros documentos usando [Unir PDF](tool:merge-pdf), si hace falta.

Rotar antes de convertir un PDF a Word también ayuda: los conversores leen mejor las líneas de texto cuando las páginas están derechas.

## Páginas horizontales en documentos verticales

Una tabla ancha colocada en una página horizontal es correcta en el original, aunque en las miniaturas parezca de lado. Antes de girarla, piensa en cómo la verá el lector. En pantalla, una página horizontal derecha se lee mejor. En papel, muchos informes mantienen a propósito las páginas horizontales giradas para que el borde de encuadernación quede siempre en el mismo lado. Si dudas, deja las páginas como las pensó el autor y gira solo las que estén realmente al revés o mal leídas por el escáner.

## Lista rápida

- Rota en el archivo, no solo en el visor, antes de compartir.
- Cuenta los clics: uno para páginas tumbadas a la izquierda, dos para las que están al revés, tres para las tumbadas a la derecha.
- Revisa todas las miniaturas antes de descargar.
- Abre el archivo descargado en otro lector para confirmar el cambio.

=== ar ===
title: كيف تدوّر صفحات PDF بشكل دائم صفحةً صفحة
seo_title: كيف تدوّر صفحات PDF بشكل دائم
description: صحّح الصفحات الممسوحة الجانبية أو المقلوبة لتُعرض وتُطبع بشكل صحيح لدى الجميع، لا في عارضك فقط، ودون أي فقدان في الجودة.
dek: تدوير الصفحة في عارض PDF يغيّر ما تراه أنت فقط. أما تدويرها داخل الملف فيصلحها لكل قارئ وكل طابعة، ولا يحتاج إلا إلى نقرات قليلة لكل صفحة.
---
## تدوير العرض مقابل التدوير المحفوظ

لدى كل قارئ PDF تقريباً زر للتدوير، لكنه في معظمها يغيّر شكل الصفحة على شاشتك في تلك اللحظة فقط. أغلق الملف أو أرسله لشخص آخر أو اطبعه من برنامج آخر، وستعود الصفحة جانبية.

لإصلاح المستند للجميع يجب حفظ التدوير داخل ملف PDF نفسه. تحمل كل صفحة في الملف تعليمة تخبر القارئات بالاتجاه الذي تُعرض به، وتغيير هذه التعليمة هو معنى «التدوير الدائم».

## لماذا تصبح الصفحات جانبية

- **الماسحات وتطبيقات المسح** تخطئ أحياناً في الاتجاه، خصوصاً في الصفحات القليلة النص.
- **الصفحات الأفقية** مثل الجداول والمخططات العريضة تُدرج كثيراً داخل تقارير عمودية.
- **صور الهاتف** المحوّلة إلى PDF قد تحتفظ باتجاه خاطئ إذا غابت بيانات الاتجاه من الكاميرا.
- **المسح على الوجهين** قد يقلب كل صفحة ثانية رأساً على عقب.

## كيف تدوّر الصفحات في Convertios

تفتح أداة [تدوير PDF](tool:rotate-pdf) المستند داخل متصفحك، فلا يُرفع الملف إلى أي خادم.

1. افتح [تدوير PDF](tool:rotate-pdf) واختر ملفك. تظهر كل صفحة كصورة مصغرة مع زر تدوير خاص بها.
2. انقر **تدوير** تحت كل صفحة تحتاج إلى تصحيح. كل نقرة تدير الصفحة 90° باتجاه عقارب الساعة:
   - نقرة واحدة لصفحة مائلة على جانبها الأيسر،
   - نقرتان لصفحة مقلوبة،
   - ثلاث نقرات لتدوير الصفحة 90° عكس عقارب الساعة.
3. راقب الصور المصغرة، فهي تتحدث فوراً وتتيح لك مراجعة كل صفحة.
4. نزّل الملف `rotated.pdf`.

تتغير الصفحات التي تنقر عليها فقط، وتبقى بقية الصفحات كما هي تماماً.

## هل يقلل التدوير الجودة؟

لا. لا يُعاد رسم محتوى الصفحة ولا ضغطه، وإنما يتغير اتجاه عرضه فقط. يبقى النص القابل للبحث قابلاً للبحث، وتحتفظ الصور الممسوحة بدقتها الأصلية.

## ترتيب منطقي لتنظيف مستند ممسوح

عندما يحمل المستند الممسوح عدة مشكلات فأصلحها بهذا الترتيب:

1. **احذف الصفحات غير المطلوبة** بأداة [تقسيم PDF](tool:split-pdf)، فلا فائدة من تدوير صفحات فارغة. راجع [طريقة استخراج الصفحات](blog:split-pdf-extract-pages).
2. **دوّر** ما تبقى من صفحات جانبية أو مقلوبة.
3. **ادمج** الملف المصحح مع مستندات أخرى بأداة [دمج PDF](tool:merge-pdf) عند الحاجة.

التدوير قبل تحويل PDF إلى Word مفيد أيضاً، إذ تقرأ المحوّلات أسطر النص بشكل أدق عندما تكون الصفحات قائمة.

## الصفحات الأفقية داخل المستندات العمودية

الجدول العريض الموضوع في صفحة أفقية صحيح في الأصل حتى لو بدا جانبياً في الصور المصغرة. قبل تدويره فكّر في طريقة عرض القارئ له: على الشاشة تكون الصفحة الأفقية القائمة أسهل للقراءة، أما في الطباعة فكثير من التقارير تُبقي الصفحات الأفقية مدوّرة عمداً حتى تبقى حافة التجليد في الجهة نفسها. إن ترددت فاترك الصفحات كما أرادها المؤلف ودوّر فقط ما هو مقلوب فعلاً أو أخطأ الماسح في قراءته.

## قائمة سريعة

- دوّر داخل الملف لا في العارض فقط قبل المشاركة.
- عُدّ النقرات: واحدة للصفحات المائلة إلى اليسار، واثنتان للمقلوبة، وثلاث للمائلة إلى اليمين.
- راجع كل الصور المصغرة قبل التنزيل.
- افتح الملف المنزّل في قارئ آخر للتأكد من الإصلاح.

=== pt-br ===
title: Como girar páginas de PDF de forma permanente, página por página
seo_title: Como girar páginas de PDF de forma permanente
description: Corrija digitalizações de lado ou de cabeça para baixo para que apareçam e imprimam certo para todo mundo, não só no seu leitor, sem perder qualidade.
dek: Girar a página no leitor de PDF só muda o que você está vendo. Girar a página dentro do arquivo corrige para qualquer leitor e impressora, e leva poucos cliques por página.
---
## Giro na tela versus giro salvo

Quase todo leitor de PDF tem um botão de girar. Na maioria, ele só muda a aparência da página na sua tela naquele momento. Feche o arquivo, envie para alguém ou imprima por outro programa, e a página volta a ficar de lado.

Para corrigir o documento para todos, o giro precisa ser salvo no próprio PDF. Cada página de um PDF traz uma instrução que diz aos leitores em que direção exibi-la. Mudar essa instrução é o que significa "girar de forma permanente".

## Por que as páginas ficam de lado

- **Scanners e apps de digitalização** às vezes erram a orientação, principalmente em páginas com pouco texto.
- **Páginas na horizontal**, como tabelas e gráficos largos, costumam ser inseridas em relatórios na vertical.
- **Fotos do celular** transformadas em PDF podem manter a orientação errada se faltarem os dados de orientação da câmera.
- **Digitalizações frente e verso** podem deixar uma em cada duas páginas de cabeça para baixo.

## Como girar páginas com a Convertios

A ferramenta [Girar PDF](tool:rotate-pdf) abre o documento no seu navegador, então o arquivo não é enviado para nenhum servidor.

1. Abra o [Girar PDF](tool:rotate-pdf) e escolha seu PDF. Cada página aparece como miniatura com seu próprio botão Girar.
2. Clique em **Girar** embaixo de cada página que precisa de correção. Cada clique gira a página 90° no sentido horário:
   - um clique para uma página deitada sobre o lado esquerdo,
   - dois cliques para uma página de cabeça para baixo,
   - três cliques para girar a página 90° no sentido anti-horário.
3. Acompanhe as miniaturas: elas atualizam na hora, então dá para conferir cada página.
4. Baixe o `rotated.pdf`.

Só mudam as páginas em que você clica. Todas as outras continuam exatamente como estavam.

## Girar reduz a qualidade?

Não. O conteúdo da página não é redesenhado nem recomprimido; só muda a direção em que ele é exibido. O texto pesquisável continua pesquisável e as imagens digitalizadas mantêm a resolução original.

## Uma ordem lógica para arrumar uma digitalização

Quando um documento digitalizado tem vários problemas, corrija nesta ordem:

1. **Tire as páginas desnecessárias** com o [Dividir PDF](tool:split-pdf). Não faz sentido girar páginas em branco. Veja [como extrair páginas](blog:split-pdf-extract-pages).
2. **Gire** as páginas que continuam de lado ou de cabeça para baixo.
3. **Combine** o arquivo corrigido com outros documentos no [Juntar PDF](tool:merge-pdf), se precisar.

Girar antes de converter um PDF em Word também ajuda: os conversores leem as linhas de texto com mais precisão quando as páginas estão em pé.

## Páginas na horizontal em documentos na vertical

Uma tabela larga colocada em uma página horizontal está correta no original, mesmo que pareça de lado nas miniaturas. Antes de girar, pense em como o leitor vai ver. Na tela, uma página horizontal em pé é mais fácil de ler. No papel, muitos relatórios mantêm de propósito as páginas horizontais giradas para que a borda da encadernação fique sempre do mesmo lado. Na dúvida, deixe as páginas como o autor planejou e gire só as que estão de fato de cabeça para baixo ou foram lidas errado pelo scanner.

## Checklist rápido

- Gire no arquivo, não só no leitor, antes de compartilhar.
- Conte os cliques: um para páginas deitadas à esquerda, dois para as de cabeça para baixo, três para as deitadas à direita.
- Confira todas as miniaturas antes de baixar.
- Abra o arquivo baixado em outro leitor para confirmar a correção.
