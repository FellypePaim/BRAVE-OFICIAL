import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Camera, Sparkles } from "lucide-react";

interface Props {
  displayName: string;
  setDisplayName: (v: string) => void;
  cpfCnpj: string;
  setCpfCnpj: (v: string) => void;
  monthlyIncome: string;
  setMonthlyIncome: (v: string) => void;
  email: string;
  avatarUrl: string | null;
  setAvatarUrl: (v: string | null) => void;
}

export function SettingsProfileSection({
  displayName, setDisplayName, cpfCnpj, setCpfCnpj,
  monthlyIncome, setMonthlyIncome, email, avatarUrl, setAvatarUrl,
}: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const initials = displayName ? displayName.charAt(0).toUpperCase() : "U";

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadErr) {
      toast({ title: "Erro", description: uploadErr.message, variant: "destructive" });
      setUploadingAvatar(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${urlData.publicUrl}?t=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
    setAvatarUrl(url);
    setUploadingAvatar(false);
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast({ title: "Foto atualizada!" });
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const cleanCpf = cpfCnpj.replace(/\D/g, "");
    const { error } = await supabase.from("profiles").update({
      display_name: displayName,
      monthly_income: parseFloat(monthlyIncome) || 0,
      cpf_cnpj: cleanCpf || null,
    } as any).eq("id", user.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      setSaving(false);
      return;
    }
    const { error: metaError } = await supabase.auth.updateUser({ data: { display_name: displayName } });
    if (metaError) {
      toast({ title: "Perfil salvo, mas falha ao sincronizar nome", description: metaError.message, variant: "destructive" });
    } else {
      toast({ title: "Alterações salvas!", description: "Seu nome foi atualizado em todo o sistema." });
    }
    setSaving(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Perfil</h2>
          <p className="text-xs text-muted-foreground">Suas informações pessoais</p>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden">
          {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : initials}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar}>
          <Camera className="h-3.5 w-3.5 mr-1.5" />
          {uploadingAvatar ? "Enviando..." : "Alterar foto"}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">E-mail</label>
          <Input value={email} disabled className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Nome completo</label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">CPF ou CNPJ</label>
          <Input
            value={cpfCnpj}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 14);
              if (digits.length <= 11) {
                setCpfCnpj(digits.replace(/(\d{3})(\d{3})?(\d{3})?(\d{2})?/, (_, a, b, c, d) =>
                  [a, b, c].filter(Boolean).join(".") + (d ? `-${d}` : "")
                ));
              } else {
                setCpfCnpj(digits.replace(/(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, (_, a, b, c, d, ee) =>
                  [a, b, c].filter(Boolean).join(".") + (d ? `/${d}` : "") + (ee ? `-${ee}` : "")
                ));
              }
            }}
            placeholder="000.000.000-00"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Renda mensal</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
            <Input value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} className="pl-10" type="number" />
          </div>
        </div>
        <Button onClick={saveProfile} disabled={saving} className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </Card>
  );
}
