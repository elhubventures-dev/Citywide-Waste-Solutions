import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/admin/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/admin/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/admin/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/admin/ecommerce/StatisticsChart";
import RecentOrders from "@/components/admin/ecommerce/RecentOrders";
import DemographicCard from "@/components/admin/ecommerce/DemographicCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin Dashboard | Citywide Waste Solutions",
  description: "Admin Dashboard for Citywide Waste Solutions",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch aggregate data
  const [
    totalClients,
    totalQuotes,
    totalInvoices,
    recentInvoices,
    allInvoices,
    quoteRequests,
    contactSubmissions
  ] = await Promise.all([
    prisma.client.count(),
    prisma.quoteRequest.count(),
    prisma.invoice.count(),
    prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: { select: { name: true, company: true } } }
    }),
    prisma.invoice.findMany({
      select: { grandTotal: true, status: true, createdAt: true, deposit: true, amountPaid: true }
    }),
    prisma.quoteRequest.findMany({
      select: { city: true, createdAt: true }
    }),
    prisma.contactSubmission.findMany({
      select: { createdAt: true }
    })
  ]);

  // Total paid revenue (sum of grandTotal for fully PAID, or deposit + amountPaid for others)
  const totalRevenue = allInvoices
    .reduce((acc, i) => {
      const paid = i.status.toUpperCase() === "PAID" ? i.grandTotal : (i.deposit + i.amountPaid);
      return acc + paid;
    }, 0);

  // Current month revenue
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentRevenue = allInvoices
    .filter(i => i.createdAt.getMonth() === currentMonth && i.createdAt.getFullYear() === currentYear)
    .reduce((acc, i) => {
      const paid = i.status.toUpperCase() === "PAID" ? i.grandTotal : (i.deposit + i.amountPaid);
      return acc + paid;
    }, 0);

  // Monthly Revenue for Sales Chart (Jan - Dec)
  const monthlyRevenue = new Array(12).fill(0);
  allInvoices.forEach(i => {
    if (i.createdAt.getFullYear() === currentYear) {
      const paid = i.status.toUpperCase() === "PAID" ? i.grandTotal : (i.deposit + i.amountPaid);
      monthlyRevenue[i.createdAt.getMonth()] += paid;
    }
  });

  // Quotes and Contacts per month for Statistics Chart
  const quotesSeries = new Array(12).fill(0);
  quoteRequests.forEach(q => {
    if (q.createdAt.getFullYear() === currentYear) {
      quotesSeries[q.createdAt.getMonth()]++;
    }
  });
  
  const contactsSeries = new Array(12).fill(0);
  contactSubmissions.forEach(c => {
    if (c.createdAt.getFullYear() === currentYear) {
      contactsSeries[c.createdAt.getMonth()]++;
    }
  });

  // Top Cities
  const cityCounts = quoteRequests.reduce((acc, q) => {
    const city = q.city || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCityQuotes = quoteRequests.length || 1;
  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalCityQuotes) * 100)
    }));

  // Map Recent Invoices
  const mappedRecentInvoices = recentInvoices.map(inv => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    clientName: inv.client?.company || inv.client?.name || "Unknown",
    date: inv.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    amount: "$" + inv.grandTotal.toFixed(2),
    status: inv.status,
  }));

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics 
          totalClients={totalClients}
          totalQuotes={totalQuotes}
          totalInvoices={totalInvoices}
          totalRevenue={totalRevenue}
        />

        <MonthlySalesChart seriesData={monthlyRevenue} />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget currentRevenue={currentRevenue} targetRevenue={10000} />
      </div>

      <div className="col-span-12">
        <StatisticsChart quotesSeries={quotesSeries} contactsSeries={contactsSeries} />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard cities={topCities} />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders invoices={mappedRecentInvoices} />
      </div>
    </div>
  );
}
