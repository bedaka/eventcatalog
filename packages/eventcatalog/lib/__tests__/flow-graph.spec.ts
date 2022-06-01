import { FolderDownloadIcon } from '@heroicons/react/outline';
import path from 'path';
import { buildFlowGraph, Flow, prepareFlow } from '../flow-graph';

let PROJECT_DIR: any;

describe('flow-graphs', () => {
  beforeAll(() => {
    PROJECT_DIR = process.env.PROJECT_DIR;
    process.env.PROJECT_DIR = path.join(__dirname, 'assets');
  });

  // it('temp test case', () => {
  //     const domainName = "User";
  //     prepareFlow(process.env.PROJECT_DIR, domainName);
  // });

  describe('mermaid builder', () => {
    it('creates a valid mermaid flow', () => {
      const flow = new Flow('testflow');

      flow.addNode('A', 'S1'); // event default?
      flow.addNode('B', 'S2');
      flow.addNode('C', 'S1');
      flow.addNode('D');

      flow.addEdge('A', 'B');
      flow.addEdge('B', 'C', 'And');
      flow.addEdge('B', 'D', 'And');

      // const flow: Flow = {id: 1, name: "testflow", domain: {name: "User", summary: "abc"}, nodes: [], edges: []};

      // flow.nodes.set(1, {id: 1, name: "Start", subgraph:"Service1", style:{type:"event"}});
      // flow.nodes.set(2, {id: 2, name: "Zwei", subgraph:"Service2", style:{type:"event"}});
      // flow.nodes.set(3, {id: 3, name: "OR", subgraph:"Service1", style:{type:"gate"}});
      // flow.nodes.set(4, {id: 4, name: "Vier", subgraph:"Service1", style:{type:"event"}});
      // flow.nodes.set(5, {id: 5, name: "AND", subgraph:"Service1", style:{type:"event"}});
      // flow.nodes.set(6, {id: 6, name: "AND", subgraph:"Service1", style:{type:"event"}});
      // flow.nodes.set(7, {id: 7, name: "Sieben", subgraph:"Service1", style:{type:"event"}});
      // flow.nodes.set(8, {id: 8, name: "Acht", subgraph:"Service1", style:{type:"event"}});
      // flow.nodes.set(9, {id: 9, name: "Neun", subgraph:"Service1", style:{type:"event"}});
      // flow.nodes.set(10, {id: 10, name: "End", subgraph:"Service1", style:{type:"event"}});

      // flow.edges.push({src: 1, dst: 2, text: "first step"});
      // flow.edges.push({src: 2, dst: 3});
      // flow.edges.push({src: 3, dst: 4});
      // flow.edges.push({src: 4, dst: 2});
      // flow.edges.push({src: 3, dst: 5});
      // flow.edges.push({src: 6, dst: 7});
      // flow.edges.push({src: 7, dst: 9});
      // flow.edges.push({src: 6, dst: 8});
      // flow.edges.push({src: 8, dst: 9});
      // flow.edges.push({src: 9, dst: 10});
      // flow.edges.push({src: 5, dst: 6});

      const res = buildFlowGraph(flow);
      console.log(res);
      expect(res.trim()).toEqual(basicFlow);
    });
  });
});

const basicFlow = `flowchart LR\n
subgraph S1\n    
A[A]\n
C[C]\n
end\n
subgraph S2\n
B[B]\n
BAndGate[AND]\n
A --> B\n
B --> BAndGate\n
BAndGate --> C\n
BAndGate --> D\n`;

// test Data
const expectedFlow1 = `flowchart LR\n
subgraph x\n
    1[Start]\n
    2[Zwei]\n
    3{OR}\n
    4[Vier]\n
    5{AND}\n
    6{AND}\n
    7[Sieben]\n
    8[Acht]\n
    9[Neun]\n
    10[Ende]\n
end\n
subgraph y\n
    D[Drei]\n
end\n
1 -->|first step| 2\n
2 --> 3\n
3 --> 4\n
4 --> 2\n
3 --> 5\n
5 --> 6\n
6 --> 7\n
7 --> 9\n
6 --> 8\n
8 --> 9\n
9 --> 10\n`;
