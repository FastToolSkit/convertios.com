---
category: audio-video
type: guide
published: 2026-11-18
order: 159
status: published
cover: 0.5× · 1× · 2×
tools: audio-speed-changer, mp3-cutter, audio-converter
related: trim-voice-recordings, mp3-vs-wav
keyword: change audio speed
intent: how-to
---
=== en ===
title: Changing audio speed: what happens to pitch, and when it matters
seo_title: Change audio speed: pitch, quality and uses
description: Speeding up or slowing down audio: why simple speed changes alter pitch, when that is fine, when you need time-stretching, and how to export the result as MP3.
dek: Play a recording at 1.5× and voices rise; slow it to 0.75× and they drop. That is not a bug, it is how simple speed change works. Knowing why helps you pick the right tool for practice, review or a quick edit.
---
## Two different ways to change speed

**Resampling (the "tape" method).** The audio is played back faster or slower, exactly like spinning a record at the wrong speed. Duration and pitch change together: twice as fast means one octave higher; half speed means one octave lower. It is simple and introduces no extra processing artefacts.

**Time-stretching.** Specialised algorithms change duration while keeping the pitch, which is what podcast and video players do when you choose 1.5× playback. It is more complex and, at large changes, can sound slightly metallic or smeared.

Neither is "better"; they suit different jobs.

## What the Convertios tool does

The [Audio Speed Changer](tool:audio-speed-changer) works in your browser. You choose a speed from 0.5× to 2× in steps of 0.1, preview it, and **Export** an MP3. It uses the resampling method, so **pitch changes along with speed**. The file is not uploaded.

That makes it a good fit for:

- creating a slowed or sped-up version of a clip for fun or effects,
- shortening a long silence-heavy recording when a small pitch shift does not matter,
- hearing fast passages at lower speed to follow the rhythm, accepting the lower pitch.

It is not the right tool when you need the same pitch at a new speed, for example practising along with music in the original key. For that, use an audio editor or player with time-stretching (often labelled "tempo" rather than "speed").

## How much change is noticeable

Small changes are subtle. A shift to 1.1× raises pitch by under two semitones: speech sounds a little brighter and faster but natural. Around 1.3× and above, voices start to sound obviously higher. Slowing below about 0.8× makes speech sound deep and drawn out.

## Practical workflow

1. **Trim first.** Remove unwanted beginnings and ends with the [MP3 Cutter](tool:mp3-cutter) so you only process what you need; see [trimming voice recordings](blog:trim-voice-recordings).
2. **Change speed** and listen to the preview before exporting.
3. **Export the MP3**, which is encoded at 192 kbps.
4. **Name the result** with the speed, such as `interview_1-2x.mp3`, so you do not confuse it with the original.

If your source is WAV and you need WAV again afterwards, the [Audio Converter](tool:audio-converter) converts between MP3 and WAV in the browser. Bear in mind that MP3 is lossy; see [MP3 vs WAV](blog:mp3-vs-wav).

## Quick questions

**Does speeding up reduce quality?** The speed change itself does not add noise, but the export is a new MP3, so a WAV source becomes lossy and an MP3 source is encoded a second time. At 192 kbps this is rarely audible for speech.

**Can I go beyond 2× or below 0.5×?** Not with this tool. Extreme changes make speech hard to understand with the resampling method anyway.

**Will the file get shorter?** Yes. At 2× a ten-minute recording becomes five minutes; at 0.5× it becomes twenty.

## Respect the original

Changing the speed of someone else's music or recording does not change who owns it. Use your own recordings, or material you have permission to edit and share.

=== es ===
title: Cambiar la velocidad del audio: qué pasa con el tono y cuándo importa
seo_title: Cambiar la velocidad del audio: tono y usos
description: Acelerar o ralentizar audio: por qué un cambio de velocidad simple altera el tono, cuándo da igual, cuándo hace falta estirar el tiempo y cómo exportar en MP3.
dek: Reproduce una grabación a 1,5× y las voces suben; bájala a 0,75× y se vuelven graves. No es un fallo: así funciona el cambio de velocidad simple. Entender por qué ayuda a elegir la herramienta adecuada.
---
## Dos formas distintas de cambiar la velocidad

**Remuestreo (el método de la cinta).** El audio se reproduce más rápido o más lento, como un disco girando a la velocidad equivocada. Duración y tono cambian juntos: el doble de rápido es una octava más aguda; la mitad, una octava más grave. Es sencillo y no añade artefactos de procesamiento.

**Estiramiento de tiempo (time-stretching).** Algoritmos especializados cambian la duración manteniendo el tono, que es lo que hacen los reproductores de pódcast y vídeo al elegir 1,5×. Es más complejo y, con cambios grandes, puede sonar algo metálico o borroso.

Ninguno es «mejor»; sirven para cosas distintas.

## Qué hace la herramienta de Convertios

El [Control de velocidad de audio](tool:audio-speed-changer) funciona en tu navegador. Eliges una velocidad entre 0,5× y 2× en pasos de 0,1, la escuchas y pulsas **Exportar** para obtener un MP3. Usa el método de remuestreo, así que **el tono cambia junto con la velocidad**. El archivo no se sube.

Por eso encaja bien para:

- crear una versión ralentizada o acelerada de un clip como efecto o por diversión,
- acortar una grabación larga cuando un pequeño cambio de tono no importa,
- escuchar pasajes rápidos más despacio para seguir el ritmo, aceptando un tono más grave.

No es la herramienta adecuada si necesitas el mismo tono a otra velocidad, por ejemplo para practicar con una canción en su tonalidad original. Para eso, usa un editor o reproductor con estiramiento de tiempo (a menudo llamado «tempo» en lugar de «velocidad»).

## Cuánto cambio se nota

Los cambios pequeños son sutiles. A 1,1× el tono sube menos de dos semitonos: la voz suena algo más brillante y rápida, pero natural. A partir de 1,3× las voces suenan claramente más agudas. Por debajo de 0,8×, el habla suena grave y arrastrada.

## Flujo de trabajo práctico

1. **Recorta primero.** Quita el principio y el final que sobran con [Cortar MP3](tool:mp3-cutter) para procesar solo lo necesario; consulta [cómo recortar grabaciones de voz](blog:trim-voice-recordings).
2. **Cambia la velocidad** y escucha la vista previa antes de exportar.
3. **Exporta el MP3**, codificado a 192 kbps.
4. **Nombra el resultado** con la velocidad, como `entrevista_1-2x.mp3`, para no confundirlo con el original.

Si tu fuente es WAV y luego necesitas WAV, el [Convertidor de audio](tool:audio-converter) pasa de MP3 a WAV en el navegador. Ten en cuenta que el MP3 tiene pérdida; consulta [MP3 o WAV](blog:mp3-vs-wav).

## Preguntas rápidas

**¿Acelerar reduce la calidad?** El cambio de velocidad en sí no añade ruido, pero la exportación es un MP3 nuevo: una fuente WAV pasa a tener pérdida y un MP3 se codifica por segunda vez. A 192 kbps rara vez se nota en la voz.

**¿Puedo pasar de 2× o bajar de 0,5×?** Con esta herramienta no. Los cambios extremos hacen que el habla cueste entenderse con el método de remuestreo.

**¿El archivo dura menos?** Sí. A 2× una grabación de diez minutos dura cinco; a 0,5×, veinte.

## Respeta el original

Cambiar la velocidad de la música o la grabación de otra persona no cambia quién es su dueño. Usa tus propias grabaciones o material que tengas permiso para editar y compartir.

=== ar ===
title: تغيير سرعة الصوت: ماذا يحدث لطبقة الصوت ومتى يهم ذلك
seo_title: تغيير سرعة الصوت: الطبقة والجودة والاستخدامات
description: تسريع الصوت أو إبطاؤه: لماذا يغيّر تعديل السرعة البسيط طبقة الصوت، ومتى لا يهم ذلك، ومتى تحتاج إلى تمديد الزمن، وكيف تصدّر النتيجة بصيغة MP3.
dek: شغّل تسجيلاً بسرعة 1.5× فترتفع الأصوات، وأبطئه إلى 0.75× فتنخفض. هذا ليس خللاً بل هو طريقة عمل تغيير السرعة البسيط، وفهم السبب يساعدك على اختيار الأداة المناسبة.
---
## طريقتان مختلفتان لتغيير السرعة

**إعادة التشكيل (طريقة الشريط).** يُشغَّل الصوت أسرع أو أبطأ تماماً كأسطوانة تدور بسرعة خاطئة، فتتغير المدة وطبقة الصوت معاً: ضعف السرعة يعني أوكتافاً أعلى، ونصفها يعني أوكتافاً أدنى. وهي طريقة بسيطة لا تضيف تشوهات معالجة.

**تمديد الزمن.** خوارزميات متخصصة تغيّر المدة مع الحفاظ على طبقة الصوت، وهو ما تفعله مشغلات البودكاست والفيديو عند اختيار 1.5×. وهي أعقد، وقد يبدو الصوت معها معدنياً قليلاً أو مشوشاً عند التغييرات الكبيرة.

ولا توجد طريقة «أفضل»، فلكل منهما استخدامها.

## ماذا تفعل أداة Convertios

تعمل أداة [تغيير سرعة الصوت](tool:audio-speed-changer) داخل متصفحك. تختار سرعة من 0.5× إلى 2× بخطوات قدرها 0.1، وتستمع إلى المعاينة، ثم تضغط **تصدير** لتحصل على ملف MP3. وهي تستخدم طريقة إعادة التشكيل، لذا **تتغير طبقة الصوت مع السرعة**. ولا يُرفع الملف.

ولهذا تناسب:

- صنع نسخة مبطأة أو مسرّعة من مقطع للتسلية أو كمؤثر،
- تقصير تسجيل طويل حين لا يهم تغير بسيط في الطبقة،
- سماع المقاطع السريعة ببطء لمتابعة الإيقاع مع قبول طبقة أخفض.

وليست الأداة المناسبة إن احتجت إلى الطبقة نفسها بسرعة جديدة، مثل التدرب مع أغنية بمقامها الأصلي. لذلك استخدم محرراً أو مشغلاً يدعم تمديد الزمن (ويُسمى غالباً «tempo» بدلاً من «speed»).

## ما مقدار التغيير الملحوظ

التغييرات الصغيرة خفيفة، فعند 1.1× ترتفع الطبقة أقل من نصفي تون، ويبدو الكلام أسرع وأوضح قليلاً لكنه طبيعي. ومن نحو 1.3× فما فوق تصبح الأصوات أعلى بشكل واضح، وتحت 0.8× تقريباً يبدو الكلام عميقاً وممطوطاً.

## خطوات عملية

1. **قص أولاً.** احذف البداية والنهاية غير المرغوبتين باستخدام [قص MP3](tool:mp3-cutter) لتعالج ما تحتاجه فقط؛ راجع [قص التسجيلات الصوتية](blog:trim-voice-recordings).
2. **غيّر السرعة** واستمع إلى المعاينة قبل التصدير.
3. **صدّر ملف MP3** المرمّز بمعدل 192 كيلوبت في الثانية.
4. **سمِّ النتيجة** مع ذكر السرعة، مثل `interview_1-2x.mp3`، كي لا تخلطها بالأصل.

وإن كان مصدرك WAV واحتجت إلى WAV بعد ذلك، فإن [محول الصوت](tool:audio-converter) يحوّل بين MP3 وWAV داخل المتصفح. وتذكر أن MP3 صيغة ضغط مع فقد؛ راجع [مقارنة MP3 وWAV](blog:mp3-vs-wav).

## أسئلة سريعة

**هل يقلل التسريع الجودة؟** تغيير السرعة نفسه لا يضيف ضجيجاً، لكن التصدير ملف MP3 جديد، فيصبح مصدر WAV مضغوطاً مع فقد ويُرمّز مصدر MP3 مرة ثانية. وبمعدل 192 كيلوبت في الثانية نادراً ما يُلاحظ ذلك في الكلام.

**هل يمكنني تجاوز 2× أو النزول تحت 0.5×؟** ليس بهذه الأداة، فالتغييرات الكبيرة جداً تجعل الكلام صعب الفهم بطريقة إعادة التشكيل أصلاً.

**هل تقصر مدة الملف؟** نعم. عند 2× يصبح تسجيل مدته عشر دقائق خمس دقائق، وعند 0.5× يصبح عشرين.

## احترم الأصل

تغيير سرعة موسيقى غيرك أو تسجيله لا يغيّر ملكيته. استخدم تسجيلاتك أو مواد لديك إذن بتحريرها ومشاركتها.

=== pt-br ===
title: Mudar a velocidade do áudio: o que acontece com o tom e quando importa
seo_title: Mudar a velocidade do áudio: tom, qualidade e usos
description: Acelerar ou desacelerar áudio: por que a mudança simples de velocidade altera o tom, quando isso não importa, quando é preciso esticar o tempo e como exportar em MP3.
dek: Toque uma gravação a 1,5× e as vozes sobem; desacelere para 0,75× e elas ficam graves. Não é defeito: é assim que a mudança simples de velocidade funciona. Entender o porquê ajuda a escolher a ferramenta certa.
---
## Duas formas diferentes de mudar a velocidade

**Reamostragem (o método da fita).** O áudio toca mais rápido ou mais devagar, como um disco girando na rotação errada. Duração e tom mudam juntos: duas vezes mais rápido é uma oitava acima; metade da velocidade, uma oitava abaixo. É simples e não adiciona artefatos de processamento.

**Esticamento de tempo (time-stretching).** Algoritmos especializados mudam a duração mantendo o tom, que é o que players de podcast e vídeo fazem quando você escolhe 1,5×. É mais complexo e, em mudanças grandes, pode soar um pouco metálico ou borrado.

Nenhum é "melhor"; servem para coisas diferentes.

## O que a ferramenta da Convertios faz

O [Controle de velocidade de áudio](tool:audio-speed-changer) funciona no navegador. Você escolhe uma velocidade de 0,5× a 2× em passos de 0,1, ouve a prévia e clica em **Exportar** para baixar um MP3. Ele usa a reamostragem, então **o tom muda junto com a velocidade**. O arquivo não é enviado.

Por isso funciona bem para:

- criar uma versão desacelerada ou acelerada de um clipe, como efeito ou diversão,
- encurtar uma gravação longa quando uma pequena mudança de tom não importa,
- ouvir trechos rápidos mais devagar para acompanhar o ritmo, aceitando o tom mais grave.

Não é a ferramenta certa quando você precisa do mesmo tom em outra velocidade, como praticar junto com uma música no tom original. Para isso, use um editor ou player com esticamento de tempo (muitas vezes chamado de "tempo" em vez de "velocidade").

## Quanto a mudança se nota

Mudanças pequenas são sutis. A 1,1× o tom sobe menos de dois semitons: a fala soa um pouco mais viva e rápida, mas natural. A partir de 1,3× as vozes ficam claramente mais agudas. Abaixo de 0,8×, a fala soa grave e arrastada.

## Fluxo prático

1. **Corte antes.** Tire começo e fim indesejados com o [Cortar MP3](tool:mp3-cutter) para processar só o necessário; veja [como cortar gravações de voz](blog:trim-voice-recordings).
2. **Mude a velocidade** e ouça a prévia antes de exportar.
3. **Exporte o MP3**, codificado a 192 kbps.
4. **Nomeie o resultado** com a velocidade, como `entrevista_1-2x.mp3`, para não confundir com o original.

Se a fonte é WAV e você precisa de WAV depois, o [Conversor de áudio](tool:audio-converter) converte entre MP3 e WAV no navegador. Lembre que o MP3 tem perdas; veja [MP3 ou WAV](blog:mp3-vs-wav).

## Perguntas rápidas

**Acelerar reduz a qualidade?** A mudança de velocidade em si não adiciona ruído, mas a exportação é um MP3 novo: uma fonte WAV passa a ter perdas e um MP3 é codificado pela segunda vez. A 192 kbps isso raramente é perceptível na fala.

**Dá para passar de 2× ou ficar abaixo de 0,5×?** Não com esta ferramenta. Mudanças extremas deixam a fala difícil de entender com a reamostragem.

**O arquivo fica mais curto?** Sim. A 2×, uma gravação de dez minutos vira cinco; a 0,5×, vira vinte.

## Respeite o original

Mudar a velocidade da música ou gravação de outra pessoa não muda quem é o dono. Use suas próprias gravações ou material que você tem permissão para editar e compartilhar.
