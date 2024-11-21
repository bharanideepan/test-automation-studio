import { Application as ExpressFeathers } from '@feathersjs/express';
import { Server as SocketIOServer } from 'socket.io';

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes { }
// The application instance type that will be used everywhere else
// export type Application = ExpressFeathers<ServiceTypes>;
export interface Application extends ExpressFeathers<ServiceTypes> {
    io?: SocketIOServer; // Correctly typing the `io` property as a Socket.IO server
}
