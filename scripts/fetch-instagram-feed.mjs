#!/usr/bin/env node
/**
 * Gera public/instagram-feed.json antes do build (npm prebuild).
 * Requer conta Instagram Profissional (Empresa ou Criador) e token da Instagram Graph API.
 * Sem INSTAGRAM_ACCESS_TOKEN: escreve feed vazio (site usa placeholders / ficheiros estáticos).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "instagram-feed.json");
const API_VERSION = "v21.0";
const BASE = `https://graph.instagram.com/${API_VERSION}`;

function out(payload) {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(payload, null, 0)}\n`, "utf8");
}

function pickImageUrl(item) {
  if (!item) return null;
  if (item.media_type === "VIDEO") {
    return item.thumbnail_url || item.media_url || null;
  }
  if (item.media_type === "CAROUSEL_ALBUM") {
    const first = item.children?.data?.[0];
    return (
      first?.media_url || item.media_url || item.thumbnail_url || null
    );
  }
  return item.media_url || item.thumbnail_url || null;
}

async function resolveUserId(token) {
  const fromEnv = process.env.INSTAGRAM_USER_ID?.trim();
  if (fromEnv) return fromEnv;
  const url = `${BASE}/me?fields=id&access_token=${encodeURIComponent(token)}`;
  const r = await fetch(url);
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`me: ${r.status} ${t}`);
  }
  const j = await r.json();
  if (!j.id) throw new Error("me: resposta sem id");
  return j.id;
}

async function fetchMedia(userId, token) {
  const fields =
    "id,media_type,media_url,permalink,thumbnail_url,children{media_url,media_type}";
  const url = `${BASE}/${userId}/media?fields=${encodeURIComponent(fields)}&limit=6&access_token=${encodeURIComponent(token)}`;
  const r = await fetch(url);
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`media: ${r.status} ${t}`);
  }
  return r.json();
}

async function main() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!token) {
    console.log(
      "[fetch-instagram-feed] Sem INSTAGRAM_ACCESS_TOKEN — feed vazio.",
    );
    out({ items: [], fetchedAt: null });
    return;
  }

  try {
    const userId = await resolveUserId(token);
    const data = await fetchMedia(userId, token);
    const raw = data.data ?? [];
    const items = [];
    for (const item of raw) {
      const imageUrl = pickImageUrl(item);
      if (!imageUrl || !item.permalink) continue;
      items.push({
        id: item.id,
        permalink: item.permalink,
        imageUrl,
        mediaType: item.media_type,
      });
    }
    out({
      items,
      fetchedAt: new Date().toISOString(),
    });
    console.log(
      `[fetch-instagram-feed] OK — ${items.length} item(ns) em instagram-feed.json`,
    );
  } catch (e) {
    console.error("[fetch-instagram-feed] Falhou:", e?.message || e);
    out({ items: [], fetchedAt: null });
  }
}

main();
