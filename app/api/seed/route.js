import { NextResponse } from 'next/server';
import { cargarSeed } from '@/lib/seed';

export async function GET() {
  try {
    const insertados = await cargarSeed();
    return NextResponse.json({
      ok: true,
      mensaje: '¡Productos de prueba subidos correctamente a Firestore!',
      data: insertados
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}