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

interface SessionData {
  id: string;
  title: string;
  structure: string;
  notes?: string;
  subsessionIds: string[]; //Required
}

interface SubsessionData{
     id: string;
   title: string;
   time: number; //in minutes
   maxTime: number; //in minutes
   startDate?: Date | null;
   endDate?: Date | null;
   reflections?: string;
   goalIds?: string[]; //Foreign Key
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
  getAllPiece: { req: undefined; res: ExtendedPieceData[] };
  getOnePiece: { req: { id: string }; res: ExtendedPieceData | null };
  addPiece: { req: Omit<PieceData, "id">; res: ValidationResult };

  getAllPieceGoals: { req: { pieceId: string }; res: GoalData[] };

  getAllPieceSessions: { req: { pieceId: string }; res: SessionData[] };

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
    getAllPiece: () => Promise<ExtendedPieceData[]>;
    getOnePiece: ({ id }: { id: string }) => Promise<ExtendedPieceData | null>;
    addPiece: (req: Omit<PieceData, "id">) => Promise<ValidationResult>;

    getAllPieceGoals: (req: { pieceId: string }) => Promise<GoalData[]>;

    getAllPieceSessions: (req: { pieceId: string }) => Promise<SessionData[]>;

    getAnalytics: (req: {
      id: string;
      timeFrameEndDate?: Date;
      timeFrameStartDate?: Date;
    }) => Promise<AnalyticsData>;
  };
}
