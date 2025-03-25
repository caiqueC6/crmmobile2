"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function QuotationForm() {
  const [customer, setCustomer] = useState("")
  const [vehicle, setVehicle] = useState("")
  const [price, setPrice] = useState("")
  const [source, setSource] = useState("MANUAL")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customer || !vehicle || !price) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/powercrm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          vehicle,
          price,
          source,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar cotação")
      }

      const data = await response.json()

      toast({
        title: "Cotação criada",
        description: "A cotação foi criada com sucesso no PowerCRM.",
      })

      // Reset form
      setCustomer("")
      setVehicle("")
      setPrice("")
      setSource("MANUAL")
    } catch (error) {
      console.error("Error creating quotation:", error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a cotação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Cotação</CardTitle>
        <CardDescription>Crie uma nova cotação no PowerCRM</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Cliente</Label>
            <Input
              id="customer"
              placeholder="Nome do cliente"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle">Veículo</Label>
            <Input
              id="vehicle"
              placeholder="Modelo, ano, detalhes"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Valor (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Origem</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANUAL">Manual</SelectItem>
                <SelectItem value="FACEBOOK">Facebook</SelectItem>
                <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                <SelectItem value="WEBSITE">Website</SelectItem>
                <SelectItem value="PHONE">Telefone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Enviando..." : "Criar Cotação"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

