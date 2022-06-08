import FlowNode from './flowNode';

export default class GateNode extends FlowNode {
  constructor(public srcNode: FlowNode, public name: string, public service?: string) {
    super(GateNode.gateId(srcNode.id, name), service);
    srcNode.addEdge(this);
  }

  // Return name with format brackets
  displayName(): string {
    return `{${this.name}}`;
  }

  static gateId(parentName: string, gateName: string): string {
    return `${parentName + gateName}Gate`;
  }
}
