/**
 * PowerCRM API client
 * Handles communication with the PowerCRM API
 */

export interface PowerCRMQuotation {
  id: string
  customer: {
    id: string
    name: string
    phone?: string
    email?: string
  }
  vehicle: {
    model: string
    year: string
    plate?: string
    details?: string
  }
  price: number
  additionalPrice?: number
  status: string
  source?: string
  createdAt: string
  updatedAt: string
}

export class PowerCRMClient {
  private apiKey: string
  private apiUrl: string

  constructor(apiKey: string, apiUrl: string) {
    this.apiKey = apiKey
    this.apiUrl = apiUrl
  }

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
    data?: any,
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`

    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }

    if (data) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`PowerCRM API error (${response.status}): ${errorText}`)
    }

    return response.json()
  }

  // Get all quotations
  async getQuotations(): Promise<PowerCRMQuotation[]> {
    return this.request<PowerCRMQuotation[]>("/quotations")
  }

  // Get quotation by ID
  async getQuotation(id: string): Promise<PowerCRMQuotation> {
    return this.request<PowerCRMQuotation>(`/quotations/${id}`)
  }

  // Create new quotation
  async createQuotation(data: Partial<PowerCRMQuotation>): Promise<PowerCRMQuotation> {
    return this.request<PowerCRMQuotation>("/quotations", "POST", data)
  }

  // Update quotation
  async updateQuotation(id: string, data: Partial<PowerCRMQuotation>): Promise<PowerCRMQuotation> {
    return this.request<PowerCRMQuotation>(`/quotations/${id}`, "PATCH", data)
  }
}

