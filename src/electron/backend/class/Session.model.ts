// Session model: models a practice session referencing subsession IDs. Using an
// ID-array (`subsessionIds`) keeps the CSV representation compact and allows
// joining/mapping to full `Subsession` objects at runtime.
//Data Source: CSV File session.csv and user entered through GUI

import {
  numberConverter,
  stringArrayConverter,
  stringConverter,
} from "../database/table/converters.js";
import { Subsession } from "./Subsession.model.js";

const SESSION_STATUSES = ["Completed", "InProgress", "Active", "Planned"];

const SESSION_STRUCTURES = ["Blocked", "Interleaved", "Unstructured"] as const;

export class Session implements SessionData {
  public id: string;
  public title: string;
  public structure: SessionStructure;

  public status: SessionStatus;
  public currentIndex: number; // starts at 1
  //Invariance: if status = completed: numberOfLoops * subsessionIds.length = currentIndex
  public numberOfLoops: number;

  public notes?: string;
  public subsessionIds: string[]; //Required

  //Initialise to prepare for joining
  public subsessions?: Subsession[] | [] = [];

  constructor({
    id = "",
    title,
    structure,
    status = "Active",
    currentIndex = 1,
    numberOfLoops = 1,
    notes = "",
    subsessionIds = [],
  }: {
    id?: string;
    title: string;
    structure: SessionStructure;
    status?: SessionStatus;
    currentIndex?: number;
    numberOfLoops?: number;
    notes?: string;
    subsessionIds?: string[];
  }) {
    //Everything is in string before conversion
    this.id = id ?? null;
    this.title = title;
    this.structure = structure;

    this.status = status;
    this.currentIndex = currentIndex;
    this.numberOfLoops = numberOfLoops;

    this.notes = notes;
    this.subsessionIds = subsessionIds;
  }

  //Purpose: ensure the data is validated before allow creating the object
  public static validateAndCreate(obj: Omit<Session, "id">): Session {
    if (!obj.title || !obj.structure || !obj.subsessionIds) {
      console.log(obj);
      throw new Error("Missing Properties");
    }

    if (obj.status && !SESSION_STATUSES.includes(obj.status)) {
      throw new Error("Invalid Session Status");
    }

    if (obj.currentIndex && obj.currentIndex < 1) {
      throw new Error("Invalid Current Index");
    }
    if (obj.numberOfLoops && obj.numberOfLoops < 1) {
      throw new Error("Invalid numberOfLoops");
    }

    return new Session({ ...obj });
  }

  //----CONVERTERS----
  //Purpose: Provide the Database instructions to convert Data from JS Obj to CSV
  public static sessionStatusConverter: Converter<SessionStatus> = {
    //Data Source: CSV File
    fromDB(value: string): SessionStatus {
      if ((SESSION_STATUSES as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as Status;
      }
      throw new Error(
        `SessionStatus is not valid: ${value} is not SessionStatus type`,
      );
    },

    //Data Source: Provide by the user through the GUI, through the Controller
    toDB(value: SessionStatus): string {
      if (SESSION_STATUSES.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }

      throw new Error(
        `SessionStatus is not valid: ${value} is not SessionStatus type`,
      );
    },
  };

  public static sessionStructureConverter: Converter<SessionStructure> = {
    fromDB(value: string): SessionStructure {
      if ((SESSION_STRUCTURES as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as SessionStructure;
      }
      throw new Error(
        `SessionStructure is not valid: ${value} is not SessionStructure type`,
      );
    },

    toDB(value: SessionStructure): string {
      if (SESSION_STRUCTURES.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }

      throw new Error(
        `SessionStructure is not valid: ${value} is not SessionStructure type`,
      );
    },
  };

  //----SCHEMA----
  //Purpose: Provide the information on data Conversion and ID generation
  public static schema: Schema<Session> = {
    IdPrefix: "S",
    converters: {
      id: stringConverter,
      title: stringConverter,
      structure: Session.sessionStructureConverter,
      status: Session.sessionStatusConverter,
      currentIndex: numberConverter,
      numberOfLoops: numberConverter,
      subsessionIds: stringArrayConverter,
      notes: stringConverter,
    },
  };
}
