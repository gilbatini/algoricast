import Link from "next/link";
import { CANON_VERSION, CHAIN, PRIMITIVES } from "@algoricast/canon";
import { realAccount, realBroadcast } from "@algoricast/registry";
import {
  accountPath,
  broadcastLabel,
  broadcastMeta,
} from "../lib/presentation";

export default function Floor() {
  return (
    <main className="floor-shell">
      <header className="masthead">
        <p className="u">ALGORICAST · THE FLOOR · CANON {CANON_VERSION}</p>
        <h1>
          Thinking is the work.
          <br />
          Proof is the pay.
        </h1>
      </header>

      <div className="chain">{CHAIN}</div>

      <div className="board-rail">
        <Link className="rail-card rail-card-account" href={accountPath(realAccount)}>
          <span className="rail-title">№{realAccount.id} · {realAccount.org}</span>
          <span className="rail-meta">SIX ENGINEERS · ONE ORG IDENTITY</span>
          <span className="rail-action">ENTER THE ACCOUNT →</span>
        </Link>

        <article className="rail-card rail-card-broadcast">
          <span className="rail-title">{broadcastLabel(realBroadcast)}</span>
          <span className="rail-meta">{broadcastMeta(realBroadcast)}</span>
        </article>
      </div>

      <section className="primitives">
        <p className="u">NINE OBJECTS. NOTHING ELSE.</p>
        <ol>
          {PRIMITIVES.map((primitive) => (
            <li key={primitive}>{primitive}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
