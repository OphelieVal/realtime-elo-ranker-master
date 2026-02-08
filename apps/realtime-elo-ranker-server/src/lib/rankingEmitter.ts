import { EventEmitter } from "events";

export const rankingEmitter = new EventEmitter();

rankingEmitter.setMaxListeners(50);