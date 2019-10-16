import { ParamDeclarationList } from "../../ts/parse-params";

export enum Source {
  EXTERNAL, LOCAL, BOTH
};

export class ConstructorService {
    private paramList: ParamDeclarationList;

    constructor() {
    }

    public set params(p: ParamDeclarationList) {
        this.paramList = p;
    }

    public isConstructorParam(param: string, source: Source) {

    }
}
