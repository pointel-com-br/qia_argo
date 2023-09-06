import {
  QinButton,
  QinColumn,
  QinCombo,
  QinExpect,
  QinHeader,
  QinInteger,
  QinLabel,
  QinLine,
  QinModule,
  QinString,
  QinText,
  QinTitled,
} from "qin_case";
import { QinEvent } from "qin_soul";

export class BaseTools extends QinColumn {
    private _module: QinModule;
    private _expect?: QinExpect;

    private _hedTitle = new QinHeader(1, "Export CSV");
    private _hedOrigin = new QinHeader(2, "Origin");
    private _edtName = new QinString();
    private _titName = new QinTitled({ title: "Name", items: [this._edtName] });
    private _edtBase = new QinCombo({
        items: [
            { title: "SQLiteMemory", value: "SQLiteMemory" },
            { title: "SQLiteLocal", value: "SQLiteLocal" },
            { title: "HSQLDBMemory", value: "HSQLDBMemory" },
            { title: "HSQLDBLocal", value: "HSQLDBLocal" },
            { title: "HSQLDBClient", value: "HSQLDBClient" },
            { title: "DerbyInner", value: "DerbyInner" },
            { title: "DerbyClient", value: "DerbyClient" },
            { title: "FirebirdLocal", value: "FirebirdLocal" },
            { title: "FirebirdInner", value: "FirebirdInner" },
            { title: "FirebirdClient", value: "FirebirdClient" },
            { title: "MySQLClient", value: "MySQLClient" },
            { title: "PostgreClient", value: "PostgreClient" },
        ],
    });
    private _titBase = new QinTitled({ title: "Base", items: [this._edtBase] });
    private _edtPath = new QinString();
    private _titPath = new QinTitled({ title: "Path", items: [this._edtPath] });
    private _edtPort = new QinInteger();
    private _titPort = new QinTitled({ title: "Port", items: [this._edtPort] });
    private _edtData = new QinString();
    private _titData = new QinTitled({ title: "Data", items: [this._edtData] });
    private _edtUser = new QinString();
    private _titUser = new QinTitled({ title: "User", items: [this._edtUser] });
    private _edtPass = new QinString();
    private _titPass = new QinTitled({ title: "Pass", items: [this._edtPass] });
    private _linOrigin = new QinLine({
        items: [
            this._titName,
            this._titBase,
            this._titPath,
            this._titPort,
            this._titData,
            this._titUser,
            this._titPass,
        ],
    });
    private _hedDestiny = new QinHeader(2, "Destiny");
    private _edtFolder = new QinString();
    private _titFolder = new QinTitled({ title: "Folder", items: [this._edtFolder] });
    private _linDestiny = new QinLine({ items: [this._titFolder] });
    private _button = new QinButton({ label: new QinLabel("Export") });
    private _output = new QinText({ rows: 10 });

    constructor(module: QinModule, expect?: QinExpect) {
        super();
        this._module = module;
        this._expect = expect;
        this._hedTitle.install(this);
        this._hedOrigin.install(this);
        this._linOrigin.install(this);
        this._hedDestiny.install(this);
        this._linDestiny.install(this);
        this._button.install(this);
        this._button.addActionMain(this._buttonAction);
        this._output.install(this);
    }

    private _buttonAction = (ev: QinEvent) => {
        let args = [
            this._edtName.value ? this._edtName.value.toString() : "",
            this._edtBase.value ? this._edtBase.value.toString() : "",
            this._edtPath.value ? this._edtPath.value.toString() : "",
            this._edtPort.value ? this._edtPort.value.toString() : "",
            this._edtData.value ? this._edtData.value.toString() : "",
            this._edtUser.value ? this._edtUser.value.toString() : "",
            this._edtPass.value ? this._edtPass.value.toString() : "",
            this._edtFolder.value ? this._edtFolder.value.toString() : "",
        ];
        this.qinpel.talk.giz
            .run({
                exec: "argo/base-export.giz",
                args,
                joinErrs: true,
            })
            .then((token) => {
                this.qinpel.talk.issued.readStreamOut({
                    token: token,
                    chunks: 10,
                    onReceive: (line) => this._output.appendLine(line),
                    onFinish: (size) => this._output.appendLine("Finished with " + size),
                    onError: (err) =>
                        this.qinpel.jobbed.showError(err, "{qia_argo}(ErrCode-000002)"),
                });
            })
            .catch((err) => this.qinpel.jobbed.showError(err, "{qia_argo}(ErrCode-000001)"));
    };
}
