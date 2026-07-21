import { realAccount } from "@algoricast/registry";
import { requireAccountAccess } from "../../../lib/access";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAccountAccess(realAccount.id);
  return children;
}
