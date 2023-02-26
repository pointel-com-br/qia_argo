import { QinColumn, QinExpect, QinLabel, QinModule } from "qin_case";

export class BaseTools extends QinColumn {
  private _module: QinModule;
  private _expect?: QinExpect;
  
  constructor(module: QinModule, expect?: QinExpect) {
    super();
    this._module = module;
    this._expect = expect;
    let label = new QinLabel("Base Tools, testing...");
    label.install(this);
  }
}