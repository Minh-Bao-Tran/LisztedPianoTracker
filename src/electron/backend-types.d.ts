
interface ModelConstructor<T> {
  new (...args: any): T; // This is needed to define that the callback so that class Table can create objects with the wanted classes
  schema: Schema<T>;
  validateAndCreate(...arg: any): T;
}

type Primitive = string | number | boolean;


type Converter<Type> = {
  fromDB(value: string): Type;
  toDB(value: Type): string;
};

type Schema<Model> = {
  // Go through each key, Gets its value and enforce that a converter must converts from the defined type to string
  IdPrefix: string;
  converters: { [Key in keyof Model]?: Converter<Model[Key]> };
};

type IndexedObj<Model> = {
  obj: Model;
  index: number;
};
