import { IViewAgent } from "../View";
import Vue from "vue";
import VueRoot from "./App.vue";

function VueAgent(): IViewAgent {
  const div = document.createElement("div");
  document.body.appendChild(div);

  const vm = new Vue({
    el: div,
    render: (h) => h(VueRoot),
  });

  let lines: string[], options: { name: string; cb: Function }[];

  function getRendererVisitor() {
    lines = [];
    options = [];

    return {
      displayText: (s: string) => lines.push(s),
      displayImage: (url: string) => lines.push("\tSee image at: " + url),
      displayOption: (name: string, cb: Function) => {
        options.push({ name, cb });
      },
    };
  }

  return {
    renderer: getRendererVisitor,
    done: () => {
      (vm.$children[0] as any).lines = lines;
      (vm.$children[0] as any).opts = options;
    },
    close: () => { (vm.$children[0] as any).done = true; },
  };
}

export default VueAgent;
