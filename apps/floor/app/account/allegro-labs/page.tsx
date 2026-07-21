import Link from "next/link";
import {
  complianceEngineProject,
  realAccount,
  realBroadcast,
  realEngineers,
} from "@algoricast/registry";
import {
  accountPath,
  broadcastLabel,
  displayId,
  titleCase,
  uppercase,
} from "../../../lib/presentation";

const engineers = realEngineers.filter((engineer) =>
  realAccount.engineers.includes(
    engineer.id as (typeof realAccount.engineers)[number],
  ),
);

const broadcasts = realBroadcast.account === realAccount.id ? [realBroadcast] : [];
const projectPath = `${accountPath(realAccount)}/${complianceEngineProject.id}`;

export default function AccountPage() {
  return (
    <main className="floor-shell detail-shell">
      <header className="detail-header">
        <p className="u">ACCOUNT №{realAccount.id} · THE FLOOR</p>
        <h1>{realAccount.org}</h1>
      </header>

      <section className="standing-panel">
        <p className="u">STANDING — EARNED THROUGH THE LOOP, NEVER BOUGHT AT THE DOOR</p>
        <strong>{realAccount.standing}</strong>
      </section>

      <section className="account-section">
        <h2>ENGINEERS</h2>
        {engineers.length > 0 ? (
          <ul className="engineer-grid">
            {engineers.map((engineer) => (
              <li key={engineer.id}>{titleCase(engineer.id)}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">NOTHING CAST YET — THE FLOOR IS QUIET.</p>
        )}
      </section>

      <section className="account-section">
        <h2>PROJECTS</h2>
        <Link className="account-row" href={projectPath}>
          <span className="row-leading">
            <span>
              {displayId(complianceEngineProject.id)} — {uppercase(complianceEngineProject.owner)}
            </span>
            <span className="stamp">PROJECT</span>
          </span>
          <span className="stamp">▪ {uppercase(complianceEngineProject.status)}</span>
        </Link>
      </section>

      <section className="account-section">
        <h2>BROADCASTS</h2>
        {broadcasts.length > 0 ? (
          broadcasts.map((broadcast) => (
            <article className="account-row broadcast-row" key={broadcast.id}>
              <span>{broadcastLabel(broadcast)} — {uppercase(broadcast.caster)}</span>
              <span className="stamp stamp-market">{uppercase(broadcast.state)}</span>
            </article>
          ))
        ) : (
          <p className="empty-state">NOTHING CAST YET — THE FLOOR IS QUIET.</p>
        )}
      </section>
    </main>
  );
}
