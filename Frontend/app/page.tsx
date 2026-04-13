import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowRight, Cpu, Zap, Activity, Box } from "lucide-react";
import Link from "next/link";
import { getProductsForFrontend } from "@/lib/api";
import type { Product } from "@/lib/api"; // ✅ Ensure correct type

export default async function Home() {
  // ❌ DON'T USE raw GetProductDTO
  // const trendingProducts = await productApi.getTrending(4);

  // ✅ USE frontend-safe transformed products
  const allProducts: Product[] = await getProductsForFrontend();
  const byCat = (regex: RegExp, count: number) =>
    allProducts.filter(p => regex.test(p.category)).slice(0, count);
  const micro = byCat(/microcontroller/i, 3);
  const sensors = byCat(/sensor/i, 3);
  const tools = byCat(/tool/i, 2);
  const idSet = new Set<number>();
  const featuredProducts: Product[] = [];
  [micro, sensors, tools].forEach(group => {
    group.forEach(p => {
      if (!idSet.has(p.id)) {
        idSet.add(p.id);
        featuredProducts.push(p);
      }
    });
  });
  if (featuredProducts.length < 8) {
    for (const p of allProducts) {
      if (featuredProducts.length >= 8) break;
      if (!idSet.has(p.id)) {
        idSet.add(p.id);
        featuredProducts.push(p);
      }
    }
  }

  return (
    <div className="flex flex-col gap-16 w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 md:pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="container px-4 md:px-6 relative z-10 mx-auto">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-circuit-green/30 bg-circuit-green/5 px-4 py-1.5 text-sm font-medium text-circuit-green backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-circuit-green mr-2 animate-pulse"></span>
              Engineering Grade Components
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-circuit-text">
              Build the <span className="text-circuit-green">Future</span> of <br />
              Embedded Systems
            </h1>
            <p className="mx-auto max-w-2xl text-circuit-text-muted text-lg md:text-xl leading-relaxed">
              The premier marketplace for microcontrollers, sensors, and industrial modules.
              Trusted by 50,000+ engineers for rapid prototyping and production content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 min-w-[200px] justify-center pt-6">
              <Link href="/product">
                <Button size="lg" variant="default" className="w-full sm:w-auto px-8 h-12 text-base">
                  Start Prototyping <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/product?filter=industrial">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-base">
                  Industrial Solutions
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-circuit-green/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-circuit-border to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-circuit-border to-transparent"></div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-circuit-border bg-circuit-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
            <Cpu className="h-10 w-10 text-circuit-green mb-4" />
            <h3 className="text-lg font-bold mb-2">Authentic Components</h3>
            <p className="text-sm text-circuit-text-muted">Direct manufacturer sourcing guarantees 100% genuine parts for your critical systems.</p>
          </div>
          <div className="rounded-xl border border-circuit-border bg-circuit-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
            <Zap className="h-10 w-10 text-circuit-blue mb-4" />
            <h3 className="text-lg font-bold mb-2">Industrial Grade</h3>
            <p className="text-sm text-circuit-text-muted">Components rated for extended temperature ranges and high reliability applications.</p>
          </div>
          <div className="rounded-xl border border-circuit-border bg-circuit-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
            <Box className="h-10 w-10 text-orange-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Fast Logistics</h3>
            <p className="text-sm text-circuit-text-muted">Same-day shipping on in-stock items. Global warehousing for rapid delivery.</p>
          </div>
          <div className="rounded-xl border border-circuit-border bg-circuit-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
            <Activity className="h-10 w-10 text-purple-600 mb-4" />
            <h3 className="text-lg font-bold mb-2">Datasheet Library</h3>
            <p className="text-sm text-circuit-text-muted">Comprehensive technical documentation and reference designs available for every SKU.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Trending Components</h2>
            <p className="text-circuit-text-muted mt-2">
              Most popular picks for this week&apos;s prototyping designs.
            </p>
          </div>
          <Link
            href="/product"
            className="text-circuit-green font-medium hover:underline underline-offset-4 decoration-circuit-green/30"
          >
            View All Components
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Section */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl border border-circuit-border bg-circuit-card shadow-sm p-8 md:p-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-circuit-green/5 skew-x-12 transform origin-bottom-right"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
              <h2 className="text-3xl font-bold text-circuit-text">Ready for Production?</h2>
              <p className="text-circuit-text-muted">
                We offer volume discounts, kitting services, and scheduled delivery for your manufacturing runs.
              </p>
              <Button variant="default">Request Quote</Button>
            </div>
            <div className="hidden md:block">
              <Button variant="outline" className="bg-circuit-bg hover:bg-circuit-card">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
