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
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-card border-2 border-primary w-full max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-brutal text-primary">
                                STAKE ON EVENT
                            </h3>
                            <p className="text-sm font-mono-brutal text-white mt-1">
                                {event.metadata}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-accent transition-none"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Existing Stake Warning */}
                    {existingStake && (
                        <div className="bg-accent/20 border border-accent p-3 mb-4">
                            <p className="text-xs font-mono-brutal text-white mb-1">
                                EXISTING STAKE
                            </p>
                            <p className="font-brutal text-accent">
                                {existingStake.stakeType.toUpperCase()}:{" "}
                                {formatPoints(existingStake.amount)}
                            </p>
                            <p className="text-xs font-mono-brutal text-white mt-1">
                                New stake will be added to existing stake
                            </p>
                        </div>
                    )}

                    {/* Stake Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-brutal text-white mb-2">
                            STAKE TYPE
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStakeType("yes")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 font-brutal transition-none ${
                                    stakeType === "yes"
                                        ? "bg-success text-black border-success"
                                        : "bg-black text-white border-white hover:bg-white hover:text-black"
                                }`}
                            >
                                <TrendingUp size={20} />
                                YES
                            </button>
                            <button
                                onClick={() => setStakeType("no")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 font-brutal transition-none ${
                                    stakeType === "no"
                                        ? "bg-danger text-black border-danger"
                                        : "bg-black text-white border-white hover:bg-white hover:text-black"
                                }`}
                            >
                                <TrendingDown size={20} />
                                NO
                            </button>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-brutal text-white mb-2">
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
                            className="w-full bg-black border-2 border-white px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary font-mono-brutal"
                        />
                        <p className="text-xs font-mono-brutal text-white mt-2">
                            Your balance: {formatPoints(userPoints)}
                        </p>
                        {error && (
                            <p className="text-sm font-brutal text-danger mt-2">
                                {error}
                            </p>
                        )}
                    </div>

                    {/* Pool Info */}
                    <div className="bg-black border-2 border-white p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                                <p className="text-xs font-mono-brutal text-white mb-1">
                                    YES POOL
                                </p>
                                <p className="font-brutal text-success">
                                    {formatPoints(event.yesPool)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-mono-brutal text-white mb-1">
                                    NO POOL
                                </p>
                                <p className="font-brutal text-danger">
                                    {formatPoints(event.noPool)}
                                </p>
                            </div>
                        </div>
                        <div className="border-t-2 border-white pt-3">
                            <p className="text-xs font-mono-brutal text-white mb-1">
                                TOTAL POOL
                            </p>
                            <p className="font-brutal text-primary text-lg">
                                {formatPoints(totalPool)}
                            </p>
                        </div>
                    </div>

                    {/* Potential Reward */}
                    {numAmount > 0 && winningPool > 0 && (
                        <div className="bg-primary/20 border border-primary p-4 mb-6">
                            <p className="text-xs font-mono-brutal text-white mb-2">
                                POTENTIAL REWARD (IF YOU WIN)
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal text-white">
                                        STAKE
                                    </span>
                                    <span className="font-brutal text-white">
                                        {formatPoints(numAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-mono-brutal text-white">
                                        POTENTIAL REWARD
                                    </span>
                                    <span className="font-brutal text-primary text-lg">
                                        {formatPoints(potentialReward)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-t border-primary pt-2">
                                    <span className="font-brutal text-white">
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
                            className="flex-1 py-3 px-4 bg-black text-white border-2 border-white font-brutal hover:bg-white hover:text-black transition-none"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={handleStake}
                            disabled={!canStake}
                            className={`flex-1 py-3 px-4 border-2 font-brutal transition-none ${
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

