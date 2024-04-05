import ConstructionIcon from "@mui/icons-material/Construction";
import InfoIcon from "@mui/icons-material/Info";
import MonitorIcon from "@mui/icons-material/Monitor";
import "dotenv/config";
import { ComponentType } from "react";
import { config } from "./config";

export const BASE_HTTP = config.BASE_HTTP;
export const webTitle = config.webTitle;
export const DEFAULT_LIMIT = config.DEFAULT_QUERY_LIMIT;

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
  about: {
    icon: InfoIcon,
    href: "/about",
    label: "Sobre",
    // subTitle: "Aqui sabemos um pouco mais sobre a pagina, a ideia geral e sua stack",
    subTitle:
      "Este web-site foi criado com proposito de amostragem no meu portfolio e deixar algumas tecnologias em uso.",
    color: " text-sky-700",
    colorDark: " text-sky-700",
    bgColor: "bg-sky-500/10",
  },
};
