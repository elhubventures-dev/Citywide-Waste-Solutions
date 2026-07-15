import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { InvoiceDraft } from "@/types/invoice";
import { COMPANY_INFO } from "@/lib/invoice-constants";
import { BRAND_COLORS } from "@/lib/brand-colors";
import { SITE_IMAGES } from "@/lib/site-images";
import { absoluteUrl } from "@/lib/utils";

const { navy, green, navyDark, offWhite } = BRAND_COLORS;

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.45,
    backgroundColor: "#FFFFFF",
  },
  accentBar: {
    height: 5,
    backgroundColor: green,
  },
  accentBarNavy: {
    height: 3,
    backgroundColor: navy,
  },
  content: {
    paddingTop: 32,
    paddingHorizontal: 44,
    paddingBottom: 72,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  headerLeft: {
    width: "52%",
  },
  logo: {
    width: 200,
    marginBottom: 10,
  },
  brandName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: navy,
    marginBottom: 2,
  },
  tagline: {
    fontSize: 8,
    color: green,
    fontFamily: "Helvetica-Oblique",
    marginBottom: 10,
  },
  companyDetail: {
    fontSize: 8.5,
    color: "#6B7280",
    marginBottom: 3,
  },
  headerRight: {
    width: "42%",
    alignItems: "flex-end",
  },
  docType: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: navy,
    letterSpacing: 2,
    lineHeight: 1.1,
  },
  docNumber: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: green,
    marginTop: 6,
    marginBottom: 14,
  },
  metaBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  metaRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  metaRowLast: {
    flexDirection: "row",
  },
  metaLabel: {
    width: "45%",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: offWhite,
    fontSize: 8,
    color: "#6B7280",
    fontFamily: "Helvetica-Bold",
  },
  metaValue: {
    width: "55%",
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 8.5,
    color: "#111827",
  },
  addressSection: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  addressBlock: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    padding: 14,
    backgroundColor: "#FAFBFC",
  },
  sectionLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: green,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  clientName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 3,
  },
  clientText: {
    fontSize: 8.5,
    color: "#4B5563",
    marginBottom: 2,
  },
  table: {
    width: "100%",
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: navy,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  th: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FAFBFC",
  },
  td: {
    fontSize: 8.5,
    color: "#374151",
  },
  tdDesc: {
    fontSize: 8.5,
    color: "#374151",
  },
  tdDescSub: {
    fontSize: 7.5,
    color: "#9CA3AF",
    marginTop: 2,
  },
  tdAmount: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: navy,
  },
  colDesc: { flex: 3.2 },
  colQty: { flex: 0.8, textAlign: "center" },
  colPrice: { flex: 1.2, textAlign: "right" },
  colTax: { flex: 0.7, textAlign: "center" },
  colTotal: { flex: 1.2, textAlign: "right" },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  leftColumn: {
    width: "48%",
  },
  rightColumn: {
    width: "48%",
  },
  infoBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#FAFBFC",
  },
  infoTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: navy,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 8.5,
    color: "#4B5563",
    marginBottom: 4,
    lineHeight: 1.5,
  },
  paymentHighlight: {
    backgroundColor: navy,
    borderRadius: 3,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginVertical: 6,
  },
  paymentHighlightText: {
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textAlign: "center",
  },
  totalsBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  totalLabel: {
    fontSize: 8.5,
    color: "#6B7280",
  },
  totalValue: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: offWhite,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  grandTotalLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: navy,
  },
  grandTotalValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: navy,
  },
  balanceDueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: navy,
  },
  balanceDueLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  balanceDueValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: green,
  },
  notesText: {
    fontSize: 8,
    color: "#6B7280",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: navyDark,
    paddingVertical: 14,
    paddingHorizontal: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flex: 1,
  },
  footerText: {
    fontSize: 7.5,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  footerThanks: {
    fontSize: 9,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
  },
  footerRight: {
    alignItems: "flex-end",
  },
});

interface InvoicePdfTemplateProps {
  draft: InvoiceDraft;
  formatCurrency: (n: number) => string;
}

function MetaRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={last ? styles.metaRowLast : styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

export function InvoicePdfTemplate({ draft, formatCurrency }: InvoicePdfTemplateProps) {
  const { client, meta, rows } = draft;

  const subtotal = rows.reduce((s, r) => s + r.qty * r.price, 0);
  const discountTotal = rows.reduce((s, r) => s + (r.qty * r.price * r.discount) / 100, 0);
  const taxTotal = rows.reduce((s, r) => {
    const base = r.qty * r.price - (r.qty * r.price * r.discount) / 100;
    return s + (base * r.tax) / 100;
  }, 0);
  const grandTotal = subtotal - discountTotal + taxTotal;
  const balanceDue = grandTotal - meta.deposit - meta.amountPaid;

  const brandName = meta.brand === "moving" ? COMPANY_INFO.sisterBrand : COMPANY_INFO.name;
  const docLabel = meta.type === "QUOTE" ? "QUOTE" : "INVOICE";
  const logoSrc = typeof window !== "undefined"
    ? SITE_IMAGES.logos.header
    : "public" + SITE_IMAGES.logos.header;

  const formatAddress = () => {
    const parts = [client.billingAddress, client.city, client.province, client.zip].filter(Boolean);
    return parts.join(", ");
  };

  const formatServiceAddress = () => {
    const parts = [client.serviceAddress, client.city, client.province, client.zip].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />
        <View style={styles.accentBarNavy} />

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image src={logoSrc} style={styles.logo} />
              <Text style={styles.brandName}>{brandName}</Text>
              <Text style={styles.tagline}>{COMPANY_INFO.tagline}</Text>
              <Text style={styles.companyDetail}>{COMPANY_INFO.address}</Text>
              <Text style={styles.companyDetail}>{COMPANY_INFO.phone} · {COMPANY_INFO.email}</Text>
              <Text style={styles.companyDetail}>{COMPANY_INFO.website}</Text>
            </View>

            <View style={styles.headerRight}>
              <Text style={styles.docType}>{docLabel}</Text>
              <Text style={styles.docNumber}>#{meta.invoiceNo}</Text>

              <View style={styles.metaBox}>
                <MetaRow label="Issue Date" value={meta.issueDate || "—"} />
                <MetaRow label="Due Date" value={meta.dueDate || "—"} />
                <MetaRow label="Payment Terms" value={meta.terms || "—"} />
                <MetaRow label="Status" value={meta.status} last />
              </View>
            </View>
          </View>

          {/* Client addresses */}
          <View style={styles.addressSection}>
            <View style={styles.addressBlock}>
              <Text style={styles.sectionLabel}>Bill To</Text>
              <Text style={styles.clientName}>{client.name || client.company || "Client"}</Text>
              {client.company && client.name ? (
                <Text style={styles.clientText}>{client.company}</Text>
              ) : null}
              {formatAddress() ? <Text style={styles.clientText}>{formatAddress()}</Text> : null}
              {client.email ? <Text style={styles.clientText}>{client.email}</Text> : null}
              {client.phone ? <Text style={styles.clientText}>{client.phone}</Text> : null}
              {client.taxNumber ? (
                <Text style={styles.clientText}>Tax #: {client.taxNumber}</Text>
              ) : null}
            </View>

            {client.serviceAddress ? (
              <View style={styles.addressBlock}>
                <Text style={styles.sectionLabel}>Service Location</Text>
                <Text style={styles.clientText}>{formatServiceAddress()}</Text>
              </View>
            ) : null}
          </View>

          {/* Line items */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colDesc]}>Description</Text>
              <Text style={[styles.th, styles.colQty]}>Qty</Text>
              <Text style={[styles.th, styles.colPrice]}>Unit Price</Text>
              <Text style={[styles.th, styles.colTax]}>Tax</Text>
              <Text style={[styles.th, styles.colTotal]}>Amount</Text>
            </View>

            {rows.map((row, i) => {
              const base = row.qty * row.price;
              const afterDisc = base - (base * row.discount) / 100;
              const lineTot = afterDisc + (afterDisc * row.tax) / 100;
              const rowStyle = i % 2 === 1 ? styles.tableRowAlt : styles.tableRow;

              return (
                <View key={i} style={rowStyle}>
                  <View style={styles.colDesc}>
                    <Text style={styles.tdDesc}>{row.service || "—"}</Text>
                    {row.description ? (
                      <Text style={styles.tdDescSub}>{row.description}</Text>
                    ) : null}
                    {row.discount > 0 ? (
                      <Text style={styles.tdDescSub}>{row.discount}% discount applied</Text>
                    ) : null}
                  </View>
                  <Text style={[styles.td, styles.colQty]}>
                    {row.qty} {row.unit}
                  </Text>
                  <Text style={[styles.td, styles.colPrice]}>{formatCurrency(row.price)}</Text>
                  <Text style={[styles.td, styles.colTax]}>{row.tax}%</Text>
                  <Text style={[styles.tdAmount, styles.colTotal]}>{formatCurrency(lineTot)}</Text>
                </View>
              );
            })}
          </View>

          {/* Payment + Totals */}
          <View style={styles.bottomSection}>
            <View style={styles.leftColumn}>
              {meta.type !== "QUOTE" ? (
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Payment Instructions</Text>
                  <Text style={styles.infoText}>
                    Please remit payment via Interac e-Transfer to the address below.
                    Include your invoice number in the transfer message.
                  </Text>
                  <View style={styles.paymentHighlight}>
                    <Text style={styles.paymentHighlightText}>{COMPANY_INFO.email}</Text>
                  </View>
                  <Text style={styles.infoText}>
                    Reference: Invoice #{meta.invoiceNo}
                  </Text>
                  <Text style={styles.infoText}>
                    Pay online at {COMPANY_INFO.website}/pay
                  </Text>
                </View>
              ) : (
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Quote Validity</Text>
                  <Text style={styles.infoText}>
                    This quote is valid for 30 days from the issue date unless otherwise noted.
                    Contact us to accept or discuss any adjustments.
                  </Text>
                </View>
              )}

              {client.notes ? (
                <View style={styles.infoBox}>
                  <Text style={styles.infoTitle}>Notes</Text>
                  <Text style={styles.notesText}>{client.notes}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.totalsBox}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
                </View>
                {discountTotal > 0 ? (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Discount</Text>
                    <Text style={styles.totalValue}>-{formatCurrency(discountTotal)}</Text>
                  </View>
                ) : null}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>HST / Tax</Text>
                  <Text style={styles.totalValue}>{formatCurrency(taxTotal)}</Text>
                </View>
                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalLabel}>Total ({meta.currency})</Text>
                  <Text style={styles.grandTotalValue}>{formatCurrency(grandTotal)}</Text>
                </View>
                {meta.deposit > 0 ? (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Deposit Received</Text>
                    <Text style={styles.totalValue}>-{formatCurrency(meta.deposit)}</Text>
                  </View>
                ) : null}
                {meta.amountPaid > 0 ? (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Amount Paid</Text>
                    <Text style={styles.totalValue}>-{formatCurrency(meta.amountPaid)}</Text>
                  </View>
                ) : null}
                <View style={styles.balanceDueRow}>
                  <Text style={styles.balanceDueLabel}>
                    {meta.type === "QUOTE" ? "QUOTE TOTAL" : "BALANCE DUE"}
                  </Text>
                  <Text style={styles.balanceDueValue}>{formatCurrency(balanceDue)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerLeft}>
            <Text style={styles.footerText}>
              BN {COMPANY_INFO.businessNumbers.bn} · BIN {COMPANY_INFO.businessNumbers.bin}
            </Text>
            <Text style={styles.footerText}>
              NAICS {COMPANY_INFO.businessNumbers.naics} · All amounts in {meta.currency}
            </Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerThanks}>Thank you for your business</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
