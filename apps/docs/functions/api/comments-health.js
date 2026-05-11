const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers || {}),
    },
  });
}

function getDb(env) {
  return env.CHUFIX_COMMENTS_DB || env.COMMENTS_DB || null;
}

export async function onRequest({ env }) {
  const dbBound = Boolean(getDb(env));

  return json({
    ok: true,
    dbBound,
    expectedBinding: 'CHUFIX_COMMENTS_DB',
    legacyBinding: 'COMMENTS_DB',
    adminTokenConfigured: Boolean(env.CHUFIX_COMMENTS_ADMIN_TOKEN),
    message: dbBound
      ? 'Comments D1 binding is available to this deployment.'
      : 'Comments D1 binding is not available to this deployment. Bind D1 in the active Production/Preview environment and redeploy.',
  });
}
