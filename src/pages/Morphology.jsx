function Morphology() {
  return (
    <main className="container px-4 py-4">
      <article>
        <section>
          <h3 className="h3 text-danger">Зовнішній вигляд</h3>
          <p>Коні Пржевальського мають одну з найдревніших особливостей забарвлення коней — саврасу масть, що характеризується пастельними відтінками гнідо-саврасої масті з характерною темною смугою («ременем») уздовж спини, також помітні освітлені ділянки шерсті — так звана «підласість» коней.</p>
        </section>
        <section>
          <h3 className="h3 text-danger">Особливості будови</h3>
          <ul>
            <li>Довжина тіла — 200—250 см, висота у холці — 124—153 см, вага — 230—350 кг.</li>
            <li>Кінцівки темні (особливо у гібридних форм), часто помітні смуги на ногах («зебра»).</li>
            <li>Грива коротка, стояча, чуб вкорочений, хвіст при основі (тобто ріпиця) без довгого волосся.</li>
          </ul>
        </section>
        <figure className="text-center">
          <img src="../images/przewalski-pferde-in-der-morgensonnejpg.webp" alt="Коні Пржевальського у полі" className="img-fluid rounded my-4"/>
          <figcaption className="text-muted">Молоді Коні Пржевальського</figcaption>
        </figure>
      </article>
    </main>
  );
}

export default Morphology;