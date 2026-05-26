import type { QuoteFormData } from "@/types";

const GHL_BASE = "https://rest.gohighlevel.com/v1";
const API_KEY = process.env.GHL_API_KEY;
const LOC_ID = process.env.GHL_LOCATION_ID;

// ─── Service → Tag mapping ────────────────────────────────────────────────────
const SERVICE_TAGS: Record<string, string> = {
  "Residential Waste Collection": "residential",
  "Commercial Waste Management": "commercial",
  "Recycling Services": "recycling",
  "Dumpster & Bin Rental": "dumpster-rental",
  "Junk Removal": "junk-removal",
  "Construction Waste Removal": "construction",
};

// ─── Create or update contact ─────────────────────────────────────────────────
export async function upsertCrmContact(data: QuoteFormData): Promise<string | null> {
  if (!API_KEY || !LOC_ID) {
    console.warn("GHL credentials not configured — CRM sync skipped");
    return null;
  }

  const [firstName, ...rest] = data.fullName.trim().split(" ");
  const lastName = rest.join(" ") || "";

  const payload = {
    firstName,
    lastName,
    email: data.email,
    phone: data.phone,
    locationId: LOC_ID,
    tags: [
      "website-lead",
      SERVICE_TAGS[data.serviceType] ?? "general",
      `city-${data.city.toLowerCase()}`,
    ],
    customField: [
      { id: "service_type", value: data.serviceType },
      { id: "city", value: data.city },
      { id: "pickup_frequency", value: data.pickupFrequency ?? "" },
      { id: "sms_opt_in", value: data.smsOptIn ? "yes" : "no" },
      { id: "message", value: data.message ?? "" },
      { id: "lead_source", value: "website-quote-form" },
    ],
  };

  try {
    // Try to find existing contact by email first
    const searchRes = await fetch(
      `${GHL_BASE}/contacts/search?email=${encodeURIComponent(data.email)}&locationId=${LOC_ID}`,
      { headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" } }
    );
    const searchData = await searchRes.json();
    const existingId = searchData?.contacts?.[0]?.id;

    let contactId: string;

    if (existingId) {
      // Update existing contact
      await fetch(`${GHL_BASE}/contacts/${existingId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      contactId = existingId;
    } else {
      // Create new contact
      const createRes = await fetch(`${GHL_BASE}/contacts/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await createRes.json();
      contactId = created?.contact?.id;
    }

    return contactId ?? null;
  } catch (err) {
    console.error("GHL CRM error:", err);
    return null;
  }
}

// ─── Add contact to pipeline opportunity ──────────────────────────────────────
export async function addToPipeline(
  contactId: string,
  serviceType: string,
  city: string
): Promise<void> {
  if (!API_KEY || !LOC_ID || !process.env.GHL_PIPELINE_ID) return;

  try {
    await fetch(`${GHL_BASE}/pipelines/${process.env.GHL_PIPELINE_ID}/opportunities`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${serviceType} — ${city}`,
        contactId,
        locationId: LOC_ID,
        stageId: process.env.GHL_STAGE_NEW_LEAD_ID ?? "new",
        status: "open",
        source: "website",
      }),
    });
  } catch (err) {
    console.error("GHL pipeline error:", err);
  }
}
