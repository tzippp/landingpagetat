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
        <blockquote>
          "Absolutely in love with my fine line tattoo! The detail is amazing
          and the experience was so comfortable."
          <footer>- Jamie</footer>
        </blockquote>
        <blockquote>
          "I was nervous about my first tattoo, but the team made me feel at
          ease. It turned out perfect!"
          <footer>- Alex</footer>
        </blockquote>
      </section>

      {/* Interactive Chat Placeholder */}
      <section className={styles.chat}>
        <h2>Not Sure What to Get?</h2>
        <p>
          Chat with us below to get ideas for your perfect fine line tattoo!
        </p>
        <div className={styles.chatPlaceholder}>
          [Interactive Chat Coming Soon]
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
          ].map((img, idx) => (
            <img
              key={idx}
              src={`/images/${img}`}
              alt={img.replace(/[-_]/g, " ").replace(/\..+$/, "")}
              className={
                styles.portfolioImg +
                (idx === 0 ? " " + styles.flowerArmAdjust : "")
              }
            />
          ))}
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
