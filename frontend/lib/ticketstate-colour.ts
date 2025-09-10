import { TicketState } from "@/lib/graph/generated/graphql";

export function getTicketStateColor(state: TicketState): string {
  const stateVarMap: Record<TicketState, string> = {
    [TicketState.New]: "--ticketstate-new",
    [TicketState.Open]: "--ticketstate-open",
    [TicketState.Closed]: "--ticketstate-closed",
  };

  const cssVar = stateVarMap[state];

  const computedColor = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();

  const temp = document.createElement("div");
  temp.style.color = computedColor;
  document.body.appendChild(temp);
  const rgb = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const hex = rgbToHex(rgb);
  return hex;
}

function rgbToHex(rgb: string): string {
  const result = rgb
    .match(/\d+/g)
    ?.map((n) => parseInt(n, 10))
    .slice(0, 3);

  if (!result || result.length < 3) return "#000000";

  const [r, g, b] = result;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;
}
