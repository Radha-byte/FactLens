# Braid Backend API

## Upload Document

POST

/api/documents/upload

FormData:

file : PDF

Returns

{
  success,
  fileName,
  publicUrl,
  ai
}

---------------------------------

## Get All Documents

GET

/api/documents

Returns

[
  {
    id,
    file_name,
    summary,
    doc_type
  }
]

---------------------------------

## Get One Document

GET

/api/documents/:id

Returns

{
  document,
  entities,
  flags
}

---------------------------------

## Equipment API

GET

/api/equipment

Returns all extracted equipment/entities.