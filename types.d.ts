type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storage: number;
};

type StaticData = string;

type ValidationResult = { valid: boolean; value?: any };

//Literal Types
type Status = "Active" | "Completed" | "Planned";
type PieceType =
  | "Performance"
  | "Technical"
  | "Scale/Arpeggio"
  | "Sight Reading"
  | "Improvisation"
  | "Others";

type FreqFrame = "week" | "fortnight" | "month";

type GoalType = "Dynamic" | "Tempo" | "Technique" | "Expression" | "Others";

type ResourceType =
  | "Sheet Music"
  | "Recording"
  | "Practice"
  | "Guides"
  | "Others";
// Data types(From model)

type SessionStructure = "Blocked" | "Interleaved" | "Unstructured";
interface PieceData {
  id: string;
  name: string;
  composer: string;
  status: Status;
  pieceType: PieceType;

  freqNumber?: number;
  freqFrame?: FreqFrame;
  notes?: string;
  totalTime?: number; //In minutes
  termIds?: string[]; //Foreign Key
  goalIds?: string[]; //Foreign Key
  resourceIds?: string[]; //Foreign Key
}
interface ExtendedPieceData extends PieceData {
  lastPracticeDate?: Date | string;
  lastPracticeGoalName?: string;
  lastGoalProgress?: number; //out of 100
}

interface GoalData {
  id: string;
  name: string;
  status: Status;
  goalType?: GoalType;
  notes?: string;
  ratings: number; //percentage (0 - 100)

  lastPractice?: Date;
}

interface ResourceData {
  id: string;
  resourceType: ResourceType;
  notes?: string;
  resourceLink: string;
}

interface SessionData {
  id: string;
  title: string;
  structure: SessionStructure;
  notes?: string;
  subsessionIds: string[]; //Required
}

interface SubsessionData {
  id: string;
  title: string;
  ratings: number; //percentage (0 - 100)
  time: number; //in minutes
  maxTime: number; //in minutes
  date?: Date;
  reflections?: string;
  goalIds?: string[]; //Foreign Key
}

interface ExtendedSubsessionData extends SubsessionData {
  sessionId?: string;
}

interface TermData {
  id: string;
  term: string;
  definition: string;
  type: string; // "Tempo","Technique","Dynamic","Chord","Expression","Others",
  notes?: string;
}

interface AnalyticsData {
  totalTime: number;
  averageTime: number;
  totalReflections: number;
  allGoalsCompleted: number;
  totalSubsessionsNumber: number;
  streak: number;
  latestSubsession: Record<string, any>;
}

//Define what type each event would return

type EventMapping = {
  statistics: { req: undefined; res: Statistics };
  getStaticData: { req: undefined; res: StaticData };

  //----Piece Routes----
  getAllPiece: { req: undefined; res: ExtendedPieceData[] };
  getOnePiece: { req: { id: string }; res: ExtendedPieceData | null };
  addPiece: { req: Omit<PieceData, "id">; res: ValidationResult };
  updatePiece: {
    req: {
      updateCriteria: Partial<Pick<PieceData, keyof PieceData>>;
      updatingFields: Partial<PieceData>;
    };
    res: true;
  };
  //----Goal Routes----
  getAllPieceGoals: { req: { pieceId: string }; res: GoalData[] };
  addGoal: {
    req: { pieceId: string; goal: Omit<GoalData, "id"> };
    res: string;
  };
  updateGoal: {
    req: {
      updateCriteria: Partial<Pick<GoalData, keyof GoalData>>;
      updatingFields: Partial<GoalData>;
    };
    res: true;
  };
  deleteGoal: {
    req: { id: string };
    res: true;
  };
  //----Resource Routes----
  getAllPieceResources: { req: { pieceId: string }; res: ResourceData[] };
  addResource: {
    req: { pieceId: string; resource: Omit<ResourceData, "id"> };
    res: string; //return ResourceId
  };
  updateResource: {
    req: {
      updateCriteria: Partial<Pick<ResourceData, keyof ResourceData>>;
      updatingFields: Partial<ResourceData>;
    };
    res: true;
  };
  deleteResource: {
    req: { id: string };
    res: true;
  };
  //----Session Routes----
  getAllPieceSessions: { req: { pieceId: string }; res: SessionData[] };
  getAllPieceSubsessions: {
    req: { pieceId: string };
    res: ExtendedSubsessionData[];
  };

  //----Term Routes----
  getAllPieceTerms: { req: { pieceId: string }; res: TermData[] };

  //----Analytics Routes----
  getAnalytics: {
    req: { id: string; timeFrameEndDate?: Date; timeFrameStartDate?: Date };
    res: AnalyticsData;
  };
};

//Adding type to electron and define events
// import type {Piece} from "./src/electron/backend/class/Piece.model.ts";
interface Window {
  electron: {
    subscribeStatistics: (callback: (statistics: Statistics) => {}) => void;
    getStaticData: () => Promise<StaticData>;

    //----Piece Routes----
    getAllPiece: () => Promise<ExtendedPieceData[]>;
    getOnePiece: ({ id }: { id: string }) => Promise<ExtendedPieceData | null>;
    addPiece: (req: Omit<PieceData, "id">) => Promise<ValidationResult>;
    updatePiece: (req: {
      updateCriteria: Partial<Pick<PieceData, keyof PieceData>>;
      updatingFields: Partial<PieceData>;
    }) => Promise<true>;

    //----Goal Routes----
    getAllPieceGoals: (req: { pieceId: string }) => Promise<GoalData[]>;
    addGoal: (req: {
      pieceId: string;
      goal: Omit<GoalData, "id">;
    }) => Promise<string>;
    updateGoal: (req: {
      updateCriteria: Partial<Pick<GoalData, keyof GoalData>>;
      updatingFields: Partial<GoalData>;
    }) => Promise<true>;
    deleteGoal: (req: { id: string }) => Promise<true>;

    //----Resource Routes----
    getAllPieceResources: (req: { pieceId: string }) => Promise<ResourceData[]>;
    addResource: (req: {
      pieceId: string;
      resource: Omit<ResourceData, "id">;
    }) => Promise<string>; //return ResourceId

    updateResource: (req: {
      updateCriteria: Partial<Pick<ResourceData, keyof ResourceData>>;
      updatingFields: Partial<ResourceData>;
    }) => Promise<true>;
    deleteResource: (req: { id: string }) => Promise<true>;

    //----Session Routes----
    getAllPieceSessions: (req: { pieceId: string }) => Promise<SessionData[]>;
    getAllPieceSubsessions: (req: {
      pieceId: string;
    }) => Promise<ExtendedSubsessionData[]>;

    //----Term Routes----
    getAllPieceTerms: (req: { pieceId: string }) => Promise<TermData[]>;

    //----Analytics Routes----
    getAnalytics: (req: {
      id: string;
      timeFrameEndDate?: Date;
      timeFrameStartDate?: Date;
    }) => Promise<AnalyticsData>;
  };
}
