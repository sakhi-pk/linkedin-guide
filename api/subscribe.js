// Vercel serverless function: POST /api/subscribe
// Receives { name, email, topic } and adds the person to a MailerLite group.
// MailerLite's automation ("subscriber joins a group") then sends the welcome email.

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : (req.body || {});
  const name = String(body.name || "").trim().slice(0, 60);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 200);
  const topic = body.topic === "linkedin" ? "linkedin" : "app";

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "Invalid name or email" });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  // MailerLite needs group IDs (not names). Copy them from MailerLite > Subscribers > Groups.
  const groupId = topic === "linkedin"
    ? process.env.MAILERLITE_GROUP_LINKEDIN
    : process.env.MAILERLITE_GROUP_APP;

  if (!apiKey || !groupId) {
    return res.status(500).json({ ok: false, error: "Server not configured" });
  }

  try {
    const r = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ email: email, fields: { name: name }, groups: [groupId] })
    });
    if (!r.ok) {
      return res.status(502).json({ ok: false, error: "Subscription failed" });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: "Subscription failed" });
  }
};

function safeParse(s) {
  try { return JSON.parse(s); } catch (e) { return {}; }
}
