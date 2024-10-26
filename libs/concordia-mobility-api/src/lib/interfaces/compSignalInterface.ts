export declare interface CompSignalInterface {
  compSignalId: string;
  description: string;
  name: string;
  nodeId?: string;
  node: {
    description: string;
    isActive: boolean;
    name: string;
    ownerId: number | string;
    _id: string;
  }
  options?: {
    conversionId: number;
    dataSourceId: number;
    decimals: number;
    listSignalId: number;
    parentNodeId: string;
    parentSignalId: string;
    unitId: null
  }
  type: string;
}
