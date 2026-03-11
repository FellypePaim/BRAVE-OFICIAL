import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

interface Props {
  email: string;
}

export function SettingsSecuritySection({ email }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  const saveSecurityChanges = async () => {
    if (!user) return;
    const hasEmailChange = newEmail.trim() !== "" && newEmail.trim() !== email;
    const hasPasswordChange = newPassword.length >= 6;
    if (!hasEmailChange && !hasPasswordChange) {
      toast({ title: "Nada a alterar", description: "Preencha um novo e-mail ou senha.", variant: "destructive" });
      return;
    }
    if (hasPasswordChange && newPassword !== confirmPassword) {
      toast({ title: "Senhas não conferem", variant: "destructive" });
      return;
    }
    setSavingSecurity(true);
    if (currentPassword) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (signInError) {
        toast({ title: "Senha atual incorreta", variant: "destructive" });
        setSavingSecurity(false);
        return;
      }
    }
    const updateData: { email?: string; password?: string } = {};
    if (hasEmailChange) updateData.email = newEmail.trim();
    if (hasPasswordChange) updateData.password = newPassword;
    const { error } = await supabase.auth.updateUser(updateData);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Credenciais atualizadas!", description: hasEmailChange ? "Verifique seu novo e-mail." : "Senha alterada." });
      setNewEmail(""); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    }
    setSavingSecurity(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Segurança</h2>
          <p className="text-xs text-muted-foreground">Altere seu e-mail ou senha de acesso</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Novo e-mail</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="pl-9" placeholder={email} maxLength={255} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Senha atual</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="pl-9 pr-9" placeholder="Sua senha atual" maxLength={128} />
            <button type="button" onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showCurrentPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Nova senha</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input type={showNewPw ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="pl-9 pr-9" placeholder="Mínimo 6 caracteres" maxLength={128} />
            <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showNewPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
        {newPassword && (
          <div>
            <label className="text-xs font-medium text-muted-foreground">Confirmar nova senha</label>
            <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1" placeholder="Repita a nova senha" maxLength={128} />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[11px] text-destructive mt-1">As senhas não conferem.</p>
            )}
          </div>
        )}
        <Button onClick={saveSecurityChanges} disabled={savingSecurity} className="w-full">
          <Lock className="h-4 w-4 mr-2" />
          {savingSecurity ? "Salvando..." : "Atualizar credenciais"}
        </Button>
      </div>
    </Card>
  );
}
