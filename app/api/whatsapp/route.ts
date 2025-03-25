import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Send WhatsApp message
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, message, quotationId } = body

    // WhatsApp Business API configuration
    const whatsappToken = process.env.WHATSAPP_API_TOKEN
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID

    if (!whatsappToken || !whatsappPhoneId) {
      return NextResponse.json({ error: "WhatsApp API configuration missing" }, { status: 500 })
    }

    // Format phone number (remove non-numeric characters and ensure it has country code)
    const formattedPhone = formatPhoneNumber(phone)

    // Send message via WhatsApp Business API
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
      const errorData = await response.json()
      throw new Error(`WhatsApp API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    // Log the message in database
    await prisma.messageLog.create({
      data: {
        quotationId,
        phoneNumber: formattedPhone,
        message,
        messageId: data.messages?.[0]?.id,
        status: "SENT",
        channel: "WHATSAPP",
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error sending WhatsApp message:", error)
    return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 })
  }
}

// Helper function to format phone number
function formatPhoneNumber(phone: string): string {
  // Remove non-numeric characters
  const numericOnly = phone.replace(/\D/g, "")

  // Ensure it has country code (add Brazil +55 if missing)
  if (numericOnly.length === 11 || numericOnly.length === 10) {
    return `55${numericOnly}`
  }

  return numericOnly
}

