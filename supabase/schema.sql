-- This file is a saved record of database objects created directly in the
-- Supabase SQL Editor. It is NOT run automatically — there are no real
-- migrations set up for this hackathon project. If you're setting up a fresh
-- Supabase project, copy each block below into the SQL Editor and run it
-- manually, in order.

-- Vector similarity search function used by /api/chat to find the most
-- relevant document chunks for a given question.
create or replace function match_document_chunks(
  query_embedding vector(768),
  match_count int default 5
)
returns table (
  chunk_id uuid,
  document_id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    document_chunks.id as chunk_id,
    document_chunks.document_id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================================
-- FACT KNOWLEDGE LAYER
-- Superjoin Engineering Intern Assignment
-- ============================================================

-- ------------------------------------------------------------
-- 1. Atomic facts extracted from documents
-- ------------------------------------------------------------

create table if not exists facts (
  id uuid primary key default gen_random_uuid(),

  document_id uuid not null
    references documents(id)
    on delete cascade,

  page_number integer not null,

  subject text not null,
  predicate text not null,
  value text not null,

  unit text,
  time_period text,
  scope text,

  quote text not null,

  confidence float
    check (confidence >= 0 and confidence <= 1),

  embedding vector(768),

  created_at timestamp with time zone default now()
);


-- ------------------------------------------------------------
-- 2. Relationships between facts
-- ------------------------------------------------------------

create table if not exists fact_relationships (
  id uuid primary key default gen_random_uuid(),

  fact_id_a uuid not null
    references facts(id)
    on delete cascade,

  fact_id_b uuid not null
    references facts(id)
    on delete cascade,

  relationship_type text not null
    check (
      relationship_type in (
        'corroborates',
        'contradicts',
        'reconciled_by_context',
        'unrelated'
      )
    ),

  reasoning text not null,

  confidence float
    check (confidence >= 0 and confidence <= 1),

  created_at timestamp with time zone default now(),

  -- Prevent the same relationship from being inserted twice
  unique(fact_id_a, fact_id_b)
);


-- ------------------------------------------------------------
-- 3. Fact similarity search
-- ------------------------------------------------------------

create or replace function match_facts(
  query_embedding vector(768),
  source_document_id uuid,
  match_count int default 8,
  min_similarity float default 0.65
)
returns table (
  fact_id uuid,
  document_id uuid,
  page_number integer,
  subject text,
  predicate text,
  value text,
  unit text,
  time_period text,
  scope text,
  quote text,
  confidence float,
  similarity float
)
language sql
stable
as $$
  select
    f.id as fact_id,
    f.document_id,
    f.page_number,
    f.subject,
    f.predicate,
    f.value,
    f.unit,
    f.time_period,
    f.scope,
    f.quote,
    f.confidence,
    1 - (f.embedding <=> query_embedding) as similarity

  from facts f

  where
    f.document_id <> source_document_id
    and f.embedding is not null
    and 1 - (f.embedding <=> query_embedding) >= min_similarity

  order by f.embedding <=> query_embedding

  limit match_count;
$$;


-- ------------------------------------------------------------
-- 4. Helpful indexes
-- ------------------------------------------------------------

create index if not exists facts_document_id_idx
on facts(document_id);

create index if not exists facts_subject_idx
on facts(subject);

create index if not exists facts_predicate_idx
on facts(predicate);

create index if not exists fact_relationships_fact_a_idx
on fact_relationships(fact_id_a);

create index if not exists fact_relationships_fact_b_idx
on fact_relationships(fact_id_b);