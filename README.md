# heitor.pelizaro.com.br

Landing estática (Next.js 15, export) — cyberpunk / neon, grafo em canvas, camada Three.js (aberração cromática + ruído), cursor magnético, PT/EN, conquistas e easter egg.

## Desenvolvimento

```bash
npm ci
npm run dev
```

Build de produção (gera `out/`):

```bash
npm run build
```

## Variáveis públicas (opcional)

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SITE_URL` | URL canônica (default `https://heitor.pelizaro.com.br`) |
| `NEXT_PUBLIC_GITHUB_URL` | Perfil/repo GitHub |
| `NEXT_PUBLIC_EMAIL` | E-mail do CTA |
| `NEXT_PUBLIC_PRONTO_DENTAL_URL` | Link público do Pronto Dental |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn (opcional) |

Copie `.env.example` para `.env.local` se quiser testar localmente.

## OG image

Substitua `public/og.png` por uma imagem **1200×630** (PNG/JPG) para compartilhamento social. O arquivo atual é placeholder.

## Foto do hero

Substitua `public/heitor.svg` por `public/heitor.jpg` (ou ajuste o `src` em `src/components/sections/HeroSection.tsx`).

## Repositório GitHub

- **URL:** https://github.com/HeitorPelizaro/heitor-pelizaro-page  
- **Secrets do Actions** (Settings → Secrets and variables → Actions): **os mesmos nomes e valores** do repositório **Pronto-Dental** — `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`; opcional `VPS_SSH_PORT`.  
  O agente da IDE **não consegue** criar isso por você (precisa IP, usuário e chave privada). Com `gh` logado:

  ```bash
  cd /caminho/do/heitor-pelizaro
  gh secret set VPS_HOST -R HeitorPelizaro/heitor-pelizaro-page
  gh secret set VPS_USER -R HeitorPelizaro/heitor-pelizaro-page
  gh secret set VPS_SSH_KEY -R HeitorPelizaro/heitor-pelizaro-page < ~/.ssh/sua_chave_privada_deploy
  ```

  (Cole o IP/usuário quando o `gh` pedir, ou use a UI do GitHub e copie do Pronto-Dental.)

- **Variables:** `HEITOR_DEPLOY_PATH` (opcional, default `/var/www/heitor-pelizaro`), e `NEXT_PUBLIC_*` se quiser sobrescrever links no build.

Se você usa alias SSH (ex.: `Host github-gmail` no `~/.ssh/config`), o remoto pode ser `git@github-gmail:HeitorPelizaro/heitor-pelizaro-page.git`.

Se o `git push` falhar com **“refusing to allow an OAuth App … workflow … without workflow scope”**, o token do `gh` precisa do escopo `workflow`:

```bash
gh auth refresh -s workflow -h github.com
git remote set-url origin https://github.com/HeitorPelizaro/heitor-pelizaro-page.git
git push -u origin main
```

Se usar **SSH** e aparecer **Permission denied to heitorpelizaro-nh**, ou você adiciona essa conta como colaborador com escrita no repositório, ou configura outra chave SSH para a conta **HeitorPelizaro** (ex.: `~/.ssh/config` com `Host github-heitor` + `git@github-heitor:HeitorPelizaro/heitor-pelizaro-page.git`).

## Deploy (VPS + Nginx)

Passo a passo: [DEPLOY.md](./DEPLOY.md). O projeto **Pronto Dental** (mesma VPS) pode instalar o vhost de `heitor.pelizaro.com.br` no próximo deploy; os arquivos estáticos vêm deste repositório via **GitHub Actions** (`rsync` de `out/`).

## Lighthouse

Após deploy, rode Lighthouse no Chrome (ou `npx lighthouse`) contra a URL HTTPS e valide LCP, acessibilidade e best practices. Use o toggle **Performance** no HUD para comparar.
