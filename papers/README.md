# Curated research PDFs

Run `node scripts/ingest-papers.ts` from the application directory after adding papers here.

`metadata.json` is keyed by PDF filename (or relative path for subdirectories):

```json
{
  "Example.pdf": {
    "title": "Full paper title",
    "year": "2024",
    "population": "pediatric",
    "topic": "Assessment",
    "evidence_type": "systematic review/meta-analysis",
    "audience": "caregiver_clinician",
    "retrieval_group": "general",
    "source_url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC.../"
  }
}
```

Every paper must include `population`, `topic`, `evidence_type`, `audience`, and `year`. Allowed population values are `pediatric`, `adolescent`, `adult`, and `mixed`. Ingestion stops before uploading if a required field is missing or the population value is invalid.

Use `safety` for the suicide-risk review. Missing/unrecognized groups become `unreviewed` and are not retrieved until reviewed. Do not place secrets, patient records, or unrelated documents here. Ingestion uploads all PDFs to OpenAI, even if marked unreviewed.

Current files are generated text reading copies of the curated PMC sources, not original publisher PDFs; original figures/layout are absent. The duplicate Stein primer is included only once.
