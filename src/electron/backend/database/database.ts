import Table, { ForeignKey, TableModel } from "./table/table.js";
import { Piece } from "../class/Piece.model.js";
import { Resource } from "../class/Resource.model.js";
import { Term } from "../class/Term.model.js";
import { Goal } from "../class/Goal.model.js";
import { Subsession } from "../class/Subsession.model.js";
import { Session } from "../class/Session.model.js";

//--------Term--------
const termTable = new Table<Term>(
  ["id", "term", "definition", "type", "notes"] as const,
  "/term.csv",
  Term,
  "id",
  [],
);

//--------Goal--------
const goalTable = new Table<Goal>(
  ["id", "name", "status", "goalType", "notes", "ratings"],
  "/goal.csv",
  Goal,
  "id",
  [],
);

//--------Subsession--------
const subsessionTableForeignKeys: ForeignKey<Subsession, Goal>[] = [
  {
    key: "goalIds",
    referenceTable: goalTable,
    referenceTableKey: "id",
    newField: "goals",
  },
];

const subsessionTable = new Table<Subsession, [Goal]>(
  ["id", "title", "time", "maxTime", "startDate", "endDate", "goalIds", "reflections"],
  "/subsession.csv",
  Subsession,
  "id",
  subsessionTableForeignKeys,
);

//--------Session--------
const sessionTableForeignKeys: ForeignKey<Session, Subsession>[] = [
  {
    key: "subsessionIds",
    referenceTable: subsessionTable,
    referenceTableKey: "id",
    newField: "subsessions",
  },
];

const sessionTable = new Table<Session, [Subsession]>(
  ["id", "title", "structure", "notes", "subsessionIds"],
  "/session.csv",
  Session,
  "id",
  sessionTableForeignKeys,
);

//--------Resource--------

const resourceTable = new Table<Resource, [Piece]>(
  ["id", "resourceType", "resourceLink", "notes"],
  "/resource.csv",
  Resource,
  "id",
);

//--------Piece--------
const pieceTableForeignKeys: (
  | ForeignKey<Piece, Term>
  | ForeignKey<Piece, Goal>
  | ForeignKey<Piece, Resource>
)[] = [
  {
    key: "termIds",
    referenceTable: termTable,
    referenceTableKey: "id",
    newField: "terms",
  },
  {
    key: "goalIds",
    referenceTable: goalTable,
    referenceTableKey: "id",
    newField: "goals",
  },
  {
    key: "resourceIds",
    referenceTable: resourceTable,
    referenceTableKey: "id",
    newField: "resources",
  },
];
const pieceTable = new Table<Piece, [Term, Goal, Resource]>(
  [
    "id",
    "name",
    "composer",
    "status",
    "pieceType",
    "freqNumber",
    "freqFrame",
    "notes",
    "termIds",
    "goalIds",
    "resourceIds",
  ] as const,
  "/piece.csv",
  Piece,
  "id",
  pieceTableForeignKeys,
);

// ----------------
export class Database {
  private tables = {
    piece: pieceTable,
    resource: resourceTable,
    term: termTable,
    goal: goalTable,
    subsession: subsessionTable,
    session: sessionTable,
  };

  public getDb<K extends keyof typeof this.tables>(
    name: K,
  ): (typeof this.tables)[K] {
    return this.tables[name];
  }
}

export const db = new Database();
