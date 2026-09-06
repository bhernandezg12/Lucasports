import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const productosPrueba = [
  {
    nombre: "Real Madrid Home 26/27",
    liga: "LaLiga",
    club: "Real Madrid",
    categoria: "Club",
    temporada: "26/27",
    precio: 189000,
    tallas: ["S", "M", "L", "XL"],
    imageUrls: ["https://images.unsplash.com/photo-1511746315387-c4a76990fdce?q=80&w=800"],
    destacado: true,
    descuento: 0,
    nuevo: true
  },
  {
    nombre: "Arsenal Home 26/27",
    liga: "Premier League",
    club: "Arsenal",
    categoria: "Club",
    temporada: "26/27",
    precio: 185000,
    tallas: ["S", "M", "L", "XL"],
    imageUrls: ["https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=800"],
    destacado: true,
    descuento: 15,
    nuevo: false
  },
  {
    nombre: "Camiseta Colombia Retro 1990",
    liga: "Selecciones",
    club: "Selección Colombia",
    categoria: "Retro",
    temporada: "Retro",
    precio: 195000,
    tallas: ["M", "L", "XL"],
    imageUrls: ["https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800"],
    destacado: true,
    descuento: 0,
    nuevo: true
  }
];

export async function cargarSeed() {
  const resultados = [];
  for (const producto of productosPrueba) {
    const docRef = await addDoc(collection(db, 'productos'), producto);
    resultados.push({ id: docRef.id, nombre: producto.nombre });
  }
  return resultados;
}