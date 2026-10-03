import {env} from 'cloudflare:workers';
import {isProductionAdmin, type ProductionAccessEnv} from '../lib/production-access';

/** Named administrator using EmDash's supported external authentication interface. */
export async function authenticate(request: Request) {
  if (!await isProductionAdmin(request, env as ProductionAccessEnv)) throw Error('Administrator authentication required');
  return {email:'contacto@sably.co',name:'sably',role:50,subject:'globos-production-admin'};
}
