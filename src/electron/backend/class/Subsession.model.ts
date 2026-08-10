import {
  dateConverter,
  numberConverter,
  stringArrayConverter,
  stringConverter,
} from "../database/table/converters.js";

import { Goal } from "./Goal.model.js";
import { Session } from "./Session.model.js";

export class Subsession implements SubsessionData {
  public id: string;
  public title: string;
  public time: number; //in minutes
  public maxTime: number; //in minutes
  public date: Date;
  public ratings: number; //out of 100%
  public reflections?: string;
  public goalIds?: string[]; //Foreign Key

  //Initialise to prepare for joining
  public goals?: Goal[] = [];

  //Initialise for reverse-joining
  public sessionId?: string;
  public sessions?: Session[];

  constructor({
    id = "",
    title,
    ratings = 0,
    time = 0,
    maxTime = 0,
    date = new Date(),
    reflections = "",
    goalIds = [], //Default to Others
  }: {
    id?: string;
    title: string;
    time?: number;
    ratings?: number;
    maxTime?: number;
    date?: Date;
    reflections?: string;
    goalIds?: string[];
  }) {
    //Everything is in string before conversion
    this.id = id ?? null;
    this.title = title;
    this.time = time;
    this.ratings = ratings;
    this.maxTime = maxTime;
    this.date = date;
    this.reflections = reflections;
    this.goalIds = goalIds;
  }

  public static validateAndCreate(obj: Omit<Subsession, "id">): Subsession {
    if (!obj.title || obj.time === null || !obj.maxTime) {
      console.log(obj);
      throw new Error("Missing Properties");
    }
    if (obj.date && isNaN(new Date(obj.date).getTime())) {
      throw new Error("date is not a number");
    }

    if (obj.ratings > 100 || obj.ratings < 0) {
      //Exist but wrong
      throw new Error("Ratings out of range");
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
      ratings: numberConverter,
      maxTime: numberConverter,
      date: dateConverter,
      reflections: stringConverter,
      goalIds: stringArrayConverter,
    },
  };
}
