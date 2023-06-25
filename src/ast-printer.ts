import { ExprType } from "./expression.ts";
import { match } from "ts-pattern";

class AstPrinter {
  stringify(expr: ExprType): string {
    return match(expr)
      .with({ type: "binary" }, (expr) =>
        this.#parenthesize(expr.operator.lexeme, expr.left, expr.right)
      )
      .with({ type: "grouping" }, (expr) =>
        this.#parenthesize("group", expr.expression)
      )
      .with({ type: "literal" }, (expr) => expr.value.toString())
      .with({ type: "unary" }, (expr) =>
        this.#parenthesize(expr.operator.lexeme, expr.right)
      )
      .exhaustive();
  }

  #parenthesize(name: string, ...exprs: ExprType[]): string {
    return `(${name} ${exprs.map((expr) => this.stringify(expr)).join(" ")})`;
  }
}

export { AstPrinter };
