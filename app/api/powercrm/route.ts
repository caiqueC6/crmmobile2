import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Fetch quotations from PowerCRM API
export async function GET() {
  try {
    // PowerCRM API authentication
    const apiKey = process.env.POWERCRM_API_KEY
    const apiUrl = process.env.POWERCRM_API_URL

    if (!apiKey || !apiUrl) {
      return NextResponse.json({ error: "PowerCRM API configuration missing" }, { status: 500 })
    }

    // Fetch data from PowerCRM API
    const response = await fetch(`${apiUrl}/quotations`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`PowerCRM API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Store the data in the database
    await prisma.quotationSync.create({
      data: {
        syncedAt: new Date(),
        recordCount: data.length,
        status: "SUCCESS",
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from PowerCRM:", error)
    return NextResponse.json({ error: "Failed to fetch data from PowerCRM" }, { status: 500 })
  }
}

// Create new quotation in PowerCRM
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer, vehicle, price, source } = body

    // PowerCRM API authentication
    const apiKey = process.env.POWERCRM_API_KEY
    const apiUrl = process.env.POWERCRM_API_URL

    if (!apiKey || !apiUrl) {
      return NextResponse.json({ error: "PowerCRM API configuration missing" }, { status: 500 })
    }

    // Create quotation in PowerCRM
    const response = await fetch(`${apiUrl}/quotations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer,
        vehicle,
        price,
        source,
        createdAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`PowerCRM API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Store in local database
    await prisma.quotation.create({
      data: {
        customerId: data.customerId,
        customerName: customer,
        vehicleDetails: vehicle,
        price: Number.parseFloat(price),
        source,
        powercrmId: data.id,
        status: "NEW",
      },
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating quotation:", error)
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 })
  }
}

