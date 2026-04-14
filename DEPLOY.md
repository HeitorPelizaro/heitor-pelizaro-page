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

## 9. TLS e erro ERR_CERT_AUTHORITY_INVALID

O Chrome mostra `net::ERR_CERT_AUTHORITY_INVALID` quando o certificado **não é confiável** para o hostname (cadeia incompleta, cert errado, expirado) **ou** quando alguém na rede substitui o certificado (inspeção SSL / antivírus “HTTPS scan”) por um emitido por uma **AC interna** que o browser do visitante não conhece.

### 9.1 Validar o servidor (Internet pública)

Na tua máquina (fora de VPN corporativa):

```bash
echo | openssl s_client -connect heitor.pelizaro.com.br:443 -servername heitor.pelizaro.com.br -showcerts 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

No fim da saída do `s_client` (sem o pipe ao `x509`), procure **`Verify return code: 0 (ok)`**. Se for **0**, a cadeia vista da Internet está correta.

- **SSL Labs (baseline público):** [https://www.ssllabs.com/ssltest/](https://www.ssllabs.com/ssltest/) — analisar `heitor.pelizaro.com.br` e confirmar cadeia / nota.

### 9.2 Validar na VPS (Nginx + Certbot)

Com SSH no servidor:

```bash
sudo nginx -T 2>/dev/null | grep -E 'ssl_certificate|server_name'
```

Confirme que `ssl_certificate` aponta para o **`fullchain.pem`** do Let’s Encrypt (não só `cert.pem`), por exemplo:

`ssl_certificate /etc/letsencrypt/live/heitor.pelizaro.com.br/fullchain.pem;`

Renovação e teste:

```bash
sudo certbot renew --dry-run
```

### 9.3 Classificar o relato por visitante

| Pergunta | Se sim, suspeita |
|----------|------------------|
| Só falha em **Wi‑Fi empresa / escola** e **dados móveis funcionam**? | Inspeção SSL / firewall com MITM |
| **VPN** ou **antivírus** com “scan HTTPS” ligado? | Mesmo: cert substituído |
| Em **detalhes do certificado** no browser, o **emissor não é** Let’s Encrypt (ex.: nome da empresa / AC interna)? | MITM na rede do visitante |
| **SSL Labs** e `openssl` com **Verify 0** mas só **alguns** users falham? | Problema no **cliente/rede**, não no site |
| **Todos** os browsers / redes falham e SSL Labs mostra erro de cadeia? | Corrigir **Nginx** (`fullchain`), **SNI**, **renovação** |

**O que o dono do site não resolve sozinho:** pedir ao visitante que use outra rede, desative temporariamente o scan HTTPS, ou peça ao **IT** exceção de inspeção para `heitor.pelizaro.com.br` (ou instalação da raiz corporativa nos postos — política interna).

**Última verificação automática (ambiente de CI):** `openssl s_client` contra `heitor.pelizaro.com.br:443` com `-servername heitor.pelizaro.com.br` devolveu **Verify return code: 0 (ok)**, emissor **Let's Encrypt (E8)**, SAN **DNS:heitor.pelizaro.com.br** (validade conforme data no certificado ao correr o comando).
