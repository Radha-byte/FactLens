import type {
  Document,
  EquipmentEntity,
  Flag,
  DashboardSummary,
  DocumentDetailResponse,
  RelatedDocument,
  CaptureResponse,
  ChatResponse,
  UploadResponse,
} from "@/lib/types";

async function handle<T>(res: Response, errorMessage: string): Promise<T> {
  if (!res.ok) throw new Error(errorMessage);
  return res.json() as Promise<T>;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch("/api/dashboard", { cache: "no-store" });
  return handle<DashboardSummary>(res, "Failed to load dashboard summary");
}

export async function getDocuments(): Promise<Document[]> {
  const res = await fetch("/api/documents", { cache: "no-store" });
  return handle<Document[]>(res, "Failed to load documents");
}

export async function getFlags(): Promise<Flag[]> {
  const res = await fetch("/api/flags", { cache: "no-store" });
  return handle<Flag[]>(res, "Failed to load flags");
}

export async function searchEquipment(term = ""): Promise<EquipmentEntity[]> {
  const url = term
    ? `/api/equipment?search=${encodeURIComponent(term)}`
    : "/api/equipment";
  const res = await fetch(url, { cache: "no-store" });
  return handle<EquipmentEntity[]>(res, "Failed to load equipment");
}

export async function getDocument(id: string): Promise<DocumentDetailResponse> {
  const res = await fetch(`/api/documents/${id}`, { cache: "no-store" });
  return handle<DocumentDetailResponse>(res, "Document not found");
}

export async function getRelatedDocuments(id: string): Promise<RelatedDocument[]> {
  const res = await fetch(`/api/documents/${id}/related`, { cache: "no-store" });
  return handle<RelatedDocument[]>(res, "Failed to load related documents");
}

export async function askChat(question: string): Promise<ChatResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return handle<ChatResponse>(res, "Failed to get an answer");
}

// NOTE: calls Gemini on the backend, same as capture. Real credit cost
// per call — fine for normal testing, just don't spam it.
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/documents/upload", {
    method: "POST",
    body: formData,
  });
  return handle<UploadResponse>(res, "Upload failed");
}

// NOTE: this calls Gemini on the backend (extraction + embeddings), same
// as an upload. Fine to use normally, just don't hammer it in a tight
// loop while testing — each call spends real API credit.
export async function captureKnowledge(
  text: string,
  equipmentHint?: string
): Promise<CaptureResponse> {
  const res = await fetch("/api/knowledge/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, equipment_hint: equipmentHint || undefined }),
  });
  return handle<CaptureResponse>(res, "Failed to capture knowledge");
}