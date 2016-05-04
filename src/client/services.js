
import io from "socket.io-client";

import { ObservableSocket } from "shared/observable-socket";

export const socket = io({ autoConnecnt: false });
export const server = new ObservableSocket(socket);

// Create socket wrapper
// Create playlist store
// Create user store
// Create chat store.
