import { getFlowsFromDir } from './file-reader';

export class Node {
  edges: Node[];

  constructor(public id: string, public service: string = '') {
    this.edges = [];
  }

  addEdge(node: Node): void {
    this.edges.push(node);
  }

  // Return name with format brackets
  displayName(): string {
    return `[${this.id}]`;
  }
}

export class GateNode extends Node {
  constructor(public parent: string, public name: string, public service: string = '') {
    super(GateNode.gateId(parent, name), service);
  }

  // Return name with format brackets
  displayName(): string {
    return `{${this.name}}`;
  }

  static gateId(parent: string, gateName: string): string {
    return parent + gateName + 'Gate';
  }
}

export class Flow {
  nodes: Map<string, Node> = new Map();
  // Liste mit unique ids füren um die automatisch zu vergeben.
  constructor(public name: string) {}

  /**
   * Add a new node if it was not added before
   *
   * @param {string} id
   * @returns {Node}
   */

  addNode(id: string, service: string = ''): Node {
    let node = this.nodes.get(id);
    if (node) return node;

    node = new Node(id, service);
    this.nodes.set(id, node);

    return node;
  }

  addEdge(src: string, dst: string, gate?: string): void {
    const srcNode = this.nodes.get(src);
    const dstNode = this.nodes.get(dst);

    if (srcNode && dstNode) {
      if (gate) {
        let gateNode = this.nodes.get(GateNode.gateId(srcNode.id, gate));
        if (!gateNode) {
          gateNode = new GateNode(srcNode.id, gate, 'gate');
          this.nodes.set(gateNode.id, gateNode);
        }
        srcNode.addEdge(gateNode);
        gateNode.addEdge(dstNode);
      } else {
        // if no gate add simple edge
        srcNode.addEdge(dstNode);
      }
    }
  }
}

/**
 * TEMPORARY until possible integration place for integration is found
 * get Flow data from file
 * @returns {Flow}
 */
const readFlowData = (projectDir: string, domainName: string) => {
  const flows = getFlowsFromDir([projectDir, 'domains', domainName, 'flows'].join('/'));
  console.log(flows);
  return flows;
};

// const prepareFlow = (domain: Domain) => {
//     const flows = readFlowData(domain.name);
// }

export const prepareFlow = (projectDir: string, domain: string) => {
  const flows = readFlowData(projectDir, domain);
};

// /**
//  * Iterate through events / edges and create all necessary nodes.
//  * Add Nodes for Gateways
//  * @param {[Event]} Events
//  * @param {[Node]} Nodes
//  * @returns [nodes] list of nodes
//  */
//  const getEdges = (events, edges) => {
//     for e in events {

//     }

//   }

/**
 * Iterate through events / edges and create all necessary nodes.
 * Add Nodes for Gateways
 * @param {Flow} flow
 * @returns {string} FlowGraph in Markdown
 */
export const buildFlowGraph = (flow: Flow): string => {
  let flowGraph = `flowGraph LR\n`;

  // Iterate through Nodes and sort them into subgraphs (if they belong to a service) // aber kann ein event nicht von mehreren services produziert werden?
  const nodesPerService = new Map<string, Node[]>();
  flow.nodes.forEach((n) => {
    // check if subgraph
    console.log(n.service);
    if (n.service !== '') {
      // check if subgraph exists
      if (!nodesPerService.has(n.service)) {
        nodesPerService.set(n.service, [n]);
      } else {
        nodesPerService.get(n.service).push(n);
      }
    }
  });
  console.log(nodesPerService);
  nodesPerService.forEach((nodes, service) => {
    flowGraph += `subgraph ${service}\n`;
    nodes.forEach((node) => {
      flowGraph += [node.id, node.displayName(), '\n'].join('');
    });
    // Iterate through Nodes
    flowGraph += 'end\n';
  });
  flow.nodes.forEach((node, srcId) => {
    const edges = node.edges.forEach((dst) => {
      flowGraph += [srcId, ' --> ', dst.id, '\n'].join('');
    });
  });
  return flowGraph;
};
