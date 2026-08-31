FROM node:20-bookworm-slim

ENV NODE_ENV=production \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    U2NET_HOME=/opt/convertios-models

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY requirements.txt ./
RUN python3 -m pip install --no-cache-dir --break-system-packages -r requirements.txt

COPY server.js ./
COPY backend ./backend

RUN mkdir -p "$U2NET_HOME" \
    && python3 -c "from rembg import new_session; new_session('u2netp')"

RUN useradd --create-home --uid 10001 convertios \
    && chown -R convertios:convertios /app "$U2NET_HOME"
USER convertios

EXPOSE 3000
CMD ["npm", "start"]
