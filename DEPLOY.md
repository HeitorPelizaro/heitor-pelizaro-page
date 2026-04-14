# Deploy — heitor.pelizaro.com.br

## 1. DNS

No provedor do domínio `pelizaro.com.br`, crie um registro **A**:

| Nome / host | Tipo | Valor |
|-------------|------|--------|
| `heitor` | A | IP público da VPS (o mesmo do Pronto Dental) |

Propagação pode levar de minutos a horas.

## 2. Diretório na VPS

```bash
sudo mkdir -p /var/www/heitor-pelizaro
sudo chown -R "$USER:$USER" /var/www/heitor-pelizaro
```

Após o primeiro deploy com `www-data`:

```bash
sudo chown -R www-data:www-data /var/www/heitor-pelizaro
```

## 3. Nginx

### Opção A — GitHub Actions deste repositório (recomendado)

Cada push na `main` (ou *workflow dispatch*) do **heitor-pelizaro** copia [nginx/nginx-heitor-pelizaro.conf](./nginx/nginx-heitor-pelizaro.conf) para a VPS (`/etc/nginx/sites-available/heitor-pelizaro`), ativa o site, roda `certbot --nginx -d heitor.pelizaro.com.br` (se o binário existir) e recarrega o Nginx. E-mail do Let's Encrypt: variable `CERTBOT_EMAIL` no environment `vps` (default `admin@pelizaro.com.br`).

Garanta o registro **DNS A** para `heitor` antes; sem isso o Certbot pode falhar (o deploy segue; rode de novo quando o DNS propagar).

### Opção B — deploy do Pronto Dental (mesma VPS)

O workflow do **Pronto Dental** ainda copia [deploy/nginx-heitor-pelizaro.conf](../Pronto%20Dental/deploy/nginx-heitor-pelizaro.conf), mantido **espelhado** com o arquivo deste repo.

### Opção C — manual

1. Copie [nginx/nginx-heitor-pelizaro.conf](./nginx/nginx-heitor-pelizaro.conf) para `/etc/nginx/sites-available/heitor-pelizaro` e substitua `HEITOR_ROOT_PLACEHOLDER` pelo path (ex.: `/var/www/heitor-pelizaro`).
2. Ative o site:

```bash
sudo ln -sf /etc/nginx/sites-available/heitor-pelizaro /etc/nginx/sites-enabled/heitor-pelizaro
sudo nginx -t && sudo systemctl reload nginx
```

**Nota:** o export do Next com `trailingSlash: true` gera `en/index.html` em `out/en/`. O bloco `location /en/` com `try_files` cobre isso. Se algo 404, confira se os ficheiros existem em `out/` após o build.

## 4. SSL (Let’s Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d heitor.pelizaro.com.br
```

Renovação costuma ser automática via cron do `certbot`.

## 5. Build local e cópia manual (teste)

```bash
npm ci
npm run build
rsync -azP --delete out/ usuario@IP_DA_VPS:/var/www/heitor-pelizaro/
```

Depois na VPS: `sudo chown -R www-data:www-data /var/www/heitor-pelizaro` e `sudo systemctl reload nginx`.

## 6. GitHub Actions

O workflow [.github/workflows/deploy.yml](./.github/workflows/deploy.yml) faz `npm run build` no runner e sincroniza `out/` via `rsync`.

**Secrets (repositório):**

- `VPS_HOST` — IP ou hostname
- `VPS_USER` — usuário SSH (com permissão de escrita no path de deploy e `sudo` para `chown` + `nginx`)
- `VPS_SSH_KEY` — chave privada OpenSSH

**Opcional:** `VPS_SSH_PORT` se não for 22.

**Variables:**

- `HEITOR_DEPLOY_PATH` — default `/var/www/heitor-pelizaro`
- `NEXT_PUBLIC_*` — ver [README.md](./README.md)

O passo final assume `sudo nginx -t && sudo systemctl reload nginx` sem senha (sudoers) para o usuário de deploy — alinhe com o que você já usa no Pronto Dental.

## 7. Headers e performance

O snippet Nginx inclui `gzip`, cache longo para `/_next/static/` e headers básicos de segurança. Opcional: habilitar **Brotli** se o módulo estiver disponível na sua distro.

## 8. Pós-deploy

- Abrir `https://heitor.pelizaro.com.br` e `/en/`.
- Validar `robots.txt` e `sitemap.xml`.
- Rodar Lighthouse (modo normal e modo **Performance** no HUD).
