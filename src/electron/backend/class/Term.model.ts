import { stringConverter } from "../database/table/converters.js";

const MUSICTERMTYPE = [
  "Tempo",
  "Technique",
  "Dynamic",
  "Chord",
  "Expression",
  "Others",
] as const;

type TermType = (typeof MUSICTERMTYPE)[number];

export class Term {
  public id: string;
  public term: string;
  public definition: string;
  public type: TermType;
  public notes?: string;

  constructor({
    id = "",
    term,
    definition,
    type,
    notes = "",
  }: {
    id?: string; //Allow for database to automatically add
    term: string;
    definition: string;
    type: TermType;
    notes?: string;
  }) {
    this.id = id;
    this.term = term;
    this.definition = definition;
    this.type = type;
    this.notes = notes;
  }

  public static validateAndCreate(obj: Omit<Term, "id">): Term {
    // if (!obj.name || !obj.composer || !obj.status || !obj.pieceType) {
    //   throw new Error("Missing Properties");
    // }
    // if (!STATUSES.includes(obj.status)) {
    //   //Exist but wrong
    //   throw new Error("Wrong Status");
    // }
    // if (obj.freqFrame && !FREQ_FRAME.includes(obj.freqFrame)) {
    //   //Exist but wrong
    //   throw new Error("Wrong freq_frame");
    // }

    // if (typeof obj.freqNumber !== "number") {
    //   throw new Error("Type error, FreqNumber");
    // }
    return new Term({ ...obj });
  }

  public static MusicTermConverter: Converter<TermType> = {
    fromDB(value: string): TermType {
      if ((MUSICTERMTYPE as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as TermType;
      }
      throw new Error(`TermType is not valid: ${value} is not TermType type`);
    },
    toDB(value: TermType): string {
      if (MUSICTERMTYPE.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }
      throw new Error(`TermType is not valid: ${value} is notTermType type`);
    },
  };

  public static schema: Schema<Term> = {
    IdPrefix: "M",
    converters: {
      id: stringConverter,
      term: stringConverter,
      definition: stringConverter,
      type: Term.MusicTermConverter,
      notes: stringConverter,
    },
  };
}
