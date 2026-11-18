---
category: qr-web
type: guide
published: 2026-11-18
order: 172
status: published
cover_image: link-shortener-safety
cover: tinyurl → ?
tools: link-shortener, qr-generator
related: qr-code-scam-safety, qr-codes-for-business
keyword: are link shorteners safe
intent: informational
---
=== en ===
cover_alt: Short link checked behind a security shield
title: Are link shorteners safe? How to create and open short links wisely
seo_title: Are link shorteners safe? Creating and opening short links
description: Short links are convenient but hide their destination and are public. Risks for senders and recipients, how to preview short links and when not to shorten.
dek: A short link turns a long, messy address into something easy to type or print. The trade-off is that nobody can see where it leads until they click, and anyone with the link can use it.
---
## How a short link works

When you shorten an address, the service stores a mapping: `short.example/abc123` points to your long URL. When someone opens the short link, the service's server looks up the mapping and redirects their browser to the destination.

Two consequences follow:

1. **The destination is hidden** until the redirect happens.
2. **The link depends on the service.** If the provider removes the link, changes its policy or shuts down, the short link stops working.

## Risks for people who receive short links

Because the destination is invisible, short links are popular in phishing messages. A text claiming to be from a delivery company or bank with a short link is a classic pattern. Be cautious when:

- the message creates urgency ("your account will be closed today"),
- it asks you to log in, pay or confirm personal details,
- it arrives from an unexpected sender.

### How to check before you open

- **Preview it.** Some shortening services offer a preview: TinyURL, for example, has a preview feature for its links. Check the provider's own help pages for how to use it.
- **Long-press instead of tapping** on a phone; many browsers show the address before opening it, though for a short link that only shows the short address.
- **Go directly to the source.** If a message says your parcel is delayed, open the courier's app or type its website address yourself.

## Risks for people who create short links

- **Short links are public.** Anyone who has the link can open it, and short codes can sometimes be guessed. Do not shorten addresses that contain private information, such as login tokens, private document links, password-reset links or personal details in parameters.
- **You may not be able to edit or delete it.** Many free services do not let you change the destination or revoke the link later.
- **Trust signals are lost.** Recipients cannot see your domain, which can make legitimate messages look suspicious.

## How the Convertios Link Shortener works

The [Link Shortener](tool:link-shortener) passes the address you enter through the Convertios server to TinyURL, with is.gd as a fallback. That means:

- the short link is created and hosted by an external provider, not by Convertios;
- the page cannot edit or revoke a link after a provider creates it, so keep the original address;
- you should not shorten addresses that contain private information.

## When to use a short link, and when not to

**Good uses:**

- Making a long public URL easier to type from a printed slide or poster.
- Reducing the density of a QR code so it prints smaller and scans more easily; see [QR code print size](blog:qr-code-print-size).
- Sharing a public article or form in a space with a character limit.

**Better alternatives:**

- **Your own domain:** a short path such as `yourbusiness.com/menu` is trustworthy, editable and under your control.
- **The full URL** in emails and documents, where length is not a problem and recipients can see the destination.

If you put a short link inside a [QR code](tool:qr-generator), test both: the code should open the short link, and the short link should reach the right page.

=== es ===
cover_alt: Enlace corto verificado tras un escudo
title: ¿Son seguros los acortadores de enlaces? Cómo crear y abrir enlaces cortos con cabeza
seo_title: ¿Son seguros los acortadores de enlaces?
description: Los enlaces cortos son cómodos, pero ocultan su destino y son públicos. Riesgos para quien los envía y quien los recibe, cómo previsualizarlos y cuándo no acortar.
dek: Un enlace corto convierte una dirección larga y desordenada en algo fácil de escribir o imprimir. A cambio, nadie puede ver adónde lleva hasta que hace clic, y cualquiera que lo tenga puede usarlo.
---
## Cómo funciona un enlace corto

Al acortar una dirección, el servicio guarda una correspondencia: `corto.ejemplo/abc123` apunta a tu URL larga. Cuando alguien abre el enlace corto, el servidor del servicio busca esa correspondencia y redirige su navegador al destino.

De ahí se derivan dos consecuencias:

1. **El destino está oculto** hasta que se produce la redirección.
2. **El enlace depende del servicio.** Si el proveedor elimina el enlace, cambia sus normas o cierra, el enlace corto deja de funcionar.

## Riesgos para quien recibe enlaces cortos

Como el destino es invisible, los enlaces cortos son habituales en mensajes de phishing. Un SMS que dice venir de una empresa de mensajería o de un banco con un enlace corto es un patrón clásico. Ten cuidado cuando:

- el mensaje mete prisa («tu cuenta se cerrará hoy»),
- te pide iniciar sesión, pagar o confirmar datos personales,
- llega de un remitente inesperado.

### Cómo comprobarlo antes de abrir

- **Previsualízalo.** Algunos servicios de acortamiento ofrecen una vista previa: TinyURL, por ejemplo, tiene una función de vista previa para sus enlaces. Consulta la ayuda del propio proveedor para saber cómo usarla.
- **Mantén pulsado en lugar de tocar** en el móvil; muchos navegadores muestran la dirección antes de abrirla, aunque en un enlace corto solo verás la dirección corta.
- **Ve directamente a la fuente.** Si un mensaje dice que tu paquete se ha retrasado, abre la app de la empresa de mensajería o escribe tú mismo su web.

## Riesgos para quien crea enlaces cortos

- **Los enlaces cortos son públicos.** Cualquiera que tenga el enlace puede abrirlo, y a veces los códigos cortos se pueden adivinar. No acortes direcciones que contengan información privada, como tokens de acceso, enlaces a documentos privados, enlaces para restablecer contraseñas o datos personales en los parámetros.
- **Quizá no puedas editarlo ni borrarlo.** Muchos servicios gratuitos no permiten cambiar el destino ni anular el enlace después.
- **Se pierden señales de confianza.** Quien lo recibe no ve tu dominio, lo que puede hacer que un mensaje legítimo parezca sospechoso.

## Cómo funciona el Acortador de enlaces de Convertios

El [Acortador de enlaces](tool:link-shortener) envía la dirección que escribes a través del servidor de Convertios a TinyURL, con is.gd como alternativa. Eso significa que:

- el enlace corto lo crea y aloja un proveedor externo, no Convertios;
- la página no puede editar ni anular un enlace una vez creado por el proveedor, así que guarda la dirección original;
- no debes acortar direcciones que contengan información privada.

## Cuándo usar un enlace corto y cuándo no

**Buenos usos:**

- Hacer más fácil de escribir una URL pública larga desde una diapositiva o un cartel.
- Reducir la densidad de un código QR para que se imprima más pequeño y se lea mejor; consulta [el tamaño de impresión de un QR](blog:qr-code-print-size).
- Compartir un artículo o formulario público en un espacio con límite de caracteres.

**Mejores alternativas:**

- **Tu propio dominio:** una ruta corta como `tunegocio.com/carta` inspira confianza, se puede editar y la controlas tú.
- **La URL completa** en correos y documentos, donde la longitud no es un problema y el destinatario ve adónde va.

Si pones un enlace corto dentro de un [código QR](tool:qr-generator), prueba ambos: el código debe abrir el enlace corto, y el enlace corto debe llegar a la página correcta.

=== ar ===
cover_alt: رابط مختصر يخضع للتحقق خلف درع
title: هل الروابط المختصرة آمنة؟ كيف تنشئها وتفتحها بحكمة
seo_title: هل الروابط المختصرة آمنة؟ إنشاؤها وفتحها
description: الروابط المختصرة مريحة لكنها تخفي وجهتها وتكون عامة. تعرّف إلى مخاطرها على المرسل والمستلم، وكيف تعاين الرابط المختصر، ومتى تتجنب الاختصار.
dek: يحوّل الرابط المختصر عنواناً طويلاً وفوضوياً إلى شيء سهل الكتابة أو الطباعة، لكن في المقابل لا يستطيع أحد معرفة وجهته حتى ينقر عليه، ويستطيع أي شخص يملكه استخدامه.
---
## كيف يعمل الرابط المختصر

عندما تختصر عنواناً تحفظ الخدمة علاقة بين رابطين: `short.example/abc123` يشير إلى رابطك الطويل. وعندما يفتح أحدهم الرابط المختصر يبحث خادم الخدمة عن هذه العلاقة ويحوّل متصفحه إلى الوجهة.

وينتج عن ذلك أمران:

1. **الوجهة مخفية** حتى يحدث التحويل.
2. **الرابط يعتمد على الخدمة.** إذا حذف المزوّد الرابط أو غيّر سياسته أو أُغلق، يتوقف الرابط المختصر عن العمل.

## المخاطر على من يتلقى الروابط المختصرة

لأن الوجهة غير ظاهرة تنتشر الروابط المختصرة في رسائل التصيد. الرسالة النصية التي تدّعي أنها من شركة شحن أو بنك وتحتوي رابطاً مختصراً نمط معروف. كن حذراً عندما:

- تستعجلك الرسالة («سيُغلق حسابك اليوم»)،
- تطلب منك تسجيل الدخول أو الدفع أو تأكيد بيانات شخصية،
- تصلك من مرسل غير متوقع.

### كيف تتحقق قبل الفتح

- **عاين الرابط.** تقدم بعض خدمات الاختصار ميزة معاينة؛ فلدى TinyURL مثلاً ميزة لمعاينة روابطها. راجع صفحات المساعدة لدى المزوّد لمعرفة طريقة استخدامها.
- **اضغط مطولاً بدلاً من النقر** على الهاتف؛ فكثير من المتصفحات تعرض العنوان قبل فتحه، وإن كان ذلك في الرابط المختصر لا يُظهر سوى العنوان المختصر.
- **اذهب إلى المصدر مباشرة.** إذا قالت رسالة إن طردك تأخر فافتح تطبيق شركة الشحن أو اكتب عنوان موقعها بنفسك.

## المخاطر على من ينشئ الروابط المختصرة

- **الروابط المختصرة عامة.** يستطيع أي شخص يملك الرابط فتحه، وقد يمكن أحياناً تخمين الرموز القصيرة. لا تختصر عناوين تحتوي معلومات خاصة مثل رموز تسجيل الدخول أو روابط المستندات الخاصة أو روابط إعادة تعيين كلمات المرور أو بيانات شخصية في المعاملات.
- **قد لا تستطيع تعديله أو حذفه.** لا تتيح خدمات مجانية كثيرة تغيير الوجهة أو إلغاء الرابط لاحقاً.
- **تضيع إشارات الثقة.** لا يرى المستلمون نطاقك، وقد يجعل ذلك الرسائل المشروعة تبدو مريبة.

## كيف تعمل أداة اختصار الروابط في Convertios

ترسل أداة [اختصار الروابط](tool:link-shortener) العنوان الذي تدخله عبر خادم Convertios إلى TinyURL، مع is.gd كبديل. وهذا يعني:

- أن الرابط المختصر ينشئه ويستضيفه مزوّد خارجي لا Convertios،
- وأن الصفحة لا تستطيع تعديل الرابط أو إلغاءه بعد أن ينشئه المزوّد، فاحتفظ بالعنوان الأصلي،
- وأنه لا ينبغي اختصار عناوين تحتوي معلومات خاصة.

## متى تستخدم الرابط المختصر ومتى لا

**استخدامات جيدة:**

- تسهيل كتابة رابط عام طويل من شريحة عرض أو ملصق مطبوع.
- تقليل كثافة رمز QR ليُطبع أصغر ويُمسح بسهولة أكبر؛ راجع [حجم طباعة رمز QR](blog:qr-code-print-size).
- مشاركة مقال أو نموذج عام في مساحة محدودة الحروف.

**بدائل أفضل:**

- **نطاقك الخاص:** مسار قصير مثل `yourbusiness.com/menu` جدير بالثقة وقابل للتعديل وتحت سيطرتك.
- **الرابط الكامل** في الرسائل البريدية والمستندات، حيث لا يشكل الطول مشكلة ويرى المستلم الوجهة.

إذا وضعت رابطاً مختصراً داخل [رمز QR](tool:qr-generator) فاختبر الاثنين: يجب أن يفتح الرمز الرابط المختصر، ويجب أن يصل الرابط المختصر إلى الصفحة الصحيحة.

=== pt-br ===
cover_alt: Link curto verificado atrás de um escudo
title: Encurtadores de link são seguros? Como criar e abrir links curtos com cuidado
seo_title: Encurtadores de link são seguros? Criar e abrir links curtos
description: Links curtos são práticos, mas escondem o destino e são públicos. Veja os riscos para quem envia e quem recebe, como pré-visualizar um link curto e quando não encurtar.
dek: Um link curto transforma um endereço longo e bagunçado em algo fácil de digitar ou imprimir. Em troca, ninguém vê para onde ele leva até clicar, e qualquer pessoa com o link pode usá-lo.
---
## Como um link curto funciona

Quando você encurta um endereço, o serviço guarda uma correspondência: `curto.exemplo/abc123` aponta para a sua URL longa. Quando alguém abre o link curto, o servidor do serviço procura essa correspondência e redireciona o navegador para o destino.

Disso resultam duas coisas:

1. **O destino fica escondido** até o redirecionamento acontecer.
2. **O link depende do serviço.** Se o fornecedor apagar o link, mudar as regras ou encerrar, o link curto para de funcionar.

## Riscos para quem recebe links curtos

Como o destino é invisível, links curtos são comuns em mensagens de golpe. Um SMS que diz ser de uma transportadora ou banco com um link curto é um padrão clássico. Tenha cuidado quando:

- a mensagem cria urgência ("sua conta será bloqueada hoje"),
- pede para você fazer login, pagar ou confirmar dados pessoais,
- chega de um remetente inesperado.

### Como conferir antes de abrir

- **Pré-visualize.** Alguns serviços de encurtamento oferecem pré-visualização: o TinyURL, por exemplo, tem um recurso de pré-visualização para os seus links. Consulte a ajuda do próprio fornecedor para saber como usar.
- **Toque e segure em vez de tocar** no celular; muitos navegadores mostram o endereço antes de abrir, embora em um link curto só apareça o endereço curto.
- **Vá direto à fonte.** Se uma mensagem diz que a sua encomenda atrasou, abra o app da transportadora ou digite você mesmo o site dela.

## Riscos para quem cria links curtos

- **Links curtos são públicos.** Qualquer pessoa com o link consegue abrir, e códigos curtos às vezes podem ser adivinhados. Não encurte endereços com informações privadas, como tokens de login, links de documentos privados, links de redefinição de senha ou dados pessoais nos parâmetros.
- **Talvez não dê para editar ou apagar.** Muitos serviços gratuitos não permitem mudar o destino nem revogar o link depois.
- **Sinais de confiança se perdem.** Quem recebe não vê o seu domínio, o que pode fazer mensagens legítimas parecerem suspeitas.

## Como funciona o Encurtador de links da Convertios

O [Encurtador de links](tool:link-shortener) envia o endereço que você digita pelo servidor da Convertios para o TinyURL, com o is.gd como alternativa. Isso significa que:

- o link curto é criado e hospedado por um fornecedor externo, não pela Convertios;
- a página não consegue editar nem revogar um link depois que o fornecedor o cria, então guarde o endereço original;
- você não deve encurtar endereços que contenham informações privadas.

## Quando usar um link curto e quando não usar

**Bons usos:**

- Deixar uma URL pública longa mais fácil de digitar a partir de um slide ou cartaz.
- Reduzir a densidade de um QR Code para que ele seja impresso menor e lido com mais facilidade; veja [o tamanho de impressão do QR Code](blog:qr-code-print-size).
- Compartilhar um artigo ou formulário público em um espaço com limite de caracteres.

**Alternativas melhores:**

- **O seu próprio domínio:** um caminho curto como `seunegocio.com.br/cardapio` passa confiança, pode ser editado e fica sob o seu controle.
- **A URL completa** em e-mails e documentos, onde o tamanho não é problema e quem recebe vê o destino.

Se você colocar um link curto dentro de um [QR Code](tool:qr-generator), teste os dois: o código deve abrir o link curto, e o link curto deve chegar à página certa.
