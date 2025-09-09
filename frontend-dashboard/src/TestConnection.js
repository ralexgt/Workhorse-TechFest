import { useState } from "react";

const API_BASE = "https://vehicle-dismantling-api.azurewebsites.net";

export default function TestConnection() {
  const [text, setText] = useState("Hello from the frontend 👋");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function send() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/test-connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${body}`);
      }

      const json = await res.json();
      setResult(json);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 680, margin: "40px auto", padding: 16 }}>
      <h1>/testConnection</h1>
      <p>
        Sends a JSON payload to <code>{API_BASE}/api/post-data</code> and shows
        the response.
      </p>

      <label style={{ display: "block", marginBottom: 8 }}>
        Text to send (as <code>{`{ "text": "<value>" }`}</code>):
      </label>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", padding: 10, fontSize: 16 }}
        placeholder="Type something…"
      />

      <div style={{ marginTop: 12 }}>
        <button onClick={send} disabled={loading} style={{ padding: "10px 16px" }}>
          {loading ? "Sending…" : "Test connection"}
        </button>
      </div>

      {error && (
        <pre style={{ color: "crimson", background: "#fee", padding: 12, marginTop: 16 }}>
          {error}
        </pre>
      )}

      {result && (
        <pre style={{ background: "#f6f8fa", padding: 12, marginTop: 16 }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
