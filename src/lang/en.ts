import { getMessage } from "./index";
const modules = import.meta.globEager<{ [props: string]: any }>("./en_US/**/*.ts");
export default {
  "en_US": {
    ...getMessage(modules, "en_US"),
  },
};
