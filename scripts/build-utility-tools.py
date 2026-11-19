"""Generate only validated browser utility pages and their discovery links."""
from hashlib import sha256
from html import escape
from pathlib import Path
import json
import re
from artifact_content import TOOLS as ARTIFACTS, COMMON as ARTIFACT_LABELS

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://convertios.com"
PREFIX = {"en": "", "es": "es/", "ar": "ar/", "pt-BR": "pt-br/"}

# Each entry is title, description, use, limitation, question, answer.
TOOLS = {
    "json-formatter-validator": {
        "category": "developer", "icon": "{}",
        "en": ["JSON Formatter and Validator", "Validate JSON in your browser, see parse errors with a location, and download pretty or compact output.", "Paste JSON or load a UTF-8 file, then choose two-space formatting or compact output. A syntax error includes the line and column when the browser reports a position.", "Input is capped at 2 MiB. This checks JSON syntax; it does not check a JSON Schema. Your data stays in the browser.", "Does formatting change my data?", "No. Both modes parse the document and serialize the same JSON values. Whitespace and original number spelling may change."],
        "es": ["Formateador y validador JSON", "Valida JSON en tu navegador, localiza errores de sintaxis y descarga el resultado legible o compacto.", "Pega JSON o carga un archivo UTF-8 y elige sangría de dos espacios o salida compacta. Los errores muestran línea y columna cuando el navegador informa la posición.", "El límite es 2 MiB. Se comprueba la sintaxis, no un esquema JSON. Tus datos permanecen en el navegador.", "¿Cambia los datos al dar formato?", "No. Se analizan y serializan los mismos valores JSON, aunque pueden cambiar los espacios y la escritura de los números."],
        "ar": ["تنسيق JSON والتحقق منه", "تحقق من صيغة JSON في متصفحك، واعرف موضع الخطأ، ونزّل نسخة منسقة أو مضغوطة.", "الصق JSON أو حمّل ملف UTF-8، ثم اختر مسافتين للمسافة البادئة أو إخراجًا مضغوطًا. تظهر أرقام السطر والعمود عندما يحدد المتصفح موضع الخطأ.", "الحد الأقصى 2 ميبيبايت. تفحص الأداة الصيغة فقط وليس مخطط JSON. تبقى بياناتك في المتصفح.", "هل يغيّر التنسيق البيانات؟", "لا. تحلل الأداة قيم JSON نفسها وتعيد كتابتها، لكن المسافات وطريقة كتابة الأرقام قد تتغير."],
        "pt-BR": ["Formatador e validador JSON", "Valide JSON no navegador, localize erros de sintaxe e baixe o resultado formatado ou compacto.", "Cole JSON ou carregue um arquivo UTF-8 e escolha recuo de dois espaços ou saída compacta. Os erros mostram linha e coluna quando o navegador informa a posição.", "O limite é 2 MiB. A ferramenta verifica a sintaxe, não um JSON Schema. Seus dados ficam no navegador.", "A formatação altera os dados?", "Não. Os mesmos valores JSON são analisados e serializados; espaços e a grafia de números podem mudar."],
    },
    "json-csv-converter": {
        "category": "data", "icon": "CSV",
        "en": ["JSON and CSV Converter", "Convert an array of JSON objects to CSV or turn a CSV table into JSON, entirely in your browser.", "JSON to CSV accepts a nonempty array of objects. Nested objects become dotted column names; arrays become JSON text. CSV to JSON uses the header row as keys and keeps every cell as text.", "Choose comma, semicolon or tab for CSV input. Duplicate or empty headers and uneven rows are rejected. CSV cannot preserve JSON types or empty versus null; formula-like cells are prefixed for safer spreadsheet opening. Maximum input: 2 MiB.", "Can I round-trip nested data?", "No. CSV to JSON returns flat objects with text values. Dotted column names are not reconstructed into nested objects."],
        "es": ["Convertidor JSON y CSV", "Convierte listas de objetos JSON a CSV o tablas CSV a JSON sin salir del navegador.", "JSON a CSV acepta una lista no vacía de objetos. Los objetos anidados forman columnas con puntos y las listas se guardan como texto JSON. CSV a JSON usa los encabezados como claves y conserva las celdas como texto.", "Para CSV de entrada elige coma, punto y coma o tabulación. Se rechazan encabezados repetidos o vacíos y filas desiguales. CSV pierde los tipos y la distinción entre vacío y nulo; se protegen celdas que parecen fórmulas. Límite: 2 MiB.", "¿Se recuperan los objetos anidados?", "No. CSV a JSON produce objetos planos con valores de texto; no reconstruye las columnas con puntos."],
        "ar": ["تحويل JSON وCSV", "حوّل مصفوفة كائنات JSON إلى CSV أو جدول CSV إلى JSON داخل متصفحك.", "يقبل التحويل من JSON مصفوفة غير فارغة من الكائنات. تصبح الكائنات المتداخلة أعمدة بأسماء منقوطة، وتُكتب المصفوفات كنص JSON. يستخدم التحويل من CSV صف العناوين مفاتيح ويحفظ الخلايا نصوصًا.", "اختر الفاصلة أو الفاصلة المنقوطة أو الجدولة لملف CSV. تُرفض العناوين المكررة أو الفارغة والصفوف غير المتساوية. لا يحفظ CSV أنواع JSON أو الفرق بين الفارغ وnull؛ تُحمى الخلايا الشبيهة بالصيغ. الحد 2 ميبيبايت.", "هل تعود البنية المتداخلة كما كانت؟", "لا. يُنتج التحويل من CSV كائنات مسطحة بقيم نصية ولا يعيد بناء الأعمدة المنقوطة."],
        "pt-BR": ["Conversor JSON e CSV", "Converta listas de objetos JSON em CSV ou tabelas CSV em JSON no próprio navegador.", "JSON para CSV aceita uma lista não vazia de objetos. Objetos aninhados viram colunas com pontos; listas viram texto JSON. CSV para JSON usa o cabeçalho como chaves e mantém as células como texto.", "Na entrada CSV, escolha vírgula, ponto e vírgula ou tabulação. Cabeçalhos vazios ou repetidos e linhas desiguais são rejeitados. CSV perde tipos e a diferença entre vazio e nulo; células parecidas com fórmulas recebem proteção. Limite: 2 MiB.", "Os objetos aninhados voltam ao formato original?", "Não. CSV para JSON gera objetos planos com valores de texto e não reconstrói colunas com pontos."],
    },
    "regex-tester": {
        "category": "developer", "icon": ".*",
        "en": ["Regex Tester", "Test JavaScript regular expressions, inspect captures and try replacements in a time-limited browser worker.", "Enter a pattern and sample text, select flags and optionally enter a replacement. The result lists match offsets, capture groups and the substituted text.", "Pattern length is 500 characters, input 20,000 and output 50,000. Up to 200 matches are shown. Processing stops after 250 ms; complex patterns can time out. No data is uploaded.", "Why did a pattern time out?", "Some expressions explore many possible paths on particular text. Simplify nested repetitions or narrow the input and try again."],
        "es": ["Probador de expresiones regulares", "Prueba expresiones regulares de JavaScript, revisa grupos y sustituciones con un límite de tiempo.", "Escribe un patrón y texto de prueba, selecciona indicadores y añade una sustitución si la necesitas. Se muestran posiciones, grupos capturados y texto sustituido.", "Límites: patrón de 500 caracteres, entrada de 20 000, salida de 50 000 y 200 coincidencias. El proceso se detiene a los 250 ms. No se suben datos.", "¿Por qué se agotó el tiempo?", "Algunas expresiones exploran demasiadas alternativas. Simplifica las repeticiones anidadas o reduce el texto."],
        "ar": ["اختبار التعبيرات النمطية", "اختبر تعبيرات JavaScript النمطية، وافحص المجموعات والاستبدال بمهلة زمنية محددة.", "أدخل النمط ونص الاختبار، ثم اختر العلامات وأدخل نص الاستبدال إن أردت. تُعرض مواضع التطابق والمجموعات والنص الناتج.", "الحد 500 حرف للنمط و20,000 للإدخال و50,000 للإخراج و200 تطابق. يتوقف التنفيذ بعد 250 مللي ثانية. لا تُرفع البيانات.", "لماذا انتهت المهلة؟", "قد تستكشف بعض الأنماط بدائل كثيرة جدًا. بسّط التكرارات المتداخلة أو قلل نص الإدخال."],
        "pt-BR": ["Testador de expressões regulares", "Teste expressões regulares de JavaScript, veja grupos e substituições com limite de tempo.", "Digite um padrão e um texto de teste, escolha as opções e inclua uma substituição se quiser. O resultado mostra posições, grupos capturados e o texto substituído.", "Limites: padrão de 500 caracteres, entrada de 20.000, saída de 50.000 e 200 correspondências. O processo para após 250 ms. Nenhum dado é enviado.", "Por que houve tempo esgotado?", "Alguns padrões percorrem alternativas demais. Simplifique repetições aninhadas ou diminua o texto."],
    },
    "utm-campaign-builder": {
        "category": "marketing", "icon": "UTM",
        "en": ["UTM Campaign Builder", "Build encoded campaign URLs while preserving existing query parameters and page fragments.", "Enter an HTTP or HTTPS destination and the required source, medium and campaign. Optional term and content values help distinguish ads. Each generated URL stays in a copyable list for this tab.", "Changing a UTM value replaces that parameter. Empty optional fields remove their matching parameter. Existing non-UTM query values and fragments remain. Nothing is sent to a server.", "Will an existing query string survive?", "Yes. URL parsing retains its parameters and fragment; the browser may normalize their encoding when it serializes the URL."],
        "es": ["Creador de campañas UTM", "Crea enlaces de campaña codificados y conserva los parámetros existentes y fragmentos de la URL.", "Escribe una dirección HTTP o HTTPS y los campos obligatorios origen, medio y campaña. Término y contenido permiten distinguir anuncios. Los enlaces generados quedan en una lista copiable en esta pestaña.", "Un valor UTM sustituye al existente; los campos opcionales vacíos eliminan su parámetro. Se conservan los demás parámetros y fragmentos. No se envía nada a un servidor.", "¿Se conserva la consulta existente?", "Sí. Se conservan parámetros y fragmento, aunque el navegador puede normalizar su codificación."],
        "ar": ["إنشاء روابط حملات UTM", "أنشئ روابط حملات مشفّرة مع الحفاظ على معاملات الاستعلام الحالية وأجزاء الصفحة.", "أدخل رابط HTTP أو HTTPS والمصدر والوسيط والحملة المطلوبة. يساعد المصطلح والمحتوى الاختياريان في التمييز بين الإعلانات. تبقى الروابط الناتجة في قائمة قابلة للنسخ ضمن علامة التبويب.", "تستبدل قيم UTM المعاملات المطابقة؛ وتحذف الحقول الاختيارية الفارغة معاملاتِها. تبقى المعاملات الأخرى وأجزاء الصفحة. لا يُرسل شيء للخادم.", "هل تبقى معاملات الرابط الأصلية؟", "نعم. تبقى المعاملات وجزء الصفحة، وقد يوحّد المتصفح طريقة ترميزها."],
        "pt-BR": ["Criador de campanhas UTM", "Crie URLs de campanha codificadas preservando parâmetros existentes e fragmentos da página.", "Informe um destino HTTP ou HTTPS e os campos obrigatórios origem, mídia e campanha. Termo e conteúdo ajudam a diferenciar anúncios. Os links gerados ficam numa lista copiável nesta aba.", "Um valor UTM substitui o parâmetro existente; campos opcionais vazios removem o correspondente. Os demais parâmetros e fragmentos permanecem. Nada é enviado ao servidor.", "A consulta original é preservada?", "Sim. Parâmetros e fragmento permanecem, embora o navegador possa normalizar sua codificação."],
    },
    "seo-social-preview": {
        "category": "marketing", "icon": "SEO",
        "en": ["SEO and Social Preview", "Preview a search snippet and social card from metadata you enter; no remote page metadata is fetched.", "Enter a page URL, title, description and optional HTTPS image URL. Compare how the text might fit in a search result and a social card before publishing.", "These are illustrative previews. Search engines and social networks choose their own layout and may rewrite text. The page URL is not fetched; an image URL loads only in your browser when supplied.", "Can this inspect a live page?", "No. Enter the page's current metadata manually. Browser restrictions and server-side safety make automatic inspection unavailable here."],
        "es": ["Vista previa SEO y social", "Previsualiza un resultado de búsqueda y una tarjeta social con metadatos que escribas; no se consulta la página remota.", "Introduce URL, título, descripción y una imagen HTTPS opcional. Compara cómo podría mostrarse el texto antes de publicar.", "Las vistas son ilustrativas. Buscadores y redes sociales deciden el diseño y pueden reescribir el texto. No se consulta la URL; la imagen se carga solo en tu navegador si la proporcionas.", "¿Puede revisar una página publicada?", "No. Introduce los metadatos manualmente. La inspección automática no está disponible aquí por restricciones del navegador y seguridad del servidor."],
        "ar": ["معاينة SEO والبطاقات الاجتماعية", "عاين نتيجة بحث وبطاقة اجتماعية من البيانات التي تدخلها؛ لا تُجلب بيانات الصفحة البعيدة.", "أدخل رابط الصفحة والعنوان والوصف ورابط صورة HTTPS اختياريًا. قارن شكل النص المتوقع قبل النشر.", "المعاينات توضيحية؛ تختار محركات البحث والشبكات الاجتماعية تصميمها وقد تغير النص. لا يُجلب رابط الصفحة، وتُحمّل الصورة في متصفحك فقط عند إدخالها.", "هل تفحص الأداة صفحة منشورة؟", "لا. أدخل بيانات الصفحة يدويًا. الفحص التلقائي غير متاح هنا بسبب قيود المتصفح ومتطلبات سلامة الخادم."],
        "pt-BR": ["Prévia de SEO e redes sociais", "Visualize um resultado de busca e um cartão social com metadados digitados; a página remota não é consultada.", "Informe URL, título, descrição e uma imagem HTTPS opcional. Compare como o texto poderia aparecer antes da publicação.", "As prévias são ilustrativas. Buscadores e redes escolhem o layout e podem reescrever o texto. A URL da página não é consultada; a imagem carrega apenas no seu navegador quando informada.", "A ferramenta inspeciona uma página publicada?", "Não. Informe os metadados manualmente. A inspeção automática não está disponível aqui por restrições do navegador e segurança do servidor."],
    },
    "bulk-file-renamer": {
        "category": "files", "icon": "ZIP",
        "en": ["Bulk File Renamer", "Preview literal text replacement, case and sequence rules, then download up to 20 renamed files in a ZIP.", "Choose local files, enter text to replace, pick a case rule and optionally append a padded sequence. Inspect every output name before creating the ZIP. Duplicate names receive (2), (3) and so on.", "Up to 20 files and 25 MiB total. Executable file extensions are refused. Files never leave your browser. The ZIP stores original file bytes without recompression; only names change.", "Will this rename files on my device?", "No. Your originals stay as they are. Download and extract the ZIP to get copies with the previewed names."],
        "es": ["Renombrador de archivos por lotes", "Previsualiza sustituciones, mayúsculas y secuencias; descarga hasta 20 archivos renombrados en un ZIP.", "Elige archivos locales, indica el texto que quieres sustituir, selecciona mayúsculas o minúsculas y añade una secuencia si la necesitas. Revisa los nombres antes de crear el ZIP. Los duplicados reciben (2), (3), etc.", "Máximo 20 archivos y 25 MiB en total. Se rechazan extensiones ejecutables. Los archivos no salen del navegador. El ZIP conserva los bytes originales sin recomprimirlos; solo cambian los nombres.", "¿Cambia los archivos de mi dispositivo?", "No. Los originales permanecen intactos. Descarga y extrae el ZIP para obtener copias con los nombres revisados."],
        "ar": ["إعادة تسمية الملفات دفعة واحدة", "عاين الاستبدال وحالة الأحرف والترقيم، ثم نزّل حتى 20 ملفًا بأسماء جديدة داخل ZIP.", "اختر ملفات محلية، وأدخل النص المراد استبداله، واختر حالة الأحرف وترقيمًا اختياريًا. راجع كل اسم قبل إنشاء ZIP. تحصل الأسماء المتكررة على (2) و(3) وهكذا.", "الحد 20 ملفًا و25 ميبيبايت إجمالًا. تُرفض امتدادات الملفات التنفيذية. لا تغادر الملفات متصفحك. يحفظ ZIP بايتات الملفات الأصلية دون إعادة ضغط؛ تتغير الأسماء فقط.", "هل تتغير الملفات الأصلية على جهازي؟", "لا. تبقى الملفات الأصلية كما هي. نزّل ZIP واستخرجه للحصول على نسخ بالأسماء التي عاينتها."],
        "pt-BR": ["Renomeador de arquivos em lote", "Visualize substituições, letras maiúsculas e sequência; baixe até 20 arquivos renomeados num ZIP.", "Escolha arquivos locais, informe o texto a substituir, selecione maiúsculas ou minúsculas e adicione uma sequência se desejar. Confira cada nome antes de criar o ZIP. Duplicatas recebem (2), (3) e assim por diante.", "Até 20 arquivos e 25 MiB no total. Extensões executáveis são recusadas. Os arquivos ficam no navegador. O ZIP guarda os bytes originais sem recompressão; apenas os nomes mudam.", "Os arquivos do meu dispositivo serão renomeados?", "Não. Os originais ficam intactos. Baixe e extraia o ZIP para obter cópias com os nomes visualizados."],
    },
}

LABELS = {
    "en": dict(run="Run tool", source="Input", upload="Load text file", encoding="File encoding", mode="Output style", pretty="Pretty (2 spaces)", compact="Compact", direction="Direction", jsoncsv="JSON to CSV", csvjson="CSV to JSON", delimiter="CSV delimiter", comma="Comma", semicolon="Semicolon", tab="Tab", pattern="Pattern", flags="Flags", replacement="Replacement (optional)", url="Page URL", title="Page title", description="Description", image="HTTPS image URL (optional)", sourceutm="Source", medium="Medium", campaign="Campaign", term="Term (optional)", content="Content (optional)", result="Result", copy="Copy", download="Download", copied="Copied.", copyFailed="Clipboard unavailable; select and copy the result.", ready="Ready.", loaded="File loaded into the editor.", matches="matches", captures="Captures", replaced="Replacement result", google="Search snippet", social="Social card", imageAlt="Social preview image", imageFailed="Image could not be loaded.", previewNote="Illustrative preview from your input. No remote metadata was fetched.", LIMIT="Input exceeds this tool's limit.", ENCODING="Could not decode the file with the selected encoding.", SHAPE="Expected a nonempty array of objects with at most 10,000 rows and 500 columns.", HEADERS="CSV headers must be unique and nonempty.", COLUMNS="CSV rows have different numbers of columns.", CSV="Malformed CSV quoting.", URL="Enter a valid HTTP or HTTPS URL without credentials.", IMAGE_URL="Enter a valid HTTPS image URL.", REQUIRED="Source, medium and campaign are required.", TIMEOUT="Pattern exceeded 250 ms. Simplify it and try again.", ERROR="Could not process this input.", private="Processed in your browser; no file upload."),
    "es": dict(run="Ejecutar", source="Entrada", upload="Cargar archivo de texto", encoding="Codificación", mode="Estilo de salida", pretty="Legible (2 espacios)", compact="Compacto", direction="Dirección", jsoncsv="JSON a CSV", csvjson="CSV a JSON", delimiter="Separador CSV", comma="Coma", semicolon="Punto y coma", tab="Tabulación", pattern="Patrón", flags="Indicadores", replacement="Sustitución (opcional)", url="URL de la página", title="Título", description="Descripción", image="URL de imagen HTTPS (opcional)", sourceutm="Origen", medium="Medio", campaign="Campaña", term="Término (opcional)", content="Contenido (opcional)", result="Resultado", copy="Copiar", download="Descargar", copied="Copiado.", copyFailed="No se pudo usar el portapapeles; selecciona el resultado.", ready="Listo.", loaded="Archivo cargado en el editor.", matches="coincidencias", captures="Grupos", replaced="Texto sustituido", google="Resultado de búsqueda", social="Tarjeta social", imageAlt="Imagen de vista previa", imageFailed="No se pudo cargar la imagen.", previewNote="Vista ilustrativa de tus datos. No se consultó ninguna página remota.", LIMIT="La entrada supera el límite.", ENCODING="No se pudo decodificar el archivo.", SHAPE="Se requiere una lista no vacía de objetos de hasta 10 000 filas y 500 columnas.", HEADERS="Los encabezados deben ser únicos y no estar vacíos.", COLUMNS="Las filas CSV tienen distintas cantidades de columnas.", CSV="Comillas CSV incorrectas.", URL="Introduce una URL HTTP o HTTPS válida sin credenciales.", IMAGE_URL="Introduce una URL de imagen HTTPS válida.", REQUIRED="Origen, medio y campaña son obligatorios.", TIMEOUT="El patrón superó 250 ms. Simplifícalo.", ERROR="No se pudo procesar la entrada.", private="Procesado en tu navegador; no se suben archivos."),
    "ar": dict(run="تشغيل الأداة", source="الإدخال", upload="تحميل ملف نصي", encoding="ترميز الملف", mode="نمط الإخراج", pretty="منسق (مسافتان)", compact="مضغوط", direction="الاتجاه", jsoncsv="JSON إلى CSV", csvjson="CSV إلى JSON", delimiter="فاصل CSV", comma="فاصلة", semicolon="فاصلة منقوطة", tab="جدولة", pattern="النمط", flags="العلامات", replacement="الاستبدال (اختياري)", url="رابط الصفحة", title="عنوان الصفحة", description="الوصف", image="رابط صورة HTTPS (اختياري)", sourceutm="المصدر", medium="الوسيط", campaign="الحملة", term="المصطلح (اختياري)", content="المحتوى (اختياري)", result="النتيجة", copy="نسخ", download="تنزيل", copied="تم النسخ.", copyFailed="الحافظة غير متاحة؛ حدد النتيجة وانسخها.", ready="جاهز.", loaded="حُمّل الملف في المحرر.", matches="تطابقات", captures="المجموعات", replaced="نتيجة الاستبدال", google="نتيجة البحث", social="البطاقة الاجتماعية", imageAlt="صورة المعاينة", imageFailed="تعذر تحميل الصورة.", previewNote="معاينة توضيحية من إدخالك. لم تُجلب بيانات صفحة بعيدة.", LIMIT="تجاوز الإدخال الحد المسموح.", ENCODING="تعذر فك ترميز الملف.", SHAPE="يلزم مصفوفة غير فارغة من الكائنات حتى 10,000 صف و500 عمود.", HEADERS="يجب أن تكون العناوين فريدة وغير فارغة.", COLUMNS="عدد أعمدة صفوف CSV غير متساوٍ.", CSV="علامات اقتباس CSV غير صحيحة.", URL="أدخل رابط HTTP أو HTTPS صالحًا دون بيانات دخول.", IMAGE_URL="أدخل رابط صورة HTTPS صالحًا.", REQUIRED="المصدر والوسيط والحملة مطلوبة.", TIMEOUT="تجاوز النمط 250 مللي ثانية. بسّطه وحاول مجددًا.", ERROR="تعذر معالجة الإدخال.", private="تتم المعالجة في متصفحك؛ لا تُرفع الملفات."),
    "pt-BR": dict(run="Executar", source="Entrada", upload="Carregar arquivo de texto", encoding="Codificação", mode="Estilo de saída", pretty="Formatado (2 espaços)", compact="Compacto", direction="Direção", jsoncsv="JSON para CSV", csvjson="CSV para JSON", delimiter="Separador CSV", comma="Vírgula", semicolon="Ponto e vírgula", tab="Tabulação", pattern="Padrão", flags="Opções", replacement="Substituição (opcional)", url="URL da página", title="Título da página", description="Descrição", image="URL de imagem HTTPS (opcional)", sourceutm="Origem", medium="Mídia", campaign="Campanha", term="Termo (opcional)", content="Conteúdo (opcional)", result="Resultado", copy="Copiar", download="Baixar", copied="Copiado.", copyFailed="Área de transferência indisponível; selecione o resultado.", ready="Pronto.", loaded="Arquivo carregado no editor.", matches="correspondências", captures="Grupos", replaced="Texto substituído", google="Resultado de busca", social="Cartão social", imageAlt="Imagem de prévia", imageFailed="Não foi possível carregar a imagem.", previewNote="Prévia ilustrativa da sua entrada. Nenhuma página remota foi consultada.", LIMIT="A entrada excede o limite.", ENCODING="Não foi possível decodificar o arquivo.", SHAPE="É necessária uma lista não vazia de objetos com até 10.000 linhas e 500 colunas.", HEADERS="Os cabeçalhos devem ser únicos e não vazios.", COLUMNS="As linhas CSV têm quantidades diferentes de colunas.", CSV="Aspas CSV incorretas.", URL="Informe uma URL HTTP ou HTTPS válida sem credenciais.", IMAGE_URL="Informe uma URL de imagem HTTPS válida.", REQUIRED="Origem, mídia e campanha são obrigatórios.", TIMEOUT="O padrão excedeu 250 ms. Simplifique-o.", ERROR="Não foi possível processar a entrada.", private="Processado no seu navegador; nenhum arquivo é enviado."),
}
LABELS['en'].update(files='Files (up to 20, 25 MiB total)', find='Find literal text', replace='Replace with', letterCase='Name case', keep='Keep', lower='Lowercase', upper='Uppercase', sequence='Append sequence', start='Start number', pad='Minimum digits', preview='Preview names', previewReady='Review the names, then download the ZIP.', downloadZip='Download ZIP', working='Building ZIP in your browser…', OPTIONS='Check the rename settings.', FILE='A file name or executable extension is not allowed.')
LABELS['es'].update(files='Archivos (máximo 20, 25 MiB)', find='Buscar texto literal', replace='Sustituir por', letterCase='Mayúsculas del nombre', keep='Conservar', lower='Minúsculas', upper='Mayúsculas', sequence='Añadir secuencia', start='Número inicial', pad='Dígitos mínimos', preview='Previsualizar nombres', previewReady='Revisa los nombres y descarga el ZIP.', downloadZip='Descargar ZIP', working='Creando ZIP en tu navegador…', OPTIONS='Revisa las opciones de nombres.', FILE='Nombre o extensión ejecutable no permitido.')
LABELS['ar'].update(files='الملفات (حتى 20، بإجمالي 25 ميبيبايت)', find='البحث عن نص حرفي', replace='استبداله بـ', letterCase='حالة أحرف الاسم', keep='كما هي', lower='أحرف صغيرة', upper='أحرف كبيرة', sequence='إضافة تسلسل', start='رقم البداية', pad='أقل عدد من الخانات', preview='معاينة الأسماء', previewReady='راجع الأسماء ثم نزّل ZIP.', downloadZip='تنزيل ZIP', working='جارٍ إنشاء ZIP في متصفحك…', OPTIONS='تحقق من إعدادات التسمية.', FILE='اسم ملف أو امتداد تنفيذي غير مسموح.')
LABELS['pt-BR'].update(files='Arquivos (até 20, 25 MiB no total)', find='Localizar texto literal', replace='Substituir por', letterCase='Letras do nome', keep='Manter', lower='Minúsculas', upper='Maiúsculas', sequence='Adicionar sequência', start='Número inicial', pad='Dígitos mínimos', preview='Visualizar nomes', previewReady='Confira os nomes e baixe o ZIP.', downloadZip='Baixar ZIP', working='Criando ZIP no navegador…', OPTIONS='Confira as opções de nomes.', FILE='Nome de arquivo ou extensão executável não permitida.')
CATEGORIES = {
    "en": dict(developer="Developer Tools", data="Spreadsheet & Data", marketing="Marketing & SEO", heading="More browser tools"),
    "es": dict(developer="Herramientas para desarrolladores", data="Hojas de cálculo y datos", marketing="Marketing y SEO", heading="Más herramientas del navegador"),
    "ar": dict(developer="أدوات المطورين", data="الجداول والبيانات", marketing="التسويق وSEO", heading="المزيد من أدوات المتصفح"),
    "pt-BR": dict(developer="Ferramentas para desenvolvedores", data="Planilhas e dados", marketing="Marketing e SEO", heading="Mais ferramentas do navegador"),
}
for lang, title in {'en':'File Management','es':'Gestión de archivos','ar':'إدارة الملفات','pt-BR':'Gestão de arquivos'}.items():
    CATEGORIES[lang]['files'] = title
for lang, pair in {
    'en':('All Tools','Limits and privacy'), 'es':('Todas las herramientas','Límites y privacidad'),
    'ar':('جميع الأدوات','الحدود والخصوصية'), 'pt-BR':('Todas as ferramentas','Limites e privacidade')
}.items():
    CATEGORIES[lang]['tools'], CATEGORIES[lang]['limits'] = pair

def read(rel): return (ROOT / rel).read_text("utf-8")
def write(rel, data):
    target = ROOT / rel
    if target.exists() and target.read_text("utf-8") == data: return
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(data, encoding="utf-8", newline="\n")
def url(lang, slug): return f"{BASE}/{PREFIX[lang]}{slug}/"
def attrs(**items): return " ".join(f'{k}="{escape(str(v), quote=True)}"' for k,v in items.items() if v is not False and v is not None)
def field(label, name, kind="text", **extra):
    a = attrs(name=name, id=name, type=kind, **extra)
    return f'<label for="{name}">{escape(label)}</label><input {a}>'
def area(label, name="source", limit=2097152, required=False):
    return f'<label for="{name}">{escape(label)}</label><textarea id="{name}" name="{name}" maxlength="{limit}" rows="9" spellcheck="false"{" required" if required else ""}></textarea>'
def select(label, name, options):
    return f'<label for="{name}">{escape(label)}</label><select id="{name}" name="{name}">' + "".join(f'<option value="{escape(v)}">{escape(t)}</option>' for v,t in options) + '</select>'
def artifact_fields(slug, lang):
    l = ARTIFACT_LABELS[lang]
    if slug == 'invoice-generator':
        return (area(l['seller'], 'seller', 500, True) + area(l['customer'], 'customer', 500, True)
                + field(l['number'],'number',required=True,maxlength=60)
                + field(l['issued'],'issued','date',required=True)
                + field(l['due'],'due','date')
                + select(l['currency'],'currency',[(c,c) for c in ['USD','EUR','GBP','JOD','SAR','AED','BRL','ARS','MXN']])
                + field(l['logo'],'file','file',accept='.png,.jpg,.jpeg,image/png,image/jpeg')
                + '<div id="invoice-items" class="invoice-items"></div><button type="button" id="add-item">'+escape(l['add'])+'</button>'
                + '<p id="invoice-totals" aria-live="polite"></p>' + area(l['notes'],'notes',500))
    out = field(l['file'],'file','file',required=True,accept='.csv,.xlsx' if slug == 'csv-xlsx-converter' else '.pdf,application/pdf')
    if slug == 'csv-xlsx-converter':
        out += select(l['direction'],'direction',[('csv-xlsx',l['csvxlsx']),('xlsx-csv',l['xlsxcsv'])])
        out += select(l['delimiter'],'delimiter',[('comma',l['comma']),('semicolon',l['semicolon']),('tab',l['tab'])])
        out += select(l['encoding'],'encoding',[('utf-8','UTF-8'),('windows-1252','Windows-1252')])
        out += '<div id="sheet-wrap" hidden>'+select(l['sheet'],'sheet',[])+'</div>'
    elif slug == 'compress-pdf':
        out += select(l['preset'],'preset',[('light',l['light']),('balanced',l['balanced']),('small',l['small'])])
    else:
        out += select(l['language'],'lang',[('eng','English'),('spa','Español'),('ara','العربية'),('por','Português')])
    return out
def form_fields(slug, lang):
    l = LABELS[lang]
    if slug in {"json-formatter-validator", "json-csv-converter"}:
        out = ''
        if slug == "json-formatter-validator": out += select(l['mode'], 'mode', [('pretty',l['pretty']),('compact',l['compact'])])
        else:
            out += select(l['direction'],'direction',[('json-csv',l['jsoncsv']),('csv-json',l['csvjson'])])
            out += select(l['delimiter'],'delimiter', [(',',l['comma']),(';',l['semicolon']),('\t',l['tab'])])
        out += area(l['source']) + field(l['upload'],'upload','file',accept='.json,.csv,.txt,text/plain,application/json,text/csv')
        out += select(l['encoding'],'encoding',[('utf-8','UTF-8'),('windows-1252','Windows-1252')])
        return out
    if slug == 'regex-tester':
        out = field(l['pattern'],'pattern',maxlength=500) + area(l['source'],limit=20000)
        out += f'<fieldset class="utility-flags"><legend>{escape(l["flags"])}</legend>'
        out += ''.join(f'<label><input type="checkbox" name="flags" value="{f}"{" checked" if f == "g" else ""}> {f}</label>' for f in 'gimsu') + '</fieldset>'
        return out + field(l['replacement'],'replacement',maxlength=500)
    if slug == 'utm-campaign-builder':
        out = field(l['url'],'url','url',required=True,maxlength=2048,placeholder='https://example.com/page')
        return out + ''.join(field(l[k], n, required=(k in {'sourceutm','medium','campaign'}),maxlength=200) for k,n in [('sourceutm','utm_source'),('medium','utm_medium'),('campaign','utm_campaign'),('term','utm_term'),('content','utm_content')])
    if slug == 'bulk-file-renamer':
        return (field(l['files'],'files','file',multiple=True,required=True) + field(l['find'],'find',maxlength=100)
                + field(l['replace'],'replace',maxlength=100)
                + select(l['letterCase'],'letterCase',[('keep',l['keep']),('lower',l['lower']),('upper',l['upper'])])
                + field(l['sequence'],'sequence','checkbox')
                + field(l['start'],'start','number',min=0,max=999999,value=1)
                + field(l['pad'],'pad','number',min=1,max=6,value=2))
    return (field(l['url'],'url','url',required=True,maxlength=2048,placeholder='https://example.com/page') + field(l['title'],'title',maxlength=300) + area(l['description'],'description',1000) + field(l['image'],'image','url',maxlength=2048))

def render(slug, lang):
    artifact = slug in ARTIFACTS
    tool = ARTIFACTS[slug] if artifact else TOOLS[slug]
    title, desc, use, limit, question, answer = tool[lang]
    template = read(PREFIX[lang] + 'jpg-to-png/index.html')
    header = re.search(r'<body[^>]*>(.*?)</header>', template, re.S)[1] + '</header>'
    header = re.sub(r'<details class="language-selector".*?</details>', lambda m:m[0].replace('/jpg-to-png/', f'/{slug}/'), header, flags=re.S)
    footer = re.search(r'<footer\b.*?</footer>', template, re.S)[0]
    links = '\n'.join(re.findall(r'<link [^>]*(?:rel="(?:icon|apple-touch-icon)"|href="/(?:style\.min|neon-home|rtl)\.css)[^>]*>', template))
    ads = re.search(r'<script[^>]+adsbygoogle\.js[^>]*></script>', template)[0]
    analytics = re.search(r'<!-- Google tag.*?</script>\s*<script>.*?</script>', template, re.S)
    alts = '\n'.join(f'<link rel="alternate" hreflang="{k}" href="{url(k,slug) if k != "x-default" else url("en",slug)}">' for k in [*PREFIX, 'x-default'])
    canonical = url(lang,slug)
    schema = json.dumps({"@context":"https://schema.org","@graph":[{"@type":"WebApplication","name":title,"url":canonical,"inLanguage":lang,"applicationCategory":"UtilitiesApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":CATEGORIES[lang]['tools'],"item":url(lang,'all-tools')},{"@type":"ListItem","position":2,"name":title,"item":canonical}]}]},ensure_ascii=False)
    l = ARTIFACT_LABELS[lang] if artifact else LABELS[lang]
    versions = {name:sha256((ROOT / 'js' / file).read_bytes()).hexdigest()[:8] for name,file in [('core','utility-core.mjs'),('rename','rename-core.mjs'),('worker','regex-worker.js')]}
    config = json.dumps(({'tool':slug,'messages':l,'maxBytes':{'invoice-generator':2,'csv-xlsx-converter':6,'compress-pdf':15,'searchable-pdf-ocr':12}[slug]*1024*1024} if artifact else {'tool':slug,'labels':l,'versions':versions}),ensure_ascii=False).replace('<','\\u003c')
    script = '<script src="/js/tool-ui.js" defer></script><script src="/js/artifact-tools.js" type="module"></script>' if artifact else '<script src="/js/utility-tools.js" type="module"></script>'
    extra_style = '<link rel="stylesheet" href="/assets/artifact-tools.css">' if artifact else ''
    form_id = 'artifact-form' if artifact else 'utility-form'
    status_id = 'artifact-status' if artifact else 'utility-status'
    output_id = 'artifact-result' if artifact else 'utility-output'
    fields = artifact_fields(slug,lang) if artifact else form_fields(slug,lang)
    config_id = 'artifact-config' if artifact else 'utility-config'
    html = f'''<!DOCTYPE html>
<html lang="{lang}" dir="{'rtl' if lang == 'ar' else 'ltr'}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)} | Convertios</title><meta name="description" content="{escape(desc,quote=True)}"><meta name="robots" content="index, follow">
<link rel="canonical" href="{canonical}">{alts}
<meta property="og:type" content="website"><meta property="og:url" content="{canonical}"><meta property="og:title" content="{escape(title,quote=True)} | Convertios"><meta property="og:description" content="{escape(desc,quote=True)}"><meta property="og:image" content="{BASE}/convertios-logo.png"><meta name="twitter:card" content="summary_large_image">
{links}<link rel="stylesheet" href="/smart-tools.css"><link rel="stylesheet" href="/assets/utility-tools.css">{extra_style}
{analytics[0] if analytics else ''}{ads}
<script type="application/ld+json">{schema}</script><script src="/script.min.js" defer></script>{script}</head>
<body class="neon-site-header">{header}
<main class="smart-page" id="main-content"><nav class="smart-crumb" aria-label="{escape(CATEGORIES[lang]['tools'])}"><a href="/{PREFIX[lang]}all-tools/">{escape(CATEGORIES[lang]['tools'])}</a><span aria-hidden="true">/</span><span aria-current="page">{escape(title)}</span></nav>
<section class="smart-panel utility-panel"><h1>{escape(title)}</h1><p>{escape(desc)}</p><p class="utility-privacy">{escape(l['private'])}</p>
<form id="{form_id}"><div class="utility-fields">{fields}</div><button type="submit">{escape(l['preview'] if slug == 'bulk-file-renamer' else l['run'])}</button></form>
<p id="{status_id}" role="status" aria-live="polite"></p><div id="{output_id}" aria-label="{escape(l['result'],quote=True)}"></div></section>
<section class="smart-guide"><h2>{escape(title)}</h2><p>{escape(use)}</p><h2>{escape(CATEGORIES[lang]['limits'])}</h2><p>{escape(limit)}</p><details class="smart-faq"><summary>{escape(question)}</summary><p>{escape(answer)}</p></details><p><a href="/{PREFIX[lang]}all-tools/">{escape(CATEGORIES[lang]['heading'])}</a></p></section></main>
{footer}<script type="application/json" id="{config_id}">{config}</script></body></html>'''
    def stamp(m):
        data = (ROOT / m[2][1:]).read_bytes().replace(b'\r\n', b'\n')
        return f'{m[1]}{m[2]}?v={sha256(data).hexdigest()[:8]}"'
    return re.sub(r'((?:src|href)=")(/[\w./-]+\.(?:js|css))(?:\?v=\w+)?"',stamp,html)

def replace_block(rel, name, block, before):
    source = read(rel); start = f'<!-- {name}:start -->'; end = f'<!-- {name}:end -->'
    content = start + '\n' + block + '\n' + end
    if start in source: source = re.sub(re.escape(start)+r'.*?'+re.escape(end),lambda _:content,source,flags=re.S)
    else: source = source.replace(before, content+'\n'+before,1)
    write(rel,source)

def main():
    for lang, title in {'en':'Business Tools','es':'Herramientas empresariales','ar':'أدوات الأعمال','pt-BR':'Ferramentas de negócios'}.items(): CATEGORIES[lang]['business'] = title
    for lang, title in {'en':'PDF Tools','es':'Herramientas PDF','ar':'أدوات PDF','pt-BR':'Ferramentas PDF'}.items(): CATEGORIES[lang]['pdf'] = title
    all_tools = {**TOOLS, **ARTIFACTS}
    for lang in PREFIX:
        for slug in all_tools: write(PREFIX[lang]+slug+'/index.html',render(slug,lang))
        sections = []
        for category in ('developer','data','marketing','files','business','pdf'):
            cards = []
            for slug,tool in all_tools.items():
                if tool['category'] != category: continue
                title, desc = tool[lang][:2]
                cards.append(f'<a href="/{PREFIX[lang]}{slug}/" class="tool-card"><div class="tool-icon-wrap" aria-hidden="true">{escape(tool["icon"])}</div><h3>{escape(title)}</h3><p>{escape(desc)}</p></a>')
            sections.append(f'<h2>{escape(CATEGORIES[lang][category])}</h2><div class="tools-grid">'+''.join(cards)+'</div>')
        listing = f'<section class="utility-directory"><h2>{escape(CATEGORIES[lang]["heading"])}</h2>'+''.join(sections)+'</section>'
        replace_block(PREFIX[lang]+'all-tools/index.html','utility-tools',listing,'</main>')
        mini = '<section class="utility-home"><h2>'+escape(CATEGORIES[lang]['heading'])+'</h2><div>'+''.join(f'<a href="/{PREFIX[lang]}{slug}/">{escape(tool[lang][0])}</a>' for slug,tool in all_tools.items())+'</div></section>'
        replace_block(PREFIX[lang]+'index.html','utility-tools',mini,'<section class="categories-section">')
    entries = []
    for slug in all_tools:
        alts = '\n'.join(f'  <xhtml:link rel="alternate" hreflang="{k}" href="{url(k,slug) if k != "x-default" else url("en",slug)}"/>' for k in [*PREFIX,'x-default'])
        entries += [f'<url>\n  <loc>{url(lang,slug)}</loc>\n{alts}\n</url>' for lang in PREFIX]
    replace_block('sitemap.xml','utility-tools','\n'.join(entries),'</urlset>')

if __name__ == '__main__': main()
