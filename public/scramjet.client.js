window.$scramjet = {
  rewriteHtml(html, base) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // LINKS
    doc.querySelectorAll("a").forEach(a => {
      let href = a.getAttribute("href");
      if (!href) return;

      try {
        let url = new URL(href, base).href;

        a.setAttribute("href", "#");
        a.onclick = () => window.loadPage(url);
      } catch {}
    });

    // IMAGES
    doc.querySelectorAll("img").forEach(img => {
      let src = img.getAttribute("src");
      if (!src) return;

      try {
        img.src = "/api/proxy?url=" + encodeURIComponent(new URL(src, base).href);
      } catch {}
    });

    // CSS FILES
    doc.querySelectorAll("link[rel='stylesheet']").forEach(link => {
      let href = link.getAttribute("href");
      if (!href) return;

      try {
        link.href = "/api/proxy?url=" + encodeURIComponent(new URL(href, base).href);
      } catch {}
    });

    // FORMS
    doc.querySelectorAll("form").forEach(form => {
      form.onsubmit = e => {
        e.preventDefault();

        let action = form.getAttribute("action") || base;
        let url = new URL(action, base).href;

        const data = new FormData(form);
        const params = new URLSearchParams(data).toString();

        window.loadPage(url + "?" + params);
      };
    });

    // REMOVE SCRIPTS (still needed)
    doc.querySelectorAll("script").forEach(s => s.remove());

    return doc.documentElement.innerHTML;
  }
};

// GLOBAL NAV
window.loadPage = async function(url) {
  const res = await fetch("/api/proxy?url=" + encodeURIComponent(url));
  let html = await res.text();

  html = window.$scramjet.rewriteHtml(html, url);

  tabs[currentTab].content = html;
  renderPage(html);
};
