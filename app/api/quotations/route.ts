import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all quotations from database
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const source = searchParams.get("source")

    // Build filter conditions
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (source) {
      where.source = source
    }

    // Query database
    const quotations = await prisma.quotation.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        messages: true,
      },
    })

    return NextResponse.json(quotations)
  } catch (error) {
    console.error("Error fetching quotations:", error)
    return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 })
  }
}

// Update quotation status
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, notes } = body

    // Update in local database
    const updatedQuotation = await prisma.quotation.update({
      where: { id },
      data: {
        status,
        notes,
        updatedAt: new Date(),
      },
    })

    // Sync with PowerCRM if needed
    if (updatedQuotation.powercrmId) {
      const apiKey = process.env.POWERCRM_API_KEY
      const apiUrl = process.env.POWERCRM_API_URL

      if (apiKey && apiUrl) {
        await fetch(`${apiUrl}/quotations/${updatedQuotation.powercrmId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            notes,
          }),
        })
      }
    }

    return NextResponse.json(updatedQuotation)
  } catch (error) {
    console.error("Error updating quotation:", error)
    return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 })
  }
}

