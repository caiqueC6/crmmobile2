"use client"

import { useState } from "react"
import { Bell, Filter, Grid, List, MoreHorizontal, Plus, Search, Triangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface QuotationItem {
  id: string
  source?: string
  customer: string
  date: string
  time: string
  vehicle: string
  price: number | null
  additionalPrice?: number
  status: "warning" | "normal"
  agent: string
  isNew?: boolean
}

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const receivedQuotations: QuotationItem[] = [
    {
      id: "q1",
      source: "Facebook",
      customer: "Gustavo",
      date: "25/03/2025",
      time: "15:50",
      vehicle: "",
      price: 0,
      status: "warning",
      agent: "M",
    },
    {
      id: "q2",
      customer: "",
      date: "25/03/2025",
      time: "13:26",
      vehicle: "Hyundai, HB20 Comf./C.Plus/C.Style 1.0 Flex 12V 2015",
      price: 51.0,
      status: "warning",
      agent: "GP",
    },
    {
      id: "q3",
      customer: "Bárbara Navarro",
      date: "25/03/2025",
      time: "11:56",
      vehicle: "OPM-7589 - Honda, CITY Sedan DX 1.5 Flex 16V Mec. 2014",
      price: 200.0,
      additionalPrice: 100.0,
      status: "warning",
      agent: "BE",
      isNew: true,
    },
    {
      id: "q4",
      customer: "Bárbara Navarro",
      date: "25/03/2025",
      time: "11:54",
      vehicle: "BYD Yuan Pro (Elétrico) 2025",
      price: 0,
      status: "warning",
      agent: "",
    },
  ]

  const inNegotiationItems: QuotationItem[] = [
    {
      id: "n1",
      customer: "Patrick CRM",
      date: "",
      time: "",
      vehicle: "PPO-4585\n1.0 TB Flex",
      price: 51.0,
      status: "warning",
      agent: "",
    },
    {
      id: "n2",
      customer: "Anna",
      date: "25/03",
      time: "",
      vehicle: "ABC-1234\nTFSI S-Tronic",
      price: 300.0,
      status: "warning",
      agent: "",
    },
    {
      id: "n3",
      customer: "Bárbara Navarro",
      date: "",
      time: "",
      vehicle: "OPM-7589\nFlex 16V Mec",
      price: 200.0,
      status: "warning",
      agent: "",
      isNew: true,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center bg-white border-b">
        <div className="flex items-center">
          <div className="bg-[#0088cc] p-4 flex items-center">
            <img src="/placeholder.svg?height=30&width=120" alt="powerCRM" className="h-7" />
          </div>
          <div className="bg-[#0088cc] text-white px-6 py-4 flex-1">
            <span className="font-medium text-lg">Menu</span>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              2
            </span>
          </Button>
          <Avatar className="h-8 w-8">
            <img src="/placeholder.svg?height=32&width=32" alt="User" />
          </Avatar>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4 bg-white">
        <div className="flex gap-2">
          <Select defaultValue="negotiation-code">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Código da Negociação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="negotiation-code">Código da Negociação</SelectItem>
              <SelectItem value="customer">Cliente</SelectItem>
              <SelectItem value="vehicle">Veículo</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input type="text" placeholder="Buscar..." className="pl-9 w-full" />
          </div>
        </div>

        <div className="flex justify-between mt-3">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-white"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-[#0088cc] hover:bg-[#0088cc]/90 text-white" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-1 text-[#0088cc]">
              <Filter className="h-4 w-4" />
              <span>Filtrar</span>
              <Badge className="ml-1 bg-[#0088cc]">4</Badge>
            </Button>
            <Button className="bg-[#0088cc] hover:bg-[#0088cc]/90">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 p-4 gap-4 overflow-auto">
        {/* Received Quotations */}
        <div className="flex-1 bg-white rounded-sm shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-700">Cotações recebidas</h2>
            <p className="text-sm text-gray-500">439 encontradas</p>
          </div>
          <div className="divide-y">
            {receivedQuotations.map((item) => (
              <div key={item.id} className="p-4 relative">
                {item.isNew && <Badge className="absolute right-4 top-4 bg-[#0088cc]">Nova adesão</Badge>}
                {item.source && <Badge className="mb-2 bg-[#0088cc]">{item.source}</Badge>}
                <div className="flex justify-between">
                  <div>
                    {item.customer && (
                      <p className="font-medium">
                        {item.customer}{" "}
                        <span className="text-gray-500 font-normal">
                          • {item.date} - {item.time}
                        </span>
                      </p>
                    )}
                    {!item.customer && item.date && (
                      <p className="text-gray-500">
                        {item.date} - {item.time}
                      </p>
                    )}
                    {item.vehicle && <p className="mt-1 text-sm font-medium">{item.vehicle}</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <p className="font-medium text-green-600">
                        R$ {item.price?.toFixed(2).replace(".", ",")}
                        {item.additionalPrice && <span> + R$ {item.additionalPrice.toFixed(2).replace(".", ",")}</span>}
                      </p>
                      {item.status === "warning" && <Triangle className="h-4 w-4 fill-amber-400 text-amber-400" />}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                    {item.agent && (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        {item.agent}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* In Negotiation */}
        <div className="w-80 bg-white rounded-sm shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-700">Em negociação</h2>
            <p className="text-sm text-gray-500">26 encontradas</p>
          </div>
          <div className="divide-y">
            {inNegotiationItems.map((item) => (
              <div key={item.id} className="p-4 relative">
                {item.isNew && <Badge className="absolute right-4 top-4 bg-[#0088cc]">Nova adesão</Badge>}
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.customer}</p>
                    <p className="mt-1 text-sm font-medium whitespace-pre-line">{item.vehicle}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="font-medium text-green-600">R$ {item.price?.toFixed(2).replace(".", ",")}</p>
                      {item.status === "warning" && <Triangle className="h-4 w-4 fill-amber-400 text-amber-400" />}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    {item.id === "n3" && (
                      <div className="h-10 w-10 rounded-full bg-[#00BCD4] flex items-center justify-center text-white text-sm font-medium">
                        W
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

