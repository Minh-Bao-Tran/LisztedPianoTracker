type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storage: number;
};

type StaticData = string;

type ValidationResult = { valid: boolean; value?: any };

// Data types(From model)
interface PieceData {
  id: string;
  name: string;
  composer: string;
  status: string;
  pieceType: string;

  freqNumber?: number;
  freqFrame?: string;
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
  status: string; //"Active", "Completed", "Planned"
  goalType?: string; //"Dynamic", "Tempo", "Technique", "Expression", "Others"
  notes: string;
  ratings: number; //percentage (0 - 100)

  lastPractice?: Date;
}

interface ResourceData {
  id: string;
  resourceType: string;
  notes?: string;
  resourceLink: string;
}

interface SessionData {
  id: string;
  title: string;
  structure: string;
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

interface AnalyticsData {
  totalTime: number;
  averageTime: number;
  totalReflections: number;
  allGoalCompleted: number;
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

  //----Goal Routes----
  getAllPieceGoals: { req: { pieceId: string }; res: GoalData[] };

  //----Resource Routes----
  getAllPieceResources: { req: { pieceId: string }; res: ResourceData[] };

  //----Session Routes----
  getAllPieceSessions: { req: { pieceId: string }; res: SessionData[] };
  getAllPieceSubsessions: {
    req: { pieceId: string };
    res: ExtendedSubsessionData[];
  };

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

    //----Goal Routes----
    getAllPieceGoals: (req: { pieceId: string }) => Promise<GoalData[]>;

    //----Resource Routes----
    getAllPieceResources: (req: { pieceId: string }) => Promise<ResourceData[]>;

    //----Session Routes----
    getAllPieceSessions: (req: { pieceId: string }) => Promise<SessionData[]>;
    getAllPieceSubsessions: (req: {
      pieceId: string;
    }) => Promise<ExtendedSubsessionData[]>;

    //----Analytics Routes----
    getAnalytics: (req: {
      id: string;
      timeFrameEndDate?: Date;
      timeFrameStartDate?: Date;
    }) => Promise<AnalyticsData>;
  };
}
