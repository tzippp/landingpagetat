import Head from "next/head";
import styles from "../styles/Home.module.css";
import ChatBot from "../components/ChatBot";

const tattooIdeas = [
  {
    src: "/images/flower-arm-tattoo.jpg",
    alt: "Flower Arm Tattoo",
    label: "Flower Arm Tattoo",
  },
  {
    src: "/images/dragonfly-in-color-tattoo.jpg",
    alt: "Dragonfly in Color Tattoo",
    label: "Dragonfly in Color Tattoo",
  },
  {
    src: "/images/heart-lotus-tattoo.jpg",
    alt: "Heart Lotus Tattoo",
    label: "Heart Lotus Tattoo",
  },
  {
    src: "/images/moon-sun-tattoo.jpg",
    alt: "Moon Sun Tattoo",
    label: "Moon Sun Tattoo",
  },
  {
    src: "/images/fine-line-tattoo-of-cupcake-in-rockland-county-ny.jpg",
    alt: "Cupcake Fine Line Tattoo",
    label: "Cupcake Fine Line Tattoo",
  },
  {
    src: "/images/bubble-bee-tattoo.jpg",
    alt: "Bubble Bee Tattoo",
    label: "Bubble Bee Tattoo",
  },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Fine Line Tattoo - Express Yourself</title>
        <meta
          name="description"
          content="Discover beautiful fine line tattoos. Get inspired and chat with us to find your perfect design!"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@700&family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Express Yourself with a Fine Line Tattoo</h1>
        <p>Delicate. Personal. Timeless. Let your story shine through art.</p>
        <button className={styles.cta}>Book Your Tattoo</button>
      </section>

      {/* Tattoo Ideas Carousel Section */}
      <section className={styles.ideas}>
        <h2>Simple Fine Line Tattoo Ideas</h2>
        <div style={{ textAlign: "center" }}>
          <img
            src="/images/4-white-flash-sheet.png"
            alt="Fine Line Flash Sheet"
            className={styles.flashSheetImg}
          />
          <p
            style={{
              marginTop: "1rem",
              color: "#400006",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "1.1rem",
            }}
          >
            Choose from our custom fine line flash designs or request your own!
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <h2>What Our Clients Say</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.starsRow}>★★★★★</div>
            <blockquote>
              "Absolutely in love with my fine line tattoo! The detail is
              amazing and it barely hurt at all."
            </blockquote>
            <footer>- Jamie</footer>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.starsRow}>★★★★★</div>
            <blockquote>
              "Zippora made me feel at ease and explained everything clearly.
              The studio was spotless and relaxing."
            </blockquote>
            <footer>- Alex</footer>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.starsRow}>★★★★★</div>
            <blockquote>
              "This was my first tattoo and Zippora made the process so easy. I
              love my delicate new design!"
            </blockquote>
            <footer>- Taylor</footer>
          </div>
        </div>
      </section>

      {/* Artist Section */}
      <section className={styles.artistSection}>
        <h2>Meet Your Fine Line Tattoo Artist</h2>
        <div className={styles.artistContent}>
          <img
            src="/images/giving-tattoo-artist.jpg"
            alt="Zippora - Fine Line Tattoo Artist"
            className={styles.artistImg}
          />
          <div className={styles.artistBio}>
            <p>
              Hi, I'm Zippora! I specialize in delicate, fine line tattoos that
              are as unique as you are. My goal is to make every client feel
              comfortable, heard, and thrilled with their new art. Whether it's
              your first tattoo or your tenth, I'll guide you through every step
              with care and artistry.
            </p>
            <div className={styles.artistName}>— Zippora</div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className={styles.portfolio}>
        <h2>My Fine Line Tattoo Portfolio</h2>
        <div className={styles.portfolioGrid}>
          {[
            "flower-arm-tattoo.jpg",
            "dragonfly-in-color-tattoo.jpg",
            "heart-lotus-tattoo.jpg",
            "moon-sun-tattoo.jpg",
            "fine-line-tattoo-of-cupcake-in-rockland-county-ny.jpg",
            "bubble-bee-tattoo.jpg",
            "be-light-tattoo.jpeg",
            "symbol-neck-tattoo.jpeg",
            "bow-tattoo.jpeg",
            "zodiac-tattoo.jpeg",
            "panda-tattoo.jpg",
            "lotus-on-chest-tattoo.jpeg",
            "love-tat.jpg",
            "infinity-heart-tattoo.png",
            "777-fine-line-tattoo.jpg",
            "duck-face-tattoo.jpeg",
            "heart-finger-tattoo.jpeg",
            "symbol-tattoo.jpeg",
            "flower-ankle-tattoo.jpeg",
            "dragonfly-toe-tattoo.jpg",
            "glitter-butterfly-tattoo.png",
            "finger-letter-k-tattoo.jpg",
            "flower-name-tattoo.jpg",
            "hand-tattoo-breathe-symbol.jpg",
          ].map((img, idx) => (
            <img
              key={idx}
              src={`/images/${img}`}
              alt={img.replace(/[-_]/g, " ").replace(/\..+$/, "")}
              className={styles.portfolioImg}
            />
          ))}
        </div>
      </section>

      {/* Storefront Section */}
      <section className={styles.storefrontSection}>
        <h2 style={{ display: "none" }}>Storefront</h2>
        <div className={styles.storefrontContent}>
          <img
            src="/images/red-carpet-luxury-spa-storefront.jpg"
            alt="Red Carpet Luxury Spa Storefront"
            className={styles.storefrontImg}
          />
          <div className={styles.storefrontCaption}>
            Look for this storefront when you arrive!
          </div>
        </div>
      </section>

      {/* Footer with business info */}
      <footer className={styles.footer}>
        <div>Red Carpet Luxury Spa</div>
        <div>197 Main Street, Nanuet, NY</div>
        <div>Phone: 914-200-4121</div>
      </footer>
      <ChatBot />
    </div>
  );
}
