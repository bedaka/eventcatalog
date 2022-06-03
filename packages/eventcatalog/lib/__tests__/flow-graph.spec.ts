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

      const flow2: Flow = new Flow("testflow2")
      flow2.addNode("Start","Service1");
      flow2.addNode("Zwei","Service2");
      flow2.addNode("Drei","Service1");
      flow2.addNode("Vier","Service1");
      flow2.addNode("Fünf","Service1");
      flow2.addNode("Sechs","Service1");
      flow2.addNode("Sieben","Service1");
      flow2.addNode("Acht","Service1");
      flow2.addNode("Ende","Service1");

      flow2.addEdge("Start", "Zwei");
      flow2.addEdge("Zwei", "Drei", "Or");
      flow2.addEdge("Vier", "Zwei");
      flow2.addEdge("Zwei", "Vier", "Or");
      flow2.addEdge("Zwei", "Fünf", "Or");
      flow2.addEdge("Fünf", "Sechs", "And");
      flow2.addEdge("Fünf", "Sieben", "And");
      flow2.addEdge("Sieben", "Acht");
      flow2.addEdge("Sechs", "Ende");
      flow2.addEdge("Acht", "Ende");

      const res = buildFlowGraph(flow);
      const res2 = buildFlowGraph(flow2);
      console.log(res);
      expect(res.trim()).toEqual(basicFlow);
      expect(res2.trim()).toEqual(expectedFlow1);
    });
  });
});

const basicFlow = `flowchart LR
subgraph S1
A[A]
C[C]
end
subgraph S2
B[B]
BAndGate{And}
end
A --> B
B --> BAndGate
BAndGate --> C
BAndGate --> D`;

// test Data
const expectedFlow1 = `flowchart LR
subgraph Service1
Start[Start]
Drei[Drei]
Vier[Vier]
Fünf[Fünf]
Sechs[Sechs]
Sieben[Sieben]
Acht[Acht]
Ende[Ende]
FünfAndGate{And}
end
subgraph Service2
Zwei[Zwei]
ZweiOrGate{Or}
end
Start --> Zwei
Zwei --> ZweiOrGate
Vier --> Zwei
Fünf --> FünfAndGate
Sechs --> Ende
Sieben --> Acht
Acht --> Ende
ZweiOrGate --> Drei
ZweiOrGate --> Vier
ZweiOrGate --> Fünf
FünfAndGate --> Sechs
FünfAndGate --> Sieben`;

