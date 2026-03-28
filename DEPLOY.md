# Deploy (Vercel + API)

O **Vercel** só faz o build do front (Vite). O **Express** em `server/` **não roda** no Vercel com este projeto, a menos que você hospede a API em outro lugar.

## 1. Subir a API (Render, Railway, Fly.io, etc.)

1. Crie um **Web Service** apontando para o mesmo repositório (ou só a pasta do projeto).
2. **Build:** `npm install`
3. **Start:** `node server/index.mjs`
4. **Variáveis de ambiente** no painel do host:
   - `MONGODB_URI` — string do Atlas (pode ser a mesma que no `.env` local)
   - `ADMIN_PASSWORD` — senha do CMS
   - `PORT` — em muitos hosts é **definido automaticamente**; o código já usa `process.env.PORT`

5. No **MongoDB Atlas → Network Access**, use `0.0.0.0/0` (ou o IP do host) para o banco aceitar conexões da API na nuvem.

6. Copie a URL pública **HTTPS** da API (ex.: `https://barbell-api.onrender.com`).

## 2. Conectar o site no Vercel à API

### Opção A — Variável `VITE_API_URL` (recomendado)

1. No projeto **Vercel → Settings → Environment Variables**, adicione:
   - Nome: `VITE_API_URL`
   - Valor: `https://sua-api.onrender.com` (**sem** barra no final)
   - Ambientes: Production (e Preview se quiser)

2. **Faça um novo deploy** (Redeploy) para o Vite embutir a variável no build.

3. **Não** deixe `VITE_API_URL=http://localhost:3001` na Vercel — isso quebra em produção.

### Opção B — Proxy no Vercel (`vercel.json`)

1. Renomeie `vercel.json.example` para `vercel.json`.
2. Troque `https://SEU-SERVICO.onrender.com` pela URL **real** da sua API (HTTPS).
3. No front, **não** defina `VITE_API_URL` no build (ou deixe vazio), para os fetches usarem `/api/...` no mesmo domínio do site; o Vercel encaminha para o backend.

Use **A** **ou** **B**, não os dois com URLs diferentes.

## 3. Checklist rápido

- [ ] API responde em `https://.../api/health` → `{ "ok": true }`
- [ ] URL da API é **HTTPS** (o site na Vercel é HTTPS; HTTP puro pode ser bloqueado pelo navegador)
- [ ] Após mudar `VITE_API_URL`, rodou **novo deploy** no Vercel
