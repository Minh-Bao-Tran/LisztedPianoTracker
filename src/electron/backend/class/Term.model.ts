// Term model: small, developer-provided dataset of music terms stored as CSV.
// Types are narrow (string literals) to validate values during CSV conversion
// and prevent invalid developer-provided entries.
//Data Source: CSV File term.csv / chosen 50 terms from ABRSM and GUI input

import { stringConverter } from "../database/table/converters.js";

const MUSIC_TERM_TYPES = [
  "Tempo",
  "Technique",
  "Dynamic",
  "Chord",
  "Expression",
  "Others",
] as const;

type TermType = (typeof MUSIC_TERM_TYPES)[number];

export class Term implements TermData {
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
    //Terms does not need validation as its data source is entered by the developer
    return new Term({ ...obj });
  }

  //----CONVERTERS----Purpose: Provide the Database instructions to convert Data from JS Obj to CSV
  public static MusicTermTypeConverter: Converter<TermType> = {
    //Data Source: CSV File / developer entered 50 terms from a list of ABRSM term
    fromDB(value: string): TermType {
      if ((MUSIC_TERM_TYPES as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as TermType;
      }
      throw new Error(`TermType is not valid: ${value} is not TermType type`);
    },

    //Data Source: Provided by user through GUI
    toDB(value: TermType): string {
      if (MUSIC_TERM_TYPES.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }
      throw new Error(`TermType is not valid: ${value} is notTermType type`);
    },
  };

  //----SCHEMA----
  //Purpose: Provide the information on data Conversion and ID generation
  public static schema: Schema<Term> = {
    IdPrefix: "M",
    converters: {
      id: stringConverter,
      term: stringConverter,
      definition: stringConverter,
      type: Term.MusicTermTypeConverter,
      notes: stringConverter,
    },
  };
}
