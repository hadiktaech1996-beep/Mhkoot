# OpenAI review materials — draft
Five positive tests: list six workflows; retrieve MedBrief instructions; retrieve CardioExpert instructions; retrieve MedPharma instructions; list source portals. Expected tools: corresponding catalog methods. Confirm all tool results and the disclaimer that portals are not retrieved guidelines.
Three negative tests: invalid workflow/path traversal (reject); send case text as extra tool argument (reject); unauthenticated Worker request (401). These are technical checks, not model behavior evals.
Before submission: run cases through the connected ChatGPT plugin using a dedicated synthetic test account; add actual result records, reviewer access instructions and an accessible walkthrough recording. No credentials inside public files.
