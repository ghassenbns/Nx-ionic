import { MeterInterface } from './meterInterface';

export declare interface MeterSignalInterface {
  meterSignalId: string;
  meter: MeterInterface;
  nodeId: string;
  compSignalId: string;
  alias: string;
  signalType: string;
  signalSubtype: string;
  isCumulative: boolean;
  unitId?: number;
  uuid?: string;
  node: {
    _id: string;
    name: string;
  };
  compSignal: {
    compSignalId: string;
    name: string;
  };
}
