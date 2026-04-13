import { Cpu, Github, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-circuit-border bg-circuit-bg py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Cpu className="h-6 w-6 text-circuit-green" />
                            <span className="font-bold text-lg text-circuit-text">
                                CIRCUIT<span className="text-circuit-green">SUPPLY</span>
                            </span>
                        </div>
                        <p className="text-sm text-circuit-text-muted">
                            Premium components for embedded systems engineers and hobbyists.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-circuit-text">Products</h3>
                        <ul className="space-y-2 text-sm text-circuit-text-muted">
                            <li><a href="#" className="hover:text-circuit-green">Microcontrollers</a></li>
                            <li><a href="#" className="hover:text-circuit-green">Sensors</a></li>
                            <li><a href="#" className="hover:text-circuit-green">Actuators</a></li>
                            <li><a href="#" className="hover:text-circuit-green">Dev Boards</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-circuit-text">Support</h3>
                        <ul className="space-y-2 text-sm text-circuit-text-muted">
                            <li><a href="#" className="hover:text-circuit-green">Datasheets</a></li>
                            <li><a href="#" className="hover:text-circuit-green">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-circuit-green">Returns</a></li>
                            <li><a href="#" className="hover:text-circuit-green">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-circuit-text">Stay Updated</h3>
                        <div className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full rounded-md border border-circuit-border bg-circuit-card px-3 py-2 text-sm text-circuit-text placeholder:text-circuit-text-muted focus:border-circuit-green focus:outline-none"
                            />
                            <button className="rounded-md bg-circuit-green px-3 py-2 text-sm font-medium text-circuit-bg hover:bg-circuit-green/90">
                                Sub
                            </button>
                        </div>
                        <div className="mt-4 flex space-x-4">
                            <Github className="h-5 w-5 text-circuit-text-muted hover:text-circuit-text cursor-pointer" />
                            <Twitter className="h-5 w-5 text-circuit-text-muted hover:text-circuit-text cursor-pointer" />
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between border-t border-circuit-border pt-8 sm:flex-row">
                    <p className="text-xs text-circuit-text-muted">
                        &copy; {new Date().getFullYear()} CircuitSupply. All rights reserved.
                    </p>
                    <div className="mt-4 flex space-x-4 sm:mt-0">
                        <span className="h-2 w-2 rounded-full bg-circuit-green animate-pulse"></span>
                        <span className="text-xs font-mono text-circuit-green">SYSTEM ONLINE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
