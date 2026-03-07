import { useState } from "react";
import {
  LayoutDashboard, Wallet, Tag, CreditCard, ArrowLeftRight,
  Target, TrendingUp, Bell, Settings, Sparkles, ArrowUpRight,
  ArrowDownRight, ChevronRight, Plus, Home
} from "lucide-react";

/* ── Design tokens ── */
const t1 = {
  bg: "#08080C", bgCard: "#111118", bgCardHover: "#18181F", bgSidebar: "#0C0C12",
  bgInput: "#16161E", bgBottomNav: "#0E0E14", text: "#E8E8ED", textSecondary: "#8B8B9E",
  textMuted: "#5C5C72", accent: "#E8372D", accentSoft: "rgba(232,55,45,0.12)",
  accentGlow: "rgba(232,55,45,0.25)", border: "#1E1E2A", green: "#22C55E",
  greenSoft: "rgba(34,197,94,0.12)", red: "#EF4444", redSoft: "rgba(239,68,68,0.12)",
  radius: "12px", radiusSm: "8px",
};

const t2 = {
  bg: "#0B0B10", bgCard: "rgba(255,255,255,0.04)", bgCardBorder: "rgba(255,255,255,0.08)",
  bgCardHover: "rgba(255,255,255,0.07)", bgSidebar: "rgba(12,12,18,0.85)",
  bgInput: "rgba(255,255,255,0.05)", bgBottomNav: "rgba(14,14,20,0.75)",
  text: "#F0F0F5", textSecondary: "#9494AD", textMuted: "#5E5E78",
  accent: "#E8372D", accentSoft: "rgba(232,55,45,0.10)", accentGlow: "rgba(232,55,45,0.30)",
  border: "rgba(255,255,255,0.06)", green: "#34D399", greenSoft: "rgba(52,211,153,0.10)",
  red: "#F87171", redSoft: "rgba(248,113,113,0.10)", radius: "16px", radiusSm: "10px",
  blur: "blur(20px)", glowAccent: "0 0 40px rgba(232,55,45,0.08)",
  glowCard: "0 8px 32px rgba(0,0,0,0.4)",
};

const t3 = {
  bg: "#0F0F0F", bgCard: "#0F0F0F", bgCardBorder: "transparent",
  bgCardHover: "#161616", bgSidebar: "#0F0F0F",
  bgInput: "#1A1A1A", bgBottomNav: "#0F0F0F",
  text: "#FFFFFF", textSecondary: "#A0A0A0", textMuted: "#666666",
  accent: "#E8372D", accentSoft: "rgba(232,55,45,0.08)", accentGlow: "rgba(232,55,45,0.20)",
  border: "transparent", green: "#00D26A", greenSoft: "rgba(0,210,106,0.08)",
  red: "#FF4D4D", redSoft: "rgba(255,77,77,0.08)", radius: "20px", radiusSm: "12px",
  blur: "", glowAccent: "", glowCard: "",
};

/* ── Shared data ── */
const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Wallet, label: "Carteira" }, { icon: Tag, label: "Categorias" },
  { icon: CreditCard, label: "Cartões" }, { icon: ArrowLeftRight, label: "Transações" },
  { icon: Bell, label: "Lembretes" }, { icon: Target, label: "Metas" },
  { icon: TrendingUp, label: "Investimentos" }, { icon: Settings, label: "Configurações" },
];
const bottomNavItems = [
  { icon: Home, label: "Início", active: true },
  { icon: ArrowLeftRight, label: "Transações" },
  { icon: Sparkles, label: "Brave IA", isCta: true },
  { icon: Target, label: "Metas" },
  { icon: Settings, label: "Mais" },
];
const summaryCards = [
  { label: "Saldo total", value: "R$ 12.450", change: "+2,4%", positive: true, icon: Wallet },
  { label: "Receitas", value: "R$ 8.200", change: "+12%", positive: true, icon: ArrowUpRight },
  { label: "Despesas", value: "R$ 5.730", change: "+3,1%", positive: false, icon: ArrowDownRight },
  { label: "Economia", value: "R$ 2.470", change: "+18%", positive: true, icon: Target },
];
const transactions = [
  { desc: "Supermercado Extra", cat: "Alimentação", amount: -245.90, date: "Hoje" },
  { desc: "Salário", cat: "Receita", amount: 5200.00, date: "Ontem" },
  { desc: "Netflix", cat: "Assinaturas", amount: -55.90, date: "03 Mar" },
  { desc: "Uber", cat: "Transporte", amount: -32.50, date: "02 Mar" },
  { desc: "Freelance", cat: "Receita", amount: 1800.00, date: "01 Mar" },
];
const categories = [
  { name: "Alimentação", spent: 1250, budget: 2000, color: "#E8372D" },
  { name: "Transporte", spent: 480, budget: 600, color: "#3B82F6" },
  { name: "Assinaturas", spent: 320, budget: 400, color: "#8B5CF6" },
  { name: "Lazer", spent: 180, budget: 500, color: "#F59E0B" },
];

type Style = "minimal" | "glass" | "neo";
type Device = "desktop" | "mobile";

export default function DesignPreview() {
  const [style, setStyle] = useState<Style>("neo");
  const [device, setDevice] = useState<Device>("desktop");
  const tk = style === "glass" ? t2 : style === "neo" ? t3 : t1;

  return (
    <div style={{ minHeight: "100vh", background: "#060609", fontFamily: "'Inter', -apple-system, sans-serif", color: tk.text, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Switcher bar */}
      <div style={{ display: "flex", gap: 24, padding: "20px 0 16px", position: "sticky", top: 0, zIndex: 50, background: "#060609", width: "100%", justifyContent: "center", borderBottom: `1px solid rgba(255,255,255,0.06)`, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {([["minimal", "◼ Dark Minimal"], ["glass", "◻ Glassmorphism"], ["neo", "◉ Neo-Banking"]] as const).map(([s, label]) => (
            <button key={s} onClick={() => setStyle(s as Style)} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: style === s ? tk.accent : "rgba(255,255,255,0.06)", color: style === s ? "#fff" : "#9494AD", transition: "all .2s" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["desktop", "mobile"] as const).map((d) => (
            <button key={d} onClick={() => setDevice(d)} style={{ padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", background: device === d ? "rgba(255,255,255,0.1)" : "transparent", color: device === d ? "#fff" : "#9494AD", transition: "all .2s" }}>
              {d === "desktop" ? "🖥 Desktop" : "📱 Mobile"}
            </button>
          ))}
        </div>
      </div>

      {/* Background orbs for glass style */}
      {style === "glass" && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "10%", left: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,55,45,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", top: "50%", left: "60%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />
        </div>
      )}

      {/* DESKTOP */}
      {device === "desktop" && (
        <div style={{ display: "flex", width: "100%", maxWidth: 1400, minHeight: "calc(100vh - 60px)", position: "relative", zIndex: 1 }}>
          <DesktopSidebar tk={tk} glass={style === "glass"} neo={style === "neo"} />
          <main style={{ flex: 1, overflow: "auto", padding: style === "neo" ? "32px 36px" : "24px 28px" }}>
            <DashboardContent tk={tk} glass={style === "glass"} neo={style === "neo"} />
          </main>
        </div>
      )}

      {/* MOBILE */}
      {device === "mobile" && (
        <div style={{ width: 390, minHeight: 844, background: tk.bg, borderRadius: 24, border: style === "neo" ? "2px solid #222" : `2px solid ${tk.border}`, overflow: "hidden", margin: "24px 0", position: "relative", display: "flex", flexDirection: "column", boxShadow: style === "glass" ? t2.glowAccent : "none", zIndex: 1 }}>
          {/* Status bar */}
          <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", fontSize: 12, fontWeight: 600 }}>
            <span>9:41</span>
            <div style={{ width: 16, height: 10, borderRadius: 2, border: `1px solid ${tk.textMuted}`, position: "relative" }}>
              <div style={{ position: "absolute", inset: 2, borderRadius: 1, background: tk.green }} />
            </div>
          </div>

          {/* Mobile header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: style === "neo" ? "8px 20px 20px" : "8px 16px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: style === "neo" ? 10 : style === "glass" ? 10 : 8, background: tk.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff", ...(style === "glass" ? { boxShadow: `0 0 16px ${t2.accentGlow}` } : {}) }}>B</div>
              <div>
                <div style={{ fontSize: style === "neo" ? 17 : 15, fontWeight: 700, letterSpacing: "-0.03em" }}>Olá, João 👋</div>
                <div style={{ fontSize: 11, color: tk.textMuted }}>Março 2026</div>
              </div>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: tk.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: tk.accent, fontWeight: 700, fontSize: 12, ...(style === "glass" ? { backdropFilter: t2.blur, border: `1px solid ${t2.bgCardBorder}` } : {}) }}>J</div>
          </div>

          {/* Scrollable */}
          <div style={{ flex: 1, overflow: "auto", padding: style === "neo" ? "0 16px 100px" : "0 14px 100px", display: "flex", flexDirection: "column", gap: style === "neo" ? 16 : 12 }}>
            <MobileSummary tk={tk} glass={style === "glass"} neo={style === "neo"} />
            <MobileChart tk={tk} glass={style === "glass"} neo={style === "neo"} />
            <MobileBudget tk={tk} glass={style === "glass"} neo={style === "neo"} />
            <MobileTransactions tk={tk} glass={style === "glass"} neo={style === "neo"} />
          </div>

          {/* Bottom nav */}
          <MobileBottomNav tk={tk} glass={style === "glass"} neo={style === "neo"} />
        </div>
      )}

      <div style={{ textAlign: "center", padding: "24px 0 32px", color: tk.textMuted, fontSize: 12, position: "relative", zIndex: 1 }}>
        ✨ Preview — dados fictícios · Alterne estilos e dispositivos acima
      </div>
    </div>
  );
}

/* ── Helpers ── */
const cardStyle = (tk: typeof t2, glass: boolean, neo?: boolean): React.CSSProperties => ({
  background: neo ? "#161616" : tk.bgCard,
  borderRadius: tk.radius,
  border: neo ? "none" : `1px solid ${glass ? (tk as typeof t2).bgCardBorder || tk.border : tk.border}`,
  ...(glass ? { backdropFilter: t2.blur, boxShadow: t2.glowCard } : {}),
});

/* ── Desktop Sidebar ── */
function DesktopSidebar({ tk, glass, neo }: { tk: typeof t1; glass: boolean; neo?: boolean }) {
  return (
    <aside style={{ width: neo ? 240 : 260, background: glass ? t2.bgSidebar : tk.bgSidebar, borderRight: neo ? "none" : `1px solid ${tk.border}`, display: "flex", flexDirection: "column", padding: neo ? "28px 16px" : "24px 12px", gap: neo ? 6 : 4, flexShrink: 0, ...(glass ? { backdropFilter: t2.blur } : {}) }}>
      <div style={{ padding: "0 12px", marginBottom: neo ? 32 : 24, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: neo ? 12 : glass ? 12 : 10, background: tk.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff", ...(glass ? { boxShadow: `0 0 20px ${t2.accentGlow}` } : {}) }}>B</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>Brave</div>
          <div style={{ fontSize: 11, color: tk.textMuted }}>Assessor Financeiro</div>
        </div>
      </div>
      <button style={{ display: "flex", alignItems: "center", gap: 10, padding: neo ? "12px 16px" : "10px 14px", borderRadius: tk.radiusSm, background: neo ? tk.accent : tk.accentSoft, border: neo ? "none" : `1px solid rgba(232,55,45,${glass ? "0.12" : "0.15"})`, color: neo ? "#fff" : tk.accent, fontWeight: 600, fontSize: 13, cursor: "pointer", marginBottom: 16, ...(glass ? { backdropFilter: t2.blur, boxShadow: `0 0 24px ${t2.accentGlow}` } : {}) }}>
        <Sparkles size={16} /> Brave IA
      </button>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: neo ? 4 : 2 }}>
        {sidebarItems.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: neo ? "11px 16px" : "9px 14px", borderRadius: tk.radiusSm, fontSize: 13, fontWeight: item.active ? 600 : 400, color: item.active ? tk.text : tk.textSecondary, background: item.active ? (neo ? "#1A1A1A" : glass ? "rgba(255,255,255,0.06)" : (tk as typeof t1).bgCard) : "transparent", cursor: "pointer", position: "relative" }}>
            {item.active && !neo && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 18, borderRadius: 4, background: tk.accent, ...(glass ? { boxShadow: `0 0 8px ${t2.accentGlow}` } : {}) }} />}
            <item.icon size={neo ? 18 : 16} strokeWidth={item.active ? 2 : 1.5} />
            {item.label}
          </div>
        ))}
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderTop: neo ? "none" : `1px solid ${tk.border}`, marginTop: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: tk.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: tk.accent, fontWeight: 700, fontSize: 13 }}>J</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>João Silva</div>
          <div style={{ fontSize: 11, color: tk.textMuted }}>Nv. 5 · 1.240 XP</div>
        </div>
      </div>
    </aside>
  );
}

/* ── Dashboard Content (Desktop) ── */
function DashboardContent({ tk, glass, neo }: { tk: typeof t1; glass: boolean; neo?: boolean }) {
  const cs = (extra?: React.CSSProperties) => ({ ...cardStyle(tk as typeof t2, glass, neo), ...extra });
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: neo ? 36 : 28 }}>
        <div>
          <h1 style={{ fontSize: neo ? 28 : 22, fontWeight: neo ? 800 : 700, letterSpacing: "-0.03em", margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: tk.textSecondary, margin: "4px 0 0" }}>Março 2026</p>
        </div>
        <button style={{ padding: neo ? "10px 20px" : "8px 16px", borderRadius: tk.radiusSm, ...cs(), color: tk.textSecondary, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={14} /> Nova transação
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: neo ? 18 : 14, marginBottom: neo ? 36 : 28 }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{ ...cs({ padding: neo ? "22px 24px" : "18px 20px" }) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: neo ? 16 : 12 }}>
              <span style={{ fontSize: neo ? 13 : 12, color: tk.textSecondary, fontWeight: 500, textTransform: neo ? "uppercase" as const : undefined, letterSpacing: neo ? "0.05em" : undefined }}>{card.label}</span>
              {!neo && <div style={{ width: 30, height: 30, borderRadius: 8, background: card.positive ? tk.greenSoft : tk.redSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <card.icon size={14} color={card.positive ? tk.green : tk.red} />
              </div>}
            </div>
            <div style={{ fontSize: neo ? 28 : 20, fontWeight: neo ? 800 : 700, letterSpacing: "-0.03em" }}>{card.value}</div>
            <div style={{ fontSize: neo ? 12 : 11, color: card.positive ? tk.green : tk.red, marginTop: neo ? 8 : 6, fontWeight: 500 }}>{card.change} vs mês anterior</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: neo ? 18 : 14, marginBottom: neo ? 36 : 28 }}>
        <div style={{ ...cs({ padding: neo ? "24px 28px" : "20px 24px" }) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: neo ? 16 : 14, fontWeight: 700 }}>Fluxo de caixa</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["7d", "30d", "90d"].map((p) => (
                <button key={p} style={{ padding: neo ? "5px 12px" : "4px 10px", borderRadius: neo ? 8 : 6, fontSize: 11, fontWeight: 500, background: p === "30d" ? tk.accentSoft : "transparent", color: p === "30d" ? tk.accent : tk.textMuted, border: "none", cursor: "pointer" }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: neo ? 8 : 6, height: neo ? 160 : 140 }}>
            {[65, 45, 80, 55, 90, 40, 70, 85, 50, 75, 60, 95].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: neo ? "6px 6px 0 0" : glass ? "6px 6px 0 0" : "4px 4px 0 0", background: i === 11 ? tk.accent : neo ? "rgba(232,55,45,0.15)" : glass ? `linear-gradient(to top, rgba(232,55,45,0.05), rgba(232,55,45,0.20))` : `linear-gradient(to top, rgba(232,55,45,0.08), rgba(232,55,45,0.25))` }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: tk.textMuted }}>
            {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div style={{ ...cs({ padding: neo ? "24px 28px" : "20px 24px" }) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ fontSize: neo ? 16 : 14, fontWeight: 700 }}>Orçamento</span>
            <ChevronRight size={14} color={tk.textMuted} />
          </div>
          {categories.map((cat) => {
            const pct = Math.round((cat.spent / cat.budget) * 100);
            return (
              <div key={cat.name} style={{ marginBottom: neo ? 20 : 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                  <span style={{ color: tk.textSecondary }}>R$ {cat.spent} / {cat.budget}</span>
                </div>
                <div style={{ height: neo ? 8 : 6, borderRadius: neo ? 4 : 3, background: tk.bgInput, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: neo ? 4 : 3, background: cat.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ ...cs({ padding: neo ? "24px 28px" : "20px 24px" }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: neo ? 16 : 14, fontWeight: 700 }}>Últimas transações</span>
          <button style={{ fontSize: 12, color: tk.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Ver todas →</button>
        </div>
        {transactions.map((tx, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: neo ? "14px 0" : "12px 0", borderTop: i > 0 ? `1px solid ${neo ? "#1E1E1E" : tk.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: neo ? 38 : 34, height: neo ? 38 : 34, borderRadius: neo ? 10 : 8, background: tx.amount > 0 ? tk.greenSoft : tk.redSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {tx.amount > 0 ? <ArrowUpRight size={neo ? 16 : 14} color={tk.green} /> : <ArrowDownRight size={neo ? 16 : 14} color={tk.red} />}
              </div>
              <div>
                <div style={{ fontSize: neo ? 14 : 13, fontWeight: 500 }}>{tx.desc}</div>
                <div style={{ fontSize: 11, color: tk.textMuted }}>{tx.cat}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: neo ? 15 : 13, fontWeight: neo ? 700 : 600, color: tx.amount > 0 ? tk.green : tk.text }}>
                {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
              <div style={{ fontSize: 11, color: tk.textMuted }}>{tx.date}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Mobile sub-components ── */
function MobileSummary({ tk, glass, neo }: { tk: typeof t1; glass: boolean; neo?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: neo ? 12 : 10 }}>
      {summaryCards.map((card) => (
        <div key={card.label} style={{ ...cardStyle(tk as typeof t2, glass, neo), padding: neo ? "16px" : "14px" }}>
          <span style={{ fontSize: neo ? 10 : 11, color: tk.textSecondary, fontWeight: 500, textTransform: neo ? "uppercase" as const : undefined, letterSpacing: neo ? "0.04em" : undefined }}>{card.label}</span>
          <div style={{ fontSize: neo ? 22 : 17, fontWeight: neo ? 800 : 700, letterSpacing: "-0.03em", marginTop: neo ? 8 : 6 }}>{card.value}</div>
          <div style={{ fontSize: 10, color: card.positive ? tk.green : tk.red, marginTop: 4, fontWeight: 500 }}>{card.change}</div>
        </div>
      ))}
    </div>
  );
}

function MobileChart({ tk, glass, neo }: { tk: typeof t1; glass: boolean; neo?: boolean }) {
  return (
    <div style={{ ...cardStyle(tk as typeof t2, glass, neo), padding: neo ? "18px" : "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: neo ? 14 : 13, fontWeight: neo ? 700 : 600 }}>Fluxo de caixa</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["7d", "30d"].map((p) => (
            <button key={p} style={{ padding: "3px 8px", borderRadius: 5, fontSize: 10, fontWeight: 500, background: p === "30d" ? tk.accentSoft : "transparent", color: p === "30d" ? tk.accent : tk.textMuted, border: "none", cursor: "pointer" }}>{p}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: neo ? 5 : 4, height: neo ? 110 : 100 }}>
        {[65, 45, 80, 55, 90, 40, 70, 85, 50, 75, 60, 95].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: neo ? "5px 5px 0 0" : "3px 3px 0 0", background: i === 11 ? tk.accent : neo ? "rgba(232,55,45,0.12)" : `linear-gradient(to top, rgba(232,55,45,0.05), rgba(232,55,45,0.20))` }} />
        ))}
      </div>
    </div>
  );
}

function MobileBudget({ tk, glass, neo }: { tk: typeof t1; glass: boolean; neo?: boolean }) {
  return (
    <div style={{ ...cardStyle(tk as typeof t2, glass, neo), padding: neo ? "18px" : "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: neo ? 14 : 13, fontWeight: neo ? 700 : 600 }}>Orçamento</span>
        <ChevronRight size={14} color={tk.textMuted} />
      </div>
      {categories.map((cat) => {
        const pct = Math.round((cat.spent / cat.budget) * 100);
        return (
          <div key={cat.name} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
              <span style={{ fontWeight: 500 }}>{cat.name}</span>
              <span style={{ color: tk.textSecondary }}>R$ {cat.spent} / {cat.budget}</span>
            </div>
            <div style={{ height: neo ? 6 : 5, borderRadius: 3, background: tk.bgInput, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: cat.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MobileTransactions({ tk, glass, neo }: { tk: typeof t1; glass: boolean; neo?: boolean }) {
  return (
    <div style={{ ...cardStyle(tk as typeof t2, glass, neo), padding: neo ? "18px" : "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: neo ? 14 : 13, fontWeight: neo ? 700 : 600 }}>Últimas transações</span>
        <button style={{ fontSize: 11, color: tk.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Ver todas →</button>
      </div>
      {transactions.slice(0, 4).map((tx, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: neo ? "12px 0" : "10px 0", borderTop: i > 0 ? `1px solid ${neo ? "#1E1E1E" : tk.border}` : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: neo ? 34 : 30, height: neo ? 34 : 30, borderRadius: neo ? 9 : 7, background: tx.amount > 0 ? tk.greenSoft : tk.redSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {tx.amount > 0 ? <ArrowUpRight size={12} color={tk.green} /> : <ArrowDownRight size={12} color={tk.red} />}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{tx.desc}</div>
              <div style={{ fontSize: 10, color: tk.textMuted }}>{tx.cat}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: neo ? 13 : 12, fontWeight: neo ? 700 : 600, color: tx.amount > 0 ? tk.green : tk.text }}>
              {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <div style={{ fontSize: 10, color: tk.textMuted }}>{tx.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileBottomNav({ tk, glass, neo }: { tk: typeof t1; glass: boolean; neo?: boolean }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: neo ? 76 : 72, background: neo ? tk.bg : glass ? t2.bgBottomNav : (tk as typeof t1).bgBottomNav || tk.bg, borderTop: neo ? "none" : `1px solid ${tk.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 8px", ...(glass ? { backdropFilter: t2.blur } : {}) }}>
      {bottomNavItems.map((item) => (
        <button key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "6px 12px", position: "relative" }}>
          {item.isCta ? (
            <div style={{ width: neo ? 48 : 44, height: neo ? 48 : 44, borderRadius: neo ? 16 : 14, background: tk.accent, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -20, boxShadow: glass ? `0 4px 24px ${t2.accentGlow}` : `0 4px 20px ${tk.accentGlow}` }}>
              <item.icon size={20} color="#fff" />
            </div>
          ) : (
            <item.icon size={neo ? 22 : 20} color={item.active ? tk.accent : tk.textMuted} strokeWidth={item.active ? 2 : 1.5} />
          )}
          <span style={{ fontSize: 10, fontWeight: item.active ? 600 : 400, color: item.active ? tk.accent : tk.textMuted }}>{item.label}</span>
          {item.active && !neo && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 16, height: 2, borderRadius: 2, background: tk.accent }} />}
          {item.active && neo && <div style={{ width: 4, height: 4, borderRadius: "50%", background: tk.accent, marginTop: -2 }} />}
        </button>
      ))}
    </div>
  );
}
