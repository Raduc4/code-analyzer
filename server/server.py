from fastapi import FastAPI
from pydantic import BaseModel
from llama_cpp import Llama

# Initialize FastAPI app
app = FastAPI(title="Local LLaMA API")

# Load the TinyLLaMA model (adjust path to your .gguf file)
model = Llama(model_path="../models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf")

# Request schema
class PromptRequest(BaseModel):
    prompt: str
    max_tokens: int = 128

def build_prompt(code: str) -> str:
    """
    Builds the structured context prompt that tells the LLM
    how to perform the code review and what JSON format to return.
    """
    prompt = f"""
You are an expert software engineer and AI-powered code review assistant.

Your goal is to review the given source code and return structured, JSON-formatted results with refactored code, detected issues, recommendations, and estimated effort.

Follow these guidelines carefully:

1. Analyze code for:
   - Bugs and correctness issues
   - Code style and readability (follow PEP8, Google Style, etc.)
   - Security vulnerabilities or unsafe patterns
   - Performance and optimization opportunities
   - Testing coverage or missing test cases
   - Architecture and maintainability
   - Documentation quality (docstrings, comments)

2. Suggest improvements or automatic fixes:
   - Refactor code for clarity, simplicity, and safety.
   - Optimize inefficient or redundant logic.
   - Add missing docstrings or type hints.
   - Recommend additional tests or edge cases.

3. Output only JSON — no explanations, markdown, or text outside JSON.

4. Follow exactly this schema:

{{
  "refactored_code": "string - the improved version of the input code",
  "issues": [
    {{
      "id": "ISSUE-001",
      "type": "bug | style | readability | security | performance | testing | documentation | architecture | maintainability",
      "title": "Short issue title",
      "description": "Detailed explanation of the problem",
      "severity": "info | low | medium | high | critical",
      "recommendation": "Suggested fix or improvement"
    }}
  ],
  "recommendations": [
    "High-level recommendations to improve overall code quality"
  ],
  "estimated_effort": "XS (<30m) | S (30–90m) | M (0.5–1d) | L (1–3d) | XL (3–5d) | XXL (5d+)"
}}

5. Return only the JSON block. Do not wrap it in backticks, code fences, or add any commentary.

---

Code to review:
{code}
"""
    return prompt.strip()

# API endpoint
@app.post("/generate")
def generate(request: PromptRequest):
    prompt = build_prompt(request.prompt)
    response = model(prompt, max_tokens=request.max_tokens)
    return {"text": response['choices'][0]['text']}
