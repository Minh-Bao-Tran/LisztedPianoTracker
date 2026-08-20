// Subsession model: represents timed practice chunks where `time` is an array
// (history of loop times) so we can store multiple attempts per subsession in
// one CSV field and compute totals at runtime.
//Data Source: CSV File subsession.csv and user entered through GUI

import {
  dateConverter,
  numberArrayConverter,
  numberConverter,
  stringArrayConverter,
  stringConverter,
} from "../database/table/converters.js";

import { Goal } from "./Goal.model.js";
import { Session } from "./Session.model.js";

export class Subsession implements SubsessionData {
  public id: string;
  public title: string;
  public time: number[]; //in minutes
  public maxTime: number; //in minutes
  public date?: Date | undefined;
  public ratings: number; //out of 100%
  public reflections?: string;
  public goalIds?: string[]; //Foreign Key

  public totalTime?: number = 0;

  //Initialise to prepare for joining
  public goals?: Goal[] = [];

  //Initialise for reverse-joining
  public sessionId?: string;
  public sessions?: Session[];

  constructor({
    id = "",
    title,
    ratings = 0,
    time = [0],
    maxTime = 0,
    date = undefined,
    reflections = "",
    goalIds = [], //Default to Others
  }: {
    id?: string;
    title: string;
    time?: number[];
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

    this.totalTime = 0;
    for (const time of this.time) {
      this.totalTime += time;
    }
  }

  //Purpose: ensure the data is validated before allow creating the object
  public static validateAndCreate(obj: Omit<Subsession, "id">): Subsession {
    if (!obj.title || obj.time === null || !obj.maxTime) {
      console.log(obj);
      throw new Error("Missing Properties");
    }
    if (obj.date && isNaN(new Date(obj.date).getTime())) {
      console.log(obj);
      throw new Error("date is not a number");
    }

    if (obj.ratings > 100 || obj.ratings < 0) {
      //Exist but wrong
      throw new Error("Ratings out of range");
    }

    obj.totalTime = 0;

    for (const time of obj.time) {
      obj.totalTime += time;
    }

    if (obj.totalTime > obj.maxTime) {
      throw new Error("Logic Error: maxTime is less than time");
    }

    return new Subsession({ ...obj });
  }

  //----CONVERTERS----Purpose: Provide the Database instructions to convert Data from JS Obj to CSV
  //Support if the session is not finished
  public static undefinedlDateConverter: Converter<Date | undefined> = {
    //Data Source: CSV File
    fromDB(value: string): Date | undefined {
      if (value === "") {
        return undefined;
      }
      return dateConverter.fromDB(value);
    },

    //Data Source: Provided by user through GUI
    toDB(value: Date | undefined): string {
      if (!value) {
        return "";
      }
      return dateConverter.toDB(value);
    },
  };

  //----SCHEMA----
  //Purpose: Provide the information on data Conversion and ID generation
  public static schema: Schema<Subsession> = {
    IdPrefix: "B", //As S is already taken up by the Session
    converters: {
      id: stringConverter,
      title: stringConverter,
      time: numberArrayConverter,
      ratings: numberConverter,
      maxTime: numberConverter,
      date: Subsession.undefinedlDateConverter,
      reflections: stringConverter,
      goalIds: stringArrayConverter,
    },
  };
}
