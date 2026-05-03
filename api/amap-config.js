module.exports = (req, res) => {
  const key = process.env.AMAP_JSAPI_KEY;
  const securityJsCode = process.env.AMAP_SECURITY_JS_CODE;

  if (!key || !securityJsCode) {
    return res.status(500).json({
      ok: false,
      error: 'Missing AMAP_JSAPI_KEY or AMAP_SECURITY_JS_CODE'
    });
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(200).json({
    ok: true,
    key,
    securityJsCode
  });
};
