import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";

interface Listing {
    listingId: number;
    seller: string;
    points: number;
    priceStx: number; // in micro-STX
    active: boolean;
}

interface BuyListingModalProps {
    listing: Listing;
    userPoints: number;
    onClose: () => void;
    onBuy: (pointsToBuy: number) => void;
}

export function BuyListingModal({
    listing,
    userPoints,
    onClose,
    onBuy,
}: BuyListingModalProps) {
    const [pointsToBuy, setPointsToBuy] = useState("");
    const [error, setError] = useState("");

    const numPointsToBuy = parseFloat(pointsToBuy) || 0;
    const pricePerPoint = listing.priceStx / listing.points;
    const actualPriceStx = numPointsToBuy * pricePerPoint;
    const protocolFeeBps = 200; // 2%
    const protocolFee = (actualPriceStx * protocolFeeBps) / 10000;
    const sellerAmount = actualPriceStx - protocolFee;
    const totalCost = actualPriceStx;

    const canBuy =
        numPointsToBuy > 0 &&
        numPointsToBuy <= listing.points &&
        listing.active;

    const handleBuy = () => {
        if (!canBuy) {
            if (numPointsToBuy > listing.points) {
                setError("INSUFFICIENT POINTS AVAILABLE");
            } else {
                setError("INVALID AMOUNT");
            }
            return;
        }

        onBuy(numPointsToBuy);
    };

    const formatPoints = (points: number) => {
        return points.toLocaleString() + " PTS";
    };

    const formatStx = (microStx: number) => {
        return (microStx / 1000000).toFixed(4) + " STX";
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(11, 14, 20, 0.9)' }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="border-2 w-full max-w-md p-6"
                    style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-primary)' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary border-2 border-primary flex items-center justify-center">
                                <ShoppingCart className="text-black" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-brutal text-primary">
                                    BUY POINTS
                                </h3>
                                <p className="text-xs font-mono-brutal text-white mt-1">
                                    LISTING #{listing.listingId}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="transition-colors"
                            style={{ color: 'var(--color-text-body)' }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Listing Info */}
                    <div className="border-2 p-4 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)' }}>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                    AVAILABLE POINTS
                                </span>
                                <span className="font-brutal text-primary">
                                    {formatPoints(listing.points)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                    TOTAL PRICE
                                </span>
                                <span className="font-brutal text-primary">
                                    {formatStx(listing.priceStx)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                    PRICE PER POINT
                                </span>
                                <span className="font-brutal" style={{ color: 'var(--color-accent)' }}>
                                    {formatStx(pricePerPoint)} /pt
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                    SELLER
                                </span>
                                <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                    {listing.seller}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Points to Buy Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-brutal mb-2" style={{ color: 'var(--color-text)' }}>
                            POINTS TO BUY
                        </label>
                        <input
                            type="number"
                            value={pointsToBuy}
                            onChange={(e) => {
                                setPointsToBuy(e.target.value);
                                setError("");
                            }}
                            placeholder="0"
                            min="1"
                            max={listing.points}
                            step="1"
                            className="w-full border-2 px-4 py-3 focus:outline-none focus:border-primary font-mono-brutal"
                            style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                        />
                        <p className="text-xs font-mono-brutal mt-2" style={{ color: 'var(--color-text-body)' }}>
                            Max: {formatPoints(listing.points)} (partial purchases allowed)
                        </p>
                        {error && (
                            <p className="text-sm font-brutal text-danger mt-2">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Payment Calculation */}
                    {numPointsToBuy > 0 && (
                        <div className="border p-4 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-primary)' }}>
                            <p className="text-xs font-mono-brutal mb-2" style={{ color: 'var(--color-text-body)' }}>
                                PAYMENT BREAKDOWN
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        POINTS TO BUY
                                    </span>
                                    <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                        {formatPoints(numPointsToBuy)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        BASE PRICE
                                    </span>
                                    <span className="font-brutal text-primary">
                                        {formatStx(actualPriceStx)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        PROTOCOL FEE (2%)
                                    </span>
                                    <span className="font-brutal" style={{ color: 'var(--color-text-muted)' }}>
                                        {formatStx(protocolFee)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        SELLER RECEIVES
                                    </span>
                                    <span className="font-brutal text-success">
                                        {formatStx(sellerAmount)}
                                    </span>
                                </div>
                                <div className="border-t pt-2 mt-2" style={{ borderColor: 'var(--color-primary)' }}>
                                    <div className="flex justify-between items-center">
                                        <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                            TOTAL COST
                                        </span>
                                        <span className="font-brutal text-primary text-lg">
                                            {formatStx(totalCost)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 btn-secondary"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={handleBuy}
                            disabled={!canBuy}
                            className="flex-1 py-3 px-4 btn-brutal disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            BUY POINTS
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

