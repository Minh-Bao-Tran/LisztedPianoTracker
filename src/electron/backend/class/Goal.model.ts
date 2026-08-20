// Goal model: simple primitive fields with optional reverse-joined `subsessions`.
// Ratings and dates are stored as primitives; `subsessions` are linked via
// ID arrays to keep CSV rows flat and conversion straightforward.
//Data Source: CSV File goal.csv and user entered through GUI

import {
  stringConverter,
  statusConverter,
  numberConverter,
} from "../database/table/converters.js";
import { STATUSES } from "../../shared/globalVars.js";
import { Subsession } from "./Subsession.model.js";
import { TableModel } from "../database/table/table.js";

const GOALTYPE = ["Dynamic", "Tempo", "Technique", "Expression", "Others"];

export class Goal implements TableModel, GoalData {
  public id: string;
  public name: string;
  public status: Status;
  public goalType?: GoalType;
  public notes?: string;
  public ratings: number; //percentage (0 - 100)

  public lastPractice?: Date | string;

  public subsessions?: Subsession[];
  constructor({
    id = "",
    name,
    status,
    goalType = "Others", //Default to Others
    notes = "",
    ratings = 0,
  }: {
    id?: string;
    name: string;
    status: Status;
    goalType?: GoalType;
    notes?: string;
    ratings?: number;
  }) {
    //Everything is in string before conversion
    this.id = id ?? null;
    this.name = name;
    this.status = status;
    this.goalType = goalType;
    this.notes = notes;
    this.ratings = ratings;
  }

  //Purpose: ensure the data is validated before allow creating the object
  public static validateAndCreate(obj: Omit<Goal, "id"> | Goal): Goal {
    if (!obj.name || !obj.status || !obj.goalType) {
      throw new Error("Missing Properties");
    }
    if (!STATUSES.includes(obj.status)) {
      //Exist but wrong
      throw new Error("Wrong Status");
    }
    if (!GOALTYPE.includes(obj.goalType)) {
      //Exist but wrong
      throw new Error("Wrong Goal Type");
    }
    if (obj.ratings > 100 || obj.ratings < 0) {
      //Exist but wrong
      throw new Error("Ratings out of range");
    }
    return new Goal({ ...obj });
  }

  //----CONVERTERS----
  //Purpose: Provide the Database instructions to convert Data from JS Obj to CSV
  public static goalTypeConverter: Converter<GoalType> = {
    //Data Source: CSV File
    fromDB(value: string): GoalType {
      if ((GOALTYPE as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as GoalType;
      }
      throw new Error(`GoalType is not valid: ${value} is not GoalType type`);
    },

    //Data Source: Provide by the user through the GUI, through the Controller
    toDB(value: GoalType): string {
      if (GOALTYPE.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }

      throw new Error(`GoalType is not valid: ${value} is not GoalTYpe type`);
    },
  };

  //----SCHEMA----
  //Purpose: Provide the information on data Conversion and ID generation
  public static schema: Schema<Goal> = {
    IdPrefix: "G",
    converters: {
      id: stringConverter,
      name: stringConverter,
      status: statusConverter,
      goalType: Goal.goalTypeConverter,
      notes: stringConverter,
      ratings: numberConverter,
    },
  };
}
