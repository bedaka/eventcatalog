export interface Edge {
  dst: FlowNode;
  text?: string;
}

export default class FlowNode {
  public id: string;
  public service?: string;
  readonly edges: Edge[] = [];

  constructor(id: string, service?) {
    this.id = id;
    this.service = service;
  }

  addEdge(dst: FlowNode, text?: string): void {
    this.edges.push({ dst, text });
  }

  edgeExists(node: FlowNode): boolean {
    return this.edges.some((edge) => node.id === edge.dst.id);
  }

  // Return name with format brackets
  displayName(): string {
    return `(${this.id})`;
  }
}
