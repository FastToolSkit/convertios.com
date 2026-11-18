---
category: productivity
type: guide
published: 2026-11-18
order: 195
status: published
cover_image: strong-password-guide
cover: ●●●●●●●● 16+
tools: password-generator, word-counter
related: link-shortener-safety, file-naming-and-organizing
keyword: how to create a strong password
intent: how-to
---
=== en ===
cover_alt: Conceptual illustration of a blue glass padlock and a metal key in magenta and amber light.
title: How to create a strong password you never have to remember
seo_title: How to create a strong password
description: Length beats complexity, every account needs its own password, and a password manager does the remembering. A practical guide with the numbers behind it.
dek: The strongest password is one nobody could guess and you never reuse. Random generators and password managers make that easy, as long as a few habits come with them.
---
## What makes a password strong

Attackers rarely guess passwords by hand. They use software that tries common passwords, dictionary words with predictable changes ("P@ssw0rd!") and passwords leaked from other sites. A strong password resists all three:

- **It is long.** Each extra character multiplies the number of possibilities.
- **It is random.** Nothing about you, no words in obvious patterns.
- **It is unique.** Used for one account only, so a leak elsewhere does not unlock it.

## Length beats clever tricks

Strength is often measured in **bits of randomness**: each extra bit doubles the number of guesses needed. For a truly random password, the bits depend on the length and on how many characters are possible.

| Length | All four character types (86 characters) | Lowercase and digits only (36 characters) |
| --- | --- | --- |
| 12 | about 77 bits | about 62 bits |
| 16 | about 103 bits | about 83 bits |
| 20 | about 128 bits | about 103 bits |

A 20-character password of only lowercase letters and digits is as strong as a 16-character one using every symbol. For important accounts, aim for **at least 16 random characters**.

These figures apply to random passwords. "Summer2026!" has 11 characters but is weak, because it follows a pattern attackers try early.

## Generate one in your browser

The Convertios [Password Generator](tool:password-generator) creates passwords on the page itself using the browser's Web Crypto API (`crypto.getRandomValues`), the same randomness source browsers use for encryption keys. Nothing is sent to Convertios and nothing is saved; the password disappears when you reload or close the page.

- Choose a length from 6 to 50 characters.
- Tick uppercase letters, lowercase letters, digits and symbols. Each ticked type appears at least once, and the result is shuffled.
- Every character is chosen with equal probability; the generator avoids the "modulo bias" that can make some characters more likely.

If a website rejects some symbols, untick Symbols and add three or four characters to make up the difference.

## Store it properly

Nobody can remember dozens of random passwords, and nobody should try:

1. **Use a password manager.** Built into most browsers and phones, or as a dedicated app. It remembers, fills in and syncs passwords.
2. **Do not store passwords in notes, documents or screenshots,** which are easy to leak.
3. **Clear the clipboard.** Some devices sync the clipboard between phone and computer. After pasting a password, copy something else.

## The habits that matter even more

- **Use a different password for every account.** Reuse is how one breach spreads to email, banking and shopping.
- **Turn on two-step verification** wherever offered. A strong password does not protect you if you type it into a fake login page.
- **Check the address before logging in,** especially after clicking links in messages. Our guides on [link shortener safety](blog:link-shortener-safety) and QR scams cover common tricks.
- **Change a password immediately** if a service tells you it was involved in a breach.

## What about passphrases?

A passphrase of several random words, such as four to six words picked by a random process, can be strong and easier to type on a TV or game console. The key word is *random*: a famous quote or song lyric is not. For everything stored in a password manager, a long random character password is simplest.

=== es ===
cover_alt: Ilustración conceptual de un candado de cristal azul y una llave metálica bajo luces magenta y ámbar.
title: Cómo crear una contraseña segura que nunca tengas que recordar
seo_title: Cómo crear una contraseña segura
description: La longitud gana a la complejidad, cada cuenta necesita su propia contraseña y un gestor de contraseñas las recuerda por ti. Guía práctica con las cifras que lo explican.
dek: La contraseña más fuerte es la que nadie podría adivinar y que no repites nunca. Los generadores aleatorios y los gestores de contraseñas lo ponen fácil, siempre que vayan acompañados de unos cuantos hábitos.
---
## Qué hace fuerte una contraseña

Los atacantes rara vez adivinan contraseñas a mano. Usan programas que prueban contraseñas comunes, palabras del diccionario con cambios previsibles («C0ntr@seña!») y contraseñas filtradas de otras webs. Una contraseña fuerte resiste las tres cosas:

- **Es larga.** Cada carácter extra multiplica las posibilidades.
- **Es aleatoria.** Nada sobre ti, ninguna palabra con patrones evidentes.
- **Es única.** Se usa en una sola cuenta, así que una filtración en otro sitio no la abre.

## La longitud gana a los trucos

La fuerza suele medirse en **bits de aleatoriedad**: cada bit extra duplica el número de intentos necesarios. En una contraseña realmente aleatoria, los bits dependen de la longitud y de cuántos caracteres son posibles.

| Longitud | Los cuatro tipos de caracteres (86) | Solo minúsculas y dígitos (36) |
| --- | --- | --- |
| 12 | unos 77 bits | unos 62 bits |
| 16 | unos 103 bits | unos 83 bits |
| 20 | unos 128 bits | unos 103 bits |

Una contraseña de 20 caracteres con solo minúsculas y dígitos es tan fuerte como una de 16 que use todos los símbolos. Para las cuentas importantes, apunta a **al menos 16 caracteres aleatorios**.

Estas cifras valen para contraseñas aleatorias. «Verano2026!» tiene 11 caracteres pero es débil, porque sigue un patrón que los atacantes prueban pronto.

## Genera una en tu navegador

El [Generador de contraseñas](tool:password-generator) de Convertios crea las contraseñas en la propia página usando la Web Crypto API del navegador (`crypto.getRandomValues`), la misma fuente de aleatoriedad que usan los navegadores para las claves de cifrado. No se envía nada a Convertios ni se guarda nada; la contraseña desaparece al recargar o cerrar la página.

- Elige una longitud de 6 a 50 caracteres.
- Marca mayúsculas, minúsculas, dígitos y símbolos. Cada tipo marcado aparece al menos una vez y el resultado se mezcla.
- Cada carácter se elige con la misma probabilidad; el generador evita el «sesgo de módulo» que puede hacer más probables algunos caracteres.

Si una web rechaza algunos símbolos, desmarca Símbolos y añade tres o cuatro caracteres para compensar.

## Guárdala bien

Nadie puede recordar decenas de contraseñas aleatorias, ni debería intentarlo:

1. **Usa un gestor de contraseñas.** Viene integrado en la mayoría de navegadores y móviles, o como app específica. Las recuerda, las rellena y las sincroniza.
2. **No guardes contraseñas en notas, documentos ni capturas,** que se filtran con facilidad.
3. **Limpia el portapapeles.** Algunos dispositivos sincronizan el portapapeles entre móvil y ordenador. Después de pegar una contraseña, copia otra cosa.

## Los hábitos que importan todavía más

- **Usa una contraseña distinta en cada cuenta.** Repetirlas es lo que hace que una filtración llegue al correo, al banco y a las compras.
- **Activa la verificación en dos pasos** siempre que se ofrezca. Una contraseña fuerte no te protege si la escribes en una página de inicio de sesión falsa.
- **Comprueba la dirección antes de iniciar sesión,** sobre todo tras pulsar enlaces de mensajes. Nuestras guías sobre [la seguridad de los acortadores de enlaces](blog:link-shortener-safety) y las estafas con QR explican los trucos habituales.
- **Cambia una contraseña de inmediato** si un servicio te avisa de que sufrió una filtración.

## ¿Y las frases de contraseña?

Una frase de contraseña de varias palabras aleatorias, por ejemplo de cuatro a seis palabras elegidas por un proceso aleatorio, puede ser fuerte y más fácil de escribir en una tele o una consola. La clave es *aleatoria*: una cita famosa o un verso de una canción no lo son. Para todo lo que guardes en un gestor, lo más sencillo es una contraseña larga de caracteres aleatorios.

=== ar ===
cover_alt: رسم توضيحي لقفل زجاجي أزرق ومفتاح معدني تحت إضاءة أرجوانية وكهرمانية.
title: كيف تنشئ كلمة مرور قوية لا تحتاج إلى تذكرها أبداً
seo_title: كيف تنشئ كلمة مرور قوية
description: الطول أهم من التعقيد، ولكل حساب كلمة مرور خاصة، ومدير كلمات المرور يتذكرها عنك. دليل عملي مع الأرقام التي تشرح السبب.
dek: أقوى كلمة مرور هي التي لا يستطيع أحد تخمينها ولا تكررها أبداً. تجعل المولدات العشوائية ومديرو كلمات المرور ذلك سهلاً، بشرط أن ترافقها عادات قليلة.
---
## ما الذي يجعل كلمة المرور قوية

نادراً ما يخمّن المهاجمون كلمات المرور يدوياً؛ بل يستخدمون برامج تجرب كلمات المرور الشائعة، وكلمات القواميس مع تغييرات متوقعة (مثل «P@ssw0rd!»)، وكلمات مرور مسربة من مواقع أخرى. وكلمة المرور القوية تصمد أمام الثلاثة:

- **طويلة.** كل حرف إضافي يضاعف عدد الاحتمالات.
- **عشوائية.** لا شيء عنك، ولا كلمات بأنماط واضحة.
- **فريدة.** تُستخدم لحساب واحد فقط، فلا يفتحها تسريب في موقع آخر.

## الطول يتفوق على الحيل الذكية

تُقاس القوة غالباً **ببتات العشوائية**: كل بت إضافي يضاعف عدد المحاولات اللازمة. وفي كلمة المرور العشوائية حقاً تعتمد البتات على الطول وعدد الأحرف الممكنة.

| الطول | الأنواع الأربعة من الأحرف (86 حرفاً) | أحرف صغيرة وأرقام فقط (36 حرفاً) |
| --- | --- | --- |
| 12 | نحو 77 بت | نحو 62 بت |
| 16 | نحو 103 بت | نحو 83 بت |
| 20 | نحو 128 بت | نحو 103 بت |

كلمة مرور من 20 حرفاً صغيراً ورقماً فقط بقوة كلمة من 16 حرفاً تستخدم كل الرموز. للحسابات المهمة استهدف **16 حرفاً عشوائياً على الأقل**.

هذه الأرقام تنطبق على كلمات المرور العشوائية؛ فعبارة «Summer2026!» من 11 حرفاً لكنها ضعيفة لأنها تتبع نمطاً يجربه المهاجمون مبكراً.

## أنشئ واحدة داخل متصفحك

ينشئ [مولد كلمات المرور](tool:password-generator) في Convertios كلمات المرور في الصفحة نفسها باستخدام واجهة Web Crypto في المتصفح (`crypto.getRandomValues`)، وهي مصدر العشوائية نفسه الذي تستخدمه المتصفحات لمفاتيح التشفير. لا يُرسل شيء إلى Convertios ولا يُحفظ شيء، وتختفي كلمة المرور عند إعادة تحميل الصفحة أو إغلاقها.

- اختر طولاً بين 6 و50 حرفاً.
- حدد الأحرف الكبيرة والصغيرة والأرقام والرموز. يظهر كل نوع محدد مرة واحدة على الأقل، وتُخلط النتيجة.
- يُختار كل حرف باحتمال متساوٍ، ويتجنب المولد «انحياز باقي القسمة» الذي قد يجعل بعض الأحرف أكثر احتمالاً.

إذا رفض موقع ما بعض الرموز فألغِ تحديد الرموز وأضف ثلاثة أو أربعة أحرف لتعويض الفرق.

## احفظها بالطريقة الصحيحة

لا أحد يستطيع تذكر عشرات كلمات المرور العشوائية، ولا ينبغي أن يحاول:

1. **استخدم مدير كلمات مرور.** مدمج في معظم المتصفحات والهواتف أو كتطبيق مستقل، يتذكر كلمات المرور ويملؤها ويزامنها.
2. **لا تحفظ كلمات المرور في الملاحظات أو المستندات أو لقطات الشاشة،** فهي سهلة التسريب.
3. **امسح الحافظة.** تزامن بعض الأجهزة الحافظة بين الهاتف والحاسوب، فبعد لصق كلمة المرور انسخ شيئاً آخر.

## العادات الأهم من ذلك

- **استخدم كلمة مرور مختلفة لكل حساب.** التكرار هو ما ينقل تسريباً واحداً إلى البريد والبنك والتسوق.
- **فعّل التحقق بخطوتين** حيثما توفر. كلمة المرور القوية لا تحميك إذا كتبتها في صفحة دخول مزيفة.
- **تحقق من العنوان قبل تسجيل الدخول،** خصوصاً بعد النقر على روابط في الرسائل. يشرح دليلانا عن [أمان الروابط المختصرة](blog:link-shortener-safety) والاحتيال عبر QR الحيل الشائعة.
- **غيّر كلمة المرور فوراً** إذا أبلغتك خدمة أنها تعرضت لتسريب.

## ماذا عن عبارات المرور؟

عبارة المرور المكونة من عدة كلمات عشوائية، مثل أربع إلى ست كلمات تختارها عملية عشوائية، قد تكون قوية وأسهل في الكتابة على التلفاز أو جهاز الألعاب. الكلمة المفتاح هي *عشوائية*؛ فالاقتباس الشهير أو بيت الأغنية ليس عشوائياً. ولكل ما تحفظه في مدير كلمات المرور تبقى كلمة المرور الطويلة من أحرف عشوائية الخيار الأبسط.

=== pt-br ===
cover_alt: Ilustração conceitual de um cadeado de vidro azul e uma chave metálica sob luzes magenta e âmbar.
title: Como criar uma senha forte que você nunca precisa decorar
seo_title: Como criar uma senha forte
description: Tamanho vale mais que complexidade, cada conta precisa da sua própria senha e um gerenciador de senhas lembra por você. Guia prático com os números por trás.
dek: A senha mais forte é a que ninguém conseguiria adivinhar e que você nunca repete. Geradores aleatórios e gerenciadores de senhas facilitam isso, desde que venham acompanhados de alguns hábitos.
---
## O que torna uma senha forte

Atacantes raramente adivinham senhas na mão. Eles usam programas que testam senhas comuns, palavras do dicionário com mudanças previsíveis ("S3nh@123!") e senhas vazadas de outros sites. Uma senha forte resiste aos três:

- **É longa.** Cada caractere extra multiplica as possibilidades.
- **É aleatória.** Nada sobre você, nenhuma palavra em padrões óbvios.
- **É única.** Usada em uma só conta, então um vazamento em outro lugar não a abre.

## Tamanho vence truques

A força costuma ser medida em **bits de aleatoriedade**: cada bit extra dobra o número de tentativas necessárias. Em uma senha realmente aleatória, os bits dependem do tamanho e de quantos caracteres são possíveis.

| Tamanho | Os quatro tipos de caracteres (86) | Só minúsculas e números (36) |
| --- | --- | --- |
| 12 | cerca de 77 bits | cerca de 62 bits |
| 16 | cerca de 103 bits | cerca de 83 bits |
| 20 | cerca de 128 bits | cerca de 103 bits |

Uma senha de 20 caracteres só com minúsculas e números é tão forte quanto uma de 16 que usa todos os símbolos. Para contas importantes, mire em **pelo menos 16 caracteres aleatórios**.

Esses números valem para senhas aleatórias. "Verao2026!" tem 10 caracteres, mas é fraca, porque segue um padrão que os atacantes testam cedo.

## Gere uma no navegador

O [Gerador de senhas](tool:password-generator) da Convertios cria as senhas na própria página usando a Web Crypto API do navegador (`crypto.getRandomValues`), a mesma fonte de aleatoriedade que os navegadores usam para chaves de criptografia. Nada é enviado à Convertios e nada é salvo; a senha some quando você recarrega ou fecha a página.

- Escolha um tamanho de 6 a 50 caracteres.
- Marque maiúsculas, minúsculas, números e símbolos. Cada tipo marcado aparece pelo menos uma vez, e o resultado é embaralhado.
- Cada caractere é escolhido com a mesma probabilidade; o gerador evita o "viés de módulo" que pode deixar alguns caracteres mais prováveis.

Se um site recusar alguns símbolos, desmarque Símbolos e acrescente três ou quatro caracteres para compensar.

## Guarde do jeito certo

Ninguém consegue lembrar dezenas de senhas aleatórias, e ninguém deveria tentar:

1. **Use um gerenciador de senhas.** Ele vem embutido na maioria dos navegadores e celulares, ou como app próprio. Guarda, preenche e sincroniza as senhas.
2. **Não guarde senhas em notas, documentos ou capturas de tela,** que vazam com facilidade.
3. **Limpe a área de transferência.** Alguns aparelhos sincronizam a área de transferência entre celular e computador. Depois de colar uma senha, copie outra coisa.

## Os hábitos que importam ainda mais

- **Use uma senha diferente em cada conta.** A repetição é o que espalha um vazamento para e-mail, banco e compras.
- **Ative a verificação em duas etapas** sempre que houver. Uma senha forte não protege você se for digitada em uma página de login falsa.
- **Confira o endereço antes de entrar,** principalmente depois de clicar em links de mensagens. Nossos guias sobre [a segurança dos encurtadores de link](blog:link-shortener-safety) e os golpes com QR Code explicam os truques mais comuns.
- **Troque a senha na hora** se um serviço avisar que sofreu um vazamento.

## E as frases-senha?

Uma frase-senha com várias palavras aleatórias, por exemplo de quatro a seis palavras escolhidas por um processo aleatório, pode ser forte e mais fácil de digitar em uma TV ou videogame. A palavra-chave é *aleatória*: uma frase famosa ou um verso de música não é. Para tudo o que fica no gerenciador, uma senha longa de caracteres aleatórios é o mais simples.
