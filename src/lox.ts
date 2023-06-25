import { P, match } from "ts-pattern";
import { Scanner } from "./scanner.ts";

class Lox {
  static hadError = false;

  static #report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error${where}: ${message}`);
    Lox.hadError = true;
  }

  static error(line: number, message: string) {
    Lox.#report(line, "", message);
  }

  run(): void {
    match(Deno.args)
      .with([P.string], ([filePath]) => {
        this.runFile(filePath);
      })
      .with([], () => {
        this.runPrompt();
      })
      .otherwise(() => {
        console.log("Usage: deno-lox [script]");
        Deno.exit(64);
      });
  }

  runFile(filePath: string) {
    try {
      const source = Deno.readTextFileSync(filePath);
      this.runSource(source);

      if (Lox.hadError) {
        Deno.exit(65);
      }
    } catch (e) {
      match(e)
        .with(P.instanceOf(Deno.errors.NotFound), () => {
          console.error(`File at "${filePath}" was not found.`);
        })
        .otherwise((e) => {
          console.error("Unexpected error", e);
        });
    }
  }

  runPrompt() {
    while (true) {
      const line = prompt("> ");

      if (line === null) {
        break;
      }

      this.runSource(line);
      Lox.hadError = false;
    }
  }

  runSource(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    // For now, just print the tokens.
    for (const token of tokens) {
      console.log(token);
    }
  }
}

export { Lox };
