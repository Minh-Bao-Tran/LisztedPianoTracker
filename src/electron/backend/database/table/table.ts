//Purpose: A generalised module that handles data fetch and update requests. Uses the principle of Abstraction, where each Model must have certain properties inherited from interface ModelConstructor<T> in backend-types.d.ts

import { readAllCSV, writeCSV } from "../csv-storage/csv-util.js";
import { generateId } from "./table-util.js";

// ------------Type------------
export type ForeignKey<
  Model extends TableModel,
  ReferenceModel extends TableModel,
> = {
  key: Field<Model>; //Belongs to the list of Fields of the Model
  referenceTable: Table<ReferenceModel, any>;
  referenceTableKey: Field<ReferenceModel>;
  newField: string;
};
type ForeignKeys<
  Model extends TableModel,
  ReferenceModels extends TableModel[],
> = {
  [K in keyof ReferenceModels]: ForeignKey<Model, ReferenceModels[K]>; //Loop through the array, each reference model gets created a different available type
}[number][];

type Field<Model> = keyof Model & string;
type Fields<Model> = Field<Model>[]; // A fields must have be a class property and a string

export type TableModel = {
  id: string;
};

// ------------Class------------
export default class Table<
  Model extends TableModel,
  ReferenceModels extends TableModel[] = [],
> {
  public fields: Fields<Model>; //Must be an array
  public file: string;
  public primaryKey: Field<Model>; //One of the fields
  public foreignKeys: ForeignKeys<Model, ReferenceModels>; //foreign keys must be a list of
  public values: Model[];
  private model: ModelConstructor<Model>; //Only the Table would be able to access

  public usedIdSet: Set<string>; //private as this is metadata for the table to function

  public constructor(
    fields: Fields<Model>,
    file: string, //relative to wherever the constructor is called
    modelConstructor: ModelConstructor<Model>,
    primaryKey: Field<Model>,
    foreignKeys?: ForeignKeys<Model, ReferenceModels>, // Must be a list
  ) {
    this.fields = fields;
    this.file = file;
    this.primaryKey = primaryKey;
    this.foreignKeys = foreignKeys ?? [];
    this.model = modelConstructor;

    //Automatic
    this.values = this.convertFromDB(); //fetch data instantly
    try {
      this.validateForeignKeys();
    } catch (err) {
      throw err;
    }

    this.usedIdSet = this.getAllId();
    // this.values = null; //fetch data later
  }

  //------ID Related------
  public getAllId(): Set<string> {
    let id_list = new Set([]);
    for (const { id } of this.values) {
      //get id of each obj
      //Check id Prefix
      if (id[0] !== this.model.schema.IdPrefix) {
        throw new Error(
          `id: ${id} does not have the correct Prefix ${this.model.schema.IdPrefix}, in Table ${this.model.name}`,
        );
      }
      // @ts-ignore
      if (id_list.has(id)) {
        throw new Error(`Duplicate id: ${id} in Table ${this.model.name}`);
      }
      // @ts-ignore
      id_list.add(id);
    }
    return id_list;
  }

  public generateNewId(): string {
    //Loop through id number in the set until 1 that has not been used
    const prefix = this.model.schema.IdPrefix;
    let i = 0;
    let newId = generateId(prefix, i);

    while (this.usedIdSet.has(newId) && i <= this.usedIdSet.size + 2) {
      // fail safe if error has occured
      newId = generateId(prefix, i);

      i++;
    }
    if (i === this.usedIdSet.size + 2) {
      throw new Error(`Logic Error in generateNewId`);
    }
    return newId;
  }

  //------Database Handling------
  public fetch(): string[][] {
    //get data
    return readAllCSV(this.file);
  }

  public validateForeignKeys(values: Model[] = this.values): void {
    for (const { key, referenceTable, referenceTableKey } of this.foreignKeys) {
      //Go through each foreign key
      for (const obj of values) {
        for (const keyValue of obj[key] as []) {
          //Go through each foreign key of each value
          // const thisForeignKeyValue = obj[key]; //Get the value of the current Obj

          //Check type of foreignKey matchs
          if (typeof keyValue !== "string") {
            throw new Error(`ForeignKey: ${key} type is not string`);
          }

          const referencedObj = referenceTable.findOnePrimaryKey(keyValue);
          if (!referencedObj) {
            console.log(obj);
            //One of the ReferencedObj  does not exist
            throw new Error(
              `ForeignKey: ${key}, value: ${keyValue}, does not exist on Table: ${referenceTable.model.name}, TableKey: ${referenceTableKey}`,
            );
          }
        }
      }
    }
    //went through all foreign keys and value with no problem
  }

  public convertFromDB(): Model[] {
    const data = this.fetch();

    if (data[0][0] === '') return [];
    const referenceConverters: Schema<Model> = this.model.schema;

    return data.map((prevObj) => {
      const newObject: Record<string, unknown> = {}; //Only a temporary, unconverted values
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i];
        const prevValue = prevObj[i];
        newObject[field] =
          // @ts-ignore
          referenceConverters.converters[field].fromDB(prevValue);
      }

      //value conversion upon creating the object
      const obj: Model = this.model.validateAndCreate(newObject);

      return obj;
    });
  }

  public flattenObject(): string[] {
    //prepare to store to csv
    const referenceConverters: Schema<Model> = this.model.schema;
    const flattenedArray: string[] = this.values.map((obj) => {
      let flattendObj = [];

      for (const field of this.fields) {
        // @ts-ignore
        const columnData = referenceConverters.converters[field].toDB(
          obj[field],
        ); //convert to string
        flattendObj.push(columnData);
      }

      return flattendObj.join(",");
    });
    return flattenedArray;
  }

  public storeData(file = this.file) {
    const flattenedArray: string[] = this.flattenObject();
    writeCSV(file, flattenedArray);
  }

  //------Joining------

  public join(
    foreignKey: Field<Model>,
    values: Model[] = this.values,
  ): () => boolean {
    //Default to joining all values, however, it could also join given values

    if (this.foreignKeys.length === 0) {
      //Check if is actually joinable
      //no foreign Key to search
      throw new Error("Table has no Foreign Key");
    }
    // @ts-ignore
    const { referenceTable, referenceTableKey, newField } = (
      this.foreignKeys as ForeignKeys<Model, ReferenceModels>
    ).find((fKObj) => {
      return fKObj.key === foreignKey ? true : false;
    });

    if (!referenceTable) {
      //No foreign key with field found
      throw new Error(`Field ${foreignKey} is not a ForeignKey`);
    }

    for (const obj of values) {
      const foreignKeyIds = obj[foreignKey] as ReferenceModels[number][Field<
        ReferenceModels[number]
      >][];

      const joinedArray: ReferenceModels[number][] = [];

      for (const foreignKeyId of foreignKeyIds) {
        const joinedObj = referenceTable.findOne({
          [referenceTableKey]: foreignKeyId,
        } as Partial<Model>);
        if (!joinedObj) {
          //Not found
          // console.log(obj);
          throw new Error("Error? Fix this later by actually deleting the id");
        }

        joinedArray.push(joinedObj.obj);
      }
      // @ts-ignore
      obj[newField] = joinedArray;
    }
    return () => {
      return this.dejoin(newField);
    };
  }

  //call by the table that you want to
  public reverseJoin<parentTableModel extends TableModel>(
    parentTable: Table<parentTableModel, any>,
    newField: Field<Model>,
  ): () => boolean {
    //Check Relationship
    const relationship = parentTable.foreignKeys.find(
      (foreignKey: ForeignKey<any, any>) => {
        return foreignKey.referenceTable === this ? true : false;
      },
    );
    if (!relationship) {
      throw new Error(
        `Relationship does not exist between ${this.model.name} and ${parentTable.model.name}`,
      );
    }

    //check that field on object exist to append
    for (const obj of this.values) {
      //Loop through the
      // @ts-ignore
      const thisKeyValue = obj[relationship.referenceTableKey];
      const parentElements = parentTable.findManyPredicate(
        (parentElement, index, indexArray) => {
          if (
            (parentElement[relationship.key] as string[]).includes(thisKeyValue)
          ) {
            indexArray.push(index);
            return true;
          }
          return false;
        },
      );

      //@ts-ignore
      obj[newField] = parentElements;
    }

    return () => {
      return this.dejoin(newField);
    };
  }

  private dejoin(field: string) {
    //Go through each values of the table and delete the Joined fields

    this.values.map((obj) => {
      //@ts-ignore
      obj[field] = [];
    });

    return true;
  }

  //------CRUD Operations------ //Does not need error handling as the controller already handles these
  public findOne<K extends Field<Model>>(
    criteria: Partial<Pick<Model, K>>,
  ): IndexedObj<Model> | null {
    let targetObjIndex: number;

    const targetObj = this.values.find((obj, index) => {
      for (const field in criteria) {
        if (criteria[field] !== obj[field]) {
          return false;
        }
      }
      targetObjIndex = index;
      return true;
    });

    if (!targetObj) {
      //Return null if not found
      return null;
    }
    // @ts-ignore
    return { obj: targetObj, index: targetObjIndex };
  }

  //Returns an array as this allows multiple objects as the same kind to be found
  public findMany<K extends Field<Model>>(
    criteria: Partial<Pick<Model, K>> = {},
  ): IndexedObj<Model>[] | [] {
    //return an empty array if does not find
    // @ts-ignore
    let indexArray = [];
    const objArray = this.values.filter((obj, index) => {
      for (const field in criteria) {
        if (criteria[field] !== obj[field]) {
          return false;
        }
      }
      indexArray.push(index);
      return true;
    });

    const resultArray: IndexedObj<Model>[] = [];
    for (let i = 0; i < indexArray.length; i++) {
      resultArray.push({
        // @ts-ignore
        index: indexArray[i],
        obj: objArray[i],
      });
    }

    return resultArray;
  }

  public findOnePrimaryKey(value: string): IndexedObj<Model> | null {
    return this.findOne({ id: value });
  }

  public findManyPredicate(
    predicate: (
      obj: Model,
      index: number,
      returnIndexArray: number[], //Must push the index of each word into the array
    ) => boolean,
  ): Model[] {
    // @ts-ignore
    let indexArray = [];
    const objArray = this.values.filter((obj, index) => {
      // @ts-ignore
      return predicate(obj, index, indexArray);
    });

    return objArray;
  }

  public insertOne(obj: Omit<Model, "id">): string {
    //create new id
    const id = this.generateNewId();

    const newObj: Model = this.model.validateAndCreate({ ...obj, id: id });
    this.validateForeignKeys([newObj]);

    this.values.push(newObj);

    this.storeData();
    this.usedIdSet = this.getAllId(); //Update used id list

    return id; //Return id so that the controller knows which one is added
  }

  public insertMany(objArray: Omit<Model, "id">[]): string[] {
    //create new id
    const idList = [];
    const newObjList: Model[] = [];
    for (const obj of objArray) {
      const id = this.generateNewId();
      idList.push(id);

      let newObj = this.model.validateAndCreate({ ...obj, id: id });
      this.validateForeignKeys([newObj]);

      newObjList.push(newObj);
    }

    this.values.push(...newObjList);

    this.storeData();
    this.usedIdSet = this.getAllId(); //Update used id list

    return idList; //with the same sequence as the entered objs
  }

  public updateOne<K extends Field<Model>>(
    criteria: Partial<Pick<Model, K>>,
    updatingFields: Partial<Model>,
  ): Model {
    //Get the current obj

    let indexedObj: IndexedObj<Model> | null = this.findOne(criteria);
    if (!indexedObj) {
      console.log(criteria);
      throw new Error(`Object with id: ${criteria} does not exist on Table`);
    }
    //Object exist
    const newObj: Model = this.model.validateAndCreate({
      ...indexedObj.obj,
      ...updatingFields,
    });

    this.values[indexedObj.index] = newObj;
    this.storeData();
    return newObj;
  }

  public updateMany<K extends Field<Model>>(
    criteria: Partial<Pick<Model, K>>,
    updatingFields: Partial<Model>,
  ): ValidationResult {
    const newObjList = this.values.map((obj) => {
      for (const field in criteria) {
        if (criteria[field] !== obj[field]) {
          return obj;
        }
      }

      const newObj: Model = this.model.validateAndCreate({
        ...obj,
        ...updatingFields,
      });
      this.validateForeignKeys([newObj]);

      return newObj;
    });

    this.values = newObjList;

    this.storeData();

    return { valid: true, value: newObjList };
  }

  public updateArrayMany(
    arrayField: Field<Model>, //Field to modify
    modifyingValue: string | number, //Add this value if it is Push, remove this value if it is Splice
    pushOrPop: "Push" | "Splice",
    criteria: Partial<Model>, //Only works with Primitive Values
  ): Model[] {
    const newObjList = this.values.map((obj) => {
      return this.updateArrayHelper(
        obj,
        arrayField,
        modifyingValue,
        pushOrPop,
        criteria,
      );
    });

    this.validateForeignKeys(newObjList);

    this.values = newObjList;
    this.storeData();

    return newObjList;
  }

  private updateArrayHelper<Model>(
    obj: Model,
    arrayField: Field<Model>,
    modifyingValue: string | number, //Add this value if it is Push, remove this value if it is Splice
    pushOrPop: "Push" | "Splice",
    criteria: Partial<Model>, //Only works with Primitive Values
    index?: number,
  ): Model {
    for (const field in criteria) {
      if (obj[field] !== criteria[field]) {
        return obj; //Not map if does not have correct criteria
      }
    }
    const array = obj[arrayField] as Array<string | number>;

    if (pushOrPop === "Push") {
      if (array.includes(modifyingValue)) {
        console.log(obj);
      }

      //Success
      array.push(modifyingValue);
    }
    if (pushOrPop === "Splice") {
      if (array.includes(modifyingValue)) {
        array.splice(array.indexOf(modifyingValue), 1);
      }
    }

    return obj;
  }

  public deleteOne<
    K extends Field<Model>,
    parentTableModel extends Table<any, any>,
  >(
    criteria: Partial<Pick<Model, K>>,
    parentTables: parentTableModel[],
  ): boolean {
    const deletingObj = this.findOne(criteria);
    if (!deletingObj) {
      console.log(criteria);
      throw new Error("No object with criteria found");
    }
    //Obj found to be deleted. needs to reverse look up to find the ids associated with it
    const objId = deletingObj.obj.id;
    for (const parentTable of parentTables) {
      for (const { key, referenceTable } of parentTable.foreignKeys) {
        if (referenceTable === this) {
          //Correct relationship
          parentTable.updateArrayMany(key, objId, "Splice", {});
          parentTable.storeData();
        }
      }
    }

    this.values.splice(deletingObj.index, 1);
    this.storeData();

    return true;
  }
}
