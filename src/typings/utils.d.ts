type IZindexClassList<Item extends string> = `zindex-${Item extends 'max' ? Item : `l${Item}`}`;

// zIndex 的 class 名称
declare type IZindexClass = IZindexClassList<ValueOf<RepeatArr<10>> | 'max'>;

declare type IAnyObject = Record<string, unknown>;

declare type ValueOf<T> = T extends { [K in keyof T]: infer V } ? V : never;

declare type OtherParameters<T extends (...args: any) => any> = T extends (f: any, ...args: infer P) => any ? P : never;

declare type MyOmit<T, K extends keyof T> = Omit<T, K>;

/** number 转成 string */
declare type NumToStr<Num extends number> = `${Num}`;

/** 构造指定长度、指定元素的数组 */
declare type BuildArray<Length extends number, Ele = unknown, Arr extends unknown[] = []> = Arr['length'] extends Length
  ? Arr
  : BuildArray<Length, Ele, [...Arr, Ele]>;

/** 利用数组做减法 */
declare type Subtract<Num1 extends number, Num2 extends number> = BuildArray<Num1> extends [
  ...arr1: BuildArray<Num2>,
  ...arr2: infer Rest,
]
  ? Rest['length']
  : never;

/** 构造从 1 到 Num 的字符串数组 */
declare type RepeatArr<Num extends number, ResultArr extends string[] = []> = Num extends 0
  ? ResultArr
  : RepeatArr<Subtract<Num, 1>, [NumToStr<Num>, ...ResultArr]>;

// #region 下划线转驼峰
type TWhiteSpace = '_';
type ConcatDash<S extends string> = `${TWhiteSpace}${S}`;
/**
 *  下划线转驼峰的类型
 */
declare type CamelCase<S extends string | number | symbol> = S extends `${infer L}${ConcatDash<infer M>}${infer R}`
  ? M extends TWhiteSpace
    ? `${L}${ConcatDash<CamelCase<ConcatDash<R>>>}`
    : M extends Uppercase<M>
      ? `${L}${ConcatDash<M>}${CamelCase<R>}`
      : `${L}${Uppercase<M>}${CamelCase<R>}`
  : S;

type IKey = string | number;
type IValue = IKey | boolean | object | undefined | null;

/**
 * 对象的通用类型
 */
declare type IDataObject = Record<IKey, IValue>;
/**
 * 下划线转驼峰的类型
 */
declare type ToSmallCamel<T extends IDataObject | object> = {
  [K in keyof T as CamelCase<K>]: T[K] extends object ? ToSmallCamel<T[K]> : T[K];
};

// #endregion

/** 将对象类型的某个key从可选改成必选 */
type ObjKeyToRequired<T extends Record<string, any>, key extends string> = T & {
  [Key in keyof T as Key extends key ? Key : never]-?: T[Key];
};

type IsUnion<T extends any, O = T> = T extends O ? ([O] extends [T] ? false : true) : never;

/**
 * UnionToIntersection<{ foo: string } | { bar: string }> =
 *  { foo: string } & { bar: string }.
 */
type UnionToIntersection<U> = (U extends unknown ? (arg: U) => 0 : never) extends (arg: infer I) => 0 ? I : never;

/**
 * LastInUnion<1 | 2> = 2.
 */
type LastInUnion<U> = UnionToIntersection<U extends unknown ? (x: U) => 0 : never> extends (x: infer L) => 0
  ? L
  : never;

/**
 * UnionToTuple<1 | 2> = [1, 2].
 */
type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never] ? [] : [...UnionToTuple<Exclude<U, Last>>, Last];

/** 展开 ts 类型 */
declare type Expand<T> = T extends object ? (T extends infer O ? { [K in keyof O]: Expand<O[K]> } : never) : T;

/**
 * 展开 ts 类型
 * @description 补充 Expand 无法处理「对象类型嵌套联合类型」的场景
 */
declare type Expand2<T> = IsUnion<T> extends true
  ? UnionToTuple<T>[number]
  : T extends infer O
    ? O extends object
      ? {
          [K in keyof O]: Expand2<O[K]>;
        }
      : O
    : never;
