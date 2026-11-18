---
category: images-formats
type: guide
published: 2026-11-18
order: 169
status: published
cover: EXIF · GPS
tools: compress-image, image-converter, image-resizer
related: reduce-image-size-without-losing-quality, content-credentials-explained
keyword: remove exif data / photo location privacy
intent: informational
---
=== en ===
title: What your photos reveal: EXIF metadata, location and privacy
seo_title: Photo metadata (EXIF): location and privacy explained
description: Photos can carry the date, camera, settings and GPS location of where they were taken. Learn what EXIF contains, when it is removed and how to share images safely.
dek: A photo file contains more than pixels. Hidden fields can record when, where and with which device it was taken, and some of that travels with the file when you share it.
---
## What metadata is

Most cameras and phones write extra information into each photo, usually in a format called **EXIF**. It is invisible when you look at the picture but readable by any program that asks for it. Typical fields include:

- **Date and time** the photo was taken.
- **Device** make and model, sometimes a serial number.
- **Camera settings:** exposure, aperture, ISO, focal length, whether the flash fired.
- **Orientation:** which way the phone was held, so viewers can display the photo upright.
- **GPS location:** latitude and longitude, sometimes altitude and direction, if location tagging is enabled.
- **Software** used to edit the image.

Other metadata standards (IPTC, XMP) can add captions, copyright notices, author names and editing history. Some newer images also carry signed provenance data called Content Credentials; see [Content Credentials explained](blog:content-credentials-explained).

## Why it matters

Metadata is useful: it sorts your photo library by date, shows photos on a map and keeps pictures the right way up. The risk appears when you share files with people who should not know those details:

- A photo of an item for sale, taken at home, can reveal your home address through GPS coordinates.
- Photos of children or of your daily routine can expose locations and times.
- Documents photographed for work may reveal device and software details.

## Who removes metadata already

Many large social networks and messaging apps strip location data from images they display publicly, but practices differ between services and between "photo" and "file/document" sending modes. Email attachments, cloud-storage links, forums and file transfers often keep the original file exactly as it is. Do not assume metadata is removed unless you have checked.

## How to check a photo's metadata

- **Windows:** right-click the file, choose Properties, then Details.
- **macOS:** open the image in Preview and choose Tools, then Show Inspector.
- **iPhone and Android:** in the gallery app, open the photo and swipe up or tap the info button; location usually appears as a small map.

## How to share without location data

1. **Turn off location tagging for the camera** if you rarely need it. On phones it is a camera or privacy setting.
2. **Remove location when sharing.** Recent iPhone and Android versions offer an option to exclude location in the share sheet or photo details.
3. **Re-encode the image.** When the [Convertios image compressor](tool:compress-image) re-encodes a photo, the original EXIF details such as GPS location are not kept. This happens in your browser; the image is not uploaded. One exception: if an image is already below your target size and its format is unchanged, the original file is returned untouched, metadata included. Choosing a different output format or a smaller target forces re-encoding.
4. **Convert or resize.** Exporting through the [Image Converter](tool:image-converter) or the [Image Resizer](tool:image-resizer) also produces a newly encoded file. If metadata removal is critical, check the result using the steps above.

## Metadata you may want to keep

Removing everything is not always right. Photographers may want copyright and contact details to travel with their work. Archives and journalists rely on accurate dates and provenance. Keep originals with full metadata in your own library, and share stripped copies where privacy matters.

## Quick checklist

- Check one of your photos to see what your phone records.
- Disable camera location if you do not use it.
- Before posting an image publicly from home, school or a regular routine, remove location.
- Keep originals privately; share re-encoded copies.

=== es ===
title: Lo que revelan tus fotos: metadatos EXIF, ubicación y privacidad
seo_title: Metadatos de fotos (EXIF): ubicación y privacidad
description: Las fotos pueden guardar la fecha, la cámara y la ubicación GPS donde se hicieron. Qué contiene EXIF, cuándo se elimina y cómo compartir con seguridad.
dek: Un archivo de foto contiene más que píxeles. Campos ocultos pueden registrar cuándo, dónde y con qué dispositivo se hizo, y parte de eso viaja con el archivo cuando lo compartes.
---
## Qué son los metadatos

La mayoría de cámaras y móviles escriben información adicional en cada foto, normalmente en un formato llamado **EXIF**. No se ve al mirar la imagen, pero cualquier programa que la pida puede leerla. Campos habituales:

- **Fecha y hora** en que se tomó la foto.
- **Dispositivo:** marca y modelo, a veces un número de serie.
- **Ajustes de la cámara:** exposición, apertura, ISO, distancia focal, si saltó el flash.
- **Orientación:** cómo se sujetaba el móvil, para mostrar la foto derecha.
- **Ubicación GPS:** latitud y longitud, a veces altitud y dirección, si el geoetiquetado está activado.
- **Software** usado para editar la imagen.

Otros estándares (IPTC, XMP) pueden añadir pies de foto, avisos de copyright, nombres de autor e historial de edición. Algunas imágenes recientes llevan además datos de procedencia firmados llamados Content Credentials; consulta [qué son las Content Credentials](blog:content-credentials-explained).

## Por qué importa

Los metadatos son útiles: ordenan tu galería por fecha, muestran las fotos en un mapa y mantienen las imágenes derechas. El riesgo aparece cuando compartes archivos con personas que no deberían conocer esos detalles:

- La foto de un artículo en venta hecha en casa puede revelar tu dirección mediante las coordenadas GPS.
- Las fotos de niños o de tu rutina diaria pueden exponer lugares y horarios.
- Documentos fotografiados para el trabajo pueden revelar datos del dispositivo y del software.

## Quién elimina ya los metadatos

Muchas redes sociales y apps de mensajería grandes eliminan la ubicación de las imágenes que muestran públicamente, pero las prácticas varían entre servicios y entre los modos de envío «foto» y «archivo/documento». Los adjuntos de correo, los enlaces de almacenamiento en la nube, los foros y las transferencias de archivos suelen conservar el archivo original tal cual. No des por hecho que se eliminan los metadatos sin comprobarlo.

## Cómo ver los metadatos de una foto

- **Windows:** clic derecho en el archivo, Propiedades y después Detalles.
- **macOS:** abre la imagen en Vista Previa y elige Herramientas, Mostrar inspector.
- **iPhone y Android:** en la galería, abre la foto y desliza hacia arriba o toca el botón de información; la ubicación suele aparecer como un pequeño mapa.

## Cómo compartir sin la ubicación

1. **Desactiva la ubicación de la cámara** si casi nunca la necesitas. En los móviles es un ajuste de la cámara o de privacidad.
2. **Quita la ubicación al compartir.** Las versiones recientes de iPhone y Android ofrecen excluir la ubicación en el menú de compartir o en los detalles de la foto.
3. **Vuelve a codificar la imagen.** Cuando el [compresor de imágenes de Convertios](tool:compress-image) recodifica una foto, no conserva los datos EXIF originales, como la ubicación GPS. Ocurre en tu navegador; la imagen no se sube. Una excepción: si la imagen ya está por debajo del tamaño objetivo y su formato no cambia, se devuelve el archivo original intacto, metadatos incluidos. Elegir otro formato de salida o un objetivo menor obliga a recodificar.
4. **Convierte o redimensiona.** Exportar con el [Conversor de imágenes](tool:image-converter) o el [Redimensionador de imágenes](tool:image-resizer) también genera un archivo nuevo. Si eliminar los metadatos es crucial, comprueba el resultado con los pasos anteriores.

## Metadatos que quizá quieras conservar

Borrarlo todo no siempre es lo correcto. Los fotógrafos pueden querer que sus datos de copyright y contacto acompañen a su trabajo. Archivos y periodistas dependen de fechas y procedencias precisas. Guarda los originales con todos sus metadatos en tu propia biblioteca y comparte copias limpias cuando importe la privacidad.

## Lista rápida

- Revisa una de tus fotos para ver qué registra tu móvil.
- Desactiva la ubicación de la cámara si no la usas.
- Antes de publicar una imagen hecha en casa, en el colegio o en tu rutina, quita la ubicación.
- Guarda los originales en privado y comparte copias recodificadas.

=== ar ===
title: ما الذي تكشفه صورك: بيانات EXIF والموقع والخصوصية
seo_title: بيانات الصور الوصفية EXIF: الموقع والخصوصية
description: قد تحمل الصور التاريخ والكاميرا والإعدادات وموقع GPS الذي التُقطت فيه. تعرّف إلى محتوى EXIF ومتى يُحذف وكيف تشارك الصور بأمان.
dek: ملف الصورة يحتوي أكثر من البكسلات؛ فقد تسجل حقول مخفية متى وأين وبأي جهاز التُقطت، ويرافق بعض ذلك الملف عندما تشاركه.
---
## ما هي البيانات الوصفية

تكتب معظم الكاميرات والهواتف معلومات إضافية في كل صورة، عادةً بصيغة تسمى **EXIF**. لا تراها عند النظر إلى الصورة، لكن أي برنامج يطلبها يستطيع قراءتها. من الحقول المعتادة:

- **تاريخ التقاط الصورة ووقته.**
- **الجهاز:** الشركة المصنعة والطراز، وأحياناً رقم تسلسلي.
- **إعدادات الكاميرا:** التعريض وفتحة العدسة وISO والبعد البؤري وهل عمل الفلاش.
- **الاتجاه:** كيف كان الهاتف ممسوكاً، لعرض الصورة قائمة.
- **موقع GPS:** خطا العرض والطول، وأحياناً الارتفاع والاتجاه، إذا كان وسم الموقع مفعّلاً.
- **البرنامج** المستخدم في تحرير الصورة.

وقد تضيف معايير أخرى (IPTC وXMP) تعليقات وإشعارات حقوق نشر وأسماء مؤلفين وسجل تعديلات. كما تحمل بعض الصور الحديثة بيانات مصدر موقّعة تسمى Content Credentials؛ راجع [شرح Content Credentials](blog:content-credentials-explained).

## لماذا يهم ذلك

البيانات الوصفية مفيدة؛ فهي ترتب مكتبة صورك حسب التاريخ، وتعرضها على خريطة، وتبقيها في الاتجاه الصحيح. ويظهر الخطر عندما تشارك ملفات مع أشخاص لا ينبغي أن يعرفوا هذه التفاصيل:

- صورة غرض معروض للبيع التُقطت في المنزل قد تكشف عنوانك عبر إحداثيات GPS.
- صور الأطفال أو روتينك اليومي قد تكشف الأماكن والأوقات.
- المستندات المصورة للعمل قد تكشف تفاصيل الجهاز والبرامج.

## من يحذف البيانات الوصفية أصلاً

تحذف كثير من الشبكات الاجتماعية وتطبيقات المراسلة الكبيرة بيانات الموقع من الصور التي تعرضها علناً، لكن الممارسات تختلف بين الخدمات وبين وضعي الإرسال «صورة» و«ملف/مستند». أما مرفقات البريد وروابط التخزين السحابي والمنتديات وأدوات نقل الملفات فتحتفظ غالباً بالملف الأصلي كما هو. لا تفترض أن البيانات حُذفت ما لم تتحقق.

## كيف تطّلع على البيانات الوصفية لصورة

- **Windows:** انقر بزر الفأرة الأيمن على الملف، واختر «خصائص» ثم «التفاصيل».
- **macOS:** افتح الصورة في «معاينة» واختر «أدوات» ثم «إظهار المراقب».
- **iPhone وAndroid:** افتح الصورة في تطبيق المعرض واسحب إلى الأعلى أو اضغط زر المعلومات، وغالباً ما يظهر الموقع كخريطة صغيرة.

## كيف تشارك دون بيانات الموقع

1. **أوقف وسم الموقع في الكاميرا** إن كنت نادراً ما تحتاجه، وهو إعداد في الكاميرا أو الخصوصية في الهواتف.
2. **احذف الموقع عند المشاركة.** توفر الإصدارات الحديثة من iPhone وAndroid خياراً لاستبعاد الموقع في قائمة المشاركة أو تفاصيل الصورة.
3. **أعد ترميز الصورة.** عندما يعيد [ضاغط الصور في Convertios](tool:compress-image) ترميز صورة لا يحتفظ ببيانات EXIF الأصلية مثل موقع GPS، ويجري ذلك داخل متصفحك دون رفع الصورة. هناك استثناء واحد: إذا كانت الصورة أصلاً تحت الحجم المستهدف ولم تتغير صيغتها فيُعاد الملف الأصلي كما هو مع بياناته. اختيار صيغة إخراج مختلفة أو هدف أصغر يفرض إعادة الترميز.
4. **حوّل الصورة أو غيّر حجمها.** التصدير عبر [محوّل الصور](tool:image-converter) أو [أداة تغيير حجم الصور](tool:image-resizer) ينتج ملفاً مرمّزاً من جديد أيضاً. وإن كان حذف البيانات ضرورياً فتحقق من النتيجة بالخطوات السابقة.

## بيانات قد ترغب في الاحتفاظ بها

حذف كل شيء ليس صحيحاً دائماً؛ فقد يرغب المصورون في أن ترافق بيانات حقوق النشر والتواصل أعمالهم، ويعتمد الأرشيفيون والصحفيون على التواريخ والمصادر الدقيقة. احتفظ بالأصول ببياناتها الكاملة في مكتبتك الخاصة، وشارك نسخاً منظفة حين تهم الخصوصية.

## قائمة سريعة

- افحص إحدى صورك لترى ما يسجله هاتفك.
- أوقف موقع الكاميرا إن لم تكن تستخدمه.
- قبل نشر صورة التُقطت في المنزل أو المدرسة أو ضمن روتينك، احذف الموقع.
- احتفظ بالأصول سراً وشارك نسخاً معاد ترميزها.

=== pt-br ===
title: O que suas fotos revelam: metadados EXIF, localização e privacidade
seo_title: Metadados de fotos (EXIF): localização e privacidade
description: Fotos podem guardar data, câmera, configurações e a localização GPS de onde foram tiradas. Veja o que o EXIF contém, quando é removido e como compartilhar com segurança.
dek: Um arquivo de foto tem mais do que pixels. Campos escondidos podem registrar quando, onde e com que aparelho ela foi tirada, e parte disso viaja junto quando você compartilha.
---
## O que são metadados

A maioria das câmeras e celulares grava informações extras em cada foto, normalmente em um formato chamado **EXIF**. Elas não aparecem quando você olha a imagem, mas qualquer programa que pedir consegue ler. Campos comuns:

- **Data e hora** em que a foto foi tirada.
- **Aparelho:** marca e modelo, às vezes um número de série.
- **Configurações da câmera:** exposição, abertura, ISO, distância focal, se o flash disparou.
- **Orientação:** como o celular estava, para a foto aparecer em pé.
- **Localização GPS:** latitude e longitude, às vezes altitude e direção, se a marcação de local estiver ativada.
- **Software** usado para editar a imagem.

Outros padrões (IPTC, XMP) podem acrescentar legendas, avisos de direitos autorais, nomes de autor e histórico de edição. Algumas imagens recentes também levam dados de procedência assinados chamados Content Credentials; veja [o que são Content Credentials](blog:content-credentials-explained).

## Por que isso importa

Metadados são úteis: organizam a galeria por data, mostram as fotos no mapa e mantêm as imagens em pé. O risco aparece quando você compartilha arquivos com quem não deveria saber esses detalhes:

- A foto de um produto à venda tirada em casa pode revelar seu endereço pelas coordenadas GPS.
- Fotos de crianças ou da sua rotina podem expor lugares e horários.
- Documentos fotografados para o trabalho podem revelar dados do aparelho e do software.

## Quem já remove os metadados

Muitas redes sociais e apps de mensagem grandes removem a localização das imagens que exibem publicamente, mas as práticas variam entre serviços e entre os modos de envio "foto" e "arquivo/documento". Anexos de e-mail, links de armazenamento na nuvem, fóruns e transferências de arquivos costumam manter o arquivo original exatamente como está. Não presuma que os metadados foram removidos sem conferir.

## Como ver os metadados de uma foto

- **Windows:** clique com o botão direito no arquivo, escolha Propriedades e depois Detalhes.
- **macOS:** abra a imagem no Pré-Visualização e escolha Ferramentas, Mostrar Inspetor.
- **iPhone e Android:** na galeria, abra a foto e deslize para cima ou toque no botão de informações; a localização costuma aparecer como um pequeno mapa.

## Como compartilhar sem a localização

1. **Desative a localização da câmera** se você quase nunca precisa dela. No celular, é um ajuste da câmera ou de privacidade.
2. **Remova a localização ao compartilhar.** Versões recentes do iPhone e do Android oferecem a opção de excluir o local no menu de compartilhamento ou nos detalhes da foto.
3. **Recodifique a imagem.** Quando o [compressor de imagens da Convertios](tool:compress-image) recodifica uma foto, os dados EXIF originais, como a localização GPS, não são mantidos. Isso acontece no navegador; a imagem não é enviada. Uma exceção: se a imagem já estiver abaixo do tamanho-alvo e o formato não mudar, o arquivo original é devolvido intacto, com metadados. Escolher outro formato de saída ou um alvo menor força a recodificação.
4. **Converta ou redimensione.** Exportar pelo [Conversor de imagens](tool:image-converter) ou pelo [Redimensionador de imagens](tool:image-resizer) também gera um arquivo novo. Se remover os metadados for essencial, confira o resultado com os passos acima.

## Metadados que você talvez queira manter

Apagar tudo nem sempre é o certo. Fotógrafos podem querer que direitos autorais e contato acompanhem o trabalho. Arquivos e jornalistas dependem de datas e procedências corretas. Guarde os originais com todos os metadados na sua biblioteca e compartilhe cópias limpas quando a privacidade importar.

## Checklist rápido

- Confira uma das suas fotos para ver o que o celular registra.
- Desative a localização da câmera se você não usa.
- Antes de publicar uma imagem tirada em casa, na escola ou na sua rotina, remova a localização.
- Guarde os originais em privado e compartilhe cópias recodificadas.
