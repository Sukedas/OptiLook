export default async function Page() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

  let health: unknown = null;
  let healthError: string | null = null;

  try {
    const res = await fetch(`${apiBase}/api/v1/health`, {
      cache: "no-store",
    });
    health = await res.json();
  } catch (err) {
    healthError =
      err instanceof Error ? err.message : "No se pudo obtener healthcheck";
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>OptiLook</h1>
      <p style={{ marginTop: 8, lineHeight: 1.5 }}>
        Interfaz inicial. El frontend intenta leer el healthcheck del backend.
      </p>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>Backend health</h2>
        {healthError ? (
          <pre style={{ whiteSpace: "pre-wrap", color: "#b91c1c" }}>
            {healthError}
          </pre>
        ) : (
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {health ? JSON.stringify(health, null, 2) : "Cargando..."}
          </pre>
        )}
      </section>
    </main>
  );
}
