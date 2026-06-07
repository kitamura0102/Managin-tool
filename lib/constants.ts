import type { NoteCategory, Severity, Visibility } from "@/lib/types";

export const NOTE_CATEGORIES: NoteCategory[] = [
  "Performance",
  "Attendance / PTO",
  "Communication",
  "Quality",
  "Ownership",
  "Coaching",
  "Positive Feedback",
  "Follow-up"
];

export const SEVERITIES: Severity[] = ["Low", "Medium", "High"];
export const VISIBILITIES: Visibility[] = ["Private note", "Manager-ready summary"];

export const WRITING_GUIDANCE = [
  "Write facts, not opinions.",
  "Avoid labels like lazy or bad attitude. Describe the specific behavior.",
  "Focus on impact, expectations, feedback, and follow-up.",
  "PTO should be documented as context, not as a performance accusation unless policy or coverage was affected."
];

export type NoteTemplate = {
  id: string;
  name: string;
  category: NoteCategory;
  helper: string;
  placeholders: {
    observation: string;
    expected_behavior: string;
    impact: string;
    feedback_given: string;
    employee_response: string;
    next_step: string;
  };
};

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: "performance-gap",
    name: "Performance gap",
    category: "Performance",
    helper: "Capture what was expected, what happened, the impact, feedback, and a follow-up date.",
    placeholders: {
      observation: "What happened? Include dates, examples, and the specific work or behavior.",
      expected_behavior: "What was expected for the role, process, client, or team?",
      impact: "How did it affect quality, workload, timeline, client trust, or team coverage?",
      feedback_given: "What feedback did you give and when?",
      employee_response: "How did the employee respond or clarify?",
      next_step: "What will happen next, and what support or checkpoint is planned?"
    }
  },
  {
    id: "coaching-conversation",
    name: "Coaching conversation",
    category: "Coaching",
    helper: "Document the topic, aligned expectation, support offered, response, and next step.",
    placeholders: {
      observation: "What topic was discussed?",
      expected_behavior: "What expectation was aligned?",
      impact: "Why does this matter for the employee, client, or team?",
      feedback_given: "What coaching, support, or resources were offered?",
      employee_response: "What did the employee acknowledge or ask for?",
      next_step: "What is the next checkpoint or action?"
    }
  },
  {
    id: "attendance-pto-context",
    name: "Attendance / PTO context",
    category: "Attendance / PTO",
    helper: "Use attendance notes as context. Include approval, handoff, coverage impact, and needed follow-up.",
    placeholders: {
      observation: "Which date or dates are relevant? Was PTO approved or unplanned?",
      expected_behavior: "What handoff, notice, schedule, or policy expectation applied?",
      impact: "Was there any coverage, workload, client, or timeline impact?",
      feedback_given: "What was discussed about handoff, coverage, or expectations?",
      employee_response: "What context did the employee provide?",
      next_step: "Is any follow-up needed, or is this just context?"
    }
  },
  {
    id: "positive-feedback",
    name: "Positive feedback",
    category: "Positive Feedback",
    helper: "Capture what went well, the impact, and whether recognition was shared.",
    placeholders: {
      observation: "What did the employee do well?",
      expected_behavior: "What expectation, value, or standard did this reinforce?",
      impact: "What positive impact did it have?",
      feedback_given: "Was recognition given? If so, when and how?",
      employee_response: "How did the employee respond?",
      next_step: "How can this behavior be reinforced or shared?"
    }
  }
];
