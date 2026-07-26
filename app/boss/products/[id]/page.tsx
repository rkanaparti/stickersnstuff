import { notFound } from 'next/navigation';
import { sql, Product } from '@/lib/db';
import ProductForm from '../ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = (await sql`select * from products where id = ${Number(id)}`) as Product[];
  if (!rows[0]) notFound();
  return <ProductForm p={JSON.parse(JSON.stringify(rows[0]))} />;
}
