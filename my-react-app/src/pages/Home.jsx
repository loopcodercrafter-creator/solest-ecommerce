import Hero from "../components/Hero";

function Home({ shoes, activeShoe, setActiveShoe, onAddToCart }) {
  return (
    <main>
      <Hero
        shoes={shoes}
        activeShoe={activeShoe}
        setActiveShoe={setActiveShoe}
        onAddToCart={onAddToCart}
      />
    </main>
  );
}

export default Home;
