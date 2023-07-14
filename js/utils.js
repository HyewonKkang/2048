const pipe =
    (...functions) =>
    (input) =>
        functions.reduce((acc, fn) => fn(acc), input);
