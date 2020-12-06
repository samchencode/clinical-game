import { IViewAgent } from "./View";
const readline = require("readline");

function ConsoleAgent(): IViewAgent {
  // FIXME: This doesnt clear options list before displaying new ones

  let lines: string[] = [];
  let options: { name: string, cb: Function }[] = [];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.prompt();

  rl.on("line", (input: string) => {
    if(Number.parseInt(input, 10) !== NaN) {
      const optNum = Number.parseInt(input, 10);
      const option = options[optNum - 1]
      if(option.cb) option.cb();
    }
    rl.prompt();
  });


  function getRendererVisitor() {
    lines = [];
    options = [];

    return {
      displayText: (s: string) => lines.push(s),
      displayImage: (url: string) => lines.push("\tSee image at: " + url),
      displayOption: (name: string, cb: Function) => {
        options.push({ name, cb })
      },
      done: () => {
        lines.forEach(console.log);
        const optDisplay = options.map((v, k) => `${k+1}) ${v.name}`).join('\n')
        console.log(optDisplay);
      }
    }
  }

  return {
    renderer: getRendererVisitor,
  };
}

export default ConsoleAgent;