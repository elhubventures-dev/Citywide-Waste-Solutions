import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import type { InvoiceDraft } from "@/types/invoice";
import { COMPANY_INFO } from "@/lib/invoice-constants";

// Register custom fonts (using standard Inter or Roboto if we had URLs, but we'll stick to built-in Helvetica for maximum compatibility unless specified)
// Helvetica is built-in to PDF, so we don't need to load external font files for the base.

const BORDER_COLOR = "#E5E7EB";
const BRAND_NAVY = "#1E3A5C";
const BRAND_GREEN = "#2E9B4A";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  logo: {
    width: 140,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: BRAND_NAVY,
    marginBottom: 4,
  },
  companyText: {
    fontSize: 9,
    color: "#6B7280",
  },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: BRAND_NAVY,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  metaLabel: {
    width: 80,
    color: "#6B7280",
    textAlign: "right",
    paddingRight: 8,
  },
  metaValue: {
    width: 90,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  clientSection: {
    flexDirection: "row",
    marginBottom: 40,
  },
  clientBlock: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  clientName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 4,
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
    paddingBottom: 6,
    marginBottom: 6,
  },
  th: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  td: {
    fontSize: 10,
    color: "#111827",
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colTax: { flex: 1, textAlign: "center" },
  colTotal: { flex: 1.5, textAlign: "right" },
  totalsArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  paymentBlock: {
    width: 250,
  },
  paymentTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: BRAND_NAVY,
    marginBottom: 4,
  },
  paymentText: {
    fontSize: 9,
    color: "#4B5563",
    lineHeight: 1.4,
  },
  totalsBlock: {
    width: 200,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: {
    color: "#6B7280",
  },
  totalValue: {
    color: "#111827",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 2,
    borderTopColor: BRAND_NAVY,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontFamily: "Helvetica-Bold",
    color: BRAND_NAVY,
  },
  grandTotalValue: {
    fontFamily: "Helvetica-Bold",
    color: BRAND_NAVY,
  },
  balanceDueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    backgroundColor: "#F3F6F8",
    paddingHorizontal: 8,
    marginTop: 4,
    borderRadius: 4,
  },
  balanceDueLabel: {
    fontFamily: "Helvetica-Bold",
    color: BRAND_NAVY,
  },
  balanceDueValue: {
    fontFamily: "Helvetica-Bold",
    color: BRAND_NAVY,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#9CA3AF",
  },
});

interface InvoicePdfTemplateProps {
  draft: InvoiceDraft;
  formatCurrency: (n: number) => string;
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

  const brandName =
    meta.brand === "moving" ? COMPANY_INFO.sisterBrand : COMPANY_INFO.name;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Fallback to text if logo image is unavailable during client render */}
            <Text style={styles.companyName}>{brandName}</Text>
            <Text style={styles.companyText}>{COMPANY_INFO.address}</Text>
            <Text style={styles.companyText}>Phone: {COMPANY_INFO.phone}</Text>
            <Text style={styles.companyText}>Email: {COMPANY_INFO.email}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>{meta.type === "QUOTE" ? "Quote" : "Invoice"}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{meta.type === "QUOTE" ? "Quote #:" : "Invoice #:"}</Text>
              <Text style={styles.metaValue}>{meta.invoiceNo}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Issue Date:</Text>
              <Text style={styles.metaValue}>{meta.issueDate || "—"}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Due Date:</Text>
              <Text style={styles.metaValue}>{meta.dueDate || "—"}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Status:</Text>
              <Text style={styles.metaValue}>{meta.status}</Text>
            </View>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.clientSection}>
          <View style={styles.clientBlock}>
            <Text style={styles.sectionTitle}>Billed To</Text>
            <Text style={styles.clientName}>{client.name || client.company || "Client"}</Text>
            {client.company && client.name && <Text style={styles.companyText}>{client.company}</Text>}
            {client.billingAddress && (
              <Text style={styles.companyText}>
                {client.billingAddress}, {client.city} {client.province} {client.zip}
              </Text>
            )}
            {client.email && <Text style={styles.companyText}>{client.email}</Text>}
            {client.phone && <Text style={styles.companyText}>{client.phone}</Text>}
            {client.taxNumber && <Text style={styles.companyText}>Tax #: {client.taxNumber}</Text>}
          </View>
          {client.serviceAddress && (
            <View style={styles.clientBlock}>
              <Text style={styles.sectionTitle}>Service Address</Text>
              <Text style={styles.companyText}>{client.serviceAddress}</Text>
            </View>
          )}
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colDesc]}>Description</Text>
            <Text style={[styles.th, styles.colQty]}>Qty</Text>
            <Text style={[styles.th, styles.colPrice]}>Price</Text>
            <Text style={[styles.th, styles.colTax]}>Tax %</Text>
            <Text style={[styles.th, styles.colTotal]}>Total</Text>
          </View>
          {rows.map((row, i) => {
            const base = row.qty * row.price;
            const afterDisc = base - (base * row.discount) / 100;
            const lineTot = afterDisc + (afterDisc * row.tax) / 100;

            return (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.td, styles.colDesc]}>{row.service || "—"}</Text>
                <Text style={[styles.td, styles.colQty]}>
                  {row.qty} {row.unit}
                </Text>
                <Text style={[styles.td, styles.colPrice]}>
                  {formatCurrency(row.price)}
                </Text>
                <Text style={[styles.td, styles.colTax]}>{row.tax}%</Text>
                <Text style={[styles.td, styles.colTotal]}>{formatCurrency(lineTot)}</Text>
              </View>
            );
          })}
        </View>

        {/* Totals & Payment Instructions */}
        <View style={styles.totalsArea}>
          <View style={styles.paymentBlock}>
            {meta.type !== "QUOTE" && (
              <>
                <Text style={styles.paymentTitle}>Payment Instructions</Text>
                <Text style={styles.paymentText}>
                  Please send payments via Interac e-Transfer to:
                </Text>
                <Text style={[styles.paymentText, { fontFamily: "Helvetica-Bold", marginTop: 2 }]}>
                  payments@citywidewastesolutions.com
                </Text>
                <Text style={[styles.paymentText, { marginTop: 4 }]}>
                  Include Invoice #{meta.invoiceNo} in the message.
                </Text>
              </>
            )}
          </View>
          
          <View style={styles.totalsBlock}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
            </View>
            {discountTotal > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount:</Text>
                <Text style={styles.totalValue}>-{formatCurrency(discountTotal)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax (HST):</Text>
              <Text style={styles.totalValue}>{formatCurrency(taxTotal)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total:</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(grandTotal)}</Text>
            </View>
            {(meta.deposit > 0 || meta.amountPaid > 0) && (
              <>
                {meta.deposit > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Deposit:</Text>
                    <Text style={styles.totalValue}>-{formatCurrency(meta.deposit)}</Text>
                  </View>
                )}
                {meta.amountPaid > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Amount Paid:</Text>
                    <Text style={styles.totalValue}>-{formatCurrency(meta.amountPaid)}</Text>
                  </View>
                )}
              </>
            )}
            <View style={styles.balanceDueRow}>
              <Text style={styles.balanceDueLabel}>Balance Due:</Text>
              <Text style={styles.balanceDueValue}>{formatCurrency(balanceDue)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerText}>
              BN: {COMPANY_INFO.businessNumbers.bn} | BIN: {COMPANY_INFO.businessNumbers.bin}
            </Text>
          </View>
          <View>
            <Text style={styles.footerText}>Terms: {meta.terms}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
