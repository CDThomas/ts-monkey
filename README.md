# ts-monkey

A TypeScript implementation of the [monkey language](https://monkeylang.org/) along with an in-browser editor, interpreter, and AST explorer.

## Structure

Currently, all files (for both the in-browser editor and core language) live in this project. This is for ease while building out the basic feature-set for the editor and language.

This project uses [Next.js](https://nextjs.org/). Source code for the Monkey interpreter lives in `language/` and the rest of the files follow conventions for [Next.js applications](https://nextjs.org/docs/getting-started).

Eventually the core language (source code for Monkey interpreter) will most likely be moved into its own package.
