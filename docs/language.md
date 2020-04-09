# The Monkey Language

This is a port of the Monkey interpreter from [Writing An Interpreter In Go](https://interpreterbook.com/) to TypeScript.

From [monkeylang.org](https://monkeylang.org/):

> Monkey is a programming language that you can build yourself by reading through [Writing An Interpreter In Go](https://interpreterbook.com/) and [Writing A Compiler In Go](https://compilerbook.com/).
>
> There is no official implementation of Monkey — it lives in these books and it's up to you, the reader, to implement it.

## Data Types

Monkey supports integers, strings, and booleans:

```js
let n = 1;
let word = "Hi";
let bool = true;
```

You can use these data types with basic arithmetic (`+`, `-`, `/`, `*`) and logical (`==`, `!=`, `>`, `<`, `!`) operators:

```js
let n = ((1 + 1) * 5) / 2 - 4;
let bool = n > 5;
let greeting = "Hi" + " " + "there" + "!";
```

Monkey also supports arrays and hashes:

```js
let array = ["a", 5, false];
let hash = { one: 1 };
```

Items in arrays in hashes can be accessed via the index operator:

```js
["a", "b"][0]
{"c": true}["c"]
```

Expressions are allowed as both keys and values in hashes. Strings, integers, and booleans can be used as keys:

```js
let key = "one"
let hash = {key: 1, 1 < 2: 2, "another": 2 * (5 + 10)}
```

You can define functions with the `fn` keyword:

```js
let double = fn (x) { x * 2 }
```

The last value evaluated in a function's body is implicitly returned, but explicit returns are also allowed:

```js
let implicitReturn = fn () { "implicit" }
let explicitReturn = fn () { return "explicit" }
```

Functions are first-class citizens and can be passed around as values to other functions. The following code returns `5`:

```js
let addOne = fn (x) { x + 1}
let doTwice = fn (x, func) { func(func(x)) }
doTwice(3, addOne)
```

## Assigning Variables

`let` is used to assign values to an identifier. Values are immutable, but different values can be re-bound to the same identifier.

The following code returns `true`:

```js
let a = "text";
let a = true;
a;
```

## Built-in Functions

Monkey supports a handful of built-in functions.

### first

Returns the first element of an array. Returns `null`, if the array is empty.

The following code returns `1`:

```js
let myArray = [1, 2, 3];
first(myArray);
```

### last

Returns the last element of an array. Returns `null`, if the array is empty.

The following code returns `3`:

```js
let myArray = [1, 2, 3];
last(myArray);
```

### len

Returns the length of an array or string.

The following code returns `5`:

```js
len("hello");
```

### rest

Returns all items in an array except for the first item.

The following code returns `[2, 3]`:

```js
rest([1, 2, 3]);
```

### push

Returns a new array with the given value pushed the end of the input array.

The following code returns `[1, 2, 3]`:

```js
push([1, 2], 3);
```

### puts

Logs each item on a new line and returns `null`.

```js
puts("hi");
```

```js
puts(1, true, "more than one arg");
```

## Control Flow

Monkey supports `if`/`else` statements for control flow:

```js
if (1 < 2) {
  ("yep");
} else {
  ("nope");
}
```

`else` is optional:

```js
if (1 < 2) {
  return "yep";
}

return "nope";
```

## Other Notes on Syntax

Semicolons are optional:

```js
let a = "This is a valid let statement";
let b = "This is also a valid let statement";
```
