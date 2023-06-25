import { Lox } from "./lox.ts";
import { Token, TokenType } from "./token.ts";
import { match } from "ts-pattern";

class Scanner {
  static readonly #keywords = new Set<string>([
    "and",
    "class",
    "else",
    "false",
    "for",
    "fun",
    "if",
    "nil",
    "or",
    "print",
    "return",
    "super",
    "this",
    "true",
    "var",
    "while",
  ]);

  readonly #source: string;
  readonly #tokens: Token[] = [];

  #start = 0;
  #current = 0;
  #line = 1;

  constructor(source: string) {
    this.#source = source;
  }

  get #isAtEnd(): boolean {
    return this.#current >= this.#source.length;
  }

  scanTokens(): TokenType[] {
    while (!this.#isAtEnd) {
      // beginning of the next lexeme
      this.#start = this.#current;
      this.#scanToken();
    }

    this.#tokens.push({ type: "eof", lexeme: "", line: this.#line });
    return this.#tokens;
  }

  #scanToken(): void {
    const char = this.#advance();
    match(char)
      .with("(", () => this.#addToken({ type: "left_paren" }))
      .with(")", () => this.#addToken({ type: "right_paren" }))
      .with("{", () => this.#addToken({ type: "left_brace" }))
      .with("}", () => this.#addToken({ type: "right_brace" }))
      .with(",", () => this.#addToken({ type: "comma" }))
      .with(".", () => this.#addToken({ type: "dot" }))
      .with("-", () => this.#addToken({ type: "minus" }))
      .with("+", () => this.#addToken({ type: "plus" }))
      .with(";", () => this.#addToken({ type: "semicolon" }))
      .with("*", () => {
        this.#addToken({ type: "star" });
      })
      .with("!", () => {
        this.#addToken({
          type: this.#matchAndAdvance("=") ? "bang_equal" : "bang",
        });
      })
      .with("=", () => {
        this.#addToken({
          type: this.#matchAndAdvance("=") ? "equal_equal" : "equal",
        });
      })
      .with("<", () => {
        this.#addToken({
          type: this.#matchAndAdvance("=") ? "less_equal" : "less",
        });
      })
      .with(">", () => {
        this.#addToken({
          type: this.#matchAndAdvance("=") ? "greater_equal" : "greater",
        });
      })
      .with("/", () => {
        if (this.#matchAndAdvance("/")) {
          this.#comment();
          return;
        }

        if (this.#matchAndAdvance("*")) {
          this.#multilineComment();
          return;
        }

        this.#addToken({ type: "slash" });
      })
      .with(" ", "\r", "\t", () => {
        // ignore whitespace
      })
      .with("\n", () => {
        this.#line++;
      })
      .with('"', () => {
        this.#string();
      })
      .otherwise((char) => {
        if (this.#isDigit(char)) {
          this.#number();
          return;
        }

        if (this.#isAlpha(char)) {
          this.#identifier();
          return;
        }

        Lox.error(this.#line, `Unexpected character: ${char}`);
      });
  }

  #identifier(): void {
    while (this.#isAlphanumeric(this.#peek())) {
      this.#advance();
    }

    const text = this.#source.substring(this.#start, this.#current);

    this.#addToken({
      type: Scanner.#keywords.has(text) ? text : "identifier",
    } as TokenType);
  }

  #number(): void {
    while (this.#isDigit(this.#peek())) {
      this.#advance();
    }

    if (this.#peek() === "." && this.#isDigit(this.#peekNext())) {
      // consume "."
      this.#advance();

      while (this.#isDigit(this.#peek())) {
        this.#advance();
      }
    }

    this.#addToken({
      type: "number",
      literal: parseFloat(this.#source.substring(this.#start, this.#current)),
    });
  }

  #string(): void {
    while (!this.#isAtEnd && this.#peek() !== '"') {
      if (this.#peek() === "\n") {
        this.#line++;
      }

      this.#advance();
    }

    if (this.#isAtEnd) {
      Lox.error(this.#line, "Unterminated string");
      return;
    }

    // consume quote
    this.#advance();

    const literal = this.#source.substring(this.#start + 1, this.#current - 1);
    this.#addToken({ type: "string", literal });
  }

  #comment(): void {
    while (this.#peek() !== "\n" && !this.#isAtEnd) {
      this.#advance();
    }
  }

  #multilineComment(): void {
    while (
      !this.#isAtEnd &&
      (this.#peek() !== "*" || this.#peekNext() !== "/")
    ) {
      if (this.#peek() === "\n") {
        this.#line++;
      }

      this.#advance();
    }

    if (this.#isAtEnd) {
      Lox.error(this.#line, "Unterminated multiline comment");
      return;
    }

    // consume */
    this.#advance();
    this.#advance();
  }

  #advance(): string {
    return this.#source[this.#current++];
  }

  #peek(): string {
    return this.#source[this.#current] ?? "\0";
  }

  #peekNext(): string {
    return this.#source[this.#current + 1] ?? "\0";
  }

  #matchAndAdvance(expected: string): boolean {
    if (this.#isAtEnd) {
      return false;
    }

    if (this.#source[this.#current] !== expected) {
      return false;
    }

    this.#current++;
    return true;
  }

  #addToken(token: TokenType): void {
    const lexeme = this.#source.substring(this.#start, this.#current);
    this.#tokens.push({ ...token, lexeme, line: this.#line });
  }

  #isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  #isAlpha(char: string): boolean {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char == "_"
    );
  }

  #isAlphanumeric(char: string): boolean {
    return this.#isDigit(char) || this.#isAlpha(char);
  }
}

export { Scanner };
