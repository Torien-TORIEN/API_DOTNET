export * from './groupEndpoints.service';
import { GroupEndpointsService } from './groupEndpoints.service';
export * from './messageEndpoints.service';
import { MessageEndpointsService } from './messageEndpoints.service';
export * from './postEndpoints.service';
import { PostEndpointsService } from './postEndpoints.service';
export * from './userEndpoints.service';
import { UserEndpointsService } from './userEndpoints.service';
export const APIS = [GroupEndpointsService, MessageEndpointsService, PostEndpointsService, UserEndpointsService];
