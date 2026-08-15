import {
  numberConverter,
  statusConverter,
  stringArrayConverter,
  stringConverter,
} from "../database/table/converters.js";
import { STATUSES } from "./Piece.model.js";
import { Subsession } from "./Subsession.model.js";

const SESSIONSTATUSES = ["Completed", "InProgress", "Active", "Planned"];

const SESSIONSTRUCTURE = ["Blocked", "Interleaved", "Unstructured"] as const;

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

  // public findCurrentSubsession(){
  //   return this.currentIndex % this.subsessionIds.length
  // }

  public static validateAndCreate(obj: Omit<Session, "id">): Session {
    if (!obj.title || !obj.structure || !obj.subsessionIds) {
      console.log(obj);
      throw new Error("Missing Properties");
    }

    if (obj.status && !SESSIONSTATUSES.includes(obj.status)) {
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

  //Converters
  public static sessionStatusConverter: Converter<SessionStatus> = {
    fromDB(value: string): SessionStatus {
      if ((SESSIONSTATUSES as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as Status;
      }
      throw new Error(
        `SessionStatus is not valid: ${value} is not SessionStatus type`,
      );
    },

    toDB(value: SessionStatus): string {
      if (SESSIONSTATUSES.includes(value)) {
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
      if ((SESSIONSTRUCTURE as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as SessionStructure;
      }
      throw new Error(
        `SessionStructure is not valid: ${value} is not SessionStructure type`,
      );
    },

    toDB(value: SessionStructure): string {
      if (SESSIONSTRUCTURE.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }

      throw new Error(
        `SessionStructure is not valid: ${value} is not SessionStructure type`,
      );
    },
  };

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
