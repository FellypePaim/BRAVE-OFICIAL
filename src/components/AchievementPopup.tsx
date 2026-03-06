import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Star, Flame, Shield, Wallet, Tags, Receipt, Users, Zap,
  CheckCircle2, Award, TrendingUp, X
} from "lucide-react";

const iconMap: Record<string, any> = {
  trophy: Trophy, flame: Flame, star: Star, zap: Zap,
  shield: Shield, wallet: Wallet, tags: Tags, receipt: Receipt,
  users: Users, award: Award, "fire-extinguisher": Flame,
  "list-checks": CheckCircle2, "piggy-bank": TrendingUp,
};

interface AchievementPopupProps {
  achievement: { name: string; description: string; icon: string; xp_reward: number } | null;
  onClose: () => void;
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 500);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  const Icon = achievement ? (iconMap[achievement.icon] || Trophy) : Trophy;

  return (
    <AnimatePresence>
      {show && achievement && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop glow */}
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShow(false); setTimeout(onClose, 300); }}
          />

          {/* Popup card */}
          <motion.div
            className="relative pointer-events-auto max-w-sm w-[90vw] mx-4"
            initial={{ scale: 0.3, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
          >
            {/* Glow ring behind */}
            <motion.div
              className="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.8, 0.4], scale: [0.5, 1.2, 1] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {/* Sparkle particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * Math.PI * 2) / 8) * 120,
                  y: Math.sin((i * Math.PI * 2) / 8) * 120,
                }}
                transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: "easeOut" }}
              />
            ))}

            <div className="relative bg-card border border-primary/30 rounded-2xl p-6 text-center shadow-2xl overflow-hidden">
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
              />

              {/* Close button */}
              <button
                onClick={() => { setShow(false); setTimeout(onClose, 300); }}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Trophy icon with pulse */}
              <motion.div
                className="mx-auto h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 relative"
                initial={{ rotate: -10 }}
                animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-primary/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <Icon className="h-10 w-10 text-primary relative z-10" />
              </motion.div>

              {/* Title */}
              <motion.p
                className="text-xs font-semibold text-primary uppercase tracking-wider mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                🏆 Conquista Desbloqueada!
              </motion.p>

              <motion.h3
                className="text-xl font-bold text-foreground mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {achievement.name}
              </motion.h3>

              <motion.p
                className="text-sm text-muted-foreground mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {achievement.description}
              </motion.p>

              {/* XP reward */}
              <motion.div
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
              >
                <Star className="h-4 w-4" />
                +{achievement.xp_reward} XP
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Level up popup
interface LevelUpPopupProps {
  level: number | null;
  title: string;
  onClose: () => void;
}

export function LevelUpPopup({ level, title, onClose }: LevelUpPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (level) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 500);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [level, onClose]);

  return (
    <AnimatePresence>
      {show && level && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
            onClick={() => { setShow(false); setTimeout(onClose, 300); }}
          />

          <motion.div
            className="relative pointer-events-auto max-w-xs w-[85vw] mx-4"
            initial={{ scale: 0.2, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.7, bounce: 0.45 }}
          >
            {/* Glow */}
            <motion.div
              className="absolute -inset-6 rounded-3xl bg-primary/25 blur-3xl"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative bg-card border border-primary/30 rounded-2xl p-6 text-center shadow-2xl">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent rounded-2xl"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1.5, delay: 0.2 }}
              />

              <motion.div
                className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-3"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Star className="h-8 w-8 text-primary" />
              </motion.div>

              <motion.p
                className="text-xs font-semibold text-primary uppercase tracking-wider mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ⭐ Subiu de Nível!
              </motion.p>

              <motion.h3
                className="text-3xl font-black text-foreground mb-0.5"
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                Nível {level}
              </motion.h3>

              <motion.p
                className="text-sm text-primary font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {title}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
