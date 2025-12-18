import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins } from "lucide-react";

interface CreateListingModalProps {
    userPoints: number;
    earnedPoints: number;
    onClose: () => void;
    onCreate: (points: number, priceStx: number) => void;
}

export function CreateListingModal({
    userPoints,
    earnedPoints,
    onClose,
    onCreate,
}: CreateListingModalProps) {
    const [points, setPoints] = useState("");
    const [priceStx, setPriceStx] = useState("");
    const [error, setError] = useState("");

    const numPoints = parseFloat(points) || 0;
    const numPriceStx = parseFloat(priceStx) || 0;
    const listingFee = 10000000; // 10 STX in micro-STX
    const protocolFeeBps = 200; // 2%
    const totalCost = listingFee; // Listing fee only (points are locked, not spent)

    const canCreate =
        numPoints > 0 &&
        numPoints <= userPoints &&
        numPriceStx > 0 &&
        earnedPoints >= 10000;

    const handleCreate = () => {
        if (!canCreate) {
            if (earnedPoints < 10000) {
                setError("NEED 10,000+ EARNED POINTS TO SELL");
            } else if (numPoints > userPoints) {
                setError("INSUFFICIENT POINTS");
            } else {
                setError("INVALID AMOUNTS");
            }
            return;
        }

        onCreate(numPoints, numPriceStx * 1000000); // Convert STX to micro-STX
    };

    const formatPoints = (points: number) => {
        return points.toLocaleString() + " PTS";
    };

    const formatStx = (stx: number) => {
        return stx.toFixed(2) + " STX";
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
                                <Coins className="text-black" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-brutal text-primary">
                                    CREATE LISTING
                                </h3>
                                <p className="text-xs font-mono-brutal text-white mt-1">
                                    SELL POINTS ON MARKETPLACE
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

                    {/* Requirements Check */}
                    <div className="border-2 p-4 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)' }}>
                        <p className="text-xs font-mono-brutal mb-2" style={{ color: 'var(--color-text-body)' }}>
                            REQUIREMENTS
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                    EARNED POINTS
                                </span>
                                <span
                                    className={`font-brutal ${
                                        earnedPoints >= 10000
                                            ? "text-success"
                                            : "text-danger"
                                    }`}
                                >
                                    {formatPoints(earnedPoints)} / 10,000
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                    LISTING FEE
                                </span>
                                <span className="font-brutal text-primary">
                                    {formatStx(listingFee / 1000000)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Points Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-brutal mb-2" style={{ color: 'var(--color-text)' }}>
                            POINTS TO SELL
                        </label>
                        <input
                            type="number"
                            value={points}
                            onChange={(e) => {
                                setPoints(e.target.value);
                                setError("");
                            }}
                            placeholder="0"
                            min="1"
                            max={userPoints}
                            step="1"
                            className="w-full border-2 px-4 py-3 focus:outline-none focus:border-primary font-mono-brutal"
                            style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                        />
                        <p className="text-xs font-mono-brutal mt-2" style={{ color: 'var(--color-text-body)' }}>
                            Available: {formatPoints(userPoints)}
                        </p>
                    </div>

                    {/* Price Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-brutal mb-2" style={{ color: 'var(--color-text)' }}>
                            PRICE (STX)
                        </label>
                        <input
                            type="number"
                            value={priceStx}
                            onChange={(e) => {
                                setPriceStx(e.target.value);
                                setError("");
                            }}
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            className="w-full border-2 px-4 py-3 focus:outline-none focus:border-primary font-mono-brutal"
                            style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                        />
                        {numPoints > 0 && numPriceStx > 0 && (
                            <p className="text-xs font-mono-brutal mt-2" style={{ color: 'var(--color-text-body)' }}>
                                Price per point:{" "}
                                {formatStx(
                                    (numPriceStx * 1000000) / numPoints / 1000
                                )}{" "}
                                mSTX/pt
                            </p>
                        )}
                    </div>

                    {/* Cost Summary */}
                    {numPoints > 0 && numPriceStx > 0 && (
                        <div className="border p-4 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-primary)' }}>
                            <p className="text-xs font-mono-brutal mb-2" style={{ color: 'var(--color-text-body)' }}>
                                LISTING SUMMARY
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        POINTS TO LIST
                                    </span>
                                    <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                        {formatPoints(numPoints)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        TOTAL PRICE
                                    </span>
                                    <span className="font-brutal text-primary text-lg">
                                        {formatStx(numPriceStx)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-t pt-2" style={{ borderColor: 'var(--color-primary)' }}>
                                    <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        LISTING FEE
                                    </span>
                                    <span className="font-brutal" style={{ color: 'var(--color-text-muted)' }}>
                                        {formatStx(listingFee / 1000000)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        PROTOCOL FEE (ON SALE)
                                    </span>
                                    <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                        {((numPriceStx * protocolFeeBps) / 10000).toFixed(2)} STX
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="border p-3 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-danger)' }}>
                            <p className="text-sm font-brutal text-danger">{error}</p>
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
                            onClick={handleCreate}
                            disabled={!canCreate}
                            className="flex-1 py-3 px-4 btn-brutal disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            CREATE LISTING
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

