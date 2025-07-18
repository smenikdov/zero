type Tuple = ['a', 'b', 'c']

// Indexed access =================================================================================
type A = Tuple[0]
type A = Tuple[-1]
type Length = Tuple['length'];
type ABC = Tuple[number];

// Spread =========================================================================================
type Tuple2 = ['e', 'g']
type Tuple3 = [...Tuple, ...Tuple2, 'c']

// VS array =======================================================================================
const args = [8, 5];
// const args: [number, number] = [8, 5];
const angle = Math.atan2(...args);

// Head ===========================================================================================
type Head<T extends any[]> = T extends [infer H, ...any] ? H : never;
type First = Head<Tuple>;

// Tail ===========================================================================================
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : [];
type Rest = Tail<Tuple>;

// Mapping ========================================================================================
type MapTuple<T extends any[], F extends (x: any) => any> = {
  [K in keyof T]: F extends (x: T[K]) => infer R ? R : never;
};
type Mapped = MapTuple<Tuple, (x: any) => string>;

// Utility types ==================================================================================
type Picked = Pick<Tuple, 0 | 1>;
type ReadonlyTuple = Readonly<Tuple>;
// type Omitted = Omit<Tuple, 1>; // not working

// Tuple to union =================================================================================
type TupleToUnion<T extends any[]> = T[number];
type Union = TupleToUnion<Tuple>;
