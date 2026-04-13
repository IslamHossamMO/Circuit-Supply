"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Cpu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", phoneNumber: "", address: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await authApi.signup({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                address: formData.address
            });
            const token = response.responseObj.token;
            const email = response.responseObj.email || formData.email;
            const id = response.responseObj.id;
            const name = email.split("@")[0];
            login({
                email,
                name,
                token,
                role: "Customer",
                id: id,
                userId: id,
                userName: name,
                expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            });
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex bg-circuit-bg">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="absolute top-8 left-8">
                    <Link href="/" className="text-circuit-text-muted hover:text-circuit-text flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-circuit-card border border-circuit-border mb-4">
                            <Cpu className="w-6 h-6 text-circuit-green" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                        <p className="text-circuit-text-muted mt-2">Join the community of embedded system engineers</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleRegister}>
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-circuit-text">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full h-11 rounded-md border border-circuit-border bg-circuit-card px-3 text-sm text-circuit-text focus:border-circuit-green focus:outline-none focus:ring-1 focus:ring-circuit-green transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-circuit-text">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full h-11 rounded-md border border-circuit-border bg-circuit-card px-3 text-sm text-circuit-text focus:border-circuit-green focus:outline-none focus:ring-1 focus:ring-circuit-green transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-circuit-text">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="engineer@example.com"
                                className="w-full h-11 rounded-md border border-circuit-border bg-circuit-card px-3 text-sm text-circuit-text focus:border-circuit-green focus:outline-none focus:ring-1 focus:ring-circuit-green transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-circuit-text">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className="w-full h-11 rounded-md border border-circuit-border bg-circuit-card px-3 text-sm text-circuit-text focus:border-circuit-green focus:outline-none focus:ring-1 focus:ring-circuit-green transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-circuit-text">PhoneNumber</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Add Phone Number"
                                className="w-full h-11 rounded-md border border-circuit-border bg-circuit-card px-3 text-sm text-circuit-text focus:border-circuit-green focus:outline-none focus:ring-1 focus:ring-circuit-green transition-all"
                            />
                        </div>

                        <Button variant="default" className="w-full h-11 text-base" disabled={isSubmitting}>
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <span className="text-circuit-text-muted">Already have an account? </span>
                        <Link href="/login" className="font-semibold text-circuit-green hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-circuit-card border-l border-circuit-border relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-circuit-green/5 to-circuit-blue/5"></div>
                <div className="relative z-10 max-w-md text-center p-12">
                    <div className="mb-4 text-left p-6 border border-circuit-border bg-circuit-bg rounded-lg shadow-sm">
                        <div className="h-2 w-24 bg-circuit-text-muted/20 rounded mb-4"></div>
                        <div className="h-2 w-full bg-circuit-text-muted/10 rounded mb-2"></div>
                        <div className="h-2 w-2/3 bg-circuit-text-muted/10 rounded"></div>
                        <div className="mt-4 flex gap-2">
                            <div className="h-8 w-20 bg-circuit-green/20 rounded"></div>
                        </div>
                    </div>
                    <div className="text-left p-6 border border-circuit-border bg-circuit-bg rounded-lg shadow-sm opacity-60 translate-x-4 -translate-y-2">
                        <div className="h-2 w-24 bg-circuit-text-muted/20 rounded mb-4"></div>
                        <div className="h-2 w-full bg-circuit-text-muted/10 rounded"></div>
                    </div>
                    <h2 className="text-2xl font-bold mt-8 mb-4">Track Your Prototypes</h2>
                    <p className="text-circuit-text-muted">Keep track of your orders, manage BOMs, and get faster checkout.</p>
                </div>
            </div>
        </div>
    );
}
