import { Resource } from "../class/Resource.model.js";
import { Piece } from "../class/Piece.model.js";

import { db } from "../database/database.js";
export default class ResourceController {
  public getResourceById(
    _: any,
    resourceId: string,
  ): IndexedObj<Resource> | null {
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
    // @ts-ignore
    return piece.resources;
  }

  public addResource(
    _: any,
    { pieceId, resource }: { pieceId: string; resource: Omit<Resource, "id"> },
  ) {
    //Get Piece
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

    return true;
  }

  public updateResource(
    _: any,
    criteria: Partial<Pick<Resource, keyof Resource>>,
    updatingFields: Partial<Resource>,
  ): boolean {
    try {
      db.getDb("resource").updateOne(criteria, updatingFields);
    } catch (err) {
      throw err;
    }
    return true;
  }

  public deleteResource(_: any, resourceId: Resource["id"]) {
    try {
      const pieceTable = db.getDb("piece");
      db.getDb("resource").deleteOne({ id: resourceId }, [pieceTable]);
    } catch (err) {
      throw err;
    }
    return true;
  }
}
