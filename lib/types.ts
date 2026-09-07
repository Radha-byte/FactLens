// =========================
// Verified against the live API contract (see handoff doc section 5).
// entity_type and doc_type are FREEFORM strings set by Gemini per
// document — never hardcode them as a fixed enum/union.
// =========================

export interface Document {
  id: string;
  file_name: string;
  file_url: string; // "" for knowledge-capture entries, no file exists
  doc_type: string | null;
  summary: string | null;
  raw_text: string | null;
  uploaded_at: string;
}

export interface Entity {
  id: string;
  document_id: string;
  entity_type: string; // freeform: 'Equipment', 'Technician', 'Component', etc.
  entity_value: string;
  context: string | null;
}

export interface EquipmentEntity extends Entity {
  documents: {
    id: string;
    file_name: string;
    summary: string | null;
    doc_type: string | null;
  } | null;
}

export interface Flag {
  id: string;
  document_id: string;
  flag_type: string | null;
  description: string | null;
  severity: "low" | "medium" | "high";
  created_at: string;
}

export interface RelatedDocument {
  document_id: string;
  file_name: string;
  doc_type: string | null;
  similarity_score: number;
}

// =========================
// POST /api/documents/upload response
// NOTE: no "id" field. AI output is nested under "ai".
// =========================
export interface UploadResponse {
  success: boolean;
  fileName: string;
  publicUrl: string;
  ai: {
    doc_type: string | null;
    summary: string | null;
    raw_text: string;
    entities: { type: string; value: string; context: string }[];
    flags: { type: string; description: string; severity: "low" | "medium" | "high" }[];
  };
}

// =========================
// GET /api/documents/:id response — nested, not flat
// =========================
export interface DocumentDetailResponse {
  document: Document;
  entities: Entity[];
  flags: Flag[];
}

// =========================
// POST /api/chat response — field is "citations", not "sources"
// =========================
export interface ChatResponse {
  answer: string;
  citations: {
    document_id: string;
    file_name: string;
    excerpt: string;
  }[];
}

// =========================
// POST /api/knowledge/capture response
// =========================
export interface CaptureResponse {
  id: string;
  summary: string;
  entities: { type: string; value: string; context: string }[];
}

// =========================
// GET /api/dashboard response (Module 4 — built by Person 3)
// =========================
export interface DashboardSummary {
  total_documents: number;
  total_flags: number;
  total_equipment: number;
  recent_uploads: {
    id: string;
    file_name: string;
    doc_type: string | null;
    uploaded_at: string;
  }[];
}