import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { PowerCRMClient } from "@/lib/powercrm-api"

const prisma = new PrismaClient()

// Sync data between PowerCRM and local database
export async function POST() {
  try {
    const apiKey = process.env.POWERCRM_API_KEY
    const apiUrl = process.env.POWERCRM_API_URL

    if (!apiKey || !apiUrl) {
      return NextResponse.json({ error: "PowerCRM API configuration missing" }, { status: 500 })
    }

    const client = new PowerCRMClient(apiKey, apiUrl)

    // Get all quotations from PowerCRM
    const quotations = await client.getQuotations()

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      let created = 0
      let updated = 0
      let unchanged = 0

      for (const quotation of quotations) {
        // Check if quotation exists in local database
        const existingQuotation = await tx.quotation.findFirst({
          where: { powercrmId: quotation.id },
        })

        if (!existingQuotation) {
          // Create new quotation in local database
          await tx.quotation.create({
            data: {
              customerId: quotation.customer.id,
              customerName: quotation.customer.name,
              vehicleDetails: `${quotation.vehicle.model} ${quotation.vehicle.year}`,
              price: quotation.price,
              additionalPrice: quotation.additionalPrice,
              source: quotation.source,
              powercrmId: quotation.id,
              status: quotation.status,
              createdAt: new Date(quotation.createdAt),
              updatedAt: new Date(quotation.updatedAt),
            },
          })
          created++
        } else {
          // Check if update is needed
          const needsUpdate =
            existingQuotation.customerName !== quotation.customer.name ||
            existingQuotation.price !== quotation.price ||
            existingQuotation.status !== quotation.status

          if (needsUpdate) {
            // Update existing quotation
            await tx.quotation.update({
              where: { id: existingQuotation.id },
              data: {
                customerName: quotation.customer.name,
                vehicleDetails: `${quotation.vehicle.model} ${quotation.vehicle.year}`,
                price: quotation.price,
                additionalPrice: quotation.additionalPrice,
                status: quotation.status,
                updatedAt: new Date(quotation.updatedAt),
              },
            })
            updated++
          } else {
            unchanged++
          }
        }
      }

      // Log sync results
      await tx.quotationSync.create({
        data: {
          syncedAt: new Date(),
          recordCount: quotations.length,
          status: "SUCCESS",
        },
      })

      return { created, updated, unchanged, total: quotations.length }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error syncing with PowerCRM:", error)

    // Log sync failure
    await prisma.quotationSync.create({
      data: {
        syncedAt: new Date(),
        recordCount: 0,
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    })

    return NextResponse.json({ error: "Failed to sync with PowerCRM" }, { status: 500 })
  }
}

