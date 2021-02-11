---
title: "Haskell or not"
desc: "Either it is or it's not"
date: 2020-10-26T23:43:25+01:00
author: "noAuthor"
categories: ["Undefined"]
draft: false
private: false
---

This is haskell

```hs
fizz :: Int -> String
fizz n | n `mod` 15 == 0  = "FizzBuzz"
       | n `mod` 3  == 0  = "Fizz"
       | n `mod` 5  == 0  = "Buzz"
       | otherwise        = show n

main :: IO ()
main = mapM_ putStrLn $ map fizz [1..100]
```

This is not 

```c
#include <stdio.h>
int main() {
    // printf() displays the string inside quotation
    printf("Hello, World!");
    return 0;
}
```
