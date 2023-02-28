import {
  QinButton,
  QinColumn,
  QinExpect,
  QinHeader,
  QinLabel,
  QinModule,
  QinText,
} from "qin_case";
import { QinEvent } from "qin_soul";

export class BaseTools extends QinColumn {
  private _module: QinModule;
  private _expect?: QinExpect;

  private _header = new QinHeader(1, "Export CSV");
  private _button = new QinButton({ label: new QinLabel("Export") });
  private _output = new QinText({ rows: 10 });

  constructor(module: QinModule, expect?: QinExpect) {
    super();
    this._module = module;
    this._expect = expect;
    this._header.install(this);
    this._button.install(this);
    this._button.addActionMain(this._buttonAction);
    this._output.install(this);
  }

  private _buttonAction = (ev: QinEvent) => {
    this.qinpel.talk.giz
      .run({
        exec: "argo/base-export.giz",
      })
      .then((token) => {
        this.qinpel.talk.issued
          .askWhenDone({
            token: token,
            askOutLines: true,
          })
          .then((result) => (this._output.value = result.outLines))
          .catch((err) => this.qinpel.jobbed.showError(err, "{qia_argo}(ErrCode-000002)"));
      })
      .catch((err) => this.qinpel.jobbed.showError(err, "{qia_argo}(ErrCode-000001)"));
  };
}
