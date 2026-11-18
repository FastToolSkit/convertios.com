---
category: qr-web
type: guide
published: 2026-11-18
order: 184
status: published
cover_image: qr-code-print-size
cover: QR ↔ 2 cm
tools: qr-generator, link-shortener
related: qr-codes-for-business, qr-code-png-vs-svg
keyword: minimum qr code size for printing
intent: informational
---
=== en ===
cover_alt: Printed QR samples measured with a ruler
title: What size should a printed QR code be? Distance, density and testing
seo_title: QR code print size: how big should it be?
description: Choose QR code print size from scanning distance and content length, plus quiet-zone, contrast and placement rules that make printed codes scan first time.
dek: Too small and phones struggle; too big and it dominates the design. The right size depends mostly on how far away people will stand and how much data the code contains.
---
## Two things decide the size

1. **Scanning distance.** A code on a business card is scanned from a hand's length away; a code on a shop window from a metre or two.
2. **Density.** Longer content needs more modules (the small squares). With more modules in the same space, each module gets smaller and harder for cameras to resolve.

A widely used rule of thumb is that the code's width should be **at least about one tenth of the scanning distance**. It is a starting point, not a standard, so always test.

| Scanning distance | Suggested minimum width |
| --- | --- |
| 20–30 cm (card, flyer in hand) | 2–3 cm |
| 50 cm (table tent, menu) | 5 cm |
| 1 m (poster, counter sign) | 10 cm |
| 2–3 m (window, wall sign) | 20–30 cm |
| Across a room or street | Test with real phones; often much larger |

For codes containing long URLs, go larger than the table suggests.

## Reduce density where you can

- **Shorter content makes simpler codes.** A short, clean URL such as `yourshop.com/menu` creates fewer modules than a long link full of tracking parameters.
- The Convertios [QR Code Generator](tool:qr-generator) warns if text is too long for one QR code. For long links, the [Link Shortener](tool:link-shortener) can help, but remember that short links rely on an external service.
- The generator uses medium error correction, a balance between robustness and density.

## The quiet zone is part of the size

QR codes need a clear margin around them, at least four modules wide. The Convertios PNG and SVG downloads include it. When placing the code in a design:

- do not crop the white border,
- do not let text, photos or patterns touch it,
- count the quiet zone as part of the space you reserve.

## Print quality matters

- **Contrast:** black or very dark modules on white or a very light background.
- **Sharpness:** for print, use the SVG download or the 1024-pixel PNG at its native size or smaller. Do not enlarge a small screenshot of a code.
- **Material:** glossy laminate can reflect light; matte finishes scan more reliably. Avoid printing across folds, curves or textured surfaces.
- **No distortion:** always scale proportionally.

Our guide to [PNG versus SVG for QR codes](blog:qr-code-png-vs-svg) explains which file to send to a printer.

## Worked examples

- **Restaurant table card,** scanned from about 40 cm: a 4 to 5 cm code with a short menu URL works comfortably.
- **A4 poster on a noticeboard,** scanned from about 1 m: aim for 10 cm or more, and keep the call to action close to the code.
- **Shop window decal,** scanned from the pavement 2 m away: 20 cm or larger, on a matte background, at chest height.

## Test like a customer

1. Print a proof at the exact final size.
2. Stand where customers will stand, not closer.
3. Scan with an older phone as well as a new one, using the default camera app.
4. Try in the real lighting conditions.

If any test phone hesitates, make the code larger or shorten the content. For planning the whole campaign, see [how to create QR codes for your business](blog:qr-codes-for-business).

=== es ===
cover_alt: Muestras impresas de QR medidas con una regla
title: ¿De qué tamaño imprimir un código QR? Distancia, densidad y pruebas
seo_title: Tamaño de impresión de un código QR: cuánto debe medir
description: Elige el tamaño de un QR según la distancia de escaneo y la longitud del contenido, con reglas de margen, contraste y colocación para que se lea a la primera.
dek: Demasiado pequeño y los móviles tienen problemas; demasiado grande y domina el diseño. El tamaño correcto depende sobre todo de a qué distancia estará la gente y de cuántos datos contiene el código.
---
## Dos cosas deciden el tamaño

1. **La distancia de escaneo.** Un código en una tarjeta de visita se escanea a un palmo; uno en un escaparate, a uno o dos metros.
2. **La densidad.** Un contenido más largo necesita más módulos (los cuadraditos). Con más módulos en el mismo espacio, cada uno es más pequeño y a la cámara le cuesta más distinguirlo.

Una regla práctica muy extendida es que el ancho del código sea **al menos una décima parte de la distancia de escaneo**. Es un punto de partida, no una norma, así que pruébalo siempre.

| Distancia de escaneo | Ancho mínimo orientativo |
| --- | --- |
| 20–30 cm (tarjeta, folleto en la mano) | 2–3 cm |
| 50 cm (expositor de mesa, carta) | 5 cm |
| 1 m (cartel, mostrador) | 10 cm |
| 2–3 m (escaparate, rótulo de pared) | 20–30 cm |
| Al otro lado de una sala o calle | Prueba con móviles reales; suele hacer falta mucho más |

Si el código contiene URL largas, hazlo más grande de lo que indica la tabla.

## Reduce la densidad cuando puedas

- **Un contenido más corto genera códigos más simples.** Una URL corta y limpia como `tutienda.com/carta` crea menos módulos que un enlace largo lleno de parámetros de seguimiento.
- El [Generador de códigos QR](tool:qr-generator) de Convertios avisa si un texto es demasiado largo para un solo QR. Para enlaces largos puede ayudar el [Acortador de enlaces](tool:link-shortener), pero recuerda que los enlaces cortos dependen de un servicio externo.
- El generador usa una corrección de errores media, un equilibrio entre robustez y densidad.

## El margen blanco forma parte del tamaño

Los códigos QR necesitan un margen libre alrededor de al menos cuatro módulos. Las descargas PNG y SVG de Convertios lo incluyen. Al colocar el código en un diseño:

- no recortes el borde blanco,
- no dejes que textos, fotos o tramas lo toquen,
- cuenta el margen como parte del espacio que reservas.

## La calidad de impresión importa

- **Contraste:** módulos negros o muy oscuros sobre blanco o un fondo muy claro.
- **Nitidez:** para imprimir, usa la descarga SVG o el PNG de 1024 píxeles a su tamaño original o menor. No amplíes una captura pequeña de un código.
- **Material:** el plastificado brillante puede reflejar la luz; los acabados mate se leen mejor. Evita imprimir sobre pliegues, curvas o superficies con textura.
- **Sin deformaciones:** escala siempre de forma proporcional.

Nuestra guía sobre [PNG o SVG para códigos QR](blog:qr-code-png-vs-svg) explica qué archivo enviar a la imprenta.

## Ejemplos prácticos

- **Tarjeta de mesa de restaurante,** escaneada a unos 40 cm: un código de 4 a 5 cm con una URL corta de la carta funciona con holgura.
- **Cartel A4 en un tablón,** escaneado a 1 m: apunta a 10 cm o más y deja la llamada a la acción cerca del código.
- **Vinilo de escaparate,** escaneado desde la acera a 2 m: 20 cm o más, sobre fondo mate y a la altura del pecho.

## Pruébalo como lo haría un cliente

1. Imprime una prueba al tamaño final exacto.
2. Colócate donde estarán los clientes, no más cerca.
3. Escanea con un móvil antiguo además de uno nuevo, con la app de cámara predeterminada.
4. Prueba con la iluminación real.

Si algún móvil duda, agranda el código o acorta el contenido. Para planificar toda la campaña, consulta [cómo crear códigos QR para tu negocio](blog:qr-codes-for-business).

=== ar ===
cover_alt: عينات QR مطبوعة تقاس بمسطرة
title: ما الحجم المناسب لطباعة رمز QR؟ المسافة والكثافة والاختبار
seo_title: حجم طباعة رمز QR: كم يجب أن يكون؟
description: طريقة عملية لاختيار حجم رمز QR المطبوع وفق مسافة المسح وطول المحتوى، مع قواعد الهامش والتباين والموضع التي تجعل الرمز يُقرأ من أول مرة.
dek: إن كان صغيراً جداً تتعثر الهواتف، وإن كان كبيراً جداً طغى على التصميم. يعتمد الحجم الصحيح أساساً على بُعد الناس عنه وكمية البيانات التي يحتويها.
---
## أمران يحددان الحجم

1. **مسافة المسح.** يُمسح الرمز على بطاقة العمل من مسافة اليد، أما الرمز على واجهة المحل فمن متر أو مترين.
2. **الكثافة.** يحتاج المحتوى الأطول إلى وحدات أكثر (المربعات الصغيرة)، ومع وحدات أكثر في المساحة نفسها تصغر كل وحدة ويصعب على الكاميرا تمييزها.

من القواعد العملية الشائعة أن يكون عرض الرمز **عُشر مسافة المسح تقريباً على الأقل**. هذه نقطة بداية لا معيار، فاختبر دائماً.

| مسافة المسح | الحد الأدنى المقترح للعرض |
| --- | --- |
| 20–30 سم (بطاقة أو مطوية في اليد) | 2–3 سم |
| 50 سم (حامل طاولة أو قائمة طعام) | 5 سم |
| 1 متر (ملصق أو لافتة على الطاولة) | 10 سم |
| 2–3 أمتار (واجهة أو لافتة جدارية) | 20–30 سم |
| عبر قاعة أو شارع | اختبر بهواتف حقيقية، وغالباً تحتاج إلى حجم أكبر بكثير |

للرموز التي تحتوي روابط طويلة اجعل الحجم أكبر مما يقترحه الجدول.

## قلّل الكثافة متى أمكن

- **المحتوى الأقصر يصنع رموزاً أبسط.** الرابط القصير النظيف مثل `yourshop.com/menu` ينشئ وحدات أقل من رابط طويل مليء بمعاملات التتبع.
- ينبّه [مولد رموز QR](tool:qr-generator) في Convertios إذا كان النص أطول من أن يتسع له رمز واحد. وللروابط الطويلة قد تساعد أداة [اختصار الروابط](tool:link-shortener)، مع تذكّر أن الروابط المختصرة تعتمد على خدمة خارجية.
- يستخدم المولد مستوى متوسطاً لتصحيح الأخطاء، وهو توازن بين المتانة والكثافة.

## الهامش الأبيض جزء من الحجم

تحتاج رموز QR إلى هامش فارغ حولها لا يقل عن أربع وحدات، وتتضمنه ملفات PNG وSVG من Convertios. وعند وضع الرمز في تصميم:

- لا تقص الحد الأبيض،
- لا تدع النصوص أو الصور أو الزخارف تلامسه،
- احسب الهامش ضمن المساحة التي تخصصها.

## جودة الطباعة مهمة

- **التباين:** وحدات سوداء أو داكنة جداً على خلفية بيضاء أو فاتحة جداً.
- **الحدة:** للطباعة استخدم ملف SVG أو ملف PNG بعرض 1024 بكسل بحجمه الأصلي أو أصغر، ولا تكبّر لقطة شاشة صغيرة لرمز.
- **المادة:** قد يعكس التغليف اللامع الضوء، والتشطيبات غير اللامعة أسهل في القراءة. تجنب الطباعة على الطيات أو الانحناءات أو الأسطح الخشنة.
- **دون تشويه:** كبّر وصغّر دائماً بتناسب.

يشرح دليلنا عن [PNG أم SVG لرموز QR](blog:qr-code-png-vs-svg) أي ملف ترسله إلى المطبعة.

## أمثلة عملية

- **بطاقة طاولة في مطعم** تُمسح من نحو 40 سم: رمز بعرض 4 إلى 5 سم مع رابط قصير لقائمة الطعام يعمل بارتياح.
- **ملصق A4 على لوحة إعلانات** يُمسح من متر: استهدف 10 سم أو أكثر، وأبقِ الدعوة للتصرف قريبة من الرمز.
- **ملصق على واجهة محل** يُمسح من الرصيف على بعد مترين: 20 سم أو أكثر، على خلفية غير لامعة وعلى مستوى الصدر.

## اختبره كما يفعل العميل

1. اطبع نسخة تجريبية بالحجم النهائي بالضبط.
2. قف حيث سيقف العملاء لا أقرب.
3. امسح بهاتف قديم إلى جانب هاتف حديث باستخدام تطبيق الكاميرا الافتراضي.
4. جرّب في ظروف الإضاءة الحقيقية.

إن تردد أي هاتف في القراءة فكبّر الرمز أو اختصر المحتوى. ولتخطيط الحملة كاملة راجع [كيف تنشئ رموز QR لنشاطك التجاري](blog:qr-codes-for-business).

=== pt-br ===
cover_alt: Amostras impressas de QR medidas com régua
title: De que tamanho imprimir um QR Code? Distância, densidade e testes
seo_title: Tamanho de impressão do QR Code: qual deve ser?
description: Um jeito prático de escolher o tamanho do QR Code pela distância de leitura e pelo tamanho do conteúdo, com regras de margem, contraste e posição para ler de primeira.
dek: Pequeno demais e o celular sofre; grande demais e ele domina o design. O tamanho certo depende principalmente de quão longe as pessoas vão ficar e de quantos dados o código contém.
---
## Duas coisas definem o tamanho

1. **Distância de leitura.** Um código em cartão de visita é lido a um palmo; um código em vitrine, a um ou dois metros.
2. **Densidade.** Conteúdos mais longos precisam de mais módulos (os quadradinhos). Com mais módulos no mesmo espaço, cada um fica menor e mais difícil para a câmera distinguir.

Uma regra prática bem difundida é que a largura do código seja **pelo menos cerca de um décimo da distância de leitura**. É um ponto de partida, não uma norma, então teste sempre.

| Distância de leitura | Largura mínima sugerida |
| --- | --- |
| 20–30 cm (cartão, panfleto na mão) | 2–3 cm |
| 50 cm (display de mesa, cardápio) | 5 cm |
| 1 m (cartaz, balcão) | 10 cm |
| 2–3 m (vitrine, placa de parede) | 20–30 cm |
| Do outro lado de uma sala ou rua | Teste com celulares de verdade; muitas vezes precisa ser bem maior |

Se o código tiver URLs longas, faça maior do que a tabela sugere.

## Reduza a densidade quando puder

- **Conteúdo mais curto gera códigos mais simples.** Uma URL curta e limpa como `sualoja.com.br/cardapio` cria menos módulos do que um link longo cheio de parâmetros de rastreamento.
- O [Gerador de QR Code](tool:qr-generator) da Convertios avisa se o texto for longo demais para um único QR. Para links longos, o [Encurtador de links](tool:link-shortener) pode ajudar, mas lembre que links curtos dependem de um serviço externo.
- O gerador usa correção de erros média, um equilíbrio entre robustez e densidade.

## A margem branca faz parte do tamanho

QR Codes precisam de uma margem livre em volta de pelo menos quatro módulos. Os downloads em PNG e SVG da Convertios já incluem essa margem. Ao posicionar o código no design:

- não recorte a borda branca,
- não deixe textos, fotos ou estampas encostarem nela,
- conte a margem como parte do espaço reservado.

## A qualidade de impressão importa

- **Contraste:** módulos pretos ou bem escuros sobre branco ou fundo bem claro.
- **Nitidez:** para impressão, use o SVG ou o PNG de 1024 pixels no tamanho original ou menor. Não amplie uma captura de tela pequena de um código.
- **Material:** laminação brilhante pode refletir luz; acabamentos foscos são lidos com mais facilidade. Evite imprimir sobre dobras, curvas ou superfícies texturizadas.
- **Sem distorção:** redimensione sempre proporcionalmente.

Nosso guia sobre [PNG ou SVG para QR Codes](blog:qr-code-png-vs-svg) explica qual arquivo mandar para a gráfica.

## Exemplos práticos

- **Display de mesa de restaurante,** lido a uns 40 cm: um código de 4 a 5 cm com uma URL curta do cardápio funciona com folga.
- **Cartaz A4 em um mural,** lido a 1 m: mire em 10 cm ou mais e deixe a chamada para ação perto do código.
- **Adesivo de vitrine,** lido da calçada a 2 m: 20 cm ou mais, em fundo fosco e na altura do peito.

## Teste como um cliente

1. Imprima uma prova no tamanho final exato.
2. Fique onde os clientes vão ficar, não mais perto.
3. Escaneie com um celular antigo além de um novo, usando o app de câmera padrão.
4. Teste na iluminação real.

Se algum celular hesitar, aumente o código ou encurte o conteúdo. Para planejar a campanha toda, veja [como criar QR Codes para o seu negócio](blog:qr-codes-for-business).
