---
category: pdf-documents
type: guide
published: 2026-11-18
order: 152
status: published
cover: PDF/A · ISO 19005
tools: merge-pdf, pdf-to-word, split-pdf
related: pdf-vs-docx, pdf-upload-requirements, file-naming-and-organizing
keyword: pdf/a archiving
intent: informational
---
=== en ===
title: PDF/A explained: saving documents so they still open in 20 years
seo_title: PDF/A explained: archiving documents
description: What PDF/A is, how it differs from a normal PDF, the versions and conformance levels, how to create one in common office apps, and when you actually need it.
dek: A normal PDF usually opens fine years later, but it may depend on fonts, links or features that will not survive. PDF/A is the version of PDF designed for long-term archiving, and some courts, governments and universities require it.
---
## What PDF/A is

PDF/A is an international standard, ISO 19005, that defines a restricted form of PDF for long-term preservation. The idea is simple: everything needed to display the document must be inside the file, and nothing that could stop working later is allowed.

A PDF/A file is still a PDF. It opens in any PDF reader; the difference is in what it contains and what it leaves out.

## What PDF/A requires and forbids

Typical requirements include:

- **All fonts embedded**, so text looks the same on systems that do not have those fonts.
- **Colour defined in a device-independent way**, so colours are reproduced consistently.
- **Metadata in a standard format** (XMP), such as title and author.

And it forbids, among other things:

- **Encryption and passwords**, which could lock the content away.
- **JavaScript and executable actions.**
- **Content loaded from outside the file**, such as linked fonts or external media.
- **Audio and video** in most versions.

## Versions and conformance levels

| Version | Year | Notable points |
| --- | --- | --- |
| PDF/A-1 | 2005 | Based on PDF 1.4; strictest; no transparency or layers |
| PDF/A-2 | 2011 | Based on PDF 1.7; allows transparency, layers and JPEG 2000 |
| PDF/A-3 | 2012 | Like PDF/A-2 but allows embedding other files, such as XML data |
| PDF/A-4 | 2020 | Based on PDF 2.0; simplifies conformance levels |

Older versions also have **conformance levels**: "b" (basic) guarantees the visual appearance; "a" (accessible) adds structure and tagging for accessibility; "u" (Unicode) ensures text can be reliably extracted. Requirements usually name a specific combination, such as "PDF/A-2b".

## When you need it

- **When someone requires it.** Some courts, public authorities, archives and universities ask for PDF/A for filings, theses or records. Their rules decide the version.
- **Records you must keep for many years**, such as contracts, financial documents or research data, where you want the best chance they will display correctly in the future.

For everyday sharing, a normal PDF is fine.

## How to create a PDF/A

- **Microsoft Word:** File → Save As → PDF, then Options → tick the PDF/A compliance option.
- **LibreOffice:** File → Export as PDF → tick "Archive (PDF/A, ISO 19005)" and choose the version.
- **Dedicated PDF software** can convert existing PDFs to PDF/A and report problems.

Converting an existing PDF is harder than exporting from the original, because missing fonts or forbidden features have to be fixed. Exporting from the source document is the most reliable route.

## Checking the result

A file can claim to be PDF/A without meeting the rules. Free validators such as veraPDF check conformance and list problems. If an institution provides its own validator, use that one.

## Convertios and PDF/A

Convertios does not create or validate PDF/A files. Our PDF tools work with standard PDFs: [Merge PDF](tool:merge-pdf) and [Split PDF](tool:split-pdf) run in your browser, and [PDF to Word](tool:pdf-to-word) converts on our server. Merging or splitting a PDF/A file with general tools may produce a file that no longer conforms, so if PDF/A is required, do those steps first and export or convert to PDF/A as the final step.

Whatever format you choose, clear names and more than one backup copy matter as much as the format; see [file naming habits](blog:file-naming-and-organizing).

=== es ===
title: PDF/A explicado: guardar documentos para que se abran dentro de 20 años
seo_title: Qué es PDF/A: archivar documentos
description: Qué es PDF/A, en qué se diferencia de un PDF normal, sus versiones y niveles, cómo crearlo en programas de oficina habituales y cuándo lo necesitas de verdad.
dek: Un PDF normal suele abrirse bien años después, pero puede depender de fuentes, enlaces o funciones que no sobrevivirán. PDF/A es la versión de PDF pensada para el archivo a largo plazo, y algunos tribunales, administraciones y universidades la exigen.
---
## Qué es PDF/A

PDF/A es una norma internacional, ISO 19005, que define una forma restringida de PDF para la conservación a largo plazo. La idea es sencilla: todo lo necesario para mostrar el documento debe estar dentro del archivo, y no se permite nada que pueda dejar de funcionar con el tiempo.

Un archivo PDF/A sigue siendo un PDF. Se abre con cualquier lector; la diferencia está en lo que contiene y lo que deja fuera.

## Qué exige y qué prohíbe

Entre los requisitos habituales:

- **Todas las fuentes incrustadas**, para que el texto se vea igual en sistemas que no las tienen.
- **Color definido de forma independiente del dispositivo**, para reproducirlo con coherencia.
- **Metadatos en un formato estándar** (XMP), como título y autor.

Y prohíbe, entre otras cosas:

- **Cifrado y contraseñas**, que podrían bloquear el contenido.
- **JavaScript y acciones ejecutables.**
- **Contenido cargado desde fuera del archivo**, como fuentes enlazadas o multimedia externa.
- **Audio y vídeo** en la mayoría de versiones.

## Versiones y niveles de conformidad

| Versión | Año | Aspectos destacados |
| --- | --- | --- |
| PDF/A-1 | 2005 | Basada en PDF 1.4; la más estricta; sin transparencias ni capas |
| PDF/A-2 | 2011 | Basada en PDF 1.7; permite transparencias, capas y JPEG 2000 |
| PDF/A-3 | 2012 | Como PDF/A-2, pero permite incrustar otros archivos, como datos XML |
| PDF/A-4 | 2020 | Basada en PDF 2.0; simplifica los niveles de conformidad |

Las versiones anteriores tienen además **niveles de conformidad**: «b» (básico) garantiza el aspecto visual; «a» (accesible) añade estructura y etiquetado para la accesibilidad; «u» (Unicode) asegura que el texto se pueda extraer de forma fiable. Los requisitos suelen indicar una combinación concreta, como «PDF/A-2b».

## Cuándo lo necesitas

- **Cuando te lo exigen.** Algunos tribunales, administraciones, archivos y universidades piden PDF/A para escritos, tesis o expedientes. Sus normas determinan la versión.
- **Documentos que debes guardar muchos años**, como contratos, documentos financieros o datos de investigación, cuando quieres la mejor garantía de que se verán bien en el futuro.

Para compartir en el día a día, un PDF normal es suficiente.

## Cómo crear un PDF/A

- **Microsoft Word:** Archivo → Guardar como → PDF, luego Opciones → marca la opción de compatibilidad con PDF/A.
- **LibreOffice:** Archivo → Exportar como PDF → marca «Archivo (PDF/A, ISO 19005)» y elige la versión.
- **Programas PDF especializados** pueden convertir PDF existentes a PDF/A e informar de los problemas.

Convertir un PDF existente es más difícil que exportar desde el original, porque hay que corregir fuentes que faltan o funciones prohibidas. Exportar desde el documento de origen es lo más fiable.

## Comprobar el resultado

Un archivo puede declararse PDF/A sin cumplir las reglas. Validadores gratuitos como veraPDF comprueban la conformidad y enumeran los problemas. Si la institución ofrece su propio validador, usa ese.

## Convertios y PDF/A

Convertios no crea ni valida archivos PDF/A. Nuestras herramientas trabajan con PDF estándar: [Unir PDF](tool:merge-pdf) y [Dividir PDF](tool:split-pdf) funcionan en tu navegador, y [PDF a Word](tool:pdf-to-word) convierte en nuestro servidor. Unir o dividir un PDF/A con herramientas generales puede dar un archivo que ya no cumple la norma, así que, si te exigen PDF/A, haz antes esos pasos y deja la exportación o conversión a PDF/A para el final.

Sea cual sea el formato, los nombres claros y tener más de una copia de seguridad importan tanto como el formato; consulta [hábitos para nombrar archivos](blog:file-naming-and-organizing).

=== ar ===
title: شرح PDF/A: حفظ المستندات لتُفتح بعد 20 عاماً
seo_title: ما هو PDF/A: أرشفة المستندات
description: ما صيغة PDF/A، وكيف تختلف عن PDF العادي، وما إصداراتها ومستويات مطابقتها، وكيف تنشئها في تطبيقات المكتب الشائعة، ومتى تحتاج إليها فعلاً.
dek: يُفتح ملف PDF العادي غالباً دون مشكلة بعد سنوات، لكنه قد يعتمد على خطوط أو روابط أو ميزات لن تدوم. وصيغة PDF/A هي نسخة PDF المصممة للأرشفة الطويلة، وتشترطها بعض المحاكم والجهات الحكومية والجامعات.
---
## ما هي PDF/A

صيغة PDF/A معيار دولي برقم ISO 19005 يحدد شكلاً مقيداً من PDF للحفظ طويل الأمد. والفكرة بسيطة: يجب أن يكون كل ما يلزم لعرض المستند داخل الملف، ولا يُسمح بأي شيء قد يتوقف عن العمل لاحقاً.

ويبقى ملف PDF/A ملف PDF يُفتح في أي قارئ، والفرق في ما يحتويه وما يستبعده.

## ما تشترطه وما تمنعه

من المتطلبات المعتادة:

- **تضمين كل الخطوط** كي يظهر النص بالشكل نفسه على الأنظمة التي لا تحتوي تلك الخطوط.
- **تعريف الألوان بطريقة مستقلة عن الجهاز** لإعادة إنتاجها باتساق.
- **بيانات وصفية بصيغة قياسية** (XMP) مثل العنوان والمؤلف.

وتمنع، من بين أمور أخرى:

- **التشفير وكلمات المرور** التي قد تحجب المحتوى.
- **JavaScript والإجراءات القابلة للتنفيذ.**
- **المحتوى المحمّل من خارج الملف** مثل الخطوط المرتبطة أو الوسائط الخارجية.
- **الصوت والفيديو** في معظم الإصدارات.

## الإصدارات ومستويات المطابقة

| الإصدار | السنة | أبرز النقاط |
| --- | --- | --- |
| PDF/A-1 | 2005 | مبني على PDF 1.4؛ الأكثر صرامة؛ بلا شفافية أو طبقات |
| PDF/A-2 | 2011 | مبني على PDF 1.7؛ يسمح بالشفافية والطبقات وJPEG 2000 |
| PDF/A-3 | 2012 | مثل PDF/A-2 لكنه يسمح بتضمين ملفات أخرى مثل بيانات XML |
| PDF/A-4 | 2020 | مبني على PDF 2.0؛ يبسّط مستويات المطابقة |

وللإصدارات الأقدم **مستويات مطابقة**: المستوى «b» (أساسي) يضمن المظهر المرئي، و«a» (قابل للوصول) يضيف البنية والوسوم لإمكانية الوصول، و«u» (يونيكود) يضمن استخراج النص بموثوقية. وتحدد المتطلبات عادة تركيبة بعينها مثل «PDF/A-2b».

## متى تحتاج إليها

- **حين تُشترط عليك.** تطلب بعض المحاكم والجهات العامة ودور الأرشيف والجامعات صيغة PDF/A للمذكرات أو الرسائل الجامعية أو السجلات، وقواعدها تحدد الإصدار.
- **السجلات التي يجب حفظها سنوات طويلة** مثل العقود والمستندات المالية وبيانات البحث، حين تريد أفضل فرصة لعرضها صحيحاً مستقبلاً.

أما للمشاركة اليومية فملف PDF العادي يكفي.

## كيف تنشئ ملف PDF/A

- **Microsoft Word:** ملف ← حفظ باسم ← PDF، ثم خيارات ← فعّل خيار التوافق مع PDF/A.
- **LibreOffice:** ملف ← تصدير بتنسيق PDF ← فعّل خيار الأرشفة (PDF/A, ISO 19005) واختر الإصدار.
- **برامج PDF المتخصصة** يمكنها تحويل ملفات PDF الحالية إلى PDF/A والإبلاغ عن المشكلات.

وتحويل ملف PDF موجود أصعب من التصدير من الأصل، لأن الخطوط الناقصة أو الميزات الممنوعة يجب إصلاحها. فالتصدير من المستند المصدر هو الطريق الأكثر موثوقية.

## التحقق من النتيجة

قد يدّعي ملف أنه PDF/A دون أن يستوفي القواعد. وتتحقق أدوات مجانية مثل veraPDF من المطابقة وتسرد المشكلات، وإن وفرت الجهة أداة تحقق خاصة بها فاستخدمها.

## Convertios وصيغة PDF/A

لا ينشئ Convertios ملفات PDF/A ولا يتحقق منها، فأدواتنا تعمل مع ملفات PDF القياسية: تعمل أداتا [دمج PDF](tool:merge-pdf) و[تقسيم PDF](tool:split-pdf) داخل متصفحك، وتحوّل أداة [PDF إلى Word](tool:pdf-to-word) على خادمنا. وقد ينتج دمج ملف PDF/A أو تقسيمه بأدوات عامة ملفاً لم يعد مطابقاً، لذا إن كانت PDF/A مطلوبة فأنجز هذه الخطوات أولاً واجعل التصدير أو التحويل إلى PDF/A الخطوة الأخيرة.

وأياً كانت الصيغة، فالأسماء الواضحة ووجود أكثر من نسخة احتياطية مهمان بقدر الصيغة نفسها؛ راجع [عادات تسمية الملفات](blog:file-naming-and-organizing).

=== pt-br ===
title: PDF/A explicado: salvar documentos para que abram daqui a 20 anos
seo_title: O que é PDF/A: arquivar documentos
description: O que é PDF/A, como ele difere de um PDF comum, versões e níveis de conformidade, como criá-lo em programas de escritório comuns e quando você realmente precisa.
dek: Um PDF comum geralmente abre bem anos depois, mas pode depender de fontes, links ou recursos que não vão durar. O PDF/A é a versão do PDF feita para arquivamento de longo prazo, e alguns tribunais, órgãos públicos e universidades a exigem.
---
## O que é PDF/A

PDF/A é um padrão internacional, ISO 19005, que define uma forma restrita de PDF para preservação de longo prazo. A ideia é simples: tudo o que é necessário para exibir o documento precisa estar dentro do arquivo, e nada que possa parar de funcionar depois é permitido.

Um arquivo PDF/A continua sendo um PDF. Ele abre em qualquer leitor; a diferença está no que contém e no que deixa de fora.

## O que o PDF/A exige e proíbe

Entre os requisitos típicos:

- **Todas as fontes incorporadas**, para que o texto pareça igual em sistemas que não têm essas fontes.
- **Cores definidas de forma independente do dispositivo**, para serem reproduzidas com consistência.
- **Metadados em formato padrão** (XMP), como título e autor.

E proíbe, entre outras coisas:

- **Criptografia e senhas**, que poderiam trancar o conteúdo.
- **JavaScript e ações executáveis.**
- **Conteúdo carregado de fora do arquivo**, como fontes vinculadas ou mídia externa.
- **Áudio e vídeo** na maioria das versões.

## Versões e níveis de conformidade

| Versão | Ano | Destaques |
| --- | --- | --- |
| PDF/A-1 | 2005 | Baseada no PDF 1.4; a mais rígida; sem transparência nem camadas |
| PDF/A-2 | 2011 | Baseada no PDF 1.7; permite transparência, camadas e JPEG 2000 |
| PDF/A-3 | 2012 | Como a PDF/A-2, mas permite incorporar outros arquivos, como dados XML |
| PDF/A-4 | 2020 | Baseada no PDF 2.0; simplifica os níveis de conformidade |

As versões mais antigas também têm **níveis de conformidade**: "b" (básico) garante a aparência visual; "a" (acessível) acrescenta estrutura e marcação para acessibilidade; "u" (Unicode) garante que o texto possa ser extraído com confiança. Os requisitos costumam citar uma combinação específica, como "PDF/A-2b".

## Quando você precisa

- **Quando alguém exige.** Alguns tribunais, órgãos públicos, arquivos e universidades pedem PDF/A para petições, teses ou registros. As regras deles definem a versão.
- **Registros que você precisa guardar por muitos anos**, como contratos, documentos financeiros ou dados de pesquisa, quando você quer a melhor chance de que sejam exibidos corretamente no futuro.

Para o compartilhamento do dia a dia, um PDF comum basta.

## Como criar um PDF/A

- **Microsoft Word:** Arquivo → Salvar como → PDF, depois Opções → marque a opção de compatibilidade com PDF/A.
- **LibreOffice:** Arquivo → Exportar como PDF → marque "Arquivamento (PDF/A, ISO 19005)" e escolha a versão.
- **Programas de PDF especializados** podem converter PDFs existentes em PDF/A e apontar problemas.

Converter um PDF existente é mais difícil do que exportar a partir do original, porque fontes ausentes ou recursos proibidos precisam ser corrigidos. Exportar do documento de origem é o caminho mais confiável.

## Verificando o resultado

Um arquivo pode se declarar PDF/A sem cumprir as regras. Validadores gratuitos como o veraPDF verificam a conformidade e listam os problemas. Se a instituição oferecer um validador próprio, use esse.

## A Convertios e o PDF/A

A Convertios não cria nem valida arquivos PDF/A. Nossas ferramentas trabalham com PDFs padrão: o [Juntar PDF](tool:merge-pdf) e o [Dividir PDF](tool:split-pdf) rodam no navegador, e o [PDF para Word](tool:pdf-to-word) converte no nosso servidor. Juntar ou dividir um PDF/A com ferramentas gerais pode gerar um arquivo que não está mais em conformidade; então, se o PDF/A for exigido, faça essas etapas antes e deixe a exportação ou conversão para PDF/A como último passo.

Seja qual for o formato, nomes claros e mais de uma cópia de backup importam tanto quanto o formato; veja [hábitos para nomear arquivos](blog:file-naming-and-organizing).
