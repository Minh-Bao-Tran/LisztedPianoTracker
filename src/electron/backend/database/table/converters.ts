import { STATUSES } from "../../class/Piece.model.js";

//----Primitive----
export const stringConverter: Converter<string> = {
  fromDB(value: string): string {
    const replacedString = value.replace(/&comma/g, ",");
    return replacedString;
  },
  toDB(value: string): string {
    const replacedString = value.replace(/,/g, "&comma"); //Change the character , to &comma as the , is used to split the string
    return replacedString;
  },
};

export const numberConverter: Converter<number> = {
  fromDB(value: string): number {
    const convertedValue: number = Number(value);

    if (Number.isNaN(convertedValue)) {
      //returns NaN
      throw new Error(`${value} is not a number`);
    }

    return convertedValue;
  },

  toDB(value: number): string {
    return value.toString();
  },
};

export const booleanConverter: Converter<boolean> = {
  fromDB(value: string): boolean {
    if (value.toLowerCase() === "true") {
      return true;
    }
    if (value.toLowerCase() === "false") {
      return false;
    }
    //Not a correct boolean value
    throw new Error(`Value ${value} is not a boolean`);
  },

  toDB(value: boolean): string {
    return value ? "true" : "false";
  },
};

//----Array----

export const stringArrayConverter: Converter<string[] | []> = {
  //foreign key stored in
  fromDB(stringedKey: string = ""): string[] | [] {
    if (stringedKey === "") {
      return [];
    }
    return stringedKey.trim().split(":");
  },
  toDB(keys: string[] | [] = []): string {
    if (keys.length === 0) {
      return "";
    }
    return keys.join(":");
  },
};

export const numberArrayConverter: Converter<number[]> = {
  fromDB(value: string = ""): number[] {
    return stringArrayConverter.fromDB(value).map((number) => {
      return numberConverter.fromDB(number);
    });
  },
  toDB(value: number[] = []): string {
    return stringArrayConverter.toDB(
      value.map((number) => numberConverter.toDB(number)),
    );
  },
};

//----Literal/Special----

export const statusConverter: Converter<Status> = {
  fromDB(value: string): Status {
    if ((STATUSES as readonly string[]).includes(value)) {
      //Has to widen STATUES types here to check
      return value as Status;
    }
    throw new Error(`Status is not valid: ${value} is not Status type`);
  },

  toDB(value: Status): string {
    if (STATUSES.includes(value)) {
      //Has to widen STATUES types here to check
      return value as string;
    }

    throw new Error(`Status is not valid: ${value} is not Status type`);
  },
};

export const dateConverter: Converter<Date> = {
  fromDB(value: string): Date {
    return new Date(value);
  },
  toDB(value: Date): string {
    return value.toISOString();
  },
};
