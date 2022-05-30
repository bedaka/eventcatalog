import path from 'path';
import { prepareFlow } from "../flow-graph";

let PROJECT_DIR: any;

describe('flow-graphs', () => {

    beforeAll(() => {
        PROJECT_DIR = process.env.PROJECT_DIR;
        process.env.PROJECT_DIR = path.join(__dirname, 'assets');
      });

    it('temp test case', () => {
        const domainName = "User";
        prepareFlow(process.env.PROJECT_DIR, domainName);
    });
})