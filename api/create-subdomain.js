const SUBDOMAIN_CONFIG = {
  "vortexx.web.id": {
    zone: "c18b51c25edcb0a1ed085a5db3dea175",
    token: "4Iv8vSQPpyjyoXcu2n4RaHWgpAQ4tj-vZh5jvmKX"
  },
  "kelazzz.biz.id": {
    zone: "0487158c5c8dbebdfcb2f53f20b3be6b",
    token: "4Iv8vSQPpyjyoXcu2n4RaHWgpAQ4tj-vZh5jvmKX"
  },
  "joomods.web.id": {
    zone: "87e098c925fd485d66d18807d7feb473",
    token: "4Iv8vSQPpyjyoXcu2n4RaHWgpAQ4tj-vZh5jvmKX"
  },
  "liinode.biz.id": {
    zone: "b8711da7208a687e9c2a85c94a710a04",
    token: "4Iv8vSQPpyjyoXcu2n4RaHWgpAQ4tj-vZh5jvmKX"
  },
  "blademoon.my.id": {
    zone: "451a7aecd42284d49f189b271d48fc2f",
    token: "4Iv8vSQPpyjyoXcu2n4RaHWgpAQ4tj-vZh5jvmKX"
  },
  "rezeemd.my.id": {
    zone: "493170047ee028aad6322f0da2f8e4af",
    token: "4Iv8vSQPpyjyoXcu2n4RaHWgpAQ4tj-vZh5jvmKX"
  },
  "pteroodctly.my.id": {
    zone: "",
    token: "4Iv8vSQPpyjyoXcu2n4RaHWgpAQ4tj-vZh5jvmKX"
  },
  "kaylapanel.my.id": {
    zone: "a5cd2c869d78330ab37790d283535b61",
    token: "4Iv8vSQPpyjyoXcu2n4RaHWgpAQ4tj-vZh5jvmKX"
  },
  "digitalzocean.biz.id": {
    zone: "25b80844e4f41eed83f47fa60ebd03e0",
    token: "4Iv8vSQPpyjyoXcu2n4RaHWgpAQ4tj-vZh5jvmKX"
  }
};

const FIXED_API_KEY = "JooooModdssAlicia11112025";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Only GET allowed" });

  const { subdomain, ip, domain, apikey } = req.query;

  if (!subdomain || !ip || !domain || !apikey) return res.status(400).json({ error: "Missing parameters" });
  if (apikey !== FIXED_API_KEY) return res.status(401).json({ error: "Invalid apikey" });
  if (!/^[a-zA-Z0-9-]+$/.test(subdomain)) return res.status(400).json({ error: "Invalid subdomain" });
  if (!isValidIP(ip)) return res.status(400).json({ error: "Invalid IP" });

  const cfg = SUBDOMAIN_CONFIG[domain];
  if (!cfg || !cfg.zone) return res.status(400).json({ error: "Domain not configured" });

  const cfRes = await fetch(`https://api.cloudflare.com/client/v4/zones/${cfg.zone}/dns_records`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${cfg.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "A",
      name: `${subdomain}.${domain}`,
      content: ip,
      ttl: 300,
      proxied: false
    })
  });

  const cfData = await cfRes.json();
  if (!cfData.success) return res.status(500).json({ error: "Cloudflare error" });

  return res.status(200).json({
    success: true,
    data: {
      subdomain: `${subdomain}.${domain}`,
      ip
    }
  });
}

function isValidIP(ip) {
  const p = ip.split(".");
  if (p.length !== 4) return false;
  return p.every(x => { const n = parseInt(x, 10); return !isNaN(n) && n >= 0 && n <= 255; });
}