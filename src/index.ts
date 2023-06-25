import { Lox } from "./lox.ts";

const lox = new Lox();

lox.run();

// const expression: Expr<"binary"> = {
//   type: "binary",
//   left: {
//     type: "unary",
//     operator: { type: "minus", lexeme: "-", line: 1 },
//     right: { type: "literal", value: 123 },
//   },
//   operator: { type: "star", lexeme: "*", line: 1 },
//   right: {
//     type: "grouping",
//     expression: {
//       type: "literal",
//       value: 45.67,
//     },
//   },
// };
// console.log(new AstPrinter().stringify(expression));
