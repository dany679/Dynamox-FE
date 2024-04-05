export interface IPointsList {
  id: string;
  name: string;
  state: string;
  serialID: string;
  machineId: string;
  Machine: Machine;
}

export interface Machine {
  name: string;
  type: string;
}
export interface IMachine extends Machine {
  id?: string;
}
