# FactLens

A fact knowledge layer that extracts atomic facts from PDF documents, links every fact to its verbatim source evidence (document + page + quote), and identifies where facts across documents corroborate, contradict, or are reconciled by context (time period, scope, or units).

Built for the Superjoin VIT 2026 Engineering Intern hiring assignment.

---

**Live deployment**: https://factlens-yourname.vercel.app

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

Grant the service role the required table privileges (needed once, since tables created via the SQL Editor don't get this automatically):
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
   (On Windows PowerShell: `Invoke-WebRequest -Uri http://localhost:3000/api/admin/match-relationships -Method POST`)

   This is deliberately a separate, re-runnable step — see Approach below for why.
3. Go to **Relationships** to see fact pairs classified as corroborating, contradicting, or reconciled by context, each with the model's reasoning and both pieces of source evidence.

**Note on API quotas**: this project runs entirely on Gemini's free tier, which caps both requests-per-minute and requests-per-day. Processing many documents in one session can exhaust the daily quota; see Limitations below.

---

## Video Demo

**[Link to demo video — under 3 minutes]**

Shows a PDF being processed and all four required cases below.

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
Batched fact extraction (Gemini, ~5 pages per call) — atomic facts as structured JSON:
   subject / predicate / value / unit / time_period / scope / quote / confidence / page_number
   │
   ▼
Quote verification — each fact's quote is checked against its source page's text
(whitespace-normalized) before being accepted; unverifiable facts are logged and dropped
   │
   ▼
Embedding (Gemini embeddings, 768-dim) — stored alongside each fact
   │
   ▼
[separate, re-runnable step] Cross-document matching — pgvector similarity search
finds candidate fact pairs across different documents (same-document pairs excluded,
similarity threshold applied in SQL)
   │
   ▼
[separate, re-runnable step] Relationship classification (Gemini) — each candidate
pair is classified as corroborates / contradicts / reconciled_by_context / unrelated,
with a one-sentence reasoning grounded in both facts' evidence
```

### The four required cases

**1. Corroboration** — `EBITDA — 127 ₹ Cr` (FY24) and `EBITDA margin — 1.6%` (FY24), both from the Q4 FY24 earnings presentation (p.6). The system correctly recognized these as the same underlying data point stated in two different units (absolute value vs. margin percentage), rather than treating them as unrelated numbers.

**2. Genuine contradiction** — `FY24 EBITDA increased by Rs. 578 Cr` vs. `FY24 EBITDA` reported at `Rs. 127 Cr`, both from the same document. The system flagged these as reporting "drastically different values for EBITDA in the same fiscal year." (See Limitations — this case also revealed a real reasoning limitation, discussed below.)

**3. Reconciled by context** — `EBITDA — 127 ₹ Cr` (FY24, full year) vs. `EBITDA — 109 Cr` (Q3 FY24), from two different pages of the same earnings presentation. The system correctly explained the difference as full-year vs. single-quarter figures rather than flagging it as a contradiction — the `time_period` field carried through extraction is what made this distinction possible.

**4. Extraction/reasoning failure** — [Fill in your final chosen example here — either: (a) the quote-verification safety net rejecting facts whose cited quote didn't exactly match the source page text (visible in server logs as `REJECTED FACTS`), showing the system correctly refusing to trust an unverifiable claim; or (b) the Case 2 contradiction above being a reasoning limitation in disguise — the system compared an absolute EBITDA value (127 Cr) against a stated *increase* in EBITDA (578 Cr) as if they were the same kind of quantity, when one is a level and the other is a delta. A more complete system would distinguish "value" facts from "change-in-value" facts as different predicate types before comparing them, which would have caught this as a category mismatch rather than a contradiction.]

### Key decisions and trade-offs

- **Facts are extracted per page, not per document**, and pages are batched (~5 per Gemini call) rather than processed one at a time. Per-page extraction means every fact carries a real page number for evidence linking; batching keeps the number of API calls manageable against free-tier rate limits.

- **Every extracted fact is quote-verified before being stored.** The model must cite a verbatim quote for each fact; that quote is checked against the actual page text (whitespace-normalized, since PDF line-wrapping doesn't always match the model's rendering of a sentence) before the fact is accepted. Facts that fail this check are logged and dropped rather than trusted — a deliberate defense against hallucination.

- **Relationship matching is a separate, resumable step from ingestion**, triggered manually after uploads rather than running automatically per-document. Chaining extraction, embedding, and classification into one long request per upload made the whole pipeline fragile to any single transient failure (rate limits, network blips). Decoupling means an upload finishes once its own facts are saved, and matching can be triggered, interrupted, and safely re-run without reprocessing or duplicating anything — a uniqueness constraint on fact pairs makes re-runs idempotent. **This also means new documents are processed incrementally**: uploading a new PDF only extracts and embeds that document's own facts and matches them against the existing pool — it never reprocesses or re-embeds documents already in the system.

- **The schema is intentionally generic** (subject/predicate/value/unit/time_period/scope/quote), not shaped around this project's two sample datasets. Nothing in the prompts or schema assumes financial documents specifically, in line with the requirement that the system generalize beyond the starter documents.

- **AI tools used**: Gemini (`gemini-3.1-flash-lite`) for fact extraction and relationship classification, and Gemini's embedding model for vector similarity search (pgvector). Claude was used throughout development for architecture planning, debugging, and code review.

---

## Limitations and Next Steps

- **Free-tier rate and daily quotas**: Gemini's free tier caps both requests-per-minute and requests-per-day (500/day at time of writing). Processing many documents plus a full relationship-matching pass in one session can exhaust the daily limit, after which the system correctly reports the failure (via retry-then-error) rather than hanging silently — but no further processing is possible until the quota resets. A production version would use a paid tier with higher throughput and true request batching.
- **The naive value-vs-delta comparison** described in Case 4 above is a real reasoning gap: the system doesn't yet distinguish an absolute value from a stated change-in-value as different predicate types, which can produce a false-positive "contradiction" between two facts that are actually consistent. Fixing this would mean adding a predicate-type classification step before candidate matching.
- **Schema is fixed, not yet dynamically evolving**: fact fields are set in advance rather than emerging from the documents themselves, as suggested in the brief's brownie points.
- **Table-heavy PDF pages** can produce imperfect text extraction (merged or misaligned columns), which occasionally limits what the extractor has to work with on dense financial statement pages.
- **Large PDFs**: the per-page batched approach scales reasonably, but hasn't been stress-tested against very large (500+ page) documents.

---

## Additional Notes

This system processes new documents incrementally by design — uploading an additional PDF only extracts and embeds its own facts, then matches them against the existing knowledge base, without reprocessing or rebuilding anything already stored.

[Add anything else worth mentioning here.]