import {
  complianceEngineProject,
  realAccount,
} from "@algoricast/registry";
import { displayId, uppercase } from "../../../../lib/presentation";

export default function ComplianceEnginePage() {
  return (
    <main className="floor-shell project-shell">
      <header className="detail-header project-header">
        <p className="u">
          PROJECT · ACCOUNT №{realAccount.id} · OWNER — {uppercase(complianceEngineProject.owner)}
        </p>
        <h1>{displayId(complianceEngineProject.id)}</h1>
      </header>

      <div className="project-body">
        <p className="project-summary">
          A project lives inside the account. It becomes a broadcast only when
          its owner casts it — covenant first, labor second.
        </p>
        <p className="stamp project-stamp">▪ {uppercase(complianceEngineProject.status)}</p>
        <button className="cast-chip" type="button" disabled>
          CAST THIS PROJECT → · REQUIRES L3 — CASTER
        </button>
      </div>
    </main>
  );
}
