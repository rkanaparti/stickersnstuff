'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToBag } from '@/components/bag';
import type { Product } from '@/lib/db';

export default function Picker({ product }: { product: Product }) {
  const router = useRouter();
  const [size, setSize] = useState(product.sizes[0] || '');
  const [color, setColor] = useState(product.colors[0] || '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = product.stock !== null && product.stock <= 0;

  function add() {
    addToBag({
      product_id: product.id, name: product.name, price_cents: product.price_cents,
      size: size || undefined, color: color || undefined, qty,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => router.push('/bag'), 500);
  }

  if (soldOut) return <p className="card center"><strong>Sold out for now</strong></p>;

  return (
    <div style={{ marginTop: 8 }}>
      {product.sizes.length > 0 && (
        <>
          <label>Size</label>
          <div className="chips">
            {product.sizes.map((s) => (
              <label key={s} className="chip">
                <input type="radio" name="size" checked={size === s} onChange={() => setSize(s)} />
                {s}
              </label>
            ))}
          </div>
        </>
      )}

      {product.colors.length > 0 && (
        <>
          <label>Color</label>
          <div className="chips">
            {product.colors.map((c) => (
              <label key={c} className="chip">
                <input type="radio" name="color" checked={color === c} onChange={() => setColor(c)} />
                {c}
              </label>
            ))}
          </div>
        </>
      )}

      <label>How many</label>
      <div className="chips">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="chip">
            <input type="radio" name="qty" checked={qty === n} onChange={() => setQty(n)} />
            {n}
          </label>
        ))}
      </div>

      <div style={{ marginTop: 26 }}>
        <button className="btn" onClick={add} disabled={added}>
          {added ? 'Added ✓' : 'Add to bag'}
        </button>
      </div>
    </div>
  );
}
