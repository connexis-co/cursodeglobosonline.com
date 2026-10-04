/// <reference types="@cloudflare/workers-types" />
/// <reference types="emdash/locals" />

/// <reference types="@astrojs/cloudflare" />

declare namespace App { interface Locals { cmsContent?:{data:Record<string,unknown>;contentRef:{collection:string;id:string;slug:string}} } }
