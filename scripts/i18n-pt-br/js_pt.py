"""Insert a pt (Brazilian Portuguese) dictionary right after each shared script's es dictionary."""
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
PT = {
    'video-tools.js': "pt: { tooLarge: 'O arquivo tem mais de 50 MB. Escolha um vídeo menor.', badType: 'Este tipo de arquivo não é compatível. Escolha MP4, MOV, WEBM, MKV, AVI, M4V, MPEG, MPG, 3GP, OGV, FLV, WMV ou TS.', working: 'Enviando e convertendo… vídeos grandes podem levar alguns minutos. Mantenha esta página aberta.', successMp3: 'MP3 criado. O download começou.', successVideo: 'Vídeo convertido. O download começou.' }",
    'js/compress.js': "pt: { notImage: 'Escolha uma imagem JPG, PNG ou WEBP.', original: 'Original: {size} · {w}×{h} px', working: 'Comprimindo… {p}%', reached: 'Meta atingida: {size} (meta {target} KB) · {w}×{h} px{q}.', close: 'Muito perto da meta: {size} (meta {target} KB) · {w}×{h} px{q}.', missed: 'Não foi possível chegar a {target} KB sem reduzir demais a imagem. Menor resultado utilizável: {size} · {w}×{h} px{q}. Tente uma meta maior ou o formato JPG/WEBP.', already: 'Esta imagem já tem menos de {target} KB, então foi mantida como está ({size}).', manual: 'Comprimida para {size} (antes {orig}) · {w}×{h} px{q}.', bigger: 'Este formato deixou o arquivo maior ({size}, antes {orig}). Tente JPG ou WEBP, ou uma qualidade menor.', quality: ' · qualidade {q}%', download: 'Baixar ({size})', invalidTarget: 'Digite uma meta entre 1 e 50.000 KB, ou deixe em branco para usar o controle de qualidade.' }",
    'js/image-converter.js': "pt: { notImage: 'Alguns arquivos não são imagens e foram ignorados.', converting: 'Convertendo {n} de {total}…', converted: '{n} imagem(ns) convertida(s). Baixe separadamente ou em um ZIP.', failedOne: 'Não foi possível converter {name}.', convertFirst: 'Converta pelo menos uma imagem antes de baixar.', download: 'Baixar' }",
    'js/image-enhancer.js': "pt: { choose: 'Escolha uma imagem JPG, PNG ou WEBP.', tooBig: 'Esta imagem tem mais de 8 MB. Escolha uma imagem menor.', selected: 'Selecionado: ', ready: 'Pronta para melhorar.', working: 'Melhorando sua imagem… normalmente leva de 10 a 60 segundos.', done: 'Imagem melhorada. Confira a pré-visualização e baixe.', download: 'Baixar imagem melhorada' }",
    'js/image-resizer.js': "pt: { original: 'Original', output: 'Resultado', notImage: 'Escolha um arquivo de imagem (JPG, PNG, WEBP, GIF ou BMP).', loadFailed: 'Não foi possível abrir esta imagem. Tente outro arquivo.', invalidSize: 'Digite uma largura e uma altura entre 1 e 8000 pixels.', tooLarge: 'Esse tamanho é grande demais para ser processado com segurança no navegador. Use no máximo 8000 pixels por lado e 36 megapixels no total.', ready: 'Sua imagem redimensionada está sendo baixada.', pixels: 'px' }",
    'js/jpg-to-pdf.js': "pt: { skipped: 'Só é possível adicionar imagens JPG e PNG. Os outros arquivos foram ignorados.', noneSelected: 'Selecione pelo menos uma imagem para incluir no PDF.', include: 'Incluir', remove: 'Remover', making: 'Criando PDF…', done: 'PDF pronto: {n} página(s).', download: 'Baixar PDF', pageSize: 'Tamanho da página', fit: 'Igual à imagem', a4: 'A4' }",
    'js/meme-generator.js': "pt: { notImage: 'Escolha um arquivo de imagem.', loadFailed: 'Não foi possível abrir esta imagem. Tente outro arquivo.' }",
    'js/qr-generator.js': "pt: { enterText: 'Digite um link ou um texto para transformar em QR Code.', tooLong: 'Este texto é longo demais para um único QR Code. Encurte-o (para links longos, use antes o Encurtador de links).', svg: 'Baixar SVG (para imprimir)' }",
    'js/text-formatter.js': "pt: { empty: 'Primeiro digite ou cole um texto.', copied: 'Copiado!', copyFailed: 'Não foi possível copiar. Selecione o texto e copie manualmente.' }",
    'js/link-shortener.js': "pt: { enterUrl: 'Cole um endereço da web para encurtar.', shortening: 'Encurtando…', shortened: 'Link curto pronto. Ele funciona em qualquer lugar onde um link normal funciona.', copied: 'Copiado!', copyFailed: 'Não foi possível copiar. Selecione o link e copie manualmente.' }",
    'js/pdf-to-word.js': "pt: { notPdf: 'Escolha um arquivo PDF.', tooBig: 'Este PDF tem mais de 25 MB. Escolha um arquivo menor.', ready: 'Pronto para converter. O PDF é processado no servidor da Convertios e excluído logo após a conversão.', uploading: 'Enviando e convertendo… PDFs grandes podem levar até um minuto.', size: 'Tamanho', done: 'Conversão concluída. Seu arquivo do Word está sendo baixado.', download: 'Baixar arquivo do Word' }",
    'js/simple-convert.js': "pt: { wrongType: 'Aqui só é possível adicionar imagens {type}. Os outros arquivos foram ignorados.', done: '{n} imagem(ns) convertida(s).', download: 'Baixar' }",
}

TOOL_UI_PT = """    pt: {
      retry: 'Tentar novamente',
      generic: 'A ferramenta não conseguiu concluir a solicitação. Confira o arquivo ou os dados e tente de novo.',
      actionRequired: 'Confira os dados da ferramenta e tente de novo.',
      network: 'Não foi possível conectar ao servidor de conversão. Confira sua conexão e tente de novo.',
      timeout: 'O servidor demorou demais para responder. Tente de novo.',
      coldStart: 'Iniciando o servidor de conversão. A primeira solicitação depois de um período sem uso pode levar até um minuto.',
      noFile: 'Primeiro escolha um arquivo.',
      nothingToDownload: 'Ainda não há nada para baixar. Use a ferramenta primeiro.',
      selectPages: 'Selecione pelo menos uma página.',
      INVALID_URL: 'Digite um endereço da web válido que comece com http:// ou https://.',
      SHORTENER_REJECTED: 'Não foi possível encurtar este endereço. Confira e tente de novo.',
      UPSTREAM_TIMEOUT: 'O serviço externo demorou demais. Tente de novo.',
      UPSTREAM_UNAVAILABLE: 'O serviço externo está indisponível no momento. Tente de novo daqui a pouco.',
      RATE_LIMITED: 'Muitas solicitações. Aguarde alguns minutos e tente de novo.',
      NO_FILE: 'Primeiro escolha um arquivo.',
      FILE_TOO_LARGE: 'Este arquivo é maior do que a ferramenta permite.',
      UNSUPPORTED_FORMAT: 'Este tipo de arquivo não é compatível com esta ferramenta.',
      UNSUPPORTED_OUTPUT: 'Este formato de saída não é compatível.',
      ENHANCER_UNAVAILABLE: 'O serviço de melhoria está indisponível no momento. Tente mais tarde.',
      BUSY: 'O servidor está ocupado com outros arquivos. Tente de novo em instantes.',
      PROCESSING_TIMEOUT: 'O processamento demorou demais. Tente um arquivo menor.',
      PROCESSING_FAILED: 'Não foi possível processar o arquivo. Confira se ele é válido e não está protegido por senha.',
      INVALID_REQUEST: 'A solicitação não é válida. Tente de novo.'
    }
"""

for rel, line in PT.items():
    p = REPO / rel
    s = p.read_text(encoding='utf-8')
    if re.search(r'^\s*pt: \{', s, re.M):
        continue
    m = re.search(r'^(\s*)es: \{.*\}$', s, re.M)
    assert m, rel
    indent = m.group(1)
    # previous line must end with a comma for valid object syntax
    s = s[:m.end()] + ',\n' + indent + line + s[m.end():]
    p.write_text(s, encoding='utf-8')

p = REPO / 'js/tool-ui.js'
s = p.read_text(encoding='utf-8')
if "    pt: {" not in s:
    s = s.replace("if (lang !== 'ar' && lang !== 'es') lang = 'en';", "if (lang !== 'ar' && lang !== 'es' && lang !== 'pt') lang = 'en';", 1)
    s = s.replace("The page language comes from <html lang>, so English, Arabic and Spanish pages share one implementation.",
                  "The page language comes from <html lang>, so English, Arabic, Spanish and Portuguese pages share one implementation.", 1)
    s = s.replace("ConvertiosUI.extend({ en: {...}, ar: {...}, es: {...} })", "ConvertiosUI.extend({ en: {...}, ar: {...}, es: {...}, pt: {...} })", 1)
    # close the es block and append pt
    m = re.search(r"\n    es: \{.*?\n    \}\n", s, re.S)
    s = s[:m.end() - 1] + ",\n" + TOOL_UI_PT.rstrip('\n') + "\n" + s[m.end():]
    p.write_text(s, encoding='utf-8')
print('ok')
