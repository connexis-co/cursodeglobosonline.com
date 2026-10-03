import { env } from 'cloudflare:workers';
import { gate, type StagingAccessEnv } from '../lib/staging-access';
/** EmDash's supported transparent auth interface; enabled only for isolated development. */
export async function authenticate(request:Request){
 const bindings=env as unknown as StagingAccessEnv & {GLOBOS_ENVIRONMENT?:string};
 if(bindings.GLOBOS_ENVIRONMENT!=='development'||await gate(request,bindings))throw Error('Development authentication required');
 return {email:'sably@dev.cursodeglobosonline.com',name:'sably',role:50,subject:'globos-development-admin'};
}
