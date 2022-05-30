flowchart LR
    subgraph x
        A[Start]
        B[Zwei]
        C{OR}
        E[Vier]
        F{&}
        I{&}
        G[hier]
        H[und hier]
        J[Ende]
    end
    subgraph y
        D[Drei]
    end
    A -->|first step| B
    B --> C
    C --> D
    D --> B
    C --> E
    E --> F
    F --> G
    G --> I
    F --> H
    H --> I 
    I --> J