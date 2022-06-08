import path from 'path';
import Flow from '../flow-graph/flow';

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
    it('creates a mermaid flow with subgroups and format', () => {
      const flow: Flow = new Flow('testflow2');
      flow.addNode('Start', 'Service1');
      flow.addNode('Zwei', 'Service2');
      flow.addNode('Drei', 'Service1');
      flow.addNode('Vier', 'Service1');
      flow.addNode('Fünf', 'Service1');
      flow.addNode('Sechs', 'Service1');
      flow.addNode('Sieben', 'Service1');
      flow.addNode('Acht', 'Service1');
      flow.addNode('Ende', 'Service1');

      flow.addEdge('Start', 'Zwei');
      flow.addEdgeWithGate('Zwei', 'Drei', 'Or');
      flow.addEdge('Vier', 'Zwei');
      flow.addEdgeWithGate('Zwei', 'Vier', 'Or');
      flow.addEdgeWithGate('Zwei', 'Fünf', 'Or');
      flow.addEdgeWithGate('Fünf', 'Sechs', 'And');
      flow.addEdgeWithGate('Fünf', 'Sieben', 'And');
      flow.addEdge('Sieben', 'Acht');
      flow.addEdge('Sechs', 'Ende');
      flow.addEdge('Acht', 'Ende');

      const res = flow.buildFlowGraph();
      expect(res.trim()).toEqual(expectedFlow1);
    });

    it('creates a simple mermaid flow with text unordered', () => {
      const flow = new Flow('testflow');

      flow.addNode('A', 'S1'); // event default?
      flow.addNode('B', 'S2');

      flow.addNode('D');

      flow.addEdge('A', 'B', 'text A-B');
      flow.addEdgeWithGate('B', 'C', 'And', 'text B-C');
      flow.addEdgeWithGate('B', 'D', 'And');

      flow.addNode('C', 'S1');

      const res = flow.buildFlowGraph();

      console.log(res);
      expect(res.trim()).toEqual(basicFlow);
    });
  });
});

const basicFlow = `flowchart LR
subgraph S1
A(A)
C(C)
end
subgraph S2
B(B)
BAndGate{And}
end
A --text A-B--> B
B --> BAndGate
BAndGate --text B-C--> C
BAndGate --> D`;

// test Data
const expectedFlow1 = `flowchart LR
subgraph Service1
Start(Start)
Drei(Drei)
Vier(Vier)
Fünf(Fünf)
Sechs(Sechs)
Sieben(Sieben)
Acht(Acht)
Ende(Ende)
FünfAndGate{And}
end
subgraph Service2
Zwei(Zwei)
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
