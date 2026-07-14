import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming standard Prisma location

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const dateRange = searchParams.get("dateRange");
    const type = searchParams.get("type");

    const where: any = {};

    if (type) {
      where.type = type;
    }

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
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client, meta, rows, totals } = body;

    // We'll create or update a client if needed, but for simplicity here we'll just create a new client
    // or link by email if we wanted to. For now, creating a new client record per invoice is safest
    // for historical integrity, or we can use Prisma's nested create.

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: meta.invoiceNo,
        issueDate: meta.issueDate,
        dueDate: meta.dueDate,
        currency: meta.currency,
        terms: meta.terms,
        status: meta.status,
        brand: meta.brand,
        type: meta.type || "INVOICE",
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        grandTotal: totals.grandTotal,
        deposit: meta.deposit,
        amountPaid: meta.amountPaid,
        balanceDue: totals.balanceDue,
        client: {
          create: {
            company: client.company,
            name: client.name,
            email: client.email,
            phone: client.phone,
            serviceAddress: client.serviceAddress,
            billingAddress: client.billingAddress,
            city: client.city,
            province: client.province,
            country: client.country,
            zip: client.zip,
            taxNumber: client.taxNumber,
            notes: client.notes,
          },
        },
        items: {
          create: rows.map((r: any) => ({
            service: r.service,
            description: r.description,
            qty: r.qty,
            unit: r.unit,
            price: r.price,
            discount: r.discount,
            tax: r.tax,
          })),
        },
        activities: {
          create: {
            action: "CREATED",
            notes: "Invoice was created.",
          }
        },
      },
      include: {
        client: true,
        items: true,
        activities: {
          orderBy: { createdAt: "desc" }
        }
      },
    });

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
