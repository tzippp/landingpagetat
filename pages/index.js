import Head from "next/head";
import styles from "../styles/Home.module.css";

const tattooIdeas = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    alt: "Minimalist Flower",
    label: "Minimalist Flower",
  },
  {
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    alt: "Tiny Heart",
    label: "Tiny Heart",
  },
  {
    src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    alt: "Fine Line Animal",
    label: "Fine Line Animal",
  },
  {
    src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    alt: "Tiny Star",
    label: "Tiny Star",
  },
  {
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    alt: "Abstract Line",
    label: "Abstract Line",
  },
  {
    src: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    alt: "Tiny Wave",
    label: "Tiny Wave",
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
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@700&display=swap"
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
        <div className={styles.carousel}>
          {tattooIdeas.map((idea, idx) => (
            <div className={styles.ideaCard} key={idx}>
              <img src={idea.src} alt={idea.alt} />
              <p>{idea.label}</p>
            </div>
          ))}
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

      {/* Footer with business info */}
      <footer className={styles.footer}>
        <div>Red Carpet Luxury Spa</div>
        <div>197 Main Street, Nanuet, NY</div>
        <div>Phone: 914-200-4121</div>
      </footer>
    </div>
  );
}
