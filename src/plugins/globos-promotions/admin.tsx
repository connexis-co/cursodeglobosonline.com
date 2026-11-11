import { useEffect, useState } from 'react';
import { countdownParts, type OfferCheck, type PromotionState } from './model';

interface Campaign {
  id: string;
  slug: string | null;
  status: string;
  state: PromotionState;
  title: string;
  label: string;
  headline: string;
  startsAt: string;
  endsAt: string;
  coupon: string;
  discountPct: number | null;
  urlKey: string;
  theme: string;
  offerVerified: boolean;
  notes: string;
  source: string;
}
interface Verification {
  checkedAt: string;
  coupon: string;
  discountPct: number;
  allOk: boolean;
  checks: (OfferCheck & { title: string })[];
}

async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/_emdash/api/plugins/globos-promotions/${path}`, {
    method: body ? 'POST' : 'GET',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-EmDash-Request': '1' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const value = (await response.json()) as { success?: boolean; error?: { message?: string }; data: T };
  if (!response.ok) throw new Error(value.error?.message || 'No se pudo completar la operación.');
  return value.data;
}

const STATES: Record<PromotionState, { label: string; help: string; tone: string }> = {
  live: { label: 'Activa ahora', help: 'Pone el precio, el cupón y la cuenta atrás en el sitio.', tone: 'ok' },
  scheduled: { label: 'Programada', help: 'Publicada y verificada. Empieza sola en su fecha.', tone: 'info' },
  draft: { label: 'Borrador', help: 'No se muestra en el sitio.', tone: 'muted' },
  unverified: { label: 'Sin verificar', help: 'Publicada, pero no se muestra hasta marcar la oferta como verificada.', tone: 'warn' },
  ended: { label: 'Terminada', help: 'Su fecha de fin ya pasó.', tone: 'muted' },
  invalid: { label: 'Fechas inválidas', help: 'El inicio debe ser anterior al fin.', tone: 'warn' },
};

const when = (value: string): string => {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' }).format(date)
    : 'Sin definir';
};
const usd = (value?: number): string => (value === undefined ? '—' : `US$${value.toFixed(2).replace('.', ',')}`);
const remaining = (ms: number): string => {
  const { d, h, m } = countdownParts(ms);
  return d > 0 ? `${d} d ${h} h` : h > 0 ? `${h} h ${m} min` : `${m} min`;
};

const CSS = `
.promo-cal{padding:24px;max-width:1180px;color:var(--foreground,inherit)}
.promo-cal h1{font-size:28px;font-weight:700}
.promo-cal h2{font-size:18px;font-weight:700;margin:28px 0 8px}
.promo-cal p{margin:10px 0;max-width:78ch;line-height:1.5}
.promo-cal .ahora{margin:18px 0;padding:14px 16px;border:1px solid #8885;border-radius:10px}
.promo-cal .ahora b{font-size:17px}
.promo-cal .filtros{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:18px}
.promo-cal input,.promo-cal button{border:1px solid #8888;border-radius:6px;padding:7px 11px;color:inherit;background:transparent;font:inherit}
.promo-cal button{cursor:pointer;font-weight:600}
.promo-cal button:disabled{opacity:.5;cursor:default}
.promo-cal .tabla{overflow:auto;margin-top:14px}
.promo-cal table{width:100%;border-collapse:collapse}
.promo-cal th,.promo-cal td{text-align:left;border-bottom:1px solid #8884;padding:12px 10px;vertical-align:top}
.promo-cal th{font-size:13px;opacity:.75;font-weight:600}
.promo-cal a{text-decoration:underline}
.promo-cal small{display:block;opacity:.75;margin-top:3px;line-height:1.4}
.promo-cal .chip{display:inline-block;border-radius:999px;padding:3px 10px;font-size:12.5px;font-weight:700;white-space:nowrap}
.promo-cal .chip.ok{background:#16794a;color:#fff}
.promo-cal .chip.info{background:#1f5fa8;color:#fff}
.promo-cal .chip.warn{background:#a35a00;color:#fff}
.promo-cal .chip.muted{background:#8883}
.promo-cal .resultado{margin:10px 0 4px;padding:12px 14px;border:1px solid #8885;border-radius:10px}
.promo-cal .resultado td,.promo-cal .resultado th{padding:6px 10px}
.promo-cal .bien{color:#16794a;font-weight:700}
.promo-cal .mal{color:#b3261e;font-weight:700}
`;

function Calendar() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState('');
  const [month, setMonth] = useState('');
  const [checking, setChecking] = useState('');
  const [results, setResults] = useState<Record<string, Verification | string>>({});

  useEffect(() => {
    api<{ items: Campaign[]; now: number }>('calendar')
      .then((data) => {
        setItems(data.items);
        setNow(data.now);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const verify = async (id: string) => {
    setChecking(id);
    try {
      const result = await api<Verification>('verify', { id });
      setResults((current) => ({ ...current, [id]: result }));
    } catch (e) {
      setResults((current) => ({ ...current, [id]: (e as Error).message }));
    } finally {
      setChecking('');
    }
  };

  const live = items.filter((item) => item.state === 'live' && !item.urlKey);
  const visible = items
    .filter((item) => !month || (item.startsAt.slice(0, 7) <= month && item.endsAt.slice(0, 7) >= month))
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));

  return (
    <div className="promo-cal">
      <style>{CSS}</style>
      <h1>Calendario de promociones</h1>
      <p>
        La campaña activa pone en el sitio el precio rebajado, el cupón en los botones de pago, la barra superior y la
        cuenta atrás. Cuando llega su fecha de fin, el sitio vuelve solo al precio de lista de cada curso. Las fechas
        están en hora de Colombia.
      </p>
      <p>
        Para lanzar una campaña: escribe el cupón y el porcentaje, pulsa «Comprobar en Hotmart» y, si el checkout cobra
        lo esperado, marca la oferta como verificada y publícala. Una campaña en borrador o sin verificar no se
        muestra.
      </p>

      <div className="ahora" role="status">
        {live.length ? (
          live.map((item) => (
            <div key={item.id}>
              <b>
                Ahora en el sitio: {item.label || item.title}
                {item.discountPct ? ` (−${item.discountPct} %)` : ''}
              </b>
              <small>
                Termina en {remaining(Date.parse(item.endsAt) - now)} ({when(item.endsAt)})
              </small>
            </div>
          ))
        ) : (
          <b>Ahora no hay ninguna campaña activa: el sitio muestra el precio de lista.</b>
        )}
      </div>

      <div className="filtros">
        <label>
          Mes <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </label>
        <button onClick={() => setMonth('')}>Ver todas</button>
      </div>
      {error && <p role="alert">{error}</p>}

      <div className="tabla">
        <table>
          <thead>
            <tr>
              <th>Campaña</th>
              <th>Inicio / fin (exclusivo)</th>
              <th>Descuento</th>
              <th>Estado</th>
              <th>Comprobación</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => {
              const state = STATES[item.state];
              const result = results[item.id];
              return (
                <tr key={item.id}>
                  <td>
                    <a href={`/_emdash/admin/content/promotions/${item.id}`}>{item.title || item.slug}</a>
                    <small>{item.headline}</small>
                    {item.urlKey && <small>Solo con ?promo={item.urlKey}</small>}
                  </td>
                  <td>
                    {when(item.startsAt)}
                    <br />
                    {when(item.endsAt)}
                    {item.state === 'scheduled' && <small>Empieza en {remaining(Date.parse(item.startsAt) - now)}</small>}
                    {item.state === 'live' && <small>Termina en {remaining(Date.parse(item.endsAt) - now)}</small>}
                  </td>
                  <td>
                    {item.discountPct ? `−${item.discountPct} %` : 'Sin porcentaje'}
                    <small>{item.coupon ? `Cupón ${item.coupon}` : 'Sin cupón'}</small>
                  </td>
                  <td>
                    <span className={`chip ${state.tone}`}>{state.label}</span>
                    <small>{state.help}</small>
                  </td>
                  <td>
                    <button
                      disabled={!item.coupon || !item.discountPct || checking === item.id}
                      onClick={() => verify(item.id)}
                    >
                      {checking === item.id ? 'Abriendo el checkout…' : 'Comprobar en Hotmart'}
                    </button>
                    <small>{item.offerVerified ? 'Marcada como verificada.' : 'Pendiente de verificar.'}</small>
                    {typeof result === 'string' && (
                      <p className="mal" role="alert">
                        {result}
                      </p>
                    )}
                    {result && typeof result !== 'string' && (
                      <div className="resultado" role="status">
                        <b className={result.allOk ? 'bien' : 'mal'}>
                          {result.allOk
                            ? `El cupón ${result.coupon} da el ${result.discountPct} % en todos los cursos.`
                            : `El cupón ${result.coupon} no da el ${result.discountPct} % en todos los cursos.`}
                        </b>
                        <table>
                          <thead>
                            <tr>
                              <th>Curso</th>
                              <th>Lista</th>
                              <th>Esperado</th>
                              <th>Hotmart cobra</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.checks.map((check) => (
                              <tr key={check.course}>
                                <td>
                                  {check.title}
                                  {!check.ok && <small>{check.note}</small>}
                                </td>
                                <td>{usd(check.listPrice)}</td>
                                <td>{usd(check.expected)}</td>
                                <td className={check.ok ? 'bien' : 'mal'}>{usd(check.charged)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <small>Comprobado el {when(result.checkedAt)}.</small>
                      </div>
                    )}
                    {item.notes && <small>{item.notes}</small>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const pages = { '/calendar': Calendar };
