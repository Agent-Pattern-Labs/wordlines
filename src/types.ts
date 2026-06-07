export type WordlineStatus = "active" | "paused" | "completed" | "archived";

export type EventType =
  | "note"
  | "link"
  | "file"
  | "screenshot"
  | "decision"
  | "question"
  | "checkpoint"
  | "agent_run"
  | "artifact";

export interface WordlineEvent {
  id: string;
  type: EventType;
  created_at: string;
  title?: string;
  body?: string;
  path?: string;
  url?: string;
  source_path?: string;
  stored_path?: string;
  sha256?: string;
  size_bytes?: number;
}

export interface WordlineCheckpoint {
  id: string;
  created_at: string;
  title: string;
  summary?: string;
  event_count: number;
}

export interface Wordline {
  version: string;
  id: string;
  title: string;
  intent: string;
  created_at: string;
  updated_at: string;
  status: WordlineStatus;
  events: WordlineEvent[];
  checkpoints: WordlineCheckpoint[];
}

