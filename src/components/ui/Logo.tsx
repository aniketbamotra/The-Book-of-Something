import { colors } from "@/design-system/tokens";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark" | "indigo";
}

export function Logo({ size = "md", variant = "light" }: LogoProps) {
  const iconSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const rx = iconSize * 0.25;
  const mainColor = variant === "light" ? colors.textPrimary : "#FFF9F5";
  const accentColor = variant === "indigo" ? "#C7D2FE" : colors.primary300;
  const somethingColor = variant === "light" ? colors.primary500 : accentColor;
  const subColor =
    variant === "light" ? colors.textMuted : "rgba(255,249,245,0.55)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx={rx} fill={colors.primary500} />
        <rect x="9" y="10" width="18" height="2.2" rx="1.1" fill="white" />
        <rect
          x="9"
          y="15"
          width="13"
          height="2.2"
          rx="1.1"
          fill="white"
          opacity="0.85"
        />
        <rect
          x="9"
          y="20"
          width="16"
          height="2.2"
          rx="1.1"
          fill="white"
          opacity="0.70"
        />
        <rect
          x="9"
          y="25"
          width="10"
          height="2.2"
          rx="1.1"
          fill="white"
          opacity="0.50"
        />
        <path
          d="M25 22 L29 26 L25 30"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontSize: size === "sm" ? 14 : size === "lg" ? 20 : 17,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: mainColor,
          }}
        >
          The Book of <span style={{ color: somethingColor }}>Something</span>
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.10em",
            textTransform: "uppercase" as const,
            color: subColor,
            marginTop: 3,
          }}
        >
          Learn one scroll at a time
        </div>
      </div>
    </div>
  );
}
