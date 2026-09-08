# FactLens

A fact knowledge layer that extracts atomic facts from PDF documents, links every fact to its verbatim source evidence (document + page + quote), and identifies where facts across documents corroborate, contradict, or are reconciled by context (time period, scope, or units).

Built for the Superjoin VIT 2026 Engineering Intern hiring assignment.

---

## Setup and Run Instructions

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project with the `pgvector` extension enabled
- A [Gemini API key](https://aistudio.google.com/apikey) (free tier)

### 1. Clone and install
```bash
git clone https://github.com/Radha-byte/FactLens.git
cd FactLens
npm install
```

### 2. Set up the database
In your Supabase project's SQL Editor, run the schema in `supabase/schema.sql` (creates `documents`, `facts`, `fact_relationships`, and the `match_facts` vector search function).

Also grant the service role the required table privileges (needed once, since tables created via the SQL Editor don't get this automatically):
```sql
grant usage on schema public to service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
```

Create a public storage bucket named `documents` (Storage → New bucket).

### 3. Configure environment variables
Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Run
```bash
npm run dev
```
Open `http://localhost:3000`.

### 5. Usage
1. Go to **Upload**, upload a PDF. The pipeline extracts per-page text, pulls out atomic facts via Gemini, embeds each fact, and stores everything with page-level evidence.
2. After uploading multiple documents, trigger cross-document relationship matching:
   ```bash
   curl -X POST http://localhost:3000/api/admin/match-relationships
   ```
   This is a separate, re-runnable step by design (see Approach below) — safe to run again if it's interrupted partway.
3. Go to **Relationships** to see fact pairs classified as corroborating, contradicting, or reconciled by context, each with the model's reasoning and both pieces of source evidence.

---

## Video Demo

**[Link to demo video — under 3 minutes]**

Shows: a PDF being uploaded and processed live, and the four required cases (corroboration, contradiction, reconciled-by-context, and an extraction/reasoning failure).

---

## Approach

### Architecture
```
PDF upload
   │
   ▼
Per-page text extraction (unpdf) — preserves real page numbers for evidence linking
   │
   ▼
Per-page fact extraction (Gemini) — atomic facts as structured JSON:
   subject / predicate / value / unit / time_period / scope / quote / confidence
   │
   ▼
Quote verification — each fact's quote is checked against the source page text
(whitespace-normalized) before being accepted; unverifiable facts are dropped
   │
   ▼
Embedding (Gemini embeddings, 768-dim) — stored alongside each fact
   │
   ▼
[separate step] Cross-document matching — vector similarity search (pgvector)
finds candidate fact pairs across different documents
   │
   ▼
[separate step] Relationship classification (Gemini) — each candidate pair is
classified as corroborates / contradicts / reconciled_by_context / unrelated,
with a one-sentence reasoning grounded in both facts' evidence
```

### Key decisions and trade-offs

- **Facts are extracted per page, not per document.** Sending an entire PDF to the model in one call (as an earlier iteration of this project's ingestion pipeline did) makes it impossible to know which page a claim came from. Splitting into per-page text first means every fact carries a real page number, which is what makes the evidence link meaningful rather than just "somewhere in this file."

- **Every extracted fact is quote-verified before being stored.** The model is asked to cite a verbatim quote for each fact; that quote is checked against the actual page text (after normalizing whitespace, since PDF line-wrapping doesn't always match the model's rendering of a sentence) before the fact is accepted. This is a deliberate defense against hallucinated facts — a fact with no real anchor in the source text is dropped rather than trusted.

- **Relationship matching is a separate, resumable step from ingestion**, not a side effect of upload. Cross-document comparison requires an LLM call per candidate pair, on top of the extraction and embedding calls already required per fact — chaining all of this into one long request per upload made the whole pipeline fragile to any single transient failure (rate limits, momentary network issues). Decoupling means an upload finishes once its own facts are saved, and relationship matching can be triggered, interrupted, and safely re-run without reprocessing or duplicating anything (enforced by a uniqueness constraint on fact pairs).

- **The schema is intentionally generic** (subject/predicate/value/unit/time_period/scope/quote), not shaped around this project's two sample datasets. Nothing in the prompts or schema assumes financial documents specifically — the same pipeline should extract structured facts from a differently-shaped domain without code changes, which was an explicit requirement of the assignment.

- **AI tools used**: Gemini (`gemini-3.1-flash-lite`) for fact extraction and relationship classification, and Gemini's embedding model for vector similarity search. Claude was used throughout development for architecture planning, debugging, and code review.

---

## Limitations and Next Steps

- **Rate limits**: the Gemini free tier caps requests per minute, so processing a long document (extraction + embedding + matching, one call each per fact) can take several minutes. A request queue with throttling and retry-on-failure is in place, but a production version would batch extraction calls across multiple pages per request rather than one call per page.
- **Table-heavy pages**: plain-text PDF extraction can misalign or merge columns in dense financial tables, occasionally producing garbled or incomplete text for the extractor to work from. [Describe your specific observed case here for the demo.]
- **Schema is fixed, not yet dynamically evolving**: the fact schema's fields are set in advance; a further iteration could let new fact "shapes" emerge as new kinds of documents are ingested, per the assignment's brownie-point suggestions.
- **No incremental re-indexing**: adding a new document currently only matches its own facts against existing ones; it doesn't re-evaluate whether earlier documents should now be reconsidered against it in reverse (though the underlying vector search is symmetric, so this is mostly a matter of triggering the match step for older facts too).
- **Large PDFs**: not yet tested against very large (500+ page) documents; the per-page approach should scale, but hasn't been stress-tested.

---

## Additional Notes

[Add anything else worth mentioning — e.g. the RAG chat feature also built on the same fact/document store, or anything specific about how you selected the four required cases from the starter dataset.]