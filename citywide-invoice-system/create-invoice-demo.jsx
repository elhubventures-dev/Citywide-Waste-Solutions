import { useState, useMemo } from "react";
import { Plus, Copy, Trash2, Save, Send, FileDown } from "lucide-react";

// Citywide Waste Solutions — Invoice Manager
// Phase 1 demo: Create Invoice page, on-brand, fully working with local state.
// Brand: navy #1E3A5C, CAD, Ontario HST default. See skill references/branding.md.

const NAVY = "#1E3A5C";

const SERVICE_LIBRARY = [
  { name: "Residential Waste Collection", unit: "pickup", price: 45 },
  { name: "Commercial Waste Management", unit: "month", price: 380 },
  { name: "Recycling Services", unit: "pickup", price: 35 },
  { name: "Dumpster & Bin Rental (14yd)", unit: "rental", price: 425 },
  { name: "Junk Removal", unit: "job", price: 250 },
  { name: "Construction Waste Removal", unit: "load", price: 320 },
  { name: "Hazardous Materials Pickup", unit: "job", price: 180 },
  { name: "Residential Moving", unit: "hour", price: 120 },
  { name: "Commercial Moving", unit: "hour", price: 150 },
  { name: "Packing", unit: "hour", price: 55 },
  { name: "Furniture Assembly", unit: "item", price: 40 },
  { name: "Office Relocation", unit: "job", price: 900 },
];

let rowId = 0;
const newRow = (svc) => ({
  id: `row-${rowId++}`,
  service: svc?.name ?? "",
  description: "",
  qty: 1,
  unit: svc?.unit ?? "unit",
  price: svc?.price ?? 0,
  discount: 0,
  tax: 13, // Ontario HST default, configurable
});

export default function CreateInvoicePage() {
  const [client, setClient] = useState({
    company: "", name: "", phone: "", email: "",
    serviceAddress: "", billingAddress: "", city: "", province: "ON", country: "Canada", zip: "",
  });
  const [meta, setMeta] = useState({
    invoiceNo: `CW-${new Date().getFullYear()}-0001`,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    currency: "CAD",
    terms: "Due on receipt",
    status: "Draft",
    deposit: 0,
    amountPaid: 0,
  });
  const [rows, setRows] = useState([newRow(SERVICE_LIBRARY[0])]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const lineTotal = (r) => {
    const base = r.qty * r.price;
    const afterDiscount = base - (base * r.discount) / 100;
    return afterDiscount + (afterDiscount * r.tax) / 100;
  };

  const totals = useMemo(() => {
    const subtotal = rows.reduce((s, r) => s + r.qty * r.price, 0);
    const discountTotal = rows.reduce((s, r) => s + (r.qty * r.price * r.discount) / 100, 0);
    const taxable = subtotal - discountTotal;
    const taxTotal = rows.reduce((s, r) => {
      const base = r.qty * r.price - (r.qty * r.price * r.discount) / 100;
      return s + (base * r.tax) / 100;
    }, 0);
    const grandTotal = taxable + taxTotal;
    const balanceDue = grandTotal - meta.deposit - meta.amountPaid;
    return { subtotal, discountTotal, taxTotal, grandTotal, balanceDue };
  }, [rows, meta.deposit, meta.amountPaid]);

  const fmt = (n) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: meta.currency }).format(n || 0);

  const updateRow = (id, patch) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => setRows((rs) => [...rs, newRow()]);
  const duplicateRow = (id) =>
    setRows((rs) => {
      const r = rs.find((x) => x.id === id);
      return [...rs, { ...r, id: `row-${rowId++}` }];
    });
  const deleteRow = (id) => setRows((rs) => rs.filter((r) => r.id !== id));

  const addFromLibrary = (svc) => {
    setRows((rs) => [...rs, newRow(svc)]);
    setShowLibrary(false);
  };

  const saveDraft = () => setSavedAt(new Date().toLocaleTimeString("en-CA"));

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#F7F8FA", minHeight: "100%", padding: "32px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: NAVY, letterSpacing: 0.4, textTransform: "uppercase" }}>
              Invoice Manager
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: "4px 0 0" }}>
              New Invoice
            </h1>
            <p style={{ color: "#6B7280", fontSize: 14, margin: "4px 0 0" }}>
              Citywide Waste Solutions · Ontario, Canada
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={saveDraft}
              style={btnStyle("#fff", NAVY, `1px solid ${NAVY}`)}
            >
              <Save size={15} style={{ marginRight: 6 }} /> Save Draft
            </button>
            <button style={btnStyle(NAVY, "#fff")}>
              <Send size={15} style={{ marginRight: 6 }} /> Send Invoice
            </button>
          </div>
        </div>
        {savedAt && (
          <div style={{ fontSize: 12, color: "#059669", marginBottom: 16 }}>
            Draft saved at {savedAt}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Client info */}
          <Card title="Client Information">
            <Field label="Company Name" value={client.company} onChange={(v) => setClient({ ...client, company: v })} />
            <Field label="Client Name" value={client.name} onChange={(v) => setClient({ ...client, name: v })} />
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="Phone" value={client.phone} onChange={(v) => setClient({ ...client, phone: v })} />
              <Field label="Email" value={client.email} onChange={(v) => setClient({ ...client, email: v })} />
            </div>
            <Field label="Service Address" value={client.serviceAddress} onChange={(v) => setClient({ ...client, serviceAddress: v })} />
            <Field label="Billing Address" value={client.billingAddress} onChange={(v) => setClient({ ...client, billingAddress: v })} />
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="City" value={client.city} onChange={(v) => setClient({ ...client, city: v })} />
              <Field label="Province" value={client.province} onChange={(v) => setClient({ ...client, province: v })} />
              <Field label="ZIP" value={client.zip} onChange={(v) => setClient({ ...client, zip: v })} />
            </div>
          </Card>

          {/* Invoice details */}
          <Card title="Invoice Details">
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="Invoice #" value={meta.invoiceNo} onChange={(v) => setMeta({ ...meta, invoiceNo: v })} />
              <Field label="Currency" value={meta.currency} onChange={(v) => setMeta({ ...meta, currency: v })} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="Issue Date" type="date" value={meta.issueDate} onChange={(v) => setMeta({ ...meta, issueDate: v })} />
              <Field label="Due Date" type="date" value={meta.dueDate} onChange={(v) => setMeta({ ...meta, dueDate: v })} />
            </div>
            <Field label="Payment Terms" value={meta.terms} onChange={(v) => setMeta({ ...meta, terms: v })} />
            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={meta.status}
                onChange={(e) => setMeta({ ...meta, status: e.target.value })}
                style={inputStyle}
              >
                {["Draft", "Pending", "Sent", "Viewed", "Partially Paid", "Paid", "Overdue", "Cancelled"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </Card>
        </div>

        {/* Service items */}
        <Card title="Service Items" action={
          <div style={{ display: "flex", gap: 8, position: "relative" }}>
            <button onClick={() => setShowLibrary((s) => !s)} style={btnStyle("#fff", NAVY, `1px solid ${NAVY}`, 13)}>
              From Library
            </button>
            <button onClick={addRow} style={btnStyle(NAVY, "#fff", "none", 13)}>
              <Plus size={14} style={{ marginRight: 4 }} /> Add Item
            </button>
            {showLibrary && (
              <div style={{
                position: "absolute", top: 36, right: 0, background: "#fff", border: "1px solid #E5E7EB",
                borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", zIndex: 10, width: 260, maxHeight: 260, overflowY: "auto"
              }}>
                {SERVICE_LIBRARY.map((s) => (
                  <div
                    key={s.name}
                    onClick={() => addFromLibrary(s)}
                    style={{ padding: "10px 14px", fontSize: 13, cursor: "pointer", borderBottom: "1px solid #F3F4F6" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F8FA")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    <div style={{ fontWeight: 600, color: "#111827" }}>{s.name}</div>
                    <div style={{ color: "#6B7280" }}>{fmt(s.price)} / {s.unit}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        }>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#6B7280", borderBottom: "2px solid #E5E7EB" }}>
                  {["Service", "Qty", "Unit", "Price", "Disc %", "Tax %", "Total", ""].map((h) => (
                    <th key={h} style={{ padding: "8px 6px", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "6px" }}>
                      <input value={r.service} onChange={(e) => updateRow(r.id, { service: e.target.value })} style={cellInput} placeholder="Service name" />
                    </td>
                    <td style={{ padding: "6px", width: 60 }}>
                      <input type="number" value={r.qty} onChange={(e) => updateRow(r.id, { qty: +e.target.value })} style={cellInput} />
                    </td>
                    <td style={{ padding: "6px", width: 80 }}>
                      <input value={r.unit} onChange={(e) => updateRow(r.id, { unit: e.target.value })} style={cellInput} />
                    </td>
                    <td style={{ padding: "6px", width: 90 }}>
                      <input type="number" value={r.price} onChange={(e) => updateRow(r.id, { price: +e.target.value })} style={cellInput} />
                    </td>
                    <td style={{ padding: "6px", width: 70 }}>
                      <input type="number" value={r.discount} onChange={(e) => updateRow(r.id, { discount: +e.target.value })} style={cellInput} />
                    </td>
                    <td style={{ padding: "6px", width: 70 }}>
                      <input type="number" value={r.tax} onChange={(e) => updateRow(r.id, { tax: +e.target.value })} style={cellInput} />
                    </td>
                    <td style={{ padding: "6px", width: 100, fontWeight: 600, color: "#111827" }}>
                      {fmt(lineTotal(r))}
                    </td>
                    <td style={{ padding: "6px", width: 60 }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <IconBtn onClick={() => duplicateRow(r.id)}><Copy size={14} /></IconBtn>
                        <IconBtn onClick={() => deleteRow(r.id)}><Trash2 size={14} /></IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <div style={{ width: 320, background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <Row label="Subtotal" value={fmt(totals.subtotal)} />
            <Row label="Discount" value={`- ${fmt(totals.discountTotal)}`} />
            <Row label="Tax (HST)" value={fmt(totals.taxTotal)} />
            <div style={{ borderTop: `2px solid ${NAVY}`, margin: "10px 0" }} />
            <Row label="Grand Total" value={fmt(totals.grandTotal)} bold />
            <Field label="Deposit" type="number" value={meta.deposit} onChange={(v) => setMeta({ ...meta, deposit: +v })} compact />
            <Field label="Amount Paid" type="number" value={meta.amountPaid} onChange={(v) => setMeta({ ...meta, amountPaid: +v })} compact />
            <div style={{ borderTop: "1px dashed #E5E7EB", margin: "10px 0" }} />
            <Row label="Balance Due" value={fmt(totals.balanceDue)} bold color={NAVY} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <button style={btnStyle("#fff", NAVY, `1px solid ${NAVY}`)}>
            <FileDown size={15} style={{ marginRight: 6 }} /> Preview PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, action, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>{title}</h3>
        {action}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", compact }) {
  return (
    <div style={{ flex: 1, marginBottom: compact ? 8 : 0 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}

function Row({ label, value, bold, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", fontWeight: bold ? 700 : 400, color: color || "#111827" }}>
      <span style={{ color: bold ? color || "#111827" : "#6B7280" }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function IconBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ border: "none", background: "#F3F4F6", borderRadius: 6, padding: 6, cursor: "pointer", color: "#6B7280" }}>
      {children}
    </button>
  );
}

const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, color: "#6B7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 };
const inputStyle = { width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, boxSizing: "border-box" };
const cellInput = { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #E5E7EB", fontSize: 13, boxSizing: "border-box" };
const btnStyle = (bg, color, border = "none", size = 14) => ({
  background: bg, color, border, borderRadius: 8, padding: "9px 16px", fontSize: size, fontWeight: 600,
  cursor: "pointer", display: "inline-flex", alignItems: "center",
});
