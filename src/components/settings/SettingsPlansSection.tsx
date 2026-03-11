import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import CheckoutDialog from "@/components/CheckoutDialog";
import {
  Crown, CheckCircle2, Zap, Star, Lock, MessageSquare,
  CreditCard, CalendarDays, ExternalLink, Loader2, HeadphonesIcon,
} from "lucide-react";

const NOX_PHONE = "5537999385148";
const NOX_PHONE_DISPLAY = "(37) 9 9938-5148";

const PLANS = [
  {
    key: "teste", name: "Plano Teste", price: "Grátis", period: "· 10 min",
    description: "Liberado pelo administrador", icon: CheckCircle2,
    color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30",
    features: [
      { label: "Acesso completo por 10 minutos", included: true },
      { label: "Todas as funcionalidades do Mensal", included: true },
      { label: "Modo Família (5 pessoas)", included: false },
      { label: "Análise comportamental", included: false },
    ],
  },
  {
    key: "mensal", name: "Brave Mensal", price: "R$ 19,90", period: "/mês",
    description: "Ideal para começar", icon: Zap,
    color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30",
    features: [
      { label: "WhatsApp conectado", included: true },
      { label: "Cartões de crédito", included: true },
      { label: "Orçamentos por categoria", included: true },
      { label: "Relatórios detalhados", included: true },
      { label: "Previsões com IA", included: true },
      { label: "Modo Família (5 pessoas)", included: false },
      { label: "Análise comportamental", included: false },
    ],
  },
  {
    key: "anual", name: "Brave Anual", price: "R$ 14,90", period: "/mês · 12x",
    description: "Melhor custo-benefício", icon: Star,
    color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30",
    badge: "Mais Popular",
    features: [
      { label: "WhatsApp conectado", included: true },
      { label: "Cartões de crédito", included: true },
      { label: "Orçamentos por categoria", included: true },
      { label: "Relatórios detalhados", included: true },
      { label: "Previsões com IA", included: true },
      { label: "Modo Família (5 pessoas)", included: true },
      { label: "Análise comportamental", included: true },
    ],
  },
];

interface Props {
  plan: string;
  subscriptionExpiresAt: string | null;
}

export function SettingsPlansSection({ plan, subscriptionExpiresAt }: Props) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<"mensal" | "anual" | null>(null);

  const currentPlan = PLANS.find(p => p.key === plan);

  const handlePortal = async () => {
    setLoadingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw new Error(error.message || "Erro ao abrir portal");
      if (data?.noCustomer || data?.noPayments) {
        toast({ title: "Sem cobranças", description: data.error || "Assine um plano primeiro." });
        return;
      }
      if (!data?.url) throw new Error("Erro ao abrir portal");
      window.open(data.url, "_blank");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoadingPortal(false);
    }
  };

  const getCheckoutDetails = () => {
    if (!checkoutPlan) return { name: "", price: "", value: 0 };
    if (checkoutPlan === "mensal") return { name: "Brave Mensal", price: "R$ 19,90/mês", value: 19.90 };
    return { name: "Brave Anual", price: "R$ 178,80/ano (R$ 14,90/mês)", value: 178.80 };
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Crown className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Planos e Assinatura</h2>
            <p className="text-xs text-muted-foreground">Gerencie sua assinatura</p>
          </div>
          {currentPlan && plan !== "free" && (
            <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Ativo
            </Badge>
          )}
        </div>

        {currentPlan && plan !== "free" ? (
          <div className={`rounded-xl border-2 p-5 mb-6 ${currentPlan.border} bg-gradient-to-r from-background to-muted/30`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-xl ${currentPlan.bg} flex items-center justify-center`}>
                  <currentPlan.icon className={`h-5 w-5 ${currentPlan.color}`} />
                </div>
                <div>
                  <p className="font-bold text-foreground text-base">{currentPlan.name}</p>
                  <p className="text-xs text-muted-foreground">{currentPlan.description}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-extrabold text-foreground">{currentPlan.price}</p>
                <p className="text-xs text-muted-foreground">{currentPlan.period}</p>
              </div>
            </div>
            {subscriptionExpiresAt && (
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Renova em{" "}
                  <span className="font-semibold text-foreground">
                    {new Date(subscriptionExpiresAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                </span>
              </div>
            )}
            <div className="mt-4 flex gap-3">
              <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={handlePortal} disabled={loadingPortal}>
                {loadingPortal ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
                Gerenciar assinatura
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-muted/30 p-5 mb-6 text-center">
            <Crown className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Você está no plano gratuito</p>
            <p className="text-xs text-muted-foreground mt-1">Assine para desbloquear todos os recursos</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {PLANS.map((p) => {
            const isActive = plan === p.key;
            const PlanIcon = p.icon;
            return (
              <div key={p.key} className={`relative rounded-xl border-2 p-5 transition-all ${isActive ? `${p.border} bg-gradient-to-b from-background to-muted/20` : "border-border bg-muted/30"}`}>
                {p.badge && <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold bg-amber-500 text-white px-3 py-0.5 rounded-full">{p.badge}</span>}
                {isActive && <span className="absolute top-3 right-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></span>}
                <div className={`h-9 w-9 rounded-xl ${p.bg} flex items-center justify-center mb-3`}><PlanIcon className={`h-4 w-4 ${p.color}`} /></div>
                <p className="font-bold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground mb-3">{p.description}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-extrabold text-foreground">{p.price}</span>
                  <span className="text-xs text-muted-foreground">{p.period}</span>
                </div>
                <div className="space-y-2">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {f.included ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <Lock className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />}
                      <span className={f.included ? "text-foreground" : "text-muted-foreground/60 line-through"}>{f.label}</span>
                    </div>
                  ))}
                </div>
                {isActive ? (
                  <div className="mt-4 text-center"><p className="text-xs font-medium text-emerald-600">✓ Plano atual</p></div>
                ) : p.key === "teste" ? null : (
                  <Button size="sm" className="w-full mt-4 rounded-xl" disabled={loadingPlan === p.key} onClick={() => setCheckoutPlan(p.key as "mensal" | "anual")}>
                    {loadingPlan === p.key ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Aguarde…</> : "Assinar agora"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white" onClick={() => window.open(`https://wa.me/${NOX_PHONE}`, "_blank")}>
          <MessageSquare className="h-4 w-4" /> Assinar via WhatsApp · {NOX_PHONE_DISPLAY}
        </Button>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center">
            <HeadphonesIcon className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Precisa de Ajuda?</h2>
            <p className="text-xs text-muted-foreground">Nossa equipe está pronta</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard/chat")}>
            <HeadphonesIcon className="h-4 w-4 mr-2" /> Central de Suporte
          </Button>
          <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white" onClick={() => window.open(`https://wa.me/${NOX_PHONE}`, "_blank")}>
            <MessageSquare className="h-4 w-4" /> WhatsApp · {NOX_PHONE_DISPLAY}
          </Button>
        </div>
      </Card>

      {checkoutPlan && (
        <CheckoutDialog
          open={!!checkoutPlan}
          onOpenChange={(o) => !o && setCheckoutPlan(null)}
          planName={getCheckoutDetails().name}
          planPrice={getCheckoutDetails().price}
          billingCycle={checkoutPlan}
          value={getCheckoutDetails().value}
        />
      )}
    </>
  );
}
