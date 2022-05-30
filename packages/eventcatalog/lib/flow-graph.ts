import { Domain } from "@eventcatalog/types";
import { stringify } from "querystring";
import { getFlowsFromDir } from "./file-reader";
export type Form = "round" | "square" | "circle" | "bool";

interface Flow {
    id: number;
    name: string;
    domain: Domain
    nodes: [Node];
    edges: [Edge];
}

interface Node {
    id: number;
    name: string;
    producer: string;
    style: {
        type: string;
        color?: string;
    }
}

interface Edge {
    source: Node;
    destination: Node;
    text?: string;
}


/**
 * TEMPORARY until possible integration place for integration is found
 * get Flow data from file
 * @returns {Flow} 
 */
const readFlowData = (projectDir: string, domainName: string) => {
    const flows = getFlowsFromDir([projectDir, "domains", domainName, 'flows'].join('/')) 
    console.log(flows);
    return flows;
}

// const prepareFlow = (domain: Domain) => {
//     const flows = readFlowData(domain.name);
// }

export const prepareFlow = (projectDir:string, domain: string) => {
    const flows = readFlowData(projectDir, domain);
}
   

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

// /**
//  * Iterate through events / edges and create all necessary nodes. 
//  * Add Nodes for Gateways
//  * @param {[Event]} Events
//  * @param {[Node]} Nodes
//  * @returns [nodes] list of nodes
//  */
// const getNodes = (events, edges) => {
//     for e in events {

//     }

//   }

/**
 * Iterate through events / edges and create all necessary nodes. 
 * Add Nodes for Gateways
 * @param {[Node]} Nodes
 * @param {[Edge]} Edges 
 * @returns {string} FlowGraph in Markdown
 */ 
const buildFlowGraph = (nodes, edges) => {
    let flowGraph = `flowGraph RL\n`
    
    // Iterate through Nodes and sort them into subgraphs (if they belong to a service) // aber kann ein event nicht von mehreren services produziert werden?
    const nodesPerProducer = new Map<string, [Node]>();
    nodes.map((n) => {
        nodesPerProducer.set(n.producer, n)
    })
   nodesPerProducer.forEach((service, node) => {
        flowGraph += `subgraph ${service}\n`;
        service.map((node) => {
            flowGraph += [
                node.id, 
                node.style.type !== 'gate' ? '[' : '{',
                node.name,
                node.style.type !== 'gate' ? ']' : '}', '\n',
            ].join('')
        })
        flowGraph += '\n';
          // Iterate through Nodes
        flowGraph += 'end\n\n'
    })
}
  
