# MedOberarzt Pro — product specification 0.2.0
Six physician-facing workflows: MedBrief Pro, MedOberarzt Clinical, CardioExpert Pro, NeuroRad Expert, MedAcademy Pro and MedPharma Safety.
German default; Arabic, Turkish and English on request. Intended developer: Mohamad Hadi Ktaech (legal operator details to be confirmed).
Current implementation: read-only instruction and source-portal catalog. ChatGPT performs any generation; this server does not invoke a model or retrieve live medical guidance. No autonomous orders, prescriptions or record writes.
Requested target: analysis of fictional case narratives, medical images and examination results in ChatGPT. Images require adequate resolution, calibration/modality context and explicit uncertainty. Never represent general model vision as validated radiology or ECG software. Future server-side analysis/upload processing requires separate design, validation and privacy review.
Not six independent GPT store listings: this is one plugin package containing six Skills. Separate public assistants require separately configured product entries and review.
Release status: engineering prototype, not clinically validated, not submitted and not approved.
