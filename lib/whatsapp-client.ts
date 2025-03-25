/**
 * WhatsApp Business API client
 * Handles sending messages via WhatsApp
 */

export interface WhatsAppMessageResponse {
  messaging_product: string
  contacts: Array<{
    input: string
    wa_id: string
  }>
  messages: Array<{
    id: string
  }>
}

export class WhatsAppClient {
  private token: string
  private phoneId: string

  constructor(token: string, phoneId: string) {
    this.token = token
    this.phoneId = phoneId
  }

  // Format phone number to WhatsApp format
  private formatPhoneNumber(phone: string): string {
    // Remove non-numeric characters
    const numericOnly = phone.replace(/\D/g, "")

    // Ensure it has country code (add Brazil +55 if missing)
    if (numericOnly.length === 11 || numericOnly.length === 10) {
      return `55${numericOnly}`
    }

    return numericOnly
  }

  // Send text message
  async sendTextMessage(to: string, message: string): Promise<WhatsAppMessageResponse> {
    const formattedPhone = this.formatPhoneNumber(to)

    const response = await fetch(`https://graph.facebook.com/v17.0/${this.phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
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

    return response.json()
  }

  // Send template message
  async sendTemplateMessage(
    to: string,
    templateName: string,
    language = "pt_BR",
    components: any[] = [],
  ): Promise<WhatsAppMessageResponse> {
    const formattedPhone = this.formatPhoneNumber(to)

    const response = await fetch(`https://graph.facebook.com/v17.0/${this.phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: language,
          },
          components,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`WhatsApp API error: ${JSON.stringify(errorData)}`)
    }

    return response.json()
  }
}

