//Purpose: To act as the blueprint for creating Resource objects. Making handling data relating to Resource Easier
// Providing the database with the schema to convert CSV file to Resource Object.

//Data Source: CSV File resource.csv and user entered through GUI

import {
  stringConverter,
} from "../database/table/converters.js";
import { TableModel } from "../database/table/table.js";

const RESOURCE_TYPES = [
  "Sheet Music",
  "Recording",
  "Guides",
  "Others",
] as const;

export class Resource implements TableModel, ResourceData {
  public id: string;
  public resourceType: ResourceType;
  public notes?: string;
  public resourceLink: string; //Validation needed for checking link works

  constructor({
    id = "",
    resourceType,
    notes = "",
    resourceLink,
  }: {
    id?: string;
    resourceType: ResourceType;
    notes?: string;
    resourceLink: string;
  }) {
    this.id = id;
    this.resourceType = resourceType;
    this.notes = notes;
    this.resourceLink = resourceLink;
  }

  //Purpose: ensure the data is validated before allow creating the object
  public static validateAndCreate(obj: Omit<Resource, "id">): Resource {
    if (!obj.resourceType || !obj.resourceLink) {
      throw new Error("Missing Properties");
    }
    if (!RESOURCE_TYPES.includes(obj.resourceType)) {
      //Exist but wrong
      throw new Error("Wrong Status");
    }
    return new Resource({ ...obj });
  }

  //----CONVERTERS----
  //Purpose: Provide the Database instructions to convert Data from JS Obj to CSV
  public static resourceConverter: Converter<ResourceType> = {
    //Data Source: CSV File
    fromDB(value: string): ResourceType {
      if ((RESOURCE_TYPES as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as ResourceType;
      }
      throw new Error(
        `ResourceType is not valid: ${value} is not ResourceType type`,
      );
    },

    //Data Source: Provide by the user through the GUI, through the Controller
    toDB(value: ResourceType): string {
      if (RESOURCE_TYPES.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }
      throw new Error(
        `ResourceType is not valid: ${value} is not ResourceType type`,
      );
    },
  };

  //----SCHEMA----
  //Purpose: Provide the information on data Conversion and ID generation
  public static schema: Schema<Resource> = {
    IdPrefix: "R",
    converters: {
      id: stringConverter,
      resourceType: Resource.resourceConverter,
      notes: stringConverter,
      resourceLink: stringConverter, //Validation needed for checking link works
    },
  };
}
