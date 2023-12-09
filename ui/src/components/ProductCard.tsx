import Image from "next/image";

interface Props {
  product: any;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="border hover:shadow-lg transition duration-300 p-4 rounded">
      <Image
        width={300}
        height={300}
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-auto rounded lazyload"
        style={{
          maxWidth: "100%",
          height: "auto"
        }} />
      <div className="mt-4">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <button className="mt-4 bg-primary text-white rounded px-4 py-2 hover:bg-secondary transition duration-300">
          Choose
        </button>
      </div>
    </div>
  );
}
