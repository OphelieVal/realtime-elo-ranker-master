export type RankingEvent = {
  type: "UPDATE" | "RESET" | "ERROR";
  message: string;
  payload?: unknown;
};