import { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, LIMITS, type BalloonSettings } from './model';

async function api<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`/_emdash/api/plugins/globos-balloons/${path}`, { method: body ? 'POST' : 'GET', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-EmDash-Request': '1' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const value = await r.json() as { success?: boolean; error?: { message?: string }; data: T };
  if (!r.ok || !value.success) throw new Error(value.error?.message || 'No se pudo guardar la configuración.');
  return value.data as T;
}

function BalloonsAdmin() {
  const [config, setConfig] = useState<BalloonSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  useEffect(() => { api<{ config: BalloonSettings }>('config').then(v => { setConfig(v.config); setReady(true); }).catch(e => setMessage(e.message)); }, []);
  const update = <K extends keyof BalloonSettings>(key: K, value: BalloonSettings[K]) => setConfig(s => ({ ...s, [key]: value }));
  const save = async () => { setBusy(true); setMessage(''); try { const v = await api<{ config: BalloonSettings }>('save', config); setConfig(v.config); setMessage('Guardado. Se ve al recargar la página; las que estén en caché tardan hasta una hora.'); } catch (e) { setMessage(e instanceof Error ? e.message : 'Error al guardar.'); } finally { setBusy(false); } };
  const check = (key: 'enabled' | 'strings' | 'interactive' | 'pop' | 'articles', label: string, help: string) => (
    <label className="fila"><input type="checkbox" checked={config[key]} onChange={e => update(key, e.target.checked)} /><span><b>{label}</b><small>{help}</small></span></label>
  );
  return <div className="globos-bandada-admin">
    <style>{`.globos-bandada-admin{max-width:760px;padding:24px;color:var(--foreground,inherit)}.globos-bandada-admin h1{font-size:28px;font-weight:700}.globos-bandada-admin h2{font-size:18px;font-weight:700;margin:28px 0 10px}.globos-bandada-admin p{margin:8px 0 0;opacity:.8}.globos-bandada-admin .fila{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent)}.globos-bandada-admin .fila input[type=checkbox]{margin-top:4px;width:18px;height:18px}.globos-bandada-admin small{display:block;opacity:.7;font-size:13px}.globos-bandada-admin .campo{display:grid;gap:6px;padding:10px 0;border-bottom:1px solid color-mix(in srgb,currentColor 12%,transparent)}.globos-bandada-admin .campo input[type=range]{width:100%}.globos-bandada-admin output{font-variant-numeric:tabular-nums;font-weight:700}.globos-bandada-admin button{margin-top:24px;padding:10px 18px;border-radius:8px;border:0;background:#cc2244;color:#fff;font-weight:700;cursor:pointer}.globos-bandada-admin button:disabled{opacity:.6}.globos-bandada-admin .aviso{margin-top:14px;font-weight:600}`}</style>
    <h1>Globos de la página</h1>
    <p>Los globos con cuerda que acompañan el recorrido en la portada, los países, las ciudades y las fichas de curso. Pasan por detrás del contenido: nunca tapan texto ni botones.</p>
    {!ready ? <p className="aviso">{message || 'Cargando…'}</p> : <>
      <h2>Mostrar</h2>
      {check('enabled', 'Mostrar los globos', 'Apágalo para quitarlos de todo el sitio.')}
      {check('articles', 'También en los artículos del blog', 'Por defecto no salen donde se lee.')}
      <h2>Cantidad y tamaño</h2>
      <label className="campo"><span><b>Globos en computador</b> <output>{config.count}</output></span><input type="range" min={0} max={LIMITS.count} step={1} value={config.count} onChange={e => update('count', Number(e.target.value))} /><small>De 0 a {LIMITS.count}. Los dos primeros son los grandes de los lados.</small></label>
      <label className="campo"><span><b>Globos en celular y tableta</b> <output>{config.countMobile}</output></span><input type="range" min={0} max={LIMITS.countMobile} step={1} value={config.countMobile} onChange={e => update('countMobile', Number(e.target.value))} /><small>De 0 a {LIMITS.countMobile}. En pantallas pequeñas solo asoman por los bordes.</small></label>
      <label className="campo"><span><b>Tamaño</b> <output>{config.size} %</output></span><input type="range" min={LIMITS.sizeMin} max={LIMITS.sizeMax} step={5} value={config.size} onChange={e => update('size', Number(e.target.value))} /><small>100 % es el tamaño del diseño.</small></label>
      <h2>Comportamiento</h2>
      {check('strings', 'Con cuerda', 'Cuelga del nudo y se balancea con el globo.')}
      <label className="campo"><span><b>Tipo de cuerda</b></span><select value={config.stringStyle} onChange={e => update('stringStyle', e.target.value === 'serpentina' ? 'serpentina' : 'cuerda')}><option value="cuerda">Cuerda fina (cae recta)</option><option value="serpentina">Serpentina rizada (del color del globo, más elástica)</option></select><small>La serpentina se enrosca y rebota como una cinta rizada; la cuerda cae a plomo.</small></label>
      {check('interactive', 'Se pueden tocar', 'El cursor los empuja y se pueden agarrar, arrastrar y lanzar.')}
      {check('pop', 'Se revientan con doble clic', 'Al rato sube uno nuevo. Necesita «Se pueden tocar».')}
      <button disabled={busy} onClick={save}>{busy ? 'Guardando…' : 'Guardar'}</button>
      {message && <p className="aviso" role="status">{message}</p>}
    </>}
  </div>;
}
export const pages = { '/globos': BalloonsAdmin };
