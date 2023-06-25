import { Token } from "./token.ts";

type ExprType =
  // | { type: "assign"; name: Token; expression: Expression }
  | { type: "binary"; left: ExprType; operator: Token; right: ExprType }
  // | { type: "call"; callee: Expression; paren: Token; arguments: Expression[] }
  // | { type: "get"; object: Expression; name: Token }
  | { type: "grouping"; expression: ExprType }
  | { type: "literal"; value: string | number }
  // | { type: "logical"; left: Expression; operator: Token; right: Expression }
  // | { type: "set"; object: Expression; name: Token; value: Expression }
  // | { type: "super"; keyword: Token; method: Token }
  // | { type: "this"; keyword: Token }
  | { type: "unary"; operator: Token; right: ExprType };
// | { type: "variable"; name: Token };

type Expr<T extends ExprType["type"]> = Extract<ExprType, { type: T }>;

export type { ExprType, Expr };
