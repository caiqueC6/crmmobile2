import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import QuotationForm from "@/components/quotation-form"
import WhatsAppSender from "@/components/whatsapp-sender"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações e Integrações</h1>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api">API PowerCRM</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração da API PowerCRM</CardTitle>
              <CardDescription>Configure as credenciais para integração com a API do PowerCRM</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">URL da API</Label>
                <Input id="api-url" placeholder="https://api.powercrm.com.br/v1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave da API</Label>
                <Input id="api-key" type="password" placeholder="Sua chave de API" />
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>

          <div className="mt-6">
            <QuotationForm />
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do WhatsApp Business API</CardTitle>
              <CardDescription>Configure as credenciais para integração com a API do WhatsApp Business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-token">Token de Acesso</Label>
                <Input id="whatsapp-token" type="password" placeholder="Seu token de acesso" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp-phone">ID do Telefone</Label>
                <Input id="whatsapp-phone" placeholder="ID do telefone no WhatsApp Business" />
              </div>
              <Button>Salvar Configurações</Button>
            </CardContent>
          </Card>

          <div className="mt-6">
            <WhatsAppSender defaultMessage="Olá! Obrigado pelo seu interesse em nossos veículos. Como posso ajudar com sua cotação?" />
          </div>
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Banco de Dados</CardTitle>
              <CardDescription>Configure a conexão com o banco de dados SQL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="db-url">URL de Conexão</Label>
                <Input id="db-url" placeholder="postgresql://user:password@localhost:5432/database" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db-user">Usuário</Label>
                  <Input id="db-user" placeholder="Usuário do banco" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-password">Senha</Label>
                  <Input id="db-password" type="password" placeholder="Senha do banco" />
                </div>
              </div>
              <Button>Testar Conexão</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

