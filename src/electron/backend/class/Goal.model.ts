import {
  stringConverter,
  statusConverter,
  numberArrayConverter,
  numberConverter,
} from "../database/table/converters.js";
import { STATUSES } from "../../shared/globalVars.js";
import { Subsession } from "./Subsession.model.js";

const GOALTYPE = ["Dynamic", "Tempo", "Technique", "Expression", "Others"];

export class Goal implements GoalData {
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

  //Converters
  public static goalTypeConverter: Converter<GoalType> = {
    fromDB(value: string): GoalType {
      if ((GOALTYPE as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as GoalType;
      }
      throw new Error(`GoalType is not valid: ${value} is not GoalType type`);
    },

    toDB(value: GoalType): string {
      if (GOALTYPE.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }

      throw new Error(`GoalType is not valid: ${value} is not GoalTYpe type`);
    },
  };

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
