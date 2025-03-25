import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get dashboard statistics
export async function GET() {
  try {
    // Get counts by status
    const statusCounts = await prisma.quotation.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    })

    // Get counts by source
    const sourceCounts = await prisma.quotation.groupBy({
      by: ["source"],
      _count: {
        id: true,
      },
    })

    // Get total value of quotations
    const totalValue = await prisma.quotation.aggregate({
      _sum: {
        price: true,
      },
    })

    // Get recent quotations
    const recentQuotations = await prisma.quotation.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get message statistics
    const messageStats = await prisma.messageLog.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    })

    // Get last sync info
    const lastSync = await prisma.quotationSync.findFirst({
      orderBy: {
        syncedAt: "desc",
      },
    })

    return NextResponse.json({
      statusCounts,
      sourceCounts,
      totalValue: totalValue._sum.price,
      recentQuotations,
      messageStats,
      lastSync,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}

