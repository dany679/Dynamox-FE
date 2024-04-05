import * as z from "zod";
export const statesList = ["AGUARDANDO", "EM ANDAMENTO", "PLANEJAMENTO", "CONCLUIDO"];
export const stateIn = ["AGUARDANDO", "EM ANDAMENTO", "PLANEJAMENTO", "CONCLUIDO", " "] as const;
export const stateInSend = ["AGUARDANDO", "EM ANDAMENTO", "PLANEJAMENTO", "CONCLUIDO"] as const;
export type stateTypeSend = "AGUARDANDO" | "EM ANDAMENTO" | "PLANEJAMENTO" | "CONCLUIDO";
export type stateT = "AGUARDANDO" | "EM ANDAMENTO" | "PLANEJAMENTO" | "CONCLUIDO" | " ";

// export const sensorsList = ["TcAg", "TcAs", "HF+"];
// export const sensorIn = ["TcAg", "TcAs", "HF+", " "] as const;
// export const sensorInSend = ["TcAg", "TcAs", "HF+"] as const;
// export type sensorTypeSend = "TcAg" | "TcAs" | "HF+";
// export type sensorT = "TcAg" | "TcAs" | "HF+" | " ";
export const formSearchSchema = z.object({
  name: z.string().optional(),
  state: z.enum(stateIn),
  serialID: z.string().optional(),
  id: z
    .string()
    .min(1, {
      message: " id obrigatorio",
    })
    .optional(),
});

export const formSchemaPoint = z.object({
  name: z.string().min(3, {
    message: " nome obrigatorio",
  }),
  machineId: z.string(),
  // .min(28, {
  //   message: " Id da maquina é obrigatorio",
  // })
  // .max(28)
  state: z.enum(stateInSend),
  serialID: z.string().min(3, {
    message: " nome obrigatorio",
  }),
  id: z
    .string()
    .min(1, {
      message: " id obrigatorio",
    })
    .optional(),
});
