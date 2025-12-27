'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/providers/CartProvider';
import {
    ChevronLeft, CreditCard, Truck, Shield, Check,
    Loader2, Package
} from 'lucide-react';
import { motion } from 'framer-motion';

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [step, setStep] = useState<CheckoutStep>('cart');
    const [loading, setLoading] = useState(false);

    const [shippingForm, setShippingForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const [paymentForm, setPaymentForm] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: '',
    });

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Transform items for backend
            const orderItems = items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                size: item.selectedSize,
                color: item.selectedColor
            }));

            // Construct order payload
            const payload = {
                items: orderItems,
                shipping_name: `${shippingForm.firstName} ${shippingForm.lastName}`,
                shipping_email: shippingForm.email,
                shipping_address: shippingForm.address,
                shipping_city: shippingForm.city,
                shipping_postal_code: shippingForm.postalCode,
                shipping_country: shippingForm.country,
                payment_method: 'cod', // Defaulting to COD/Mock Payment for Demo
                // In a real app, you'd process Stripe here and send the token
            };

            await import('@/lib/api').then(mod => mod.default.post('/orders', payload));

            setStep('confirmation');
            clearCart();
        } catch (error) {
            console.error('Order failed:', error);
            // Ideally show an error message to user
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 'cart', label: 'Cart', icon: Package },
        { id: 'shipping', label: 'Shipping', icon: Truck },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'confirmation', label: 'Done', icon: Check },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === step);

    if (items.length === 0 && step !== 'confirmation') {
        return (
            <div className="min-h-screen bg-[var(--bg-body)] pt-32 text-center">
                <Package size={64} className="mx-auto mb-4 text-gray-700" />
                <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
                <Link href="/shop" className="text-red-500 hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-body)] pt-24">
            <div className="container mx-auto px-4 py-12">
                {/* Back Link */}
                <Link href="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold mb-8">
                    <ChevronLeft size={16} /> Back to Shop
                </Link>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${i <= currentStepIndex ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-500'}`}>
                                {i < currentStepIndex ? <Check size={16} /> : <s.icon size={16} />}
                            </div>
                            <span className={`ml-2 font-bold text-sm hidden sm:block ${i <= currentStepIndex ? 'text-white' : 'text-gray-500'}`}>
                                {s.label}
                            </span>
                            {i < steps.length - 1 && (
                                <div className={`w-12 h-0.5 mx-4 ${i < currentStepIndex ? 'bg-red-500' : 'bg-white/10'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Cart Review */}
                        {step === 'cart' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-2xl border border-white/10 p-6">
                                <h2 className="text-xl font-bold text-white mb-6">Review Your Order</h2>
                                <div className="space-y-4">
                                    {items.map(item => (
                                        <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 p-4 bg-white/5 rounded-xl">
                                            <div className="w-20 h-20 relative rounded-lg overflow-hidden shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white">{item.name}</h3>
                                                <div className="text-sm text-gray-400">
                                                    {item.selectedSize && <span>Size: {item.selectedSize} • </span>}
                                                    Qty: {item.quantity}
                                                </div>
                                            </div>
                                            <div className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setStep('shipping')}
                                    className="w-full mt-6 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                                >
                                    Continue to Shipping
                                </button>
                            </motion.div>
                        )}

                        {/* Shipping Form */}
                        {step === 'shipping' && (
                            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleShippingSubmit} className="glass-dark rounded-2xl border border-white/10 p-6">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Truck size={20} /> Shipping Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        required
                                        value={shippingForm.firstName}
                                        onChange={e => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        required
                                        value={shippingForm.lastName}
                                        onChange={e => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        value={shippingForm.email}
                                        onChange={e => setShippingForm({ ...shippingForm, email: e.target.value })}
                                        className="col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        required
                                        value={shippingForm.address}
                                        onChange={e => setShippingForm({ ...shippingForm, address: e.target.value })}
                                        className="col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        required
                                        value={shippingForm.city}
                                        onChange={e => setShippingForm({ ...shippingForm, city: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Postal Code"
                                        required
                                        value={shippingForm.postalCode}
                                        onChange={e => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        required
                                        value={shippingForm.country}
                                        onChange={e => setShippingForm({ ...shippingForm, country: e.target.value })}
                                        className="col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <button type="submit" className="w-full mt-6 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition">
                                    Continue to Payment
                                </button>
                            </motion.form>
                        )}

                        {/* Payment Form */}
                        {step === 'payment' && (
                            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handlePaymentSubmit} className="glass-dark rounded-2xl border border-white/10 p-6">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <CreditCard size={20} /> Payment Details
                                </h2>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        required
                                        value={paymentForm.cardNumber}
                                        onChange={e => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Name on Card"
                                        required
                                        value={paymentForm.cardName}
                                        onChange={e => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            required
                                            value={paymentForm.expiry}
                                            onChange={e => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVV"
                                            required
                                            value={paymentForm.cvv}
                                            onChange={e => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                                    <Shield size={16} className="text-green-500" />
                                    Your payment is secure and encrypted
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-6 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : `Pay $${total.toFixed(2)}`}
                                </button>
                            </motion.form>
                        )}

                        {/* Confirmation */}
                        {step === 'confirmation' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-2xl border border-white/10 p-12 text-center">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check size={40} className="text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-white mb-4">Order Confirmed!</h2>
                                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                    Thank you for your purchase. You will receive an email confirmation shortly with tracking details.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/shop" className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition">
                                        Continue Shopping
                                    </Link>
                                    <Link href="/profile" className="px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition">
                                        View Orders
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    {step !== 'confirmation' && (
                        <div className="glass-dark rounded-2xl border border-white/10 p-6 h-fit sticky top-24">
                            <h3 className="font-bold text-white mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal ({items.length} items)</span>
                                    <span className="text-white">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Tax</span>
                                    <span className="text-white">${(total * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between">
                                    <span className="font-bold text-white">Total</span>
                                    <span className="font-black text-xl text-white">${(total * 1.1).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
