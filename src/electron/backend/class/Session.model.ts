import {
  stringArrayConverter,
  stringConverter,
} from "../database/table/converters.js";
import { Subsession } from "./Subsession.model.js";

const SESSIONSTRUCTURE = ["Blocked", "Interleaved", "Unstructured"] as const;

type SessionStructure = (typeof SESSIONSTRUCTURE)[number];

export class Session implements SessionData{
  public id: string;
  public title: string;
  public structure: SessionStructure;
  public notes?: string;
  public subsessionIds: string[]; //Required

  //Initialise to prepare for joining
  public subsessions?: Subsession[] | [] = [];

  constructor({
    id = "",
    title,
    structure,
    notes = "",
    subsessionIds = [],
  }: {
    id?: string;
    title: string;
    structure: SessionStructure;
    notes?: string;
    subsessionIds?: string[];
  }) {
    //Everything is in string before conversion
    this.id = id ?? null;
    this.title = title;
    this.structure = structure;
    this.notes = notes;
    this.subsessionIds = subsessionIds;
  }

  public static validateAndCreate(obj: Omit<Session, "id">): Session {
    if (!obj.title || !obj.structure || obj.subsessionIds) {
    }
    return new Session({ ...obj });
  }

  //Converters
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
      subsessionIds: stringArrayConverter,
      notes: stringConverter,
    },
  };
}
