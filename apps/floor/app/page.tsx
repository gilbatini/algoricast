import { CANON_VERSION, CHAIN, PRIMITIVES } from "@algoricast/canon";

export default function Floor() {
  return (
    <main>
      <p className="u">ALGORICAST · THE FLOOR · CANON {CANON_VERSION}</p>
      <h1>
        Thinking is the work.
        <br />
        Proof is the pay.
      </h1>
      <div className="chain">{CHAIN}</div>
      <p className="u" style={{ marginTop: 36 }}>
        NINE OBJECTS. NOTHING ELSE.
      </p>
      <ol>
        {PRIMITIVES.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>
    </main>
  );
}
