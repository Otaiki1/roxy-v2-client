import { motion, AnimatePresence } from "framer-motion";
import { X, Coins } from "lucide-react";

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

interface ClaimModalProps {
    event: Event;
    userStake: UserStake;
    onClose: () => void;
    onClaim: () => void;
}

export function ClaimModal({
    event,
    userStake,
    onClose,
    onClaim,
}: ClaimModalProps) {
    const totalPool = event.yesPool + event.noPool;
    const winningPool =
        event.winner === true ? event.yesPool : event.noPool;
    const reward =
        winningPool > 0
            ? (userStake.amount * totalPool) / winningPool
            : 0;
    const profit = reward - userStake.amount;

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
                    style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-success)' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-success border-2 border-success flex items-center justify-center">
                                <Coins className="text-black" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-brutal text-success">
                                    CLAIM REWARD
                                </h3>
                                <p className="text-sm font-mono-brutal mt-1" style={{ color: 'var(--color-text-body)' }}>
                                    {event.metadata}
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

                    {/* Winner Info */}
                    <div className="border p-4 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-success)' }}>
                        <p className="text-sm font-mono-brutal mb-2" style={{ color: 'var(--color-text-body)' }}>
                            WINNER
                        </p>
                        <p className="text-2xl font-brutal text-success">
                            {event.winner ? "YES" : "NO"}
                        </p>
                        <p className="text-xs font-mono-brutal mt-2" style={{ color: 'var(--color-text-body)' }}>
                            Your stake: {userStake.stakeType.toUpperCase()}{" "}
                            {formatPoints(userStake.amount)}
                        </p>
                    </div>

                    {/* Reward Calculation */}
                    <div className="border-2 p-4 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)' }}>
                        <p className="text-xs font-mono-brutal mb-3" style={{ color: 'var(--color-text-body)' }}>
                            REWARD CALCULATION
                        </p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                    YOUR STAKE
                                </span>
                                <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                    {formatPoints(userStake.amount)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                    TOTAL POOL
                                </span>
                                <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                    {formatPoints(totalPool)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                    WINNING POOL
                                </span>
                                <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                    {formatPoints(winningPool)}
                                </span>
                            </div>
                            <div className="border-t-2 pt-2 mt-2" style={{ borderColor: 'var(--color-border)' }}>
                                <div className="flex justify-between items-center">
                                    <span className="font-brutal" style={{ color: 'var(--color-text)' }}>
                                        YOUR REWARD
                                    </span>
                                    <span className="font-brutal text-success text-2xl">
                                        {formatPoints(reward)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                    PROFIT
                                </span>
                                <span className="font-brutal text-success text-lg">
                                    +{formatPoints(profit)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="border p-3 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-primary)' }}>
                        <p className="text-xs font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                            Reward will be added to your point balance and earned
                            points. Earned points count toward the 10,000 threshold
                            needed to sell points on the marketplace.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 btn-secondary"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={onClaim}
                            className="flex-1 py-3 px-4 btn-brutal"
                            style={{ backgroundColor: 'var(--color-success)', color: 'var(--color-background)' }}
                        >
                            CLAIM REWARD
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

