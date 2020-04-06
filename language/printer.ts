import { ASTKind, HashLiteral, IfExpression, Node } from "./ast";

function print(node: Node): string {
  switch (node.kind) {
    case ASTKind.ArrayLiteral:
      return `[${node.elements.map(print).join(", ")}]`;
    case ASTKind.BlockStatement:
      return node.statements.map(print).join("\n");
    case ASTKind.Bool:
      return String(node.value);
    case ASTKind.CallExpression: {
      const args = node.arguments.map(print).join(", ");
      return `${print(node.function)}(${args})`;
    }
    case ASTKind.ExpressionStatement:
      return print(node.expression) + ";";
    case ASTKind.FunctionLiteral: {
      const params = node.parameters.map(print).join(", ");
      return `fn(${params}) {\n  ${print(node.body)}\n}`;
    }
    case ASTKind.HashLiteral:
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return printHash(node);
    case ASTKind.Identifier:
      return node.value;
    case ASTKind.IfExpression:
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return printIfExpression(node);
    case ASTKind.IndexExpression:
      return `(${print(node.left)}[${print(node.index)}])`;
    case ASTKind.InfixExpression:
      return `(${print(node.left)} ${node.operator} ${print(node.right)})`;
    case ASTKind.Integer:
      return String(node.value);
    case ASTKind.Let:
      return `let ${print(node.name)} = ${print(node.value)};`;
    case ASTKind.PrefixExpression:
      return `(${node.operator}${print(node.right)})`;
    case ASTKind.Program:
      return node.statements.map(print).join("\n");
    case ASTKind.Return:
      return `return ${print(node.returnValue)};`;
    case ASTKind.String:
      return `"${node.value}"`;
  }
}

function printIfExpression({
  condition,
  consequence,
  alternative
}: IfExpression): string {
  const alternativeString = alternative
    ? ` else {\n  ${print(alternative)}\n}`
    : "";

  return (
    `if (${print(condition)}) {\n  ${print(consequence)}\n}` + alternativeString
  );
}

function printHash(node: HashLiteral): string {
  const pairs = [];
  for (const [key, value] of node.pairs) {
    pairs.push(`${print(key)}: ${print(value)}`);
  }

  return `{${pairs.join(", ")}}`;
}

export { print };
