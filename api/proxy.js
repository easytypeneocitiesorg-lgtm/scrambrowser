// api/proxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).send("No URL provided");
    return;
  }

  try {
    // Fetch the real page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (ProxyBrowser)"
      }
    });

    let html = await response.text();

    // Inject iframe-hijack.js at the start of <head>
    html = html.replace(
      /<head([^>]*)>/i,
      `<head$1><script src="/iframe-hijack.js"></script>`
    );

    // Return proxied page
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    res.status(500).send(`<p style="color:red;">Failed to fetch URL: ${err}</p>`);
  }
}
