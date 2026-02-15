# Technical Design Document: BharatAGI

## 1. System Architecture
BharatAGI follows a **Cloud-Native Agentic Architecture** consisting of four primary layers:

### A. Ingestion Layer
- **Interface:** WhatsApp Business API / Custom Web-App.
- **Input Processing:** - Audio -> Bhashini S2S (Speech-to-Text).
    - Images -> Vision-Language Model (VLM) for document reasoning.

### B. Orchestration Layer (The Brain)
- **Framework:** LangGraph / CrewAI.
- **Core LLM:** Claude 3.5 Sonnet or Llama 3.2.
- **Reasoning Loop:** The agent uses a **ReAct (Reason + Act)** pattern to:
    1. Parse the user's natural language intent.
    2. Decide if more documents/info are needed.
    3. Query the Knowledge Base.

### C. Knowledge & Retrieval Layer (Agentic RAG)
- **Vector DB:** Pinecone / Milvus.
- **Data Source:** Verified PDFs of government gazettes and scheme guidelines.
- **Retrieval:** Semantic search that maps local slang to official policy keywords.

### D. Execution & Output Layer
- **Form Engine:** Python `reportlab` library to generate PDFs from the Agent's structured output.
- **Notification:** SMS / WhatsApp confirmation with a download link.

## 2. Design Patterns
- **Planning Pattern:** Breaking the "Apply for Scheme" goal into sub-tasks (Verify -> Fill -> Submit).
- **Reflection Pattern:** The Agent critiques its own form-filling to ensure all required fields match the uploaded Aadhaar/Ration card data.

## 3. Data Flow
1. **Input:** User sends a voice note: *"Mera khet doob gaya"* (My field flooded).
2. **ASR:** Bhashini converts to text.
3. **Reasoning:** Agent identifies need for "Crop Insurance."
4. **Tool Use:** Agent requests a photo of the "Land Records."
5. **Vision:** VLM extracts "Khasra Number."
6. **Output:** Agent generates a filled PMFBY form and sends it back to the user.

## 4. Security
- **PII Guardrails:** AWS Comprehend or custom regex layers to detect and mask Aadhaar numbers before the data hits the reasoning LLM.
