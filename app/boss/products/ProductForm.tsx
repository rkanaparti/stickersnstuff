import Link from 'next/link';
import Uploader from '@/components/Uploader';
import { saveProduct, deleteProduct } from '../actions';
import type { Product } from '@/lib/db';

const SIZE_PRESET = 'YS, YM, YL, S, M, L, XL';

export default function ProductForm({ p }: { p?: Product }) {
  return (
    <main>
      <p><Link href="/boss/products" className="muted" style={{ textDecoration: 'none' }}>← back</Link></p>
      <h1 style={{ fontSize: '2rem', margin: '6px 0 18px' }}>
        {p ? 'Edit' : 'New thing'}
      </h1>

      <form action={saveProduct}>
        {p && <input type="hidden" name="id" value={p.id} />}

        <Uploader name="images" initial={p?.images} />

        <label htmlFor="name">What is it</label>
        <input id="name" name="name" defaultValue={p?.name} required placeholder="Sad Cat Sticker" />

        <label htmlFor="price">Price</label>
        <input
          id="price" name="price" type="number" step="0.25" min="0" inputMode="decimal"
          defaultValue={p ? (p.price_cents / 100).toFixed(2) : ''} required placeholder="3.00"
        />

        <label htmlFor="kind">Type</label>
        <select id="kind" name="kind" defaultValue={p?.kind || 'sticker'}>
          <option value="sticker">Sticker</option>
          <option value="shirt">Shirt</option>
          <option value="hat">Hat</option>
          <option value="other">Something else</option>
        </select>

        <label htmlFor="audience">Who is it for</label>
        <select id="audience" name="audience" defaultValue={p?.audience || 'everyone'}>
          <option value="everyone">Everyone</option>
          <option value="girls">Girls</option>
          <option value="boys">Boys</option>
        </select>

        <label htmlFor="sizes">Sizes <span className="muted">(leave blank for stickers)</span></label>
        <input id="sizes" name="sizes" defaultValue={p?.sizes.join(', ')} placeholder={SIZE_PRESET} />

        <label htmlFor="colors">Colors <span className="muted">(comma separated)</span></label>
        <input id="colors" name="colors" defaultValue={p?.colors.join(', ')} placeholder="white, black, sage" />

        <label htmlFor="blurb">Say something about it <span className="muted">(optional)</span></label>
        <textarea id="blurb" name="blurb" rows={2} defaultValue={p?.blurb || ''} />

        <label htmlFor="stock">How many you have <span className="muted">(blank = unlimited)</span></label>
        <input id="stock" name="stock" type="number" min="0" inputMode="numeric" defaultValue={p?.stock ?? ''} />

        <label className="chip" style={{ display: 'inline-flex', marginTop: 20, gap: 8 }}>
          <input type="checkbox" name="active" defaultChecked={p ? p.active : true} />
          Show it in my store
        </label>

        <div style={{ marginTop: 26 }}>
          <button className="btn">{p ? 'Save it' : 'Put it in my store'}</button>
        </div>
      </form>

      {p && (
        <form action={deleteProduct} style={{ marginTop: 14 }}>
          <input type="hidden" name="id" value={p.id} />
          <button className="btn ghost small">Delete this</button>
        </form>
      )}
    </main>
  );
}
