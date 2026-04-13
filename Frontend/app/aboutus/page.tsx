import { Cpu, Globe, Code, Shield } from "lucide-react";

export default function AboutUsPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Built by a Developer, for Developers
                </h1>
                <p className="text-xl text-circuit-text-muted">
                    CircuitSupply is the passion project of Islam Hossam, dedicated to simplifying component
                    sourcing for the embedded systems community.
                </p>
            </div>

            {/* Developer Profile Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20 bg-circuit-card border border-circuit-border rounded-2xl p-8 md:p-12">
                <div className="space-y-6">
                    <div className="inline-flex items-center space-x-2 text-circuit-green font-mono text-sm uppercase tracking-wider">
                        <Code className="w-4 h-4" />
                        <span>Solo Developer</span>
                    </div>
                    <h2 className="text-3xl font-bold">Meet the Developer</h2>
                    <p className="text-circuit-text-muted leading-relaxed">
                        Hi, I'm <strong>Islam Hossam</strong>. As a full-stack developer and embedded systems
                        enthusiast, I realized that getting high-quality components often meant dealing with
                        clunky enterprise distributors or unreliable marketplaces.
                    </p>
                    <p className="text-circuit-text-muted leading-relaxed">
                        I built CircuitSupply to bridge that gap—offering a curated, developer-friendly
                        experience with modern tooling and reliable sourcing. Every line of code on this
                        platform and every component in the catalog is curated with care.
                    </p>
                </div>
                <div className="relative h-[300px] w-full rounded-xl overflow-hidden bg-circuit-bg border border-circuit-border group flex items-center justify-center">
                    <div className="absolute inset-0 grid-bg opacity-40"></div>
                    {/* Abstract Avatar Placeholder */}
                    <div className="w-32 h-32 rounded-full border-2 border-circuit-green flex items-center justify-center bg-circuit-card z-10">
                        <span className="text-4xl font-bold text-circuit-green">IH</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-circuit-card to-transparent pointer-events-none"></div>
                </div>
            </div>

            {/* Philosophy */}
            <div className="grid sm:grid-cols-3 gap-8">
                <div className="bg-circuit-card border border-circuit-border rounded-lg p-6 hover:border-circuit-green/50 transition-colors">
                    <Globe className="w-10 h-10 text-circuit-green mb-4" />
                    <h3 className="font-bold text-lg mb-2">Curated Selection</h3>
                    <p className="text-sm text-circuit-text-muted">
                        I personally verify the specs of every component listed to ensure it meets engineering
                        standards.
                    </p>
                </div>
                <div className="bg-circuit-card border border-circuit-border rounded-lg p-6 hover:border-circuit-green/50 transition-colors">
                    <Cpu className="w-10 h-10 text-circuit-blue mb-4" />
                    <h3 className="font-bold text-lg mb-2">Technical Depth</h3>
                    <p className="text-sm text-circuit-text-muted">
                        Detailed datasheets and pinout diagrams provided for every microcontroller and sensor.
                    </p>
                </div>
                <div className="bg-circuit-card border border-circuit-border rounded-lg p-6 hover:border-circuit-green/50 transition-colors">
                    <Shield className="w-10 h-10 text-purple-500 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Transparency</h3>
                    <p className="text-sm text-circuit-text-muted">
                        Direct support channel. No chatbots, just direct communication with the developer.
                    </p>
                </div>
            </div>
        </div>
    );
}
