---
category: images-formats
type: news
published: 2026-11-18
order: 180
status: published
cover: .jxl in Chrome 155
tools: image-converter, compress-image
related: avif-vs-webp-vs-jpeg-xl, jpg-png-webp-guide
event_date: 2026-10-06
news_status: released
keyword: JPEG XL Chrome 155
intent: news
source: Chrome for Developers: Shipping JPEG XL in Chrome | https://developer.chrome.com/blog/jpeg-xl-in-chrome | 2026-10-06
source: Chrome for Developers: Chrome 155 beta | https://developer.chrome.com/blog/chrome-155-beta | 2026-09-16
---
=== en ===
title: Chrome 155 brings JPEG XL back: what it means for your images
seo_title: Chrome 155 adds JPEG XL support
description: Chrome now decodes JPEG XL images by default, using a new Rust decoder. What JPEG XL offers, what changed, and whether you should start using .jxl files.
dek: Google removed experimental JPEG XL support from Chrome in early 2023. With Chrome 155, decoding is back and switched on by default, built on a memory-safe decoder written in Rust.
---
## What happened

Google announced on its Chrome for Developers blog on 6 October 2026 that Chrome is shipping decoding support for the JPEG XL (.jxl) image format starting from Chrome 155. The Chrome 155 beta notes, published on 16 September 2026, describe the change as JPEG XL decoding in Blink, Chrome's rendering engine, using **jxl-rs**, a decoder written entirely in the Rust programming language. The beta notes list Android, ChromeOS, Linux, macOS and Windows as the platforms for the release.

In practice this means a website can serve .jxl images and Chrome users will see them without enabling any experimental setting.

## Why the decoder matters

Image decoders process complex files straight from the internet, which makes them a common target for attacks. Google says it chose a pure Rust implementation to remove whole classes of memory-safety bugs at the source, rather than relying only on Chrome's sandbox. The team also reports extensive work to make the Rust decoder fast enough to compete with the existing C++ library.

## What JPEG XL offers

JPEG XL is standardised as ISO/IEC 18181. According to the Chrome team, its features include:

- **Progressive decoding**, so a recognisable image appears early while the rest loads.
- **Wide colour gamut, HDR and high bit depth**, useful for modern cameras and displays.
- **Animation**.
- **Lossless compression**, and the ability to repackage existing JPEG files losslessly into a smaller JPEG XL file.

Google's announcement claims 30–50% better compression than JPEG. That is the Chrome team's figure; actual savings depend on the image and the settings used. Google does not present JPEG XL as a replacement for AVIF. It recommends trying both, and expects JPEG XL to be most useful for high-fidelity or lossless compression, especially of photographs, and where fine-grained progressive loading is wanted.

## Should you switch to .jxl?

Not on its own yet, for most people:

- **Website owners** can start offering JPEG XL alongside a fallback, using the HTML `<picture>` element so browsers that cannot display .jxl receive JPEG, WebP or AVIF instead.
- **Everyday users** should keep sharing photos as JPG or PNG. Messaging apps, email clients, office software and older devices may not open .jxl files.
- **Photographers** interested in lossless archiving can experiment, but should keep originals in established formats until their editing and backup tools fully support JPEG XL.

For an overview of the trade-offs, see our comparison of [AVIF, WebP and JPEG XL](blog:avif-vs-webp-vs-jpeg-xl) and the practical [JPG, PNG and WebP guide](blog:jpg-png-webp-guide).

## Does Convertios support JPEG XL?

Not at present. The [Image Converter](tool:image-converter) outputs JPG, PNG, WEBP, BMP and GIF, and the [Image Compressor](tool:compress-image) works with JPG, PNG and WEBP. Neither creates .jxl files, and we have not tested or listed JPEG XL as a supported input. We will review this as support across browsers and operating systems matures.

=== es ===
title: Chrome 155 recupera JPEG XL: qué supone para tus imágenes
seo_title: Chrome 155 añade soporte para JPEG XL
description: Chrome ya decodifica imágenes JPEG XL por defecto con un nuevo decodificador en Rust. Qué ofrece JPEG XL, qué ha cambiado y si conviene usar archivos .jxl.
dek: Google retiró el soporte experimental de JPEG XL de Chrome a principios de 2023. Con Chrome 155 la decodificación vuelve activada por defecto, basada en un decodificador seguro para la memoria escrito en Rust.
---
## Qué ha pasado

Google anunció en su blog Chrome for Developers, el 6 de octubre de 2026, que Chrome incorpora la decodificación del formato de imagen JPEG XL (.jxl) a partir de Chrome 155. Las notas de la beta de Chrome 155, publicadas el 16 de septiembre de 2026, describen el cambio como decodificación de JPEG XL en Blink, el motor de renderizado de Chrome, mediante **jxl-rs**, un decodificador escrito íntegramente en el lenguaje Rust. Las notas indican Android, ChromeOS, Linux, macOS y Windows como plataformas de la versión.

En la práctica, una web puede servir imágenes .jxl y los usuarios de Chrome las verán sin activar ningún ajuste experimental.

## Por qué importa el decodificador

Los decodificadores de imágenes procesan archivos complejos que llegan directamente de internet, por lo que son un objetivo habitual de ataques. Google explica que eligió una implementación pura en Rust para eliminar de raíz clases enteras de errores de memoria, en lugar de depender solo del aislamiento (sandbox) de Chrome. El equipo también describe un trabajo amplio para que el decodificador en Rust sea tan rápido como la biblioteca existente en C++.

## Qué ofrece JPEG XL

JPEG XL está normalizado como ISO/IEC 18181. Según el equipo de Chrome, entre sus funciones están:

- **Decodificación progresiva**, de modo que aparece pronto una imagen reconocible mientras se carga el resto.
- **Gama de color amplia, HDR y alta profundidad de bits**, útiles para cámaras y pantallas modernas.
- **Animación**.
- **Compresión sin pérdida**, y la posibilidad de reempaquetar sin pérdida archivos JPEG existentes en un JPEG XL más pequeño.

El anuncio de Google afirma una compresión entre un 30 % y un 50 % mejor que JPEG. Es la cifra del equipo de Chrome; el ahorro real depende de la imagen y de los ajustes. Google no presenta JPEG XL como sustituto de AVIF: recomienda probar ambos y prevé que JPEG XL será más útil en compresión de alta fidelidad o sin pérdida, sobre todo en fotografías, y cuando interese una carga progresiva muy gradual.

## ¿Deberías pasarte a .jxl?

Para la mayoría, todavía no como única opción:

- **Quien gestiona una web** puede empezar a ofrecer JPEG XL con una alternativa, usando el elemento HTML `<picture>` para que los navegadores que no muestran .jxl reciban JPEG, WebP o AVIF.
- **En el uso diario**, sigue compartiendo fotos en JPG o PNG. Aplicaciones de mensajería, clientes de correo, programas de oficina y dispositivos antiguos pueden no abrir archivos .jxl.
- **Los fotógrafos** interesados en archivar sin pérdida pueden experimentar, pero conviene guardar los originales en formatos asentados hasta que sus herramientas de edición y copia de seguridad admitan JPEG XL por completo.

Para ver las ventajas e inconvenientes, consulta nuestra comparativa de [AVIF, WebP y JPEG XL](blog:avif-vs-webp-vs-jpeg-xl) y la [guía práctica de JPG, PNG y WebP](blog:jpg-png-webp-guide).

## ¿Convertios admite JPEG XL?

Por ahora no. El [Convertidor de imágenes](tool:image-converter) genera JPG, PNG, WEBP, BMP y GIF, y el [Compresor de imágenes](tool:compress-image) trabaja con JPG, PNG y WEBP. Ninguno crea archivos .jxl, y no hemos probado ni anunciado JPEG XL como formato de entrada admitido. Lo revisaremos a medida que madure el soporte en navegadores y sistemas operativos.

=== ar ===
title: Chrome 155 يعيد JPEG XL: ماذا يعني ذلك لصورك
seo_title: Chrome 155 يضيف دعم JPEG XL
description: أصبح Chrome يفك ترميز صور JPEG XL افتراضياً عبر فاك ترميز جديد مكتوب بلغة Rust. ما الذي تقدمه الصيغة، وما الذي تغيّر، وهل تبدأ باستخدام ملفات ‎.jxl.
dek: أزالت Google الدعم التجريبي لصيغة JPEG XL من Chrome في أوائل 2023. ومع Chrome 155 عاد فك الترميز مفعلاً افتراضياً، معتمداً على فاك ترميز آمن للذاكرة مكتوب بلغة Rust.
---
## ماذا حدث

أعلنت Google في مدونة Chrome for Developers في 6 أكتوبر 2026 أن Chrome يدعم فك ترميز صيغة الصور JPEG XL (‎.jxl) بدءاً من الإصدار 155. وتصف ملاحظات النسخة التجريبية من Chrome 155، المنشورة في 16 سبتمبر 2026، هذا التغيير بأنه فك ترميز JPEG XL في Blink، محرك العرض في Chrome، باستخدام **jxl-rs**، وهو فاك ترميز مكتوب بالكامل بلغة البرمجة Rust. وتذكر الملاحظات أنظمة Android وChromeOS وLinux وmacOS وWindows منصاتٍ للإصدار.

وعملياً يعني ذلك أن المواقع تستطيع تقديم صور ‎.jxl وسيراها مستخدمو Chrome دون تفعيل أي إعداد تجريبي.

## لماذا يهم فاك الترميز

تعالج فاكّات ترميز الصور ملفات معقدة تصل مباشرة من الإنترنت، ما يجعلها هدفاً شائعاً للهجمات. وتقول Google إنها اختارت تطبيقاً مكتوباً بالكامل بلغة Rust لإزالة فئات كاملة من أخطاء أمان الذاكرة من جذورها، بدلاً من الاعتماد على عزل Chrome وحده. كما يتحدث الفريق عن عمل واسع لجعل فاك الترميز الجديد سريعاً بما يكفي لمنافسة المكتبة الحالية المكتوبة بلغة C++.

## ماذا تقدم صيغة JPEG XL

صيغة JPEG XL معتمدة معياراً باسم ISO/IEC 18181. وبحسب فريق Chrome تشمل ميزاتها:

- **فك الترميز التدريجي** فتظهر صورة يمكن تمييزها مبكراً بينما يُحمَّل الباقي.
- **نطاق ألوان واسع وHDR وعمق بت مرتفع**، وهي مفيدة للكاميرات والشاشات الحديثة.
- **الصور المتحركة**.
- **الضغط دون فقد**، وإمكانية إعادة تغليف ملفات JPEG الحالية دون فقد في ملف JPEG XL أصغر.

ويذكر إعلان Google ضغطاً أفضل من JPEG بنسبة 30 إلى 50 في المئة. وهذا رقم فريق Chrome، أما التوفير الفعلي فيعتمد على الصورة والإعدادات. ولا تقدم Google صيغة JPEG XL بديلاً عن AVIF، بل توصي بتجربة الاثنين، وتتوقع أن تكون JPEG XL أكثر فائدة في الضغط عالي الدقة أو دون فقد، خاصة للصور الفوتوغرافية، وحين يُرغب في تحميل تدريجي دقيق.

## هل تنتقل إلى ‎.jxl؟

ليس وحدها بعد بالنسبة إلى معظم الناس:

- **أصحاب المواقع** يمكنهم البدء بتقديم JPEG XL مع بديل احتياطي باستخدام عنصر HTML ‏`<picture>`، فتتلقى المتصفحات التي لا تعرض ‎.jxl صيغة JPEG أو WebP أو AVIF.
- **في الاستخدام اليومي** واصل مشاركة الصور بصيغة JPG أو PNG، فقد لا تفتح تطبيقات المراسلة وبرامج البريد والمكتب والأجهزة القديمة ملفات ‎.jxl.
- **المصورون** المهتمون بالأرشفة دون فقد يمكنهم التجربة، مع الاحتفاظ بالأصول في صيغ راسخة حتى تدعم أدوات التحرير والنسخ الاحتياطي لديهم JPEG XL بالكامل.

ولمعرفة المزايا والعيوب راجع مقارنتنا بين [AVIF وWebP وJPEG XL](blog:avif-vs-webp-vs-jpeg-xl) و[الدليل العملي لصيغ JPG وPNG وWebP](blog:jpg-png-webp-guide).

## هل يدعم Convertios صيغة JPEG XL؟

ليس حالياً. ينتج [محوّل الصور](tool:image-converter) صيغ JPG وPNG وWEBP وBMP وGIF، وتعمل أداة [ضغط الصور](tool:compress-image) مع JPG وPNG وWEBP. ولا تنشئ أي منهما ملفات ‎.jxl، ولم نختبر JPEG XL أو ندرجها صيغة إدخال مدعومة. وسنراجع ذلك مع نضوج الدعم في المتصفحات وأنظمة التشغيل.

=== pt-br ===
title: Chrome 155 traz o JPEG XL de volta: o que muda para suas imagens
seo_title: Chrome 155 adiciona suporte a JPEG XL
description: O Chrome agora decodifica imagens JPEG XL por padrão, com um novo decodificador em Rust. O que o JPEG XL oferece, o que mudou e se vale usar arquivos .jxl.
dek: O Google removeu o suporte experimental ao JPEG XL do Chrome no início de 2023. Com o Chrome 155, a decodificação volta ativada por padrão, baseada em um decodificador seguro para a memória escrito em Rust.
---
## O que aconteceu

O Google anunciou no blog Chrome for Developers, em 6 de outubro de 2026, que o Chrome passa a decodificar o formato de imagem JPEG XL (.jxl) a partir do Chrome 155. As notas do beta do Chrome 155, publicadas em 16 de setembro de 2026, descrevem a mudança como decodificação de JPEG XL no Blink, o mecanismo de renderização do Chrome, usando o **jxl-rs**, um decodificador escrito inteiramente na linguagem Rust. As notas listam Android, ChromeOS, Linux, macOS e Windows como plataformas da versão.

Na prática, um site pode servir imagens .jxl e quem usa o Chrome vai vê-las sem ativar nenhuma configuração experimental.

## Por que o decodificador importa

Decodificadores de imagem processam arquivos complexos vindos direto da internet, o que os torna alvo comum de ataques. O Google diz que escolheu uma implementação pura em Rust para eliminar na origem classes inteiras de falhas de segurança de memória, em vez de depender só do isolamento (sandbox) do Chrome. A equipe também relata um grande trabalho para deixar o decodificador em Rust rápido o bastante para competir com a biblioteca existente em C++.

## O que o JPEG XL oferece

O JPEG XL é padronizado como ISO/IEC 18181. Segundo a equipe do Chrome, seus recursos incluem:

- **Decodificação progressiva**, para que uma imagem reconhecível apareça cedo enquanto o resto carrega.
- **Gama de cores ampla, HDR e alta profundidade de bits**, úteis para câmeras e telas modernas.
- **Animação**.
- **Compressão sem perdas**, e a possibilidade de reempacotar arquivos JPEG existentes sem perdas em um JPEG XL menor.

O anúncio do Google fala em compressão de 30% a 50% melhor que a do JPEG. É o número da equipe do Chrome; a economia real depende da imagem e dos ajustes. O Google não apresenta o JPEG XL como substituto do AVIF: recomenda testar os dois e espera que o JPEG XL seja mais útil em compressão de alta fidelidade ou sem perdas, principalmente de fotografias, e quando se quer carregamento progressivo bem gradual.

## Vale mudar para .jxl?

Para a maioria das pessoas, ainda não como única opção:

- **Quem cuida de um site** pode começar a oferecer JPEG XL com uma alternativa, usando o elemento HTML `<picture>` para que navegadores que não exibem .jxl recebam JPEG, WebP ou AVIF.
- **No dia a dia**, continue compartilhando fotos em JPG ou PNG. Aplicativos de mensagens, clientes de e-mail, programas de escritório e aparelhos antigos podem não abrir arquivos .jxl.
- **Fotógrafos** interessados em arquivar sem perdas podem testar, mas devem manter os originais em formatos consolidados até que suas ferramentas de edição e backup suportem JPEG XL por completo.

Para ver os prós e contras, confira nossa comparação entre [AVIF, WebP e JPEG XL](blog:avif-vs-webp-vs-jpeg-xl) e o [guia prático de JPG, PNG e WebP](blog:jpg-png-webp-guide).

## A Convertios suporta JPEG XL?

Ainda não. O [Conversor de imagens](tool:image-converter) gera JPG, PNG, WEBP, BMP e GIF, e o [Compressor de imagens](tool:compress-image) trabalha com JPG, PNG e WEBP. Nenhum dos dois cria arquivos .jxl, e não testamos nem listamos o JPEG XL como formato de entrada suportado. Vamos rever isso conforme o suporte em navegadores e sistemas operacionais amadurecer.
