// Example 1 ======================================================================================
type DescFn = {
    description: string
    (someArg: number): boolean
}

function doSomething(fn: DescFn) {
    console.log(`Значением, возвращаемым ${fn.description} является ${fn(6)}`)
}


// Example 2 ======================================================================================

type SomeConstructor = {
  new (s: string): number
}

function fn(ctor: SomeConstructor) {
  return ctor('Hello!') // error
}

// Example 3 ======================================================================================
interface CallOrConstruct {
  new (s: string): Date
  (n?: number): number
}
