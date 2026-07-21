import type { Account, Broadcast } from "@algoricast/canon";

type CastBroadcast = Broadcast & { caster: string };

export function uppercase(value: string): string {
  return value.toLocaleUpperCase("en-US");
}

export function titleCase(value: string): string {
  return value.replace(/(^|[-\s])([a-z])/g, (_, lead: string, letter: string) =>
    `${lead}${letter.toLocaleUpperCase("en-US")}`,
  );
}

export function displayId(value: string): string {
  return uppercase(value.replaceAll("-", " "));
}

export function accountPath(account: Account): string {
  return `/account/${account.org.toLocaleLowerCase("en-US").replaceAll(" ", "-")}`;
}

export function broadcastLabel(broadcast: Broadcast): string {
  return `${uppercase(broadcast.id)} · ${uppercase(broadcast.spec)}`;
}

export function broadcastMeta(broadcast: CastBroadcast): string {
  return `CAST BY ${uppercase(broadcast.caster)} · ${uppercase(broadcast.state)}`;
}
