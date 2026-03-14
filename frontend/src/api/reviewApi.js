import api from "./axios";

export async function submitReview(code, language, problemName) {
  const { data } = await api.post("/review", { code, language, problemName });
  return data;
}

export async function submitReviewStream(code, language, problemName, onChunk) {
  const token = localStorage.getItem("token");
  const apiKey = localStorage.getItem("groqApiKey");
  const res = await fetch("/api/review/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(apiKey && { "X-Groq-API-Key": apiKey }),
    },
    body: JSON.stringify({ code, language, problemName }),
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.replace(/^data: /, "");
      if (trimmed === "[DONE]") return;
      try {
        const parsed = JSON.parse(trimmed);
        onChunk(parsed.content);
      } catch {
        // ignore parse errors on partial chunks
      }
    }
  }
}

export async function getHints(code, language) {
  const { data } = await api.post("/review/hints", { code, language });
  return data;
}

export async function getComplexity(code, language) {
  const { data } = await api.post("/review/complexity", { code, language });
  return data;
}

export async function getUnitTests(code, language) {
  const { data } = await api.post("/review/unit-tests", { code, language });
  return data;
}

export async function getSubmissions(page = 1, limit = 10) {
  const { data } = await api.get(`/submissions?page=${page}&limit=${limit}`);
  return data;
}

export async function getSubmission(id) {
  const { data } = await api.get(`/submissions/${id}`);
  return data;
}

export async function deleteSubmission(id) {
  const { data } = await api.delete(`/submissions/${id}`);
  return data;
}
