import { Term } from "../class/Term.model.js";
import { Piece } from "../class/Piece.model.js";

import { db } from "../database/database.js";
// TermController: provides access to a small developer-maintained term
// dataset and links terms to pieces using ID arrays for compact storage.
export default class TermController {
  public getAllTerms(): Term[] {
    try {
      return db
        .getDb("term")
        .findMany({})
        .map((indexedTerm) => indexedTerm.obj);
    } catch (err) {
      throw err;
    }
  }

  public getTermById(termId: string): IndexedObj<Term> | null {
    try {
      return db.getDb("term").findOnePrimaryKey(termId);
    } catch (err) {
      throw err;
    }
  }

  public getAllPieceTerms(pieceId: string): Term[] {
    let piece: Piece;
    try {
      //Join Piece with Term
      db.getDb("piece").join("termIds");
      //Get Piece
      // `findOnePrimaryKey` returns runtime data
      // @ts-ignore
      const returnedPieceObj: IndexedObj<Piece> = db
        .getDb("piece")
        .findOnePrimaryKey(pieceId);

      if (!returnedPieceObj) {
        throw new Error("No object Found");
      }

      piece = returnedPieceObj.obj;
    } catch (err) {
      throw err;
    }
    // `terms` is injected at runtime by `Table.join`
    // @ts-ignore
    return piece.terms;
  }

  public addTerm(
    { pieceId, term }: { pieceId: string | null; term: Omit<Term, "id"> },
  ): boolean {
    let newTermId: string;
    try {
      newTermId = db.getDb("term").insertOne(term);
    } catch (err) {
      throw err;
    }

    //Get Piece
    let returnedPieceObj: IndexedObj<Piece>;
    if (pieceId) {
      //term can be added without piece
      // `findOnePrimaryKey` returns runtime-shaped object; silence TS here.
      // @ts-ignore
      returnedPieceObj = db.getDb("piece").findOnePrimaryKey(pieceId);
      if (!returnedPieceObj) {
        throw new Error("No object Found");
      }
      //create new goal obj
      try {
        db.getDb("piece").updateArrayMany("termIds", newTermId, "Push", {
          id: returnedPieceObj.obj.id,
        });
      } catch (err) {
        throw err;
      }
    }

    return true;
  }

  public linkTermToPiece({
    pieceId,
    termId,
  }: {
    pieceId: string;
    termId: string;
  }): true {
    //Get Piece
    let returnedPieceObj: IndexedObj<Piece>;
    //term can be added without piece
    try {
      // `findOnePrimaryKey` returns runtime-shaped object
      // @ts-ignore
      returnedPieceObj = db.getDb("piece").findOnePrimaryKey(pieceId);
      if (!returnedPieceObj) {
        throw new Error("No Piece object Found");
      }
    } catch (err) {
      throw err;
    }

    //Get Term
    try {
      let returnedTermObj: IndexedObj<Term>;
      // `findOnePrimaryKey` returns runtime-shaped object
      // @ts-ignore
      returnedTermObj = db.getDb("term").findOnePrimaryKey(termId);
      if (!returnedTermObj) {
        throw new Error("No Term object Found");
      }
    } catch (err) {
      throw err;
    }

    try {
      db.getDb("piece").updateArrayMany("termIds", termId, "Push", {
        id: returnedPieceObj.obj.id,
      });
    } catch (err) {
      throw err;
    }
    return true;
  }

  public unlinkTermFromPiece({
    pieceId,
    termId,
  }: {
    pieceId: string;
    termId: string;
  }): true {
    // ???????????????????Maybe check the term to be present in piece before removing

    //Get Piece
    let returnedPieceObj: IndexedObj<Piece>;
    //term can be added without piece
    try {
      // @ts-ignore
      returnedPieceObj = db.getDb("piece").findOnePrimaryKey(pieceId);
      if (!returnedPieceObj) {
        throw new Error("No Piece object Found");
      }
    } catch (err) {
      throw err;
    }

    //Get Term
    try {
      let returnedTermObj: IndexedObj<Term>;
      // @ts-ignore
      returnedTermObj = db.getDb("term").findOnePrimaryKey(termId);
      if (!returnedTermObj) {
        throw new Error("No Term object Found");
      }
    } catch (err) {
      throw err;
    }

    try {
      db.getDb("piece").updateArrayMany("termIds", termId, "Splice", {
        id: returnedPieceObj.obj.id,
      });
    } catch (err) {
      throw err;
    }
    return true;
  }

  public updateTerm(
    criteria: Partial<Pick<Term, keyof Term>>,
    updatingFields: Partial<Term>,
  ): boolean {
    try {
      db.getDb("term").updateOne(criteria, updatingFields);
    } catch (err) {
      throw err;
    }
    return true;
  }

  public deleteTerm(_: any, termId: Term["id"]) {
    try {
      const pieceTable = db.getDb("piece");
      db.getDb("term").deleteOne({ id: termId }, [pieceTable]);
    } catch (err) {
      throw err;
    }
    return true;
  }
}
