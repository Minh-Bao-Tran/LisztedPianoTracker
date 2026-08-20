import { Resource } from "../class/Resource.model.js";
import { Piece } from "../class/Piece.model.js";

import { db } from "../database/database.js";
// ResourceController: CRUD wrapper for `Resource` and helpers to link
// resource ID arrays on `Piece` objects; keeps CSV-backed storage flat.
export default class ResourceController {
  public getResourceById(resourceId: string): IndexedObj<Resource> | null {
    try {
      return db.getDb("resource").findOnePrimaryKey(resourceId);
    } catch (err) {
      throw err;
    }
  }

  public getAllPieceResources(pieceId: string): Resource[] {
    let piece: Piece;
    try {
      //Join Piece with Resource
      db.getDb("piece").join("resourceIds");
      //Get Piece
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
    // `resources` is injected by `Table.join`
    // @ts-ignore
    return piece.resources;
  }

  public addResource({
    pieceId,
    resource,
  }: {
    pieceId: string;
    resource: Omit<Resource, "id">;
  }): string {
    //Get Piece
    // `findOnePrimaryKey` returns runtime-shaped data
    // @ts-ignore
    const returnedPieceObj: IndexedObj<Piece> = db
      .getDb("piece")
      .findOnePrimaryKey(pieceId);

    if (!returnedPieceObj) {
      throw new Error("No object Found");
    }

    //create new goal obj
    let newResourceId: string;
    try {
      newResourceId = db.getDb("resource").insertOne(resource);
    } catch (err) {
      throw err;
    }

    try {
      db.getDb("piece").updateArrayMany("resourceIds", newResourceId, "Push", {
        id: returnedPieceObj.obj.id,
      });
    } catch (err) {
      throw err;
    }

    return newResourceId;
  }

  public updateResource({
    updateCriteria,
    updatingFields,
  }: {
    updateCriteria: Partial<Pick<ResourceData, keyof ResourceData>>;
    updatingFields: Partial<ResourceData>;
  }): true {
    try {
      db.getDb("resource").updateOne(updateCriteria, updatingFields);
    } catch (err) {
      throw err;
    }
    return true;
  }

  public deleteResource(resourceId: string): true {
    try {
      const pieceTable = db.getDb("piece");
      db.getDb("resource").deleteOne({ id: resourceId }, [pieceTable]);
    } catch (err) {
      throw err;
    }
    return true;
  }
}
