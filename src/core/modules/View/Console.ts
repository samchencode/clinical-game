import { IViewAgent } from "./View";
const readline = {} as any //require("readline");

function ConsoleAgent(): IViewAgent {
  // FIXME: This doesnt clear options list before displaying new ones

  let lines: string[] = [];
  let options: { name: string; cb: Function }[] = [];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.prompt();

  rl.on("line", (input: string) => {
    if (Number.parseInt(input, 10) !== NaN) {
      const optNum = Number.parseInt(input, 10);
      const option = options[optNum - 1];
      if (option) option.cb();
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
        options.push({ name, cb });
      },
    };
  }

  return {
    renderer: getRendererVisitor,
    done: () => {
      lines.forEach((l) => console.log(l));
      const optDisplay = options
        .map((v, k) => `${k + 1}) ${v.name}`)
        .join("\n");
      console.log(optDisplay);
    },
    close: () => {
      rl.close();
      process.exit(0);
    },
  };
}

export default ConsoleAgent;
