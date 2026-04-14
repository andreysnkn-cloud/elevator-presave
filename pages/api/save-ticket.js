export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ticket } = req.body;

  if (!ticket) {
    return res.status(400).json({ error: "No ticket provided" });
  }

  try {
    const response = await fetch(
      "https://xinlnilbxzdwmcuiekgi.supabase.co/rest/v1/tickets",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: "sb_publishable_LzpKPaFe2gtZm4oREFA7Tg_cR3-48-A",
          Authorization: "Bearer sb_publishable_LzpKPaFe2gtZm4oREFA7Tg_cR3-48-A",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          ticket_number: ticket
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({
        error: "Failed to save ticket",
        details: errorText
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
