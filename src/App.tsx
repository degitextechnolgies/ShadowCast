import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductExperience from './components/ProductExperience'
import HowItWorks from './components/HowItWorks'
import Features from './components/Features'
import Compatibility from './components/Compatibility'
import Performance from './components/Performance'
import ProductShowcase from './components/ProductShowcase'
import Download from './components/Download'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <Navbar />
      <main>
        <Hero />
        <ProductExperience />
        <HowItWorks />
        <Features />
        <Compatibility />
        <Performance />
        <ProductShowcase />
        <Download />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

