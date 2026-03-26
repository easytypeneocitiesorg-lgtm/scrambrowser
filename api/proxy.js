// /api/proxy.js
export default async function handler(req, res) {
  try {
    let { url } = req.query;

    if (!url) {
      res.status(400).send("No URL provided");
      return;
    }

    // Normalize URL
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (ProxyBrowser)" }
    });

    if (!response.ok) {
      res.status(500).send(`<p style="color:red;">Failed to fetch page: ${response.status}</p>`);
      return;
    }

    let html = await response.text();

    // Inject iframe-hijack.js at the start of <head>
    html = html.replace(
      /<head([^>]*)>/i,
      `<head$1><script src="/iframe-hijack.js"></script>`
    );

    res.setHeader("Content-Type", "text/html");
    res.send(html);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send(`<p style="color:red;">Proxy error: ${err.message}</p>`);
  }
}
