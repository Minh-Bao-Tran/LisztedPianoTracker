
interface ModelConstructor<T> {
  new (...args: any): T; // used for runtime instantiation inside `Table`
  schema: Schema<T>;
  validateAndCreate(...arg: any): T;
}

type Primitive = string | number | boolean;


// Converter: transforms between CSV string representation and the typed value
// used in the model. Implementations must handle primitive types and also
// complex fields (arrays, nested ids) as the application expects.
type Converter<Type> = {
  fromDB(value: string): Type;
  toDB(value: Type): string;
};

type Schema<Model> = {
  IdPrefix: string;
  converters: { [Key in keyof Model]?: Converter<Model[Key]> };
};

type IndexedObj<Model> = {
  obj: Model;
  index: number;
};
