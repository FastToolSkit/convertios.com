---
category: ai-technology
type: guide
published: 2026-11-18
order: 168
status: published
cover_image: how-ai-background-removal-works
cover: Subject / Mask
tools: remove-bg, image-resizer, compress-image
related: remove-background-clean-cutouts, webassembly-browser-tools
keyword: how ai background removal works
intent: informational
---
=== en ===
cover_alt: Headphones isolated against a transparency grid
title: How AI background removal works, and why hair and glass are hard
seo_title: How AI background removal works
description: Background removers use segmentation models to separate a subject. How the mask is made, why some edges fail and what running the model in a browser means.
dek: One click and the background disappears. Behind that click, a neural network decides for every pixel whether it belongs to the subject. Understanding how it decides explains both the impressive results and the frustrating ones.
---
## The task: a mask for every pixel

Removing a background means producing a **mask**: a greyscale map the same size as the photo, where white means "keep", black means "remove" and grey means "partly transparent". The mask is then applied as an alpha channel, and the result is saved in a format that supports transparency, usually PNG.

Doing this by hand means tracing edges with a pen tool. AI tools generate the mask automatically.

## How the model decides

Background removal uses **image segmentation** models, a kind of neural network trained on many thousands of images in which people have carefully marked the foreground. During training, the network learns patterns that tend to belong to a main subject, such as people, animals and products, and patterns that usually belong to backgrounds.

When you run it on a new photo, the model:

1. Scales the image to the size it was trained on.
2. Predicts, for each position, how likely it is to be foreground.
3. Produces a soft mask with smooth transitions at edges.
4. Scales the mask back to the original size and applies it.

The model never "understands" the photo the way a person does; it recognises visual patterns. That is why results are excellent for typical portraits and products and less reliable for unusual scenes.

## Why some edges are difficult

- **Hair and fur:** fine strands mix subject and background colours in the same pixels. A perfect result needs partial transparency, which is hard to predict.
- **Glass, smoke and veils:** semi-transparent objects should let the new background show through, but the model only sees the old background behind them.
- **Low contrast:** a white product on a white table, or dark clothing against a dark wall, gives few clues about where the edge is.
- **Several subjects:** the model may keep or drop a second person, a pet or a held object unpredictably.
- **Shadows:** a natural shadow may be removed, making the subject look as if it is floating.

Our tutorial on [clean cutouts with background removal](blog:remove-background-clean-cutouts) covers practical ways to get better results.

## Running the model in your browser

Many background removers upload your photo to a server. The Convertios [Remove Background](tool:remove-bg) tool takes a different approach: it uses the open-source IMG.LY background-removal library (AGPL-3.0) inside your browser. On first use, the browser downloads and caches about 40 MB of model and runtime files. After that, your image is processed locally and never uploaded; you download a transparent PNG.

The trade-offs of running locally:

- **Privacy:** the photo stays on your device.
- **First-use download:** the model must be fetched once, which takes time on slow connections.
- **Device performance:** older phones take longer than laptops.

Our explainer on [how in-browser tools work](blog:webassembly-browser-tools) describes the technologies, such as WebAssembly and GPU acceleration, that make this possible.

## After removing the background

- Keep the original photo; you may want to retry with a cleaner shot.
- The PNG keeps transparency. If a website needs a smaller file, resize it with the [Image Resizer](tool:image-resizer), choosing PNG or WebP to keep transparency, or compress it with the [image compressor](tool:compress-image) as PNG or WebP. Converting to JPG fills transparent areas with a solid colour.

=== es ===
cover_alt: Auriculares aislados sobre una cuadrícula de transparencia
title: Cómo funciona la eliminación de fondos con IA y por qué el pelo y el cristal son difíciles
seo_title: Cómo funciona la eliminación de fondos con IA
description: Los eliminadores de fondo usan modelos de segmentación. Cómo se crea la máscara, por qué fallan algunos bordes y qué supone ejecutarlo en el navegador.
dek: Un clic y el fondo desaparece. Detrás de ese clic, una red neuronal decide para cada píxel si pertenece al sujeto. Entender cómo decide explica tanto los resultados impresionantes como los frustrantes.
---
## La tarea: una máscara para cada píxel

Quitar un fondo significa crear una **máscara**: un mapa en escala de grises del mismo tamaño que la foto, donde el blanco significa «conservar», el negro «eliminar» y el gris «parcialmente transparente». Después la máscara se aplica como canal alfa y el resultado se guarda en un formato que admita transparencia, normalmente PNG.

Hacerlo a mano supone trazar los bordes con una herramienta de pluma. Las herramientas de IA generan la máscara automáticamente.

## Cómo decide el modelo

La eliminación de fondos usa modelos de **segmentación de imágenes**, un tipo de red neuronal entrenada con miles de imágenes en las que personas han marcado con cuidado el primer plano. Durante el entrenamiento, la red aprende patrones que suelen pertenecer a un sujeto principal, como personas, animales y productos, y patrones que suelen ser fondo.

Al usarla con una foto nueva, el modelo:

1. Escala la imagen al tamaño con el que se entrenó.
2. Predice, para cada posición, la probabilidad de que sea primer plano.
3. Produce una máscara suave con transiciones graduales en los bordes.
4. Devuelve la máscara al tamaño original y la aplica.

El modelo nunca «entiende» la foto como una persona; reconoce patrones visuales. Por eso los resultados son excelentes en retratos y productos típicos y menos fiables en escenas inusuales.

## Por qué algunos bordes son difíciles

- **Pelo y pelaje:** los mechones finos mezclan colores del sujeto y del fondo en los mismos píxeles. Un resultado perfecto necesita transparencia parcial, difícil de predecir.
- **Cristal, humo y velos:** los objetos semitransparentes deberían dejar ver el nuevo fondo, pero el modelo solo ve el fondo antiguo detrás.
- **Poco contraste:** un producto blanco sobre una mesa blanca, o ropa oscura ante una pared oscura, da pocas pistas sobre dónde está el borde.
- **Varios sujetos:** el modelo puede conservar o eliminar de forma imprevisible a una segunda persona, una mascota o un objeto en la mano.
- **Sombras:** puede eliminar una sombra natural, y el sujeto parece flotar.

Nuestro tutorial para [recortes limpios al quitar el fondo](blog:remove-background-clean-cutouts) explica formas prácticas de mejorar el resultado.

## Ejecutar el modelo en tu navegador

Muchos eliminadores de fondo suben tu foto a un servidor. La herramienta [Eliminar fondo](tool:remove-bg) de Convertios lo hace de otra manera: usa la biblioteca de código abierto de IMG.LY para eliminar fondos (AGPL-3.0) dentro de tu navegador. La primera vez, el navegador descarga y guarda en caché unos 40 MB de modelo y archivos de ejecución. Después, tu imagen se procesa en local y nunca se sube; descargas un PNG transparente.

Lo que implica ejecutarlo en local:

- **Privacidad:** la foto se queda en tu dispositivo.
- **Descarga inicial:** el modelo debe descargarse una vez, lo que lleva tiempo con conexiones lentas.
- **Rendimiento del dispositivo:** los móviles antiguos tardan más que los portátiles.

Nuestra explicación sobre [cómo funcionan las herramientas en el navegador](blog:webassembly-browser-tools) describe las tecnologías, como WebAssembly y la aceleración por GPU, que lo hacen posible.

## Después de quitar el fondo

- Conserva la foto original; quizá quieras repetirlo con una toma más limpia.
- El PNG conserva la transparencia. Si una web necesita un archivo más pequeño, redimensiónalo con el [Redimensionador de imágenes](tool:image-resizer) eligiendo PNG o WebP para mantener la transparencia, o comprímelo con el [compresor de imágenes](tool:compress-image) en PNG o WebP. Convertirlo a JPG rellena las zonas transparentes con un color sólido.

=== ar ===
cover_alt: سماعات معزولة أمام شبكة شفافية
title: كيف تعمل إزالة الخلفية بالذكاء الاصطناعي ولماذا يصعب الشعر والزجاج
seo_title: كيف تعمل إزالة الخلفية بالذكاء الاصطناعي
description: تستخدم أدوات إزالة الخلفية نماذج تجزئة لفصل الموضوع عن محيطه. تعرّف إلى كيفية صنع القناع ولماذا تفشل بعض الحواف وما معنى تشغيل النموذج داخل متصفحك.
dek: نقرة واحدة وتختفي الخلفية. وخلف هذه النقرة شبكة عصبية تقرر لكل بكسل هل ينتمي إلى الموضوع. فهم طريقة قرارها يفسر النتائج المبهرة والمحبطة معاً.
---
## المهمة: قناع لكل بكسل

إزالة الخلفية تعني إنتاج **قناع**: خريطة رمادية بحجم الصورة نفسه، يعني فيها الأبيض «احتفظ» والأسود «احذف» والرمادي «شفاف جزئياً». ثم يُطبَّق القناع كقناة شفافية (ألفا)، وتُحفظ النتيجة بصيغة تدعم الشفافية، عادةً PNG.

القيام بذلك يدوياً يعني تتبع الحواف بأداة القلم، أما أدوات الذكاء الاصطناعي فتنشئ القناع تلقائياً.

## كيف يقرر النموذج

تعتمد إزالة الخلفية على نماذج **تجزئة الصور**، وهي نوع من الشبكات العصبية دُرّب على آلاف الصور التي حدد فيها أشخاص المقدمة بعناية. وخلال التدريب تتعلم الشبكة الأنماط التي تنتمي غالباً إلى موضوع رئيسي، مثل الأشخاص والحيوانات والمنتجات، والأنماط التي تكون عادةً خلفية.

وعند تشغيله على صورة جديدة فإن النموذج:

1. يغيّر حجم الصورة إلى المقاس الذي دُرّب عليه.
2. يتنبأ لكل موضع باحتمال كونه من المقدمة.
3. ينتج قناعاً ناعماً بانتقالات تدريجية عند الحواف.
4. يعيد القناع إلى الحجم الأصلي ويطبقه.

النموذج لا «يفهم» الصورة كما يفهمها الإنسان، بل يتعرف على أنماط بصرية؛ ولهذا تكون النتائج ممتازة في الصور الشخصية والمنتجات المعتادة وأقل موثوقية في المشاهد غير المألوفة.

## لماذا تصعب بعض الحواف

- **الشعر والفرو:** تخلط الخصلات الدقيقة ألوان الموضوع والخلفية في البكسلات نفسها، والنتيجة المثالية تحتاج إلى شفافية جزئية يصعب التنبؤ بها.
- **الزجاج والدخان والأوشحة الشفافة:** يجب أن تُظهر الأجسام شبه الشفافة الخلفية الجديدة، لكن النموذج لا يرى خلفها إلا الخلفية القديمة.
- **التباين المنخفض:** منتج أبيض على طاولة بيضاء أو ملابس داكنة أمام جدار داكن لا يعطي دلائل كافية على مكان الحافة.
- **تعدد المواضيع:** قد يحتفظ النموذج بشخص ثانٍ أو حيوان أليف أو غرض محمول أو يحذفه بشكل غير متوقع.
- **الظلال:** قد يحذف ظلاً طبيعياً فيبدو الموضوع كأنه يطفو.

يقدم شرحنا العملي عن [قص نظيف عند إزالة الخلفية](blog:remove-background-clean-cutouts) طرقاً عملية لتحسين النتيجة.

## تشغيل النموذج داخل متصفحك

ترفع أدوات كثيرة لإزالة الخلفية صورتك إلى خادم. أما أداة [إزالة الخلفية](tool:remove-bg) في Convertios فتتبع نهجاً مختلفاً، إذ تستخدم مكتبة IMG.LY مفتوحة المصدر لإزالة الخلفية (بترخيص AGPL-3.0) داخل متصفحك. في أول استخدام ينزّل المتصفح نحو 40 ميغابايت من ملفات النموذج والتشغيل ويخزنها، ثم تُعالج صورتك محلياً دون رفعها، وتنزّل ملف PNG شفافاً.

وللتشغيل المحلي موازناته:

- **الخصوصية:** تبقى الصورة على جهازك.
- **تنزيل أول استخدام:** يجب جلب النموذج مرة واحدة، وهذا يستغرق وقتاً مع الاتصالات البطيئة.
- **أداء الجهاز:** تستغرق الهواتف القديمة وقتاً أطول من الحواسيب المحمولة.

يشرح مقالنا عن [طريقة عمل الأدوات داخل المتصفح](blog:webassembly-browser-tools) التقنيات التي تجعل ذلك ممكناً، مثل WebAssembly والتسريع عبر معالج الرسوميات.

## بعد إزالة الخلفية

- احتفظ بالصورة الأصلية، فقد ترغب في المحاولة مجدداً بلقطة أنظف.
- يحافظ ملف PNG على الشفافية. إذا احتاج موقع ما إلى ملف أصغر فغيّر حجمه بأداة [تغيير حجم الصور](tool:image-resizer) مع اختيار PNG أو WebP للحفاظ على الشفافية، أو اضغطه بأداة [ضاغط الصور](tool:compress-image) بصيغة PNG أو WebP. أما التحويل إلى JPG فيملأ المناطق الشفافة بلون مصمت.

=== pt-br ===
cover_alt: Fones isolados sobre uma grade de transparência
title: Como funciona a remoção de fundo com IA e por que cabelo e vidro são difíceis
seo_title: Como funciona a remoção de fundo com IA
description: Removedores de fundo usam modelos de segmentação. Como a máscara é feita, por que algumas bordas falham e o que significa rodar o modelo no navegador.
dek: Um clique e o fundo some. Por trás desse clique, uma rede neural decide para cada pixel se ele pertence ao assunto. Entender como ela decide explica tanto os resultados impressionantes quanto os frustrantes.
---
## A tarefa: uma máscara para cada pixel

Remover um fundo significa produzir uma **máscara**: um mapa em tons de cinza do mesmo tamanho da foto, em que branco significa "manter", preto significa "remover" e cinza significa "parcialmente transparente". A máscara é então aplicada como canal alfa, e o resultado é salvo em um formato que aceita transparência, normalmente PNG.

Fazer isso à mão significa contornar as bordas com uma ferramenta de caneta. As ferramentas com IA geram a máscara automaticamente.

## Como o modelo decide

A remoção de fundo usa modelos de **segmentação de imagens**, um tipo de rede neural treinada com milhares de imagens em que pessoas marcaram com cuidado o primeiro plano. No treinamento, a rede aprende padrões que costumam pertencer a um assunto principal, como pessoas, animais e produtos, e padrões que normalmente são fundo.

Ao rodar em uma foto nova, o modelo:

1. Ajusta a imagem ao tamanho em que foi treinado.
2. Prevê, para cada posição, a probabilidade de ser primeiro plano.
3. Gera uma máscara suave, com transições graduais nas bordas.
4. Volta a máscara ao tamanho original e a aplica.

O modelo nunca "entende" a foto como uma pessoa; ele reconhece padrões visuais. Por isso os resultados são excelentes em retratos e produtos comuns e menos confiáveis em cenas incomuns.

## Por que algumas bordas são difíceis

- **Cabelo e pelos:** fios finos misturam cores do assunto e do fundo nos mesmos pixels. Um resultado perfeito precisa de transparência parcial, que é difícil de prever.
- **Vidro, fumaça e véus:** objetos semitransparentes deveriam deixar o novo fundo aparecer, mas o modelo só vê o fundo antigo atrás deles.
- **Pouco contraste:** um produto branco sobre uma mesa branca, ou roupa escura diante de uma parede escura, dá poucas pistas de onde está a borda.
- **Vários assuntos:** o modelo pode manter ou remover de forma imprevisível uma segunda pessoa, um animal ou um objeto na mão.
- **Sombras:** uma sombra natural pode ser removida, e o assunto parece flutuar.

Nosso tutorial sobre [recortes limpos ao remover o fundo](blog:remove-background-clean-cutouts) traz formas práticas de melhorar o resultado.

## Rodar o modelo no seu navegador

Muitos removedores de fundo enviam sua foto para um servidor. A ferramenta [Remover fundo](tool:remove-bg) da Convertios faz diferente: usa a biblioteca de código aberto da IMG.LY para remoção de fundo (AGPL-3.0) dentro do seu navegador. No primeiro uso, o navegador baixa e guarda em cache cerca de 40 MB de modelo e arquivos de execução. Depois disso, sua imagem é processada localmente e nunca enviada; você baixa um PNG transparente.

O que muda ao rodar localmente:

- **Privacidade:** a foto fica no seu aparelho.
- **Download no primeiro uso:** o modelo precisa ser baixado uma vez, o que leva tempo em conexões lentas.
- **Desempenho do aparelho:** celulares antigos demoram mais do que notebooks.

Nosso texto sobre [como funcionam as ferramentas no navegador](blog:webassembly-browser-tools) descreve as tecnologias, como WebAssembly e aceleração por GPU, que tornam isso possível.

## Depois de remover o fundo

- Guarde a foto original; você pode querer tentar de novo com uma foto mais limpa.
- O PNG mantém a transparência. Se um site precisar de um arquivo menor, redimensione com o [Redimensionador de imagens](tool:image-resizer), escolhendo PNG ou WebP para manter a transparência, ou comprima com o [compressor de imagens](tool:compress-image) em PNG ou WebP. Converter para JPG preenche as áreas transparentes com uma cor sólida.
