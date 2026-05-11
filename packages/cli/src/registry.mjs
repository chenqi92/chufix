async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} · ${url}`);
  }
  return res.json();
}

export async function fetchRegistry(base) {
  const root = base.replace(/\/+$/, '');
  // 优先尝试 base/index.json，回退到 base.json（Astro 静态构建产物）
  try {
    return await fetchJson(`${root}/index.json`);
  } catch {
    return fetchJson(`${root}.json`);
  }
}

export async function fetchBlock(base, id) {
  const url = `${base.replace(/\/+$/, '')}/${encodeURIComponent(id)}.json`;
  const data = await fetchJson(url);
  if (!data?.files?.length) {
    throw new Error(`block ${id} 没有文件，注册表可能不完整：${url}`);
  }
  return data;
}
