import { createTypedFactory, InferInterface } from '../ts-ioc';

const dependencyLessFac = createTypedFactory();

const dependencyLess = dependencyLessFac({
  multiply: () => (multiX: number) => multiX * 10,
  rebase: () => (muliRebs: number) => muliRebs * 10,
});
const other = dependencyLessFac({
  other: () => (str: string) => str + 'ahoj',
});

const withMultipleDepFac = createTypedFactory<
  InferInterface<typeof dependencyLess> & InferInterface<typeof other>
>();
const withMultipleDep = withMultipleDepFac({
  substract:
    ({ multiply, rebase }) =>
    (x: number) =>
      multiply(x) - 2 + rebase(x),

  test:
    ({ multiply, rebase, other }) =>
    (x: number) =>
      multiply(x) * 2 + rebase(x) + other(''),
});

const withOneDepFac = createTypedFactory<InferInterface<typeof other>>();
const withOneDep = withOneDepFac({
  multiply:
    ({ other }) =>
    (multiX: number) =>
      multiX * 10 + other(''),
});

const withImplementedOnDep = withOneDep({
  other: (str: string) => str + 'ahoj',
});

const withOneOtherDepFac = createTypedFactory<InferInterface<typeof withOneDep>>();
const withOneOtherDep = withOneOtherDepFac({
  something:
    ({ multiply }) =>
    (str: string) =>
      multiply(12) + 'ahoj' + str,
});

const multipleDefService = withOneOtherDep(withImplementedOnDep).something('cau po ahoj');

// // ✅ Usage Exampl
// const definedMultiplyDeps = createDefined<
//   typeof withMultipleDep.definition & typeof other.definition
// >();

// const defined = definedMultiplyDeps({
//   add:
//     ({ substract, other }) =>
//     (x: number) =>
//       x + substract(x) + other(""),
// });

// // ✅ `.add` is now correctly inferred as `(x: number) => number`
// const result = defined({
//   substract: (x: number) => x * 2,
//   other: (str: string) => str + "ahoj",
//   test: (x: number) => `${x * 2}`,
// }).add(5);
// // console.log(result); // Expected output: 5 + (5 * 2) = 15
