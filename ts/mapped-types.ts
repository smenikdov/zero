// Example 1 ======================================================================================
type AnyObject = {
    [key: string]: any
}

// Example 2 ======================================================================================
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean
}

// Merge Types ====================================================================================
type MergeValues<T, U> = {
  [K in keyof (T & U)]: (T & U)[K];
};

// Pick ===========================================================================================
type MyPick<T, K extends keyof T> = {
    [key in K]: T[key]
}

// Modifiers ======================================================================================
type CreateMutable<Type> = {
  readonly [Property in keyof Type]: Type[Property]
  // -readonly [Property in keyof Type]: Type[Property]
  // +readonly [Property in keyof Type]: Type[Property]
  // [Property in keyof Type]?: Type[Property]
  // [Property in keyof Type]+?: Type[Property]
  // [Property in keyof Type]-?: Type[Property]
}

type ReadOnlyAnyObject = CreateMutable<AnyObject>
