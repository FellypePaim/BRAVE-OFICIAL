import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy, Flame, Star, Zap, Lock, CheckCircle2,
  Shield, Wallet, Tags, Receipt, Users as UsersIcon, Award, TrendingUp,
} from "lucide-react";

const badgeIconMap: Record<string, any> = {
  trophy: Trophy, flame: Flame, star: Star, zap: Zap,
  shield: Shield, wallet: Wallet, tags: Tags, receipt: Receipt,
  users: UsersIcon, award: Award, "fire-extinguisher": Flame,
  "list-checks": CheckCircle2, "piggy-bank": TrendingUp,
};

interface Props {
  xp: number;
  level: number;
  levelTitle: string;
  streak: number;
  achievements: any[];
  unlockedKeys: Set<string>;
}

export function SettingsAchievementsSection({ xp, level, levelTitle, streak, achievements, unlockedKeys }: Props) {
  const navigate = useNavigate();
  const LEVEL_XP = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000];
  const cur = LEVEL_XP[level - 1] || 0;
  const next = LEVEL_XP[level] || cur + 5000;
  const levelProgress = Math.min(((xp - cur) / (next - cur)) * 100, 100);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Minhas Conquistas</h2>
            <p className="text-xs text-muted-foreground">{unlockedKeys.size} de {achievements.length} desbloqueadas</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-primary" />
            <span className="font-bold text-foreground">Nv. {level}</span>
            <span className="text-xs text-muted-foreground">{levelTitle}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-bold text-foreground">{streak}</span>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>{xp} XP total</span>
          <span>Próximo nível</span>
        </div>
        <Progress value={levelProgress} className="h-2.5" />
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {achievements.map((a: any, i: number) => {
          const unlocked = unlockedKeys.has(a.key);
          const Icon = badgeIconMap[a.icon] || Trophy;
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", bounce: 0.4 }}
              className="group relative"
            >
              <div className={`relative h-14 w-14 mx-auto rounded-xl flex items-center justify-center transition-all ${unlocked ? "bg-primary/10 ring-2 ring-primary/30 hover:ring-primary/50 hover:scale-110" : "bg-muted/60 grayscale opacity-40"}`}>
                {unlocked && (
                  <motion.div className="absolute inset-0 rounded-xl bg-primary/10" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                )}
                {unlocked ? <Icon className="h-6 w-6 text-primary relative z-10" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                {unlocked && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className={`text-[9px] text-center mt-1.5 leading-tight font-medium ${unlocked ? "text-foreground" : "text-muted-foreground/50"}`}>{a.name}</p>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-popover border border-border rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                <p className="text-xs font-semibold text-foreground">{a.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.description}</p>
                <p className="text-[10px] text-primary font-medium mt-1">+{a.xp_reward} XP</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => navigate("/dashboard/gamification")}>
          <Trophy className="h-3.5 w-3.5 mr-1.5" /> Ver todas as conquistas
        </Button>
      </div>
    </Card>
  );
}
