"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Send } from "lucide-react"

interface WhatsAppSenderProps {
  quotationId?: string
  defaultPhone?: string
  defaultMessage?: string
}

export default function WhatsAppSender({ quotationId, defaultPhone = "", defaultMessage = "" }: WhatsAppSenderProps) {
  const [phone, setPhone] = useState(defaultPhone)
  const [message, setMessage] = useState(defaultMessage)
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!phone || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o número de telefone e a mensagem.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          message,
          quotationId,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar mensagem")
      }

      const data = await response.json()

      toast({
        title: "Mensagem enviada",
        description: `Mensagem enviada com sucesso para ${phone}.`,
      })

      // Clear message after sending
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar WhatsApp</CardTitle>
        <CardDescription>Envie uma mensagem direta para o cliente via WhatsApp</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Número de Telefone</Label>
          <Input id="phone" placeholder="(11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea
            id="message"
            placeholder="Digite sua mensagem aqui..."
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSend} disabled={isSending} className="w-full bg-[#25D366] hover:bg-[#128C7E]">
          {isSending ? (
            "Enviando..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar WhatsApp
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

