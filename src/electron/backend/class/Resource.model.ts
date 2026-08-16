import { stringConverter, stringArrayConverter } from "../database/table/converters.js";

const RESOURCETYPE = [
  "Sheet Music",
  "Recording",
  "Guides",
  "Others",
] as const;

export class Resource implements ResourceData{
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

    public static validateAndCreate(obj: Omit<Resource, "id">): Resource {
      if (!obj.resourceType || !obj.resourceLink) {
        throw new Error("Missing Properties");
      }
      if ( !RESOURCETYPE.includes(obj.resourceType)) {
        //Exist but wrong
        throw new Error("Wrong Status");
      }
      return new Resource({...obj})
    }

  public static resourceConverter: Converter<ResourceType> = {
    fromDB(value: string): ResourceType {
      if ((RESOURCETYPE as readonly string[]).includes(value)) {
        //Has to widen STATUES types here to check
        return value as ResourceType;
      }
      throw new Error(
        `ResourceType is not valid: ${value} is not ResourceType type`,
      );
    },
    toDB(value: ResourceType): string {
      if (RESOURCETYPE.includes(value)) {
        //Has to widen STATUES types here to check
        return value as string;
      }
      throw new Error(
        `ResourceType is not valid: ${value} is not ResourceType type`,
      );
    },
  };

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
