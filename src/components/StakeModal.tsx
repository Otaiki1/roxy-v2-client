import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown } from "lucide-react";

interface Event {
    eventId: number;
    metadata: string;
    yesPool: number;
    noPool: number;
    status: "open" | "resolved";
    winner: boolean | null;
    creator: string;
}

interface UserStake {
    eventId: number;
    stakeType: "yes" | "no";
    amount: number;
}

interface StakeModalProps {
    event: Event;
    userPoints: number;
    existingStake: UserStake | null;
    onClose: () => void;
    onStake: (amount: number, stakeType: "yes" | "no") => void;
}

export function StakeModal({
    event,
    userPoints,
    existingStake,
    onClose,
    onStake,
}: StakeModalProps) {
    const [stakeType, setStakeType] = useState<"yes" | "no">(
        existingStake?.stakeType || "yes"
    );
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");

    const numAmount = parseFloat(amount) || 0;
    const totalPool = event.yesPool + event.noPool;
    const winningPool = stakeType === "yes" ? event.yesPool : event.noPool;
    
    // Calculate potential reward
    const potentialReward =
        numAmount > 0 && winningPool > 0
            ? (numAmount * totalPool) / winningPool
            : 0;
    const profit = potentialReward - numAmount;

    const canStake =
        numAmount > 0 &&
        numAmount <= userPoints &&
        event.status === "open";

    const handleStake = () => {
        if (!canStake) {
            setError("INVALID AMOUNT OR INSUFFICIENT POINTS");
            return;
        }

        onStake(numAmount, stakeType);
    };

    const formatPoints = (points: number) => {
        return points.toLocaleString() + " PTS";
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
                        <div>
                            <h3 className="text-xl font-brutal text-primary">
                                STAKE ON EVENT
                            </h3>
                            <p className="text-sm font-mono-brutal mt-1" style={{ color: 'var(--color-text-body)' }}>
                                {event.metadata}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="transition-colors"
                            style={{ color: 'var(--color-text-body)' }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Existing Stake Warning */}
                    {existingStake && (
                        <div className="border p-3 mb-4" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-primary)' }}>
                            <p className="text-xs font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                                EXISTING STAKE
                            </p>
                            <p className="font-brutal text-primary">
                                {existingStake.stakeType.toUpperCase()}:{" "}
                                {formatPoints(existingStake.amount)}
                            </p>
                            <p className="text-xs font-mono-brutal mt-1" style={{ color: 'var(--color-text-body)' }}>
                                New stake will be added to existing stake
                            </p>
                        </div>
                    )}

                    {/* Stake Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-brutal mb-2" style={{ color: 'var(--color-text)' }}>
                            STAKE TYPE
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStakeType("yes")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 font-brutal transition-colors ${
                                    stakeType === "yes"
                                        ? "bg-success text-black border-success"
                                        : "btn-secondary"
                                }`}
                            >
                                <TrendingUp size={20} />
                                YES
                            </button>
                            <button
                                onClick={() => setStakeType("no")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 font-brutal transition-colors ${
                                    stakeType === "no"
                                        ? "bg-danger text-black border-danger"
                                        : "btn-secondary"
                                }`}
                            >
                                <TrendingDown size={20} />
                                NO
                            </button>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-brutal mb-2" style={{ color: 'var(--color-text)' }}>
                            STAKE AMOUNT
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
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
                            Your balance: {formatPoints(userPoints)}
                        </p>
                        {error && (
                            <p className="text-sm font-brutal text-danger mt-2">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Pool Info */}
                    <div className="border-2 p-4 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)' }}>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <p className="text-xs font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                                    YES POOL
                                </p>
                                <p className="font-brutal text-success">
                                    {formatPoints(event.yesPool)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                                    NO POOL
                                </p>
                                <p className="font-brutal text-danger">
                                    {formatPoints(event.noPool)}
                                </p>
                            </div>
                        </div>
                        <div className="border-t-2 pt-3" style={{ borderColor: 'var(--color-border)' }}>
                            <p className="text-xs font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                                TOTAL POOL
                            </p>
                            <p className="font-brutal text-primary text-lg">
                                {formatPoints(totalPool)}
                            </p>
                        </div>
                    </div>

                    {/* Potential Reward */}
                    {numAmount > 0 && winningPool > 0 && (
                        <div className="border p-4 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-primary)' }}>
                            <p className="text-xs font-mono-brutal mb-2" style={{ color: 'var(--color-text-body)' }}>
                                POTENTIAL REWARD (IF YOU WIN)
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        STAKE
                                    </span>
                                    <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                        {formatPoints(numAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        POTENTIAL REWARD
                                    </span>
                                    <span className="font-brutal text-primary text-lg">
                                        {formatPoints(potentialReward)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-t pt-2" style={{ borderColor: 'var(--color-primary)' }}>
                                    <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                        PROFIT
                                    </span>
                                    <span className="font-brutal text-success text-lg">
                                        +{formatPoints(profit)}
                                    </span>
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
                            onClick={handleStake}
                            disabled={!canStake}
                            className={`flex-1 py-3 px-4 border-2 font-brutal transition-colors ${
                                stakeType === "yes"
                                    ? "btn-brutal disabled:opacity-50 disabled:cursor-not-allowed"
                                    : "btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}
                        >
                            STAKE {stakeType.toUpperCase()}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

