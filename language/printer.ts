import { Node, ASTKind } from "./ast";

function print(node: Node): string {
  switch (node.kind) {
    case ASTKind.Bool:
      return String(node.value);
    case ASTKind.ExpressionStatement:
      return print(node.expression) + ";";
    case ASTKind.Identifier:
      return node.value;
    case ASTKind.InfixExpression:
      return `(${print(node.left)} ${node.operator} ${print(node.right)})`;
    case ASTKind.Integer:
      return String(node.value);
    case ASTKind.Let:
      return `let ${print(node.name)};`;
    case ASTKind.PrefixExpression:
      return `(${node.operator}${print(node.right)})`;
    case ASTKind.Program:
      return node.statements.map(print).join("\n");
    case ASTKind.Return:
      return "return;";
  }
}

export { print };
