import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get message history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const quotationId = searchParams.get("quotationId")
    const phone = searchParams.get("phone")

    // Build filter conditions
    const where: any = {}

    if (quotationId) {
      where.quotationId = quotationId
    }

    if (phone) {
      where.phoneNumber = phone
    }

    // Query database
    const messages = await prisma.messageLog.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        quotation: true,
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// Send a new message
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { quotationId, phone, message, channel = "WHATSAPP" } = body

    // Validate required fields
    if (!phone || !message) {
      return NextResponse.json({ error: "Phone and message are required" }, { status: 400 })
    }

    let messageId: string | undefined

    // Send message via appropriate channel
    if (channel === "WHATSAPP") {
      const whatsappToken = process.env.WHATSAPP_API_TOKEN
      const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID

      if (!whatsappToken || !whatsappPhoneId) {
        return NextResponse.json({ error: "WhatsApp API configuration missing" }, { status: 500 })
      }

      // Format phone number
      const formattedPhone = phone.replace(/\D/g, "")

      // Send via WhatsApp API
      const response = await fetch(`https://graph.facebook.com/v17.0/${whatsappPhoneId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "text",
          text: { body: message },
        }),
      })

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`)
      }

      const data = await response.json()
      messageId = data.messages?.[0]?.id
    }

    // Log message in database
    const messageLog = await prisma.messageLog.create({
      data: {
        quotationId,
        phoneNumber: phone,
        message,
        messageId,
        status: "SENT",
        channel,
      },
    })

    return NextResponse.json(messageLog)
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

