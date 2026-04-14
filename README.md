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
| `NEXT_PUBLIC_PRONTO_DENTAL_URL` | Link “Visitar” do card Pronto Dental (default `https://italo.pelizaro.com.br`) |
| `NEXT_PUBLIC_INSTAGRAM_URL` | URL do perfil Instagram (default `https://www.instagram.com/heitor.pelizaro/`) |
| `NEXT_PUBLIC_INSTAGRAM_WIDGET_IFRAME_SRC` | Opcional: URL de iframe (ex. SnapWidget) para feed embutido acima da grade |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn (opcional) |

### Grade de fotos (Instagram)

O site **não lê o feed do Instagram automaticamente** (a API oficial exige app e token; hotlink de `cdninstagram` quebra por política do browser). Há duas opções:

1. **Imagens estáticas:** coloque até **6** ficheiros em `public/instagram/` com nomes `grid-1` … `grid-6` e extensão `.jpg`, `.jpeg`, `.webp` ou `.png` (a página tenta nessa ordem por célula). Células sem ficheiro mostram o placeholder. Cada miniatura abre o teu perfil (`NEXT_PUBLIC_INSTAGRAM_URL`).
2. **Widget embutido:** define `NEXT_PUBLIC_INSTAGRAM_WIDGET_IFRAME_SRC` com o URL do iframe (ex. SnapWidget / serviço semelhante) no `.env.local` ou nas variáveis do GitHub (environment `vps`).

Copie `.env.example` para `.env.local` se quiser testar localmente.

## OG image

Substitua `public/og.png` por uma imagem **1200×630** (PNG/JPG) para compartilhamento social. O arquivo atual é placeholder.

## Foto do hero

Substitua `public/heitor.svg` por `public/heitor.jpg` (ou ajuste o `src` em `src/components/sections/HeroSection.tsx`).

## Repositório GitHub

- **URL:** https://github.com/HeitorPelizaro/heitor-pelizaro-page  
- O workflow usa o **Environment `vps`** (como o Pronto Dental). Em **heitor-pelizaro-page**: **Settings → Environments → New environment** → nome `vps` → adicione os mesmos **Environment secrets** (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, opcional `VPS_SSH_PORT`).  
  Environments são **por repositório**: copie os valores do ambiente `vps` do Pronto-Dental para o `vps` deste repo.  
  (Se preferir só **Repository secrets**, remova `environment: vps` do workflow ou duplique os secrets no nível do repo.)

- **Secrets** — `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`; opcional `VPS_SSH_PORT`. Com `gh` logado (exemplo para **environment**; ajuste se usar só repo):

  ```bash
  cd /caminho/do/heitor-pelizaro
  # Crie o environment "vps" na UI uma vez; depois:
  echo "SEU_IP_VPS" | gh secret set VPS_HOST --env vps -R HeitorPelizaro/heitor-pelizaro-page
  echo "SEU_USUARIO_SSH" | gh secret set VPS_USER --env vps -R HeitorPelizaro/heitor-pelizaro-page
  gh secret set VPS_SSH_KEY --env vps -R HeitorPelizaro/heitor-pelizaro-page < ~/.ssh/sua_chave_privada_deploy
  ```

  Ou na UI: **Settings → Environments → vps → Add secret**.

- **Variables:** `HEITOR_DEPLOY_PATH` (opcional, default `/var/www/heitor-pelizaro`), `CERTBOT_EMAIL` (opcional, default `admin@pelizaro.com.br` no passo Certbot), e `NEXT_PUBLIC_*` se quiser sobrescrever links no build.

Se você usa alias SSH (ex.: `Host github-gmail` no `~/.ssh/config`), o remoto pode ser `git@github-gmail:HeitorPelizaro/heitor-pelizaro-page.git`.

Se o `git push` falhar com **“refusing to allow an OAuth App … workflow … without workflow scope”**, o token do `gh` precisa do escopo `workflow`:

```bash
gh auth refresh -s workflow -h github.com
git remote set-url origin https://github.com/HeitorPelizaro/heitor-pelizaro-page.git
git push -u origin main
```

Se usar **SSH** e aparecer **Permission denied to heitorpelizaro-nh**, ou você adiciona essa conta como colaborador com escrita no repositório, ou configura outra chave SSH para a conta **HeitorPelizaro** (ex.: `~/.ssh/config` com `Host github-heitor` + `git@github-heitor:HeitorPelizaro/heitor-pelizaro-page.git`).

## Deploy (VPS + Nginx)

Passo a passo: [DEPLOY.md](./DEPLOY.md). O workflow publica `out/` por **rsync**, envia o vhost **Nginx** (`nginx/nginx-heitor-pelizaro.conf`) e tenta **Certbot** para `heitor.pelizaro.com.br`. O **Pronto Dental** mantém uma cópia espelhada do mesmo arquivo em `deploy/nginx-heitor-pelizaro.conf` para deploys desse repo.

## Lighthouse

Após deploy, rode Lighthouse no Chrome (ou `npx lighthouse`) contra a URL HTTPS e valide LCP, acessibilidade e best practices. Use o toggle **Performance** no HUD para comparar.
