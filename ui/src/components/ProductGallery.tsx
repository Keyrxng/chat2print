export const ProductGallery = ({ images }) => {
  return (
    <section id="product-gallery" className="py-12 md:py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="gallery-item p-4">
            <div className="image-wrapper overflow-hidden rounded shadow">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
