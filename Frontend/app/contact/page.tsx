import { Button } from "@/components/ui/Button";
import { Mail, Phone, MessageSquare } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Contact the Developer</h1>
                <p className="text-circuit-text-muted">
                    Direct line to Islam Hossam. Available for inquiries, support, and collaboration.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="flex items-start">
                        <div className="w-12 h-12 rounded-lg bg-circuit-card border border-circuit-border flex items-center justify-center flex-shrink-0">
                            <Mail className="w-6 h-6 text-circuit-green" />
                        </div>
                        <div className="ml-4">
                            <h3 className="font-semibold text-lg">Email</h3>
                            <div className="text-circuit-text-muted mt-1 space-y-1">
                                <a
                                    href="mailto:IslamHossamDev@outlook.com"
                                    className="block hover:text-circuit-green transition-colors"
                                >
                                    IslamHossamDev@outlook.com
                                </a>
                                <a
                                    href="mailto:IslamHossamIHB@gmail.com"
                                    className="block hover:text-circuit-green transition-colors"
                                >
                                    IslamHossamIHB@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="w-12 h-12 rounded-lg bg-circuit-card border border-circuit-border flex items-center justify-center flex-shrink-0">
                            <Phone className="w-6 h-6 text-circuit-blue" />
                        </div>
                        <div className="ml-4">
                            <h3 className="font-semibold text-lg">Phone</h3>
                            <p className="text-circuit-text-muted mt-1">
                                <a
                                    href="tel:+201503157915"
                                    className="hover:text-circuit-green transition-colors"
                                >
                                    +20 150 315 7915
                                </a>
                            </p>
                            <p className="text-xs text-circuit-text-muted mt-1">Available on WhatsApp</p>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-circuit-border bg-gradient-to-br from-circuit-card to-circuit-bg relative overflow-hidden">
                        <div className="relative z-10">
                            <MessageSquare className="w-8 h-8 text-circuit-green mb-4" />
                            <h3 className="font-bold text-lg mb-2">Need a Custom Solution?</h3>
                            <p className="text-sm text-circuit-text-muted">
                                Beyond components, I offer consultation for embedded system design and full-stack development.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2 bg-circuit-card border border-circuit-border rounded-xl p-8">
                    <form className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-circuit-border bg-circuit-bg px-3 py-2 text-sm focus:border-circuit-green outline-none"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full rounded-md border border-circuit-border bg-circuit-bg px-3 py-2 text-sm focus:border-circuit-green outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <select className="w-full rounded-md border border-circuit-border bg-circuit-bg px-3 py-2 text-sm focus:border-circuit-green outline-none">
                                <option>General Inquiry</option>
                                <option>Product Support</option>
                                <option>Collaboration / Freelance</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <textarea
                                rows={5}
                                className="w-full rounded-md border border-circuit-border bg-circuit-bg px-3 py-2 text-sm focus:border-circuit-green outline-none"
                                placeholder="How can I help you?"
                            />
                        </div>

                        <Button variant="default" className="w-full sm:w-auto">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}