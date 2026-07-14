import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const dateRange = searchParams.get("dateRange");

    const where: any = {};

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { client: { name: { contains: search, mode: "insensitive" } } },
        { client: { company: { contains: search, mode: "insensitive" } } },
        { client: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status && status !== "All") {
      where.status = status;
    }

    if (dateRange && dateRange !== "All Time") {
      const now = new Date();
      let startDate = new Date();
      
      if (dateRange === "Today") {
        startDate.setHours(0, 0, 0, 0);
      } else if (dateRange === "This Week") {
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === "This Month") {
        startDate.setMonth(now.getMonth() - 1);
      } else if (dateRange === "This Year") {
        startDate.setFullYear(now.getFullYear() - 1);
      }
      
      where.createdAt = { gte: startDate };
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
      },
    });

    // Build CSV Header
    const headers = [
      "Invoice Number",
      "Brand",
      "Client Name",
      "Company",
      "Email",
      "Status",
      "Issue Date",
      "Due Date",
      "Subtotal",
      "Tax",
      "Discount",
      "Grand Total",
      "Amount Paid",
      "Balance Due"
    ];
    
    // Build CSV Rows
    const rows = invoices.map(inv => [
      inv.invoiceNumber,
      inv.brand === "waste" ? "Citywide Waste Solutions" : "Citywide Moving Solutions",
      inv.client?.name || "",
      inv.client?.company || "",
      inv.client?.email || "",
      inv.status,
      inv.issueDate || "",
      inv.dueDate || "",
      inv.subtotal.toString(),
      inv.taxTotal.toString(),
      inv.discountTotal.toString(),
      inv.grandTotal.toString(),
      inv.amountPaid.toString(),
      inv.balanceDue.toString(),
    ]);

    // Escape quotes and wrap fields in quotes
    const escapeCsv = (field: string) => {
      if (field === null || field === undefined) return '""';
      return `"${field.replace(/"/g, '""')}"`;
    };

    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map(row => row.map(escapeCsv).join(","))
    ].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="invoices_export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting invoices:", error);
    return NextResponse.json({ error: "Failed to export invoices" }, { status: 500 });
  }
}
