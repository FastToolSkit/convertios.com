---
category: pdf-documents
type: tutorial
published: 2026-11-18
order: 188
status: published
cover: Pages 2–5
tools: split-pdf, rotate-pdf, pdf-to-jpg
related: merge-pdf-files, rotate-pdf-pages
keyword: extract pages from pdf
intent: how-to
---
=== en ===
title: How to extract pages from a PDF or split it into parts
seo_title: How to extract pages from a PDF
description: Send only the page that matters, remove blank scanner pages or divide a long report into chapters, without losing text quality or page layout.
dek: Most PDFs contain more than the person you are sending them to needs. Extracting pages lets you share the signed page, the relevant statement or one chapter, while the original stays untouched.
---
## Why you would split a PDF

Splitting creates a new PDF that contains only the pages you choose. It is one of the most useful PDF tasks because it protects both your reader's time and your privacy:

- Send the **signed page** of a contract instead of all 40 pages.
- Share **one chapter** of a long report with the person responsible for it.
- Attach the **single relevant page** of a bank statement as proof of address, rather than months of transactions.
- Remove **blank pages** that a duplex scanner added.
- Keep an upload under a **size or page limit**.

## How page selection works in Convertios

The [Split PDF tool](tool:split-pdf) opens the document in your browser. The PDF is not uploaded to a server.

1. Open [Split PDF](tool:split-pdf) and choose your file. Every page appears as a thumbnail, and all pages start out selected.
2. Click a thumbnail to deselect a page you do not want. Click it again to select it again.
3. Press split. The new `split.pdf` contains the selected pages in their original order.

Removing pages and selecting pages are the same action seen from two sides. To delete two blank pages from a 30-page scan, click those two thumbnails and split. To keep only page 7, deselect everything else.

## Dividing a document into several parts

Each run produces one PDF. To divide a report into chapters, run the tool once per part:

1. Select the pages for chapter 1 and split. Rename the download, for example `report-part-1.pdf`.
2. Open the original again, select the pages for chapter 2, and split again.
3. Repeat until every part exists.

Renaming each download immediately avoids ending up with several files called `split.pdf`.

## What stays the same

- **Pages are copied exactly.** Text remains searchable and images keep their quality.
- **Size and orientation do not change.** A landscape page stays landscape.
- **The original file is not modified.** You always get a new PDF.

The page order cannot be changed during splitting; selected pages keep their original sequence. If you need a different order, split the parts separately and combine them in the order you want with [Merge PDF](tool:merge-pdf). Our guide to [merging PDFs](blog:merge-pdf-files) explains how ordering works there.

## Privacy: extracting is not redacting

Removing pages is a good way to avoid oversharing, but it only removes whole pages. If a page you keep contains an account number or a signature you do not want to share, covering it with a black box in an editor does not always delete the text underneath. Our article on [PDF redaction mistakes](blog:pdf-redaction-mistakes) explains how to remove sensitive content properly.

## Useful combinations

- **Wrong orientation?** Fix sideways pages with [Rotate PDF](tool:rotate-pdf) before or after splitting. See [how to rotate PDF pages permanently](blog:rotate-pdf-pages).
- **Need the page as an image?** If a website asks for a picture rather than a PDF, export the page with [PDF to JPG](tool:pdf-to-jpg).
- **Too large to convert?** The PDF to Word tool accepts files up to 25 MB. Splitting a long document into parts keeps each conversion within that limit.

## Quick checklist

- Thumbnails help, but zoom in on pages that look similar, such as statement pages, before deselecting.
- Check the page count of the new file.
- Rename the result so it says what it contains.
- Keep the original PDF until you are sure the extracted file is complete.

=== es ===
title: Cómo extraer páginas de un PDF o dividirlo en partes
seo_title: Cómo extraer páginas de un PDF
description: Envía solo la página que importa, elimina páginas en blanco del escáner o divide un informe largo en capítulos sin perder calidad ni diseño.
dek: La mayoría de los PDF contienen más de lo que necesita quien los recibe. Extraer páginas te permite compartir la hoja firmada, el extracto relevante o un capítulo, sin tocar el original.
---
## Por qué dividir un PDF

Dividir crea un PDF nuevo con solo las páginas que eliges. Es una de las tareas más útiles porque protege el tiempo de quien lee y también tu privacidad:

- Envía la **página firmada** de un contrato en lugar de las 40 páginas.
- Comparte **un capítulo** de un informe largo con la persona responsable.
- Adjunta la **única página relevante** de un extracto bancario como justificante de domicilio, en lugar de meses de movimientos.
- Elimina las **páginas en blanco** que añadió un escáner a doble cara.
- Mantén una subida por debajo de un **límite de tamaño o de páginas**.

## Cómo se seleccionan las páginas en Convertios

La herramienta [Dividir PDF](tool:split-pdf) abre el documento en tu navegador. El PDF no se sube a ningún servidor.

1. Abre [Dividir PDF](tool:split-pdf) y elige el archivo. Cada página aparece como miniatura y todas empiezan seleccionadas.
2. Haz clic en una miniatura para quitar una página que no quieras. Vuelve a hacer clic para seleccionarla de nuevo.
3. Pulsa dividir. El nuevo `split.pdf` contiene las páginas seleccionadas en su orden original.

Quitar páginas y seleccionar páginas son la misma acción vista desde dos lados. Para eliminar dos páginas en blanco de un escaneo de 30, haz clic en esas dos miniaturas y divide. Para quedarte solo con la página 7, quita todas las demás.

## Dividir un documento en varias partes

Cada ejecución produce un PDF. Para separar un informe en capítulos, usa la herramienta una vez por parte:

1. Selecciona las páginas del capítulo 1 y divide. Cambia el nombre de la descarga, por ejemplo `informe-parte-1.pdf`.
2. Abre de nuevo el original, selecciona las páginas del capítulo 2 y divide otra vez.
3. Repite hasta tener todas las partes.

Renombrar cada descarga al momento evita acabar con varios archivos llamados `split.pdf`.

## Qué se mantiene igual

- **Las páginas se copian tal cual.** El texto sigue siendo buscable y las imágenes conservan su calidad.
- **El tamaño y la orientación no cambian.** Una página horizontal sigue en horizontal.
- **El archivo original no se modifica.** Siempre obtienes un PDF nuevo.

Al dividir no se puede cambiar el orden; las páginas seleccionadas mantienen su secuencia original. Si necesitas otro orden, extrae las partes por separado y combínalas como quieras con [Unir PDF](tool:merge-pdf). Nuestra guía para [unir PDF](blog:merge-pdf-files) explica cómo funciona el orden allí.

## Privacidad: extraer no es censurar

Quitar páginas es una buena forma de no compartir de más, pero solo elimina páginas completas. Si una página que conservas contiene un número de cuenta o una firma que no quieres compartir, taparla con un recuadro negro en un editor no siempre borra el texto que hay debajo. Nuestro artículo sobre [errores al censurar un PDF](blog:pdf-redaction-mistakes) explica cómo eliminar bien la información sensible.

## Combinaciones útiles

- **¿Orientación incorrecta?** Corrige las páginas giradas con [Girar PDF](tool:rotate-pdf) antes o después de dividir. Consulta [cómo rotar páginas de un PDF de forma permanente](blog:rotate-pdf-pages).
- **¿Necesitas la página como imagen?** Si una web pide una imagen en lugar de un PDF, exporta la página con [PDF a JPG](tool:pdf-to-jpg).
- **¿Demasiado grande para convertir?** La herramienta PDF a Word admite archivos de hasta 25 MB. Dividir un documento largo en partes mantiene cada conversión dentro de ese límite.

## Lista rápida

- Las miniaturas ayudan, pero amplía las páginas que se parecen, como las de un extracto, antes de quitarlas.
- Comprueba el número de páginas del archivo nuevo.
- Cambia el nombre del resultado para que diga lo que contiene.
- Conserva el PDF original hasta asegurarte de que el archivo extraído está completo.

=== ar ===
title: كيف تستخرج صفحات من ملف PDF أو تقسمه إلى أجزاء
seo_title: كيف تستخرج صفحات من ملف PDF
description: أرسل الصفحة المهمة فقط، أو احذف الصفحات الفارغة من الماسح، أو قسّم تقريراً طويلاً إلى فصول دون فقدان جودة النص أو التخطيط.
dek: تحتوي معظم ملفات PDF على أكثر مما يحتاجه المستلم. يتيح لك استخراج الصفحات مشاركة صفحة التوقيع أو الكشف المطلوب أو فصل واحد، بينما يبقى الأصل كما هو.
---
## لماذا تقسم ملف PDF

ينشئ التقسيم ملف PDF جديداً يحتوي الصفحات التي تختارها فقط. وهي من أنفع مهام PDF لأنها تحفظ وقت القارئ وخصوصيتك معاً:

- أرسل **صفحة التوقيع** من العقد بدلاً من 40 صفحة.
- شارك **فصلاً واحداً** من تقرير طويل مع المسؤول عنه.
- أرفق **الصفحة الوحيدة المطلوبة** من كشف الحساب كإثبات عنوان، بدلاً من حركات أشهر كاملة.
- احذف **الصفحات الفارغة** التي أضافها الماسح ذو الوجهين.
- ابقَ ضمن **حد الحجم أو عدد الصفحات** في نموذج الرفع.

## كيف يعمل اختيار الصفحات في Convertios

تفتح أداة [تقسيم PDF](tool:split-pdf) المستند داخل متصفحك، ولا يُرفع الملف إلى أي خادم.

1. افتح [تقسيم PDF](tool:split-pdf) واختر ملفك. تظهر كل صفحة كصورة مصغرة، وتكون كلها محددة في البداية.
2. انقر على صورة مصغرة لإلغاء تحديد صفحة لا تريدها، وانقر مجدداً لإعادة تحديدها.
3. اضغط زر التقسيم. يحتوي الملف الجديد `split.pdf` على الصفحات المحددة بترتيبها الأصلي.

حذف الصفحات واختيارها عملية واحدة من جهتين: لحذف صفحتين فارغتين من مسح من 30 صفحة، انقر على هاتين الصفحتين ثم قسّم. وللاحتفاظ بالصفحة 7 فقط، ألغِ تحديد كل ما عداها.

## تقسيم المستند إلى عدة أجزاء

كل تشغيل ينتج ملف PDF واحداً. لتقسيم تقرير إلى فصول شغّل الأداة مرة لكل جزء:

1. حدد صفحات الفصل الأول ثم قسّم، وغيّر اسم الملف المنزَّل مثلاً إلى `report-part-1.pdf`.
2. افتح الأصل مجدداً، وحدد صفحات الفصل الثاني، وقسّم مرة أخرى.
3. كرّر حتى تحصل على كل الأجزاء.

تغيير اسم كل ملف فور تنزيله يمنعك من الانتهاء بعدة ملفات تحمل الاسم `split.pdf`.

## ما الذي يبقى كما هو

- **تُنسخ الصفحات كما هي.** يبقى النص قابلاً للبحث وتحافظ الصور على جودتها.
- **لا يتغير الحجم ولا الاتجاه.** تبقى الصفحة الأفقية أفقية.
- **لا يُعدَّل الملف الأصلي.** تحصل دائماً على ملف PDF جديد.

لا يمكن تغيير ترتيب الصفحات أثناء التقسيم؛ إذ تحتفظ الصفحات المحددة بتسلسلها الأصلي. إذا احتجت ترتيباً مختلفاً فاستخرج الأجزاء منفصلة ثم اجمعها بالترتيب الذي تريده عبر [دمج PDF](tool:merge-pdf). يشرح دليلنا [لدمج ملفات PDF](blog:merge-pdf-files) كيف يعمل الترتيب هناك.

## الخصوصية: الاستخراج ليس حجباً

حذف الصفحات وسيلة جيدة لتجنب مشاركة ما يزيد عن الحاجة، لكنه يحذف صفحات كاملة فقط. إذا احتوت صفحة تحتفظ بها على رقم حساب أو توقيع لا تريد مشاركته، فإن تغطيته بمربع أسود في محرر ما لا يحذف النص الموجود تحته دائماً. تشرح مقالتنا عن [أخطاء حجب المعلومات في PDF](blog:pdf-redaction-mistakes) طريقة إزالة المحتوى الحساس بشكل صحيح.

## تركيبات مفيدة

- **الاتجاه خاطئ؟** صحّح الصفحات الجانبية بأداة [تدوير PDF](tool:rotate-pdf) قبل التقسيم أو بعده. راجع [طريقة تدوير صفحات PDF بشكل دائم](blog:rotate-pdf-pages).
- **تحتاج الصفحة كصورة؟** إذا طلب موقع ما صورة بدلاً من PDF فصدّر الصفحة بأداة [PDF إلى JPG](tool:pdf-to-jpg).
- **الملف كبير على التحويل؟** تقبل أداة PDF إلى Word ملفات حتى 25 ميغابايت، وتقسيم المستند الطويل إلى أجزاء يبقي كل تحويل ضمن هذا الحد.

## قائمة سريعة

- الصور المصغرة مفيدة، لكن كبّر الصفحات المتشابهة مثل صفحات الكشوف قبل إلغاء تحديدها.
- تحقّق من عدد صفحات الملف الجديد.
- غيّر اسم النتيجة بحيث يدل على محتواها.
- احتفظ بالأصل حتى تتأكد من اكتمال الملف المستخرج.

=== pt-br ===
title: Como extrair páginas de um PDF ou dividi-lo em partes
seo_title: Como extrair páginas de um PDF
description: Envie só a página que importa, tire páginas em branco do scanner ou divida um relatório longo em capítulos, sem perder a qualidade do texto nem o layout.
dek: A maioria dos PDFs tem mais do que a pessoa que vai recebê-los precisa. Extrair páginas permite compartilhar a folha assinada, o extrato relevante ou um capítulo, sem mexer no original.
---
## Por que dividir um PDF

Dividir cria um PDF novo apenas com as páginas que você escolhe. É uma das tarefas mais úteis com PDF porque poupa o tempo de quem lê e protege a sua privacidade:

- Envie a **página assinada** de um contrato em vez das 40 páginas.
- Compartilhe **um capítulo** de um relatório longo com a pessoa responsável por ele.
- Anexe a **única página relevante** de um extrato bancário como comprovante de endereço, em vez de meses de movimentação.
- Tire **páginas em branco** que um scanner frente e verso acrescentou.
- Mantenha um envio abaixo de um **limite de tamanho ou de páginas**.

## Como funciona a seleção de páginas na Convertios

A ferramenta [Dividir PDF](tool:split-pdf) abre o documento no seu navegador. O PDF não é enviado para nenhum servidor.

1. Abra o [Dividir PDF](tool:split-pdf) e escolha o arquivo. Cada página aparece como miniatura, e todas começam selecionadas.
2. Clique em uma miniatura para desmarcar a página que você não quer. Clique de novo para marcá-la outra vez.
3. Clique em dividir. O novo `split.pdf` traz as páginas selecionadas na ordem original.

Remover páginas e selecionar páginas são a mesma ação vista de dois lados. Para apagar duas páginas em branco de uma digitalização de 30, clique nessas duas miniaturas e divida. Para ficar só com a página 7, desmarque todas as outras.

## Dividir um documento em várias partes

Cada execução gera um PDF. Para separar um relatório em capítulos, use a ferramenta uma vez por parte:

1. Selecione as páginas do capítulo 1 e divida. Renomeie o download, por exemplo `relatorio-parte-1.pdf`.
2. Abra o original de novo, selecione as páginas do capítulo 2 e divida outra vez.
3. Repita até ter todas as partes.

Renomear cada download na hora evita acabar com vários arquivos chamados `split.pdf`.

## O que continua igual

- **As páginas são copiadas exatamente.** O texto continua pesquisável e as imagens mantêm a qualidade.
- **Tamanho e orientação não mudam.** Uma página na horizontal continua na horizontal.
- **O arquivo original não é alterado.** Você sempre recebe um PDF novo.

Não dá para mudar a ordem durante a divisão; as páginas selecionadas mantêm a sequência original. Se você precisa de outra ordem, extraia as partes separadamente e combine-as como quiser com o [Juntar PDF](tool:merge-pdf). Nosso guia para [juntar PDFs](blog:merge-pdf-files) explica como a ordem funciona lá.

## Privacidade: extrair não é tarjar

Remover páginas é uma boa forma de não compartilhar demais, mas só remove páginas inteiras. Se uma página que você mantém tem um número de conta ou uma assinatura que você não quer mostrar, cobrir com um retângulo preto em um editor nem sempre apaga o texto por baixo. Nosso artigo sobre [erros ao tarjar um PDF](blog:pdf-redaction-mistakes) explica como remover informações sensíveis do jeito certo.

## Combinações úteis

- **Orientação errada?** Corrija páginas de lado com o [Girar PDF](tool:rotate-pdf) antes ou depois de dividir. Veja [como girar páginas de PDF de forma permanente](blog:rotate-pdf-pages).
- **Precisa da página como imagem?** Se um site pede uma imagem em vez de um PDF, exporte a página com o [PDF para JPG](tool:pdf-to-jpg).
- **Grande demais para converter?** A ferramenta PDF para Word aceita arquivos de até 25 MB. Dividir um documento longo em partes mantém cada conversão dentro desse limite.

## Checklist rápido

- As miniaturas ajudam, mas amplie páginas parecidas, como as de um extrato, antes de desmarcar.
- Confira o número de páginas do novo arquivo.
- Renomeie o resultado para dizer o que ele contém.
- Guarde o PDF original até ter certeza de que o arquivo extraído está completo.
