import { QinMenuItem, qinMenuStartUp } from "qin_case";
import { BaseTools } from "./base-tools";
import { QinModules } from "./qin-modules";

const items: QinMenuItem<any>[] = [
  { module: QinModules.BASE_TOOLS, action: BaseTools },
];

qinMenuStartUp(items).putAsBody();
