import ConstructionIcon from "@mui/icons-material/Construction";
import MonitorIcon from "@mui/icons-material/Monitor";
import "dotenv/config";
import { ComponentType } from "react";

export const BASE_HTTP = process.env.NEXT_BASE_HTTP;

export type IconComponent =
  | ComponentType<{
      fontSize?: "default" | "small" | "large" | undefined;
    }>
  | ComponentType<{ className?: string }>;
export const toolsObjects = {
  points: {
    icon: MonitorIcon,
    href: "/points",
    label: "Pontos de acesso",
    subTitle: "Fique de olho na sua maquina",
    color: " text-orange-700",
    colorDark: " text-orange-700",
    bgColor: "bg-orange-500/10",
  },
  machine: {
    icon: ConstructionIcon,
    href: "/",
    label: "Maquinas",
    subTitle: "Gerencie sua maquina de maneira rapida e fácil",
    color: " text-sky-700",
    colorDark: " text-sky-700",
    bgColor: "bg-sky-500/10",
  },
};

export const webTitle = "Company Box";
