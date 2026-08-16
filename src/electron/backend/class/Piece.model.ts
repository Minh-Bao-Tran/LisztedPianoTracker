import {
  numberConverter,
  stringArrayConverter,
  stringConverter,
  statusConverter,
} from "../database/table/converters.js";
import { TableModel } from "../database/table/table.js";
import { Goal } from "./Goal.model.js";
import { Resource } from "./Resource.model.js";
import { Term } from "./Term.model.js";
import { Subsession } from "./Subsession.model.js";

export const STATUSES = ["Active", "Completed", "Planned"] as const;

const PIECETYPES = [
  "Performance",
  "Technical",
  "Scale/Arpeggio",
  "Sight Reading",
  "Improvisation",
  "Others",
] as const;

const FREQ_FRAME = ["week", "fortnight", "month"] as const;

export class Piece implements TableModel, PieceData {
  public id: string;
  public name: string;
  public composer: string;
  public status: Status;
  public pieceType: PieceType;

  public freqNumber?: number;
  public freqFrame?: FreqFrame;
  public notes?: string;
  public totalTime?: number; //In minutes
  public termIds?: string[]; //Foreign Key
  public goalIds?: string[]; //Foreign Key
  public resourceIds?: string[]; //Foreign Key

  //Initialise to prepare for joining
  public terms?: Term[] = [];
  public goals?: Goal[] = [];
  public resources?: Resource[] = [];

  constructor({
    id = "",
    name,
    composer,
    status,
    pieceType = "Others", //Default to Others
    freqNumber = 0,
    freqFrame = "week",
    notes = "",
    termIds = [],
    goalIds = [],
    resourceIds = [],
  }: {
    id?: string;
    name: string;
    composer: string;
    status: Status;
    pieceType: PieceType;
    freqNumber?: number;
    freqFrame?: FreqFrame;
    notes?: string;
    termIds?: string[];
    goalIds?: string[];
    resourceIds?: string[];
  }) {
    //Everything is in string before conversion
    this.id = id ?? null;
    this.name = name;
    this.composer = composer;
    this.status = status;
    this.pieceType = pieceType;
    this.freqNumber = freqNumber; // frequency, the number part in 5 per month
    this.freqFrame = freqFrame;
    this.notes = notes;
    this.termIds = termIds;
    this.goalIds = goalIds;
    this.resourceIds = resourceIds;
  }

  public findLastPractice(): Goal | null {
    //Check join
    if (this.goals === undefined || this.goals.length === 0) {
      return null
    }
    this.goals as Goal[];

    //Sort within Goal
    const filteredGoal = this.goals.filter((goal) => {
      //Check join for subsessions
      if (goal.subsessions === undefined || goal.subsessions.length === 0) {
        return false;
      }
      return true;
    });

    let currentLatestGoal: Goal = filteredGoal[0];

    for (const goal of filteredGoal) {
      let currentLatestDate: Date = new Date(0);

      for (const subsession of goal.subsessions as Subsession[]) {
        if (!subsession.date) {
          continue;
        }

        if (subsession.date.getTime() > currentLatestDate.getTime()) {
          currentLatestDate = subsession.date;
        }
      }

      goal.lastPractice = currentLatestDate;

      if (
        goal.lastPractice.getTime() >
        (currentLatestGoal.lastPractice as Date).getTime()
      ) {
        currentLatestGoal = goal;
      }
    }

    return currentLatestGoal
  }

  public static validateAndCreate(obj: Omit<Piece, "id"> | Piece): Piece {
    if (!obj.name || !obj.composer || !obj.status || !obj.pieceType) {
      throw new Error("Missing Properties");
    }
    if (!STATUSES.includes(obj.status)) {
      //Exist but wrong
      throw new Error("Wrong Status");
    }
    if (obj.freqFrame && !FREQ_FRAME.includes(obj.freqFrame)) {
      //Exist but wrong
      throw new Error("Wrong freq_frame");
    }

    if (typeof obj.freqNumber !== "number") {
      throw new Error("Type error, FreqNumber");
    }
    return new Piece({ ...obj });
  }

  //Converters
  public static pieceTypeConverter: Converter<PieceType> = {
    fromDB(value: string): PieceType {
      if ((PIECETYPES as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as PieceType;
      }
      throw new Error(`PieceType is not valid: ${value} is not PieceType type`);
    },

    toDB(value: PieceType): string {
      if (PIECETYPES.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }

      throw new Error(`PieceType is not valid: ${value} is not PieceType type`);
    },
  };

  public static freqFrameConverter: Converter<FreqFrame> = {
    fromDB(value: string): FreqFrame {
      if ((FREQ_FRAME as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as FreqFrame;
      }
      throw new Error(`FreqFrame is not valid: ${value} is not FreqFrame type`);
    },

    toDB(value: FreqFrame): string {
      if (FREQ_FRAME.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }

      throw new Error(`PieceType is not valid: ${value} is not PieceType type`);
    },
  };

  public static schema: Schema<Piece> = {
    IdPrefix: "P",
    converters: {
      id: stringConverter,
      name: stringConverter,
      composer: stringConverter,
      status: statusConverter,
      pieceType: Piece.pieceTypeConverter,
      freqNumber: numberConverter,
      freqFrame: Piece.freqFrameConverter,
      notes: stringConverter,
      termIds: stringArrayConverter,
      goalIds: stringArrayConverter,
      resourceIds: stringArrayConverter,
    },
  };
}
