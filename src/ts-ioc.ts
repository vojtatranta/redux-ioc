export type UnwrapFactoryMethods<T extends Record<string, (deps: any) => any>> = {
  [K in keyof T]: T[K] extends (deps: any) => any ? ReturnType<T[K]> : T[K];
};

export type InferInterface<T extends Record<string, any>> = T extends {
  _TYPED_METHOD_DEFINITIONS: infer D;
}
  ? D
  : {
      [K in keyof T as K extends `_${string}` ? never : K]: T[K];
    };

export const createTypedFactory =
  <Deps extends Record<string, (deps: any) => any> = {}>() =>
  <Config extends Record<string, (deps: UnwrapFactoryMethods<Deps>) => any>>(
    config: Config
  ): ((deps: UnwrapFactoryMethods<Deps>) => UnwrapFactoryMethods<Config>) & {
    _TYPED_METHOD_DEFINITIONS: Config;
  } => {
    const result = (deps: UnwrapFactoryMethods<Deps>) => {
      return Object.keys(config).reduce<UnwrapFactoryMethods<Config>>((acc, key) => {
        const typedKey = key as keyof Config;
        const implementation = config[typedKey](deps);
        (acc as any)[typedKey] = implementation;
        return acc;
      }, {} as UnwrapFactoryMethods<Config>);
    };

    result._TYPED_METHOD_DEFINITIONS = config;
    return result;
  };
