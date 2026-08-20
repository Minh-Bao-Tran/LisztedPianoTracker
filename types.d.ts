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

type FreqFrame = "Week" | "Fortnight" | "Month";

type GoalType = "Dynamic" | "Tempo" | "Technique" | "Expression" | "Others";

type ResourceType = "Sheet Music" | "Recording" | "Guides" | "Others";

type SessionStatus = "Completed" | "InProgress" | "Active" | "Planned";
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
  lastPracticeDate?: Date | "N/A";
  lastPracticeGoalName?: string;
  lastGoalProgress?: number; //out of 100
  goals?: GoalData[];
}

interface GoalData {
  id: string;
  name: string;
  status: Status;
  goalType?: GoalType;
  notes?: string;
  ratings: number; //percentage (0 - 100)

  lastPractice?: Date | string;
}
interface ExtendedGoalData extends GoalData {
  pieceId?: string;
}

interface ResourceData {
  id: string;
  resourceType: ResourceType;
  notes?: string;
  resourceLink: string;
}

//For createNewSession
interface CreateSessionData {
  title: string;
  structure: SessionStructure;
  notes: string;
  numberOfLoops: number;
  subsessions: CreateSubsessionData[];
  time?: number; // to handle Unstructured Session, as they have no subsessions
}
interface SessionData {
  id: string;
  title: string;
  structure: SessionStructure;
  status: SessionStatus;

  currentIndex: number; //Starts at 1 //Determine using currentIndex mod subsessionsIds length. the reminder is the index of the Id that should be started
  numberOfLoops: number; // For interleaved. For Blocked, only 1 repeat is needed.

  notes?: string;
  subsessionIds: string[]; //Required
}
interface ExtendedSessionData extends SessionData {
  date?: Date;
  totalTime?: number;
  subsessions?: ExtendedSubsessionData[];
}

interface CreateSubsessionData {
  title: string;
  timePerLoop: number;
  goalIds: string[];
}
interface SubsessionData {
  id: string;
  title: string;
  ratings: number; //percentage (0 - 100)
  time: number[]; //in minutes
  totalTime?: number;
  maxTime: number; //in minutes
  date?: Date;
  reflections?: string;
  goalIds?: string[]; //Foreign Key
}
interface ExtendedSubsessionData extends SubsessionData {
  sessionId?: string;
  goals?: ExtendedGoalData[] | GoalData[];
}

//---Term---
interface TermData {
  id: string;
  term: string;
  definition: string;
  type: string; // "Tempo","Technique","Dynamic","Chord","Expression","Others",
  notes?: string;
}

//---Analytics---
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
interface EventMapping {
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
  deletePiece: { req: { id: string }; res: true };

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
  getAllSessions: {
    req: {
      timeFrameStartDate?: Date;
      timeFrameEndDate?: Date;
    };
    res: ExtendedSessionData[];
  };
  getAllPieceSessions: { req: { pieceId: string }; res: SessionData[] };
  getAllPieceSubsessions: {
    req: { pieceId: string };
    res: ExtendedSubsessionData[];
  };
  getOneSession: { req: { id: string }; res: ExtendedSessionData };
  getOneSubsession: { req: { id: string }; res: ExtendedSubsessionData };
  addNewSession: { req: { sessionData: CreateSessionData }; res: string };
  deleteSession: { req: { id: string }; res: true };

  updateSubsessionTime: {
    req: { subsessionId: string; incrementTime?: number };
    res: boolean;
  };
  startSession: { req: { id: string }; res: true };
  nextSession: {
    req: {
      sessionId: string;
      latestReflections: string;
      latestRatings: number;
      date: Date;
    };
    res: "Finished" | "Next";
  };
  pauseSession: {
    req: {
      sessionId: string;
    };
    res: true;
  };
  finishSession: { req: { sessionId: string; notes?: string }; res: true };

  //----Term Routes----
  getAllTerms: { req: undefined; res: TermData[] };
  getAllPieceTerms: { req: { pieceId: string }; res: TermData[] };
  linkTermToPiece: { req: { pieceId: string; termId: string }; res: true };
  unlinkTermFromPiece: { req: { pieceId: string; termId: string }; res: true };

  //----Analytics Routes----
  getAnalytics: {
    req: { id: string; timeFrameEndDate?: Date; timeFrameStartDate?: Date };
    res: AnalyticsData;
  };
}

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
    deletePiece: (req: { id: string }) => Promise<true>;

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
    getAllSessions: (req: {
      timeFrameStartDate?: Date;
      timeFrameEndDate?: Date;
    }) => Promise<ExtendedSessionData[]>;
    getAllPieceSessions: (req: { pieceId: string }) => Promise<SessionData[]>;
    getAllPieceSubsessions: (req: {
      pieceId: string;
    }) => Promise<ExtendedSubsessionData[]>;
    getOneSession: (req: { id: string }) => Promise<ExtendedSessionData>;
    getOneSubsession: (req: { id: string }) => Promise<ExtendedSubsessionData>;
    addNewSession: (req: { sessionData: CreateSessionData }) => Promise<string>;
    deleteSession: (req: { id: string }) => Promise<true>;

    updateSubsessionTime: (req: {
      subsessionId: string;
      incrementTime?: number;
    }) => Promise<boolean>;
    startSession: (req: { id: string }) => Promise<true>;
    nextSession: (req: {
      sessionId: string;
      latestReflections: string;
      latestRatings: number;
      date: Date;
    }) => Promise<"Finished" | "Next">;
    pauseSession: (req: { sessionId: string }) => Promise<true>;
    finishSession: (req: {
      sessionId: string;
      notes?: string;
    }) => Promise<true>;

    //----Term Routes----
    getAllTerms: () => Promise<TermData[]>;
    getAllPieceTerms: (req: { pieceId: string }) => Promise<TermData[]>;
    linkTermToPiece: (req: {
      pieceId: string;
      termId: string;
    }) => Promise<true>;
    unlinkTermFromPiece: (req: {
      pieceId: string;
      termId: string;
    }) => Promise<true>;

    //----Analytics Routes----
    getAnalytics: (req: {
      id: string;
      timeFrameEndDate?: Date;
      timeFrameStartDate?: Date;
    }) => Promise<AnalyticsData>;
  };
}
