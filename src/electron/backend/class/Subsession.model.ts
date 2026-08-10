import {
  dateConverter,
  numberConverter,
  stringArrayConverter,
  stringConverter,
} from "../database/table/converters.js";

import { Goal } from "./Goal.model.js";
import { Session } from "./Session.model.js";

export class Subsession {
  public id: string;
  public title: string;
  public time: number; //in minutes
  public maxTime: number; //in minutes
  public startDate?: Date | null;
  public endDate?: Date | null;
  public reflections?: string;
  public goalIds?: string[]; //Foreign Key

  //Initialise to prepare for joining
  public goals?: Goal[] = [];

  //Initialise for reverse-joining
  public sessions?: Session[];

  constructor({
    id = "",
    title,
    time = 0,
    maxTime = 0,
    startDate = null,
    endDate = null,
    reflections = "",
    goalIds = [], //Default to Others
  }: {
    id?: string;
    title: string;
    time?: number;
    maxTime?: number;
    startDate?: Date | null;
    endDate?: Date | null;
    reflections?: string;
    goalIds?: string[];
  }) {
    //Everything is in string before conversion
    this.id = id ?? null;
    this.title = title;
    this.time = time;
    this.maxTime = maxTime;
    this.startDate = startDate;
    this.endDate = endDate;
    this.reflections = reflections;
    this.goalIds = goalIds;
  }

  public static validateAndCreate(obj: Omit<Subsession, "id">): Subsession {
    if (!obj.title || obj.time === null || !obj.maxTime) {
      console.log(obj);
      throw new Error("Missing Properties");
    }
    if (obj.startDate && isNaN(new Date(obj.startDate).getTime())) {
      throw new Error("Start Date is not a number");
    }

    if (obj.endDate && isNaN(new Date(obj.endDate).getTime())) {
      throw new Error("End Date is not a number");
    }

    if (obj.time > obj.maxTime) {
      throw new Error("Logic Error: maxTime is less than time");
    }

    return new Subsession({ ...obj });
  }

  public static nullDateConverter: Converter<Date | null> = {
    //Support if the session is not finished
    fromDB(value: string): Date | null {
      if (value === "") {
        return null;
      }
      return dateConverter.fromDB(value);
    },
    toDB(value: Date | null): string {
      if (!value) {
        return "";
      }
      return dateConverter.toDB(value);
    },
  };

  public static schema: Schema<Subsession> = {
    IdPrefix: "B", //As S is already taken up by the Session
    converters: {
      id: stringConverter,
      title: stringConverter,
      time: numberConverter,
      maxTime: numberConverter,
      startDate: Subsession.nullDateConverter,
      endDate: Subsession.nullDateConverter,
      reflections: stringConverter,
      goalIds: stringArrayConverter,
    },
  };
}
