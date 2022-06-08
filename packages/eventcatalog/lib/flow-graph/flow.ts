import FlowNode from './flowNode';
import GateNode from './gateNode';

type Gate = 'And' | 'Or' | 'Xor';

export default class Flow {
  public name: string;
  protected nodes: Map<string, FlowNode> = new Map();

  // Liste mit unique ids füren um die automatisch zu vergeben.
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Add a new node if it was not added before
   *
   * @param {string} id
   * @returns {FlowNode}
   */

  addNode(id: string, service?: string): FlowNode {
    // Check if Node already exists
    let node = this.nodes.get(id);
    if (node) {
      if (!node.service && service) {
        node.service = service;
        console.log('Assigned service to existing node');
      }
      return node;
    }

    node = new FlowNode(id, service);
    this.nodes.set(id, node);
    return node;
  }

  addEdge(src: string, dst: string, text?: string): void {
    let srcNode = this.addNode(src);
    let dstNode = this.addNode(dst);

    srcNode.addEdge(dstNode, text);
  }

  addEdgeWithGate(src: string, dst: string, gate: Gate, text?: string): void {
    let srcNode = this.addNode(src);
    let dstNode = this.addNode(dst);
    let gateNode = this.nodes.get(GateNode.gateId(srcNode.id, gate));

    //Create new GateNode if it does not exist.
    if (!gateNode) {
      gateNode = new GateNode(srcNode, gate, srcNode.service);
      this.nodes.set(gateNode.id, gateNode);
    }
    gateNode.addEdge(dstNode, text);
  }

  /**
   * Iterate through events / edges and create all necessary nodes.
   * Add Nodes for Gateways
   * @returns {string} FlowGraph in Markdown
   */
  buildFlowGraph(): string {
    let flowGraph = `flowchart LR\n`;
    let edges = '';

    // Iterate through Nodes and sort them into subgraphs (if they belong to a service) // aber kann ein event nicht von mehreren services produziert werden?
    const nodesPerService = new Map<string, FlowNode[]>();
    this.nodes.forEach((n) => {
      // check if subgraph
      if (n.service) {
        // check if subgraph exists
        if (!nodesPerService.has(n.service)) {
          nodesPerService.set(n.service, [n]);
        } else {
          nodesPerService.get(n.service).push(n);
        }
      }
      n.edges.forEach((edge) => {
        // add edge description text if available
        const text = edge.text ? ` --${edge.text}` : ' ';
        edges += [n.id, text, `--> `, edge.dst.id, '\n'].join('');
      });
    });
    nodesPerService.forEach((nodes, service) => {
      flowGraph += `subgraph ${service}\n`;
      nodes.forEach((node) => {
        flowGraph += [node.id, node.displayName(), '\n'].join('');
      });
      flowGraph += 'end\n';
    });

    return flowGraph + edges;
  }
}
