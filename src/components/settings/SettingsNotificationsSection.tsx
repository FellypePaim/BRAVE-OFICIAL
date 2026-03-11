import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Sun, Moon, FileText } from "lucide-react";
import PushNotificationToggle from "@/components/PushNotificationToggle";

interface Props {
  notifyMorning: boolean;
  setNotifyMorning: (v: boolean) => void;
  notifyNight: boolean;
  setNotifyNight: (v: boolean) => void;
  notifyMonthlyReport: boolean;
  setNotifyMonthlyReport: (v: boolean) => void;
}

export function SettingsNotificationsSection({
  notifyMorning, setNotifyMorning,
  notifyNight, setNotifyNight,
  notifyMonthlyReport, setNotifyMonthlyReport,
}: Props) {
  const { user } = useAuth();

  const saveNotifications = async (field: string, value: boolean) => {
    if (!user) return;
    await supabase.from("profiles").update({ [field]: value }).eq("id", user.id);
  };

  const items = [
    { label: "Mensagem Matinal", desc: "Receba um resumo do dia anterior às 8h", icon: Sun, iconBg: "bg-amber-500/10", iconColor: "text-amber-500", checked: notifyMorning, field: "notify_morning", set: setNotifyMorning },
    { label: "Mensagem Noturna", desc: "Receba um resumo do dia às 22:00", icon: Moon, iconBg: "bg-indigo-500/10", iconColor: "text-indigo-500", checked: notifyNight, field: "notify_night", set: setNotifyNight },
    { label: "Relatório Mensal", desc: "Receba um relatório completo no último dia do mês", icon: FileText, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500", checked: notifyMonthlyReport, field: "notify_monthly_report", set: setNotifyMonthlyReport },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="h-4 w-4 text-primary" />
        </div>
        <h2 className="font-semibold text-foreground">Notificações WhatsApp</h2>
      </div>
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.field} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full ${item.iconBg} flex items-center justify-center`}>
                <item.icon className={`h-4 w-4 ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
            <Switch
              checked={item.checked}
              onCheckedChange={(v) => { item.set(v); saveNotifications(item.field, v); }}
            />
          </div>
        ))}
        <PushNotificationToggle />
      </div>
    </Card>
  );
}
