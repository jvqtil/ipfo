export async function onRequest({ request }) {
    const ip = request.headers.get("CF-Connecting-IP") || "-";
    const cf = request.cf || {};

    const lat = cf.latitude ?? 0;
    const lon = cf.longitude ?? 0;

    const maps = `https://www.google.com/maps?q=${lat},${lon}`;
    const ipinfo = `https://ipinfo.io/${ip}`;

    function countryFlag(code) {
      if (!code || code.length !== 2) return "";

      return String.fromCodePoint(
        ...code.toUpperCase().split("").map(c => 127397 + c.charCodeAt())
      );
    }

    function escapeHtml(value) {
      return String(value ?? "-")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function googleSearch(value) {
      return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    }

    const rows = [
      ["Country", cf.country, true],
      ["Region", cf.region, true],
      ["City", cf.city, true],
      ["Continent", cf.continent],
      ["Provider", cf.asOrganization],
      ["Timezone", cf.timezone],
      ["ASN", cf.asn],
      ["Coordinates", `${lat}, ${lon}`],
      ["POP", cf.colo]
    ];

// All the CSS was written by an AI.
    const html = `
<!doctype html>
<html>
<head>

<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">

<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛰️</text></svg>">

<title>${escapeHtml(ip)}</title>

<style>
* {
  box-sizing:border-box;
}

:root {
  --bg:#181818;
  --panel:#101010;
  --border:#292929;
  --text:#f5f5f5;
  --muted:#999;
}

html,
body {
  margin:0;
  height:100%;
  background:var(--bg);
  color:var(--text);
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Arial,sans-serif;
}

body {
  display:flex;
  justify-content:center;
  align-items:center;
  padding:12px;
}

.box {
  width:100%;
  max-width:520px;
  background:var(--panel);
  border:1px solid var(--border);
  border-radius:18px;
  overflow:visible;
}

.ip {
  display:flex;
  align-items:center;
  gap:10px;
  padding:18px;
  cursor:pointer;
  user-select:none;
  font:700 clamp(22px,7vw,38px)/1 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  letter-spacing:-.05em;
  overflow-wrap:anywhere;
  transition:.15s;
}

.ip.copied {
  color:#7fdc9b;
}

.flag {
  display:inline-flex;
  align-items:center;
  font-size:.95em;
  transform:translateY(-1px);
}

.data {
  padding:0 18px 18px;
}

.row {
  display:flex;
  justify-content:space-between;
  gap:16px;
  padding:10px 0;
  border-bottom:1px solid var(--border);
  font-size:14px;
}

.row:last-child {
  border:0;
}

.key {
  color:var(--muted);
}

.value {
  font-weight:600;
  text-align:right;
  overflow-wrap:anywhere;
}

.value a {
  color:var(--text);
  text-decoration:none;
}

.value a:hover {
  text-decoration:underline;
}

.help {
  position:relative;
  margin-left:2px;
  color:var(--muted);
  cursor:help;
  font-size:.7em;
  vertical-align:super;
}

.help:hover::after {
  content:"Cloudflare data center that handled this request";
  position:absolute;
  left:0;
  bottom:150%;
  transform:none;
  width:230px;
  padding:8px 10px;
  background:#222;
  border:1px solid var(--border);
  border-radius:8px;
  color:var(--text);
  font-size:12px;
  font-weight:400;
  line-height:1.3;
  z-index:9999;
}

.links {
  display:flex;
  gap:10px;
  padding:0 18px 18px;
}

.links a {
  flex:1;
  padding:10px;
  border:1px solid var(--border);
  border-radius:10px;
  color:var(--text);
  text-align:center;
  text-decoration:none;
  font-size:13px;
}

.links a:active {
  background:#222;
}

.copy {
  position:fixed;
  left:50%;
  bottom:20px;
  transform:translateX(-50%);
  background:#222;
  border:1px solid var(--border);
  color:white;
  padding:8px 12px;
  border-radius:10px;
  opacity:0;
  pointer-events:none;
  transition:.2s;
}

.copy.show {
  opacity:1;
}

.credit {
  position:fixed;
  bottom:10px;
  left:50%;
  transform:translateX(-50%);
  color:#777;
  font-size:12px;
  text-align:center;
  white-space:nowrap;
}

.credit a {
  color:#aaa;
  text-decoration:none;
}

.credit a:hover {
  text-decoration:underline;
}

@media(max-width:480px) {
  body {
    padding:0;
    align-items:stretch;
  }

  .box {
    max-width:none;
    min-height:100dvh;
    border-radius:0;
  }

  .ip {
    padding:16px 14px;
    font-size:32px;
  }

  .data,
  .links {
    padding-left:14px;
    padding-right:14px;
  }

  .links.a {
    font-size:15px;
  }

  .row {
    font-size:16px;
  }

  .credit {
    bottom:20px;
  }
}
</style>

</head>

<body>

<div class="box">

<div class="ip" id="ip" title="Click to copy">
${escapeHtml(ip)}<span class="flag">${countryFlag(cf.country)}</span>
</div>

<div class="data">

${rows.map(([key, value, clickable]) => `
<div class="row">

<span class="key">
${key}${key === "POP" ? '<span class="help">?</span>' : ""}
</span>

<span class="value">
${clickable && value
        ? `<a href="${googleSearch(value)}" target="_blank">${escapeHtml(value)}</a>`
        : escapeHtml(value)
      }
</span>

</div>
`).join("")}

</div>

<div class="links">
<a href="${maps}" target="_blank">Google Maps</a>
<a href="${ipinfo}" target="_blank">ipinfo.io</a>
</div>

</div>

<div class="credit">
  <a href="https://github.com/jvqtil/ipfo" target="_blank">
    Source
  </a>
  •
  Powered by
    <a href="https://cloudflare.com/" target="_blank">
    Cloudflare
  </a>
  and
  <a href="https://freedns.afraid.org/" target="_blank">
    FreeDNS
  </a>
</div>

<div class="copy" id="copy">
Copied
</div>

<script>
const ip = document.getElementById("ip");
const copy = document.getElementById("copy");

ip.onclick = () => {
  navigator.clipboard.writeText("${ip}");

  ip.classList.add("copied");
  copy.classList.add("show");

  setTimeout(() => {
    ip.classList.remove("copied");
    copy.classList.remove("show");
  }, 400);
};
</script>

</body>
</html>
`;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8"
      }
    });
};
