import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Photo() {
  const images = [
    { src: '/images/furyjpg.webp', alt: 'Кінь Пржевальського в степу' },
    { src: '/images/safari-de-peaugres.webp', alt: 'Коні Пржевальського' },
    { src: '/images/1200px-equus-przewalskii-le-villaret-02-2006-07-20jpg.webp', alt: 'Коні Пржевальського в полі' },
    { src: '/images/przewalski-pferde-in-der-morgensonnejpg.webp', alt: 'Обійми Коней Пржевальського' },
    { src: '/images/chevaux-de-przewalski-equus-przewalskii-en-semi-libert-sur-le-causse-mjean-lozre-france-50198797628jpg.webp', alt: 'Кінь Пржевальського' },
    { src: '/images/przewalskis-wild-horse-10.webp', alt: 'Родина Коней Пржевальського' }
  ];

  return (
    <main className="container px-4 py-4 flex-grow-1">
      <article>
        <h2 className="h2 text-danger mb-4">Фотогалерея Коней Пржевальського</h2>
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {images.map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <a href={image.src} target="_blank" rel="noopener noreferrer">
                  <img src={image.src} className="d-block w-100" alt={image.alt} />
                </a>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </article>
    </main>
  );
}

export default Photo;