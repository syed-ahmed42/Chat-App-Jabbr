import { io } from "socket.io-client";
import * as CONSTANTS from "../utils/constants";

// "undefined" means the URL will be computed from the `window.location` object
const URL = CONSTANTS.dev;

export const socket = io(URL);
