export type EmployeeStatus = "Active" | "Inactive";

export type NoteCategory =
  | "Performance"
  | "Attendance / PTO"
  | "Communication"
  | "Quality"
  | "Ownership"
  | "Coaching"
  | "Positive Feedback"
  | "Follow-up";

export type Severity = "Low" | "Medium" | "High";
export type Visibility = "Private note" | "Manager-ready summary";
export type FollowUpStatus = "Open" | "Done";

type DbRecord = Record<string, unknown>;

export type Employee = DbRecord & {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  team: string;
  start_date: string | null;
  status: EmployeeStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Note = DbRecord & {
  id: string;
  user_id: string;
  employee_id: string;
  note_date: string;
  category: NoteCategory;
  observation: string;
  expected_behavior: string | null;
  impact: string | null;
  feedback_given: string | null;
  employee_response: string | null;
  next_step: string | null;
  follow_up_date: string | null;
  severity: Severity;
  visibility: Visibility;
  is_1on1_talking_point: boolean;
  created_at: string;
  updated_at: string;
  employees?: Pick<Employee, "id" | "full_name" | "role" | "team"> | null;
};

export type FollowUp = DbRecord & {
  id: string;
  user_id: string;
  employee_id: string;
  note_id: string | null;
  follow_up_date: string;
  next_step: string;
  status: FollowUpStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  employees?: Pick<Employee, "id" | "full_name"> | null;
  notes?: Pick<Note, "id" | "category" | "severity"> | null;
};

export type WeeklyReview = DbRecord & {
  id: string;
  user_id: string;
  review_week_start: string;
  review_week_end: string;
  team_impact_notes: string | null;
  feedback_given: string | null;
  expectation_acknowledged: string | null;
  repeated_patterns: string | null;
  next_week_priorities: string | null;
  created_at: string;
  updated_at: string;
};

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type EmployeeInsert = DbRecord & {
  id?: string;
  user_id: string;
  full_name: string;
  role?: string;
  team?: string;
  start_date?: string | null;
  status?: EmployeeStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

type NoteInsert = DbRecord & {
  id?: string;
  user_id: string;
  employee_id: string;
  note_date?: string;
  category: NoteCategory;
  observation: string;
  expected_behavior?: string | null;
  impact?: string | null;
  feedback_given?: string | null;
  employee_response?: string | null;
  next_step?: string | null;
  follow_up_date?: string | null;
  severity?: Severity;
  visibility?: Visibility;
  is_1on1_talking_point?: boolean;
  created_at?: string;
  updated_at?: string;
};

type FollowUpInsert = DbRecord & {
  id?: string;
  user_id: string;
  employee_id: string;
  note_id?: string | null;
  follow_up_date: string;
  next_step: string;
  status?: FollowUpStatus;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

type WeeklyReviewInsert = DbRecord & {
  id?: string;
  user_id: string;
  review_week_start: string;
  review_week_end: string;
  team_impact_notes?: string | null;
  feedback_given?: string | null;
  expectation_acknowledged?: string | null;
  repeated_patterns?: string | null;
  next_week_priorities?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      employees: TableDef<Employee, EmployeeInsert, Partial<EmployeeInsert>>;
      notes: TableDef<Note, NoteInsert, Partial<NoteInsert>>;
      follow_ups: TableDef<FollowUp, FollowUpInsert, Partial<FollowUpInsert>>;
      weekly_reviews: TableDef<WeeklyReview, WeeklyReviewInsert, Partial<WeeklyReviewInsert>>;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
