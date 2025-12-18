import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    Clock,
    Target,
} from "lucide-react";
import { StakeModal } from "@/components/StakeModal";
import { ClaimModal } from "@/components/ClaimModal";

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

type SortOption = "all" | "open" | "resolved";

export function Markets() {
    const [events, setEvents] = useState<Event[]>([]);
    const [userStakes, setUserStakes] = useState<UserStake[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>("all");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showStakeModal, setShowStakeModal] = useState(false);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userPoints, setUserPoints] = useState(0);

    useEffect(() => {
        // TODO: Replace with actual contract calls
        // const loadEvents = async () => {
        //     const events = await contract.getAllEvents();
        //     const stakes = await contract.getUserStakes(userAddress);
        //     const points = await contract.getUserPoints(userAddress);
        //     setEvents(events);
        //     setUserStakes(stakes);
        //     setUserPoints(points);
        // };

        // Mock data
        setTimeout(() => {
            setEvents([
                {
                    eventId: 1,
                    metadata: "Will Bitcoin reach $100k by 2025?",
                    yesPool: 5000,
                    noPool: 3000,
                    status: "open",
                    winner: null,
                    creator: "ADMIN",
                },
                {
                    eventId: 2,
                    metadata: "Will Ethereum hit $5000?",
                    yesPool: 2000,
                    noPool: 4000,
                    status: "resolved",
                    winner: false,
                    creator: "ADMIN",
                },
                {
                    eventId: 3,
                    metadata: "Will Solana reach $200?",
                    yesPool: 1500,
                    noPool: 1200,
                    status: "open",
                    winner: null,
                    creator: "ADMIN",
                },
            ]);
            setUserStakes([
                { eventId: 1, stakeType: "yes", amount: 500 },
                { eventId: 2, stakeType: "no", amount: 300 },
            ]);
            setUserPoints(15000);
            setIsLoading(false);
        }, 500);
    }, []);

    const filteredEvents = events.filter((event) => {
        if (sortBy === "open") return event.status === "open";
        if (sortBy === "resolved") return event.status === "resolved";
        return true;
    });

    const getUserStake = (eventId: number): UserStake | null => {
        return userStakes.find((s) => s.eventId === eventId) || null;
    };

    const handleStake = (eventId: number, stakeType: "yes" | "no") => {
        const event = events.find((e) => e.eventId === eventId);
        if (event && event.status === "open") {
            setSelectedEvent(event);
            setShowStakeModal(true);
        }
    };

    const handleClaim = (eventId: number) => {
        const event = events.find((e) => e.eventId === eventId);
        if (event && event.status === "resolved") {
            setSelectedEvent(event);
            setShowClaimModal(true);
        }
    };

    const formatPoints = (points: number) => {
        return points.toLocaleString() + " PTS";
    };

    const calculateOdds = (yesPool: number, noPool: number, stakeType: "yes" | "no") => {
        const totalPool = yesPool + noPool;
        if (totalPool === 0) return "N/A";
        
        const winningPool = stakeType === "yes" ? yesPool : noPool;
        if (winningPool === 0) return "N/A";
        
        // Potential reward = (stake * totalPool) / winningPool
        // For 100 points stake
        const potentialReward = (100 * totalPool) / winningPool;
        const profit = potentialReward - 100;
        const roi = (profit / 100) * 100;
        
        return `${roi.toFixed(1)}% ROI`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                    <p className="font-mono-brutal" style={{ color: 'var(--color-text)' }}>LOADING EVENTS...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 pb-20 lg:pb-4" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-brutal text-primary mb-2">
                        PREDICTION EVENTS
                    </h1>
                    <p className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                        STAKE POINTS ON YES OR NO OUTCOMES
                    </p>
                </div>

                {/* User Points */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-brutal-primary mb-6"
                    style={{ borderColor: 'var(--color-primary)' }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                                YOUR BALANCE
                            </p>
                            <p className="text-2xl font-brutal text-primary">
                                {formatPoints(userPoints)}
                            </p>
                        </div>
                        <Target className="text-primary" size={32} />
                    </div>
                </motion.div>

                {/* Sort Options */}
                <div className="flex gap-2 mb-6">
                    {[
                        { key: "all", label: "ALL EVENTS" },
                        { key: "open", label: "OPEN" },
                        { key: "resolved", label: "RESOLVED" },
                    ].map((option) => (
                        <button
                            key={option.key}
                            onClick={() => setSortBy(option.key as SortOption)}
                            className={`px-4 py-2 border-2 font-brutal transition-colors ${
                                sortBy === option.key
                                    ? "btn-brutal"
                                    : "btn-secondary"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Event Cards */}
                {filteredEvents.length > 0 ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {filteredEvents.map((event, index) => {
                            const userStake = getUserStake(event.eventId);
                            const totalPool = event.yesPool + event.noPool;
                            const yesPercent =
                                totalPool > 0
                                    ? (event.yesPool / totalPool) * 100
                                    : 50;
                            const noPercent = 100 - yesPercent;

                            return (
                                <motion.div
                                    key={event.eventId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`card-brutal border-2 ${
                                        event.status === "open"
                                            ? "border-primary"
                                            : "border-accent"
                                    }`}
                                >
                                    {/* Event Header */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {event.status === "open" ? (
                                                    <Clock className="text-accent" size={20} />
                                                ) : (
                                                    <CheckCircle2 className="text-success" size={20} />
                                                )}
                                                <span
                                                    className={`text-xs font-brutal px-2 py-1 border ${
                                                        event.status === "open"
                                                            ? "bg-accent/20 border-accent text-accent"
                                                            : "bg-success/20 border-success text-success"
                                                    }`}
                                                >
                                                    {event.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-xs font-mono-brutal text-white">
                                                EVENT #{event.eventId}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-brutal text-primary mb-2">
                                            {event.metadata}
                                        </h3>
                                        {event.status === "resolved" && event.winner !== null && (
                                            <p className="text-sm font-mono-brutal text-white">
                                                Winner:{" "}
                                                <span
                                                    className={`font-brutal ${
                                                        event.winner ? "text-success" : "text-danger"
                                                    }`}
                                                >
                                                    {event.winner ? "YES" : "NO"}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Pool Visualization */}
                                    <div className="border-2 mb-4" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)' }}>
                                        <div className="grid grid-cols-2">
                                            <div className="p-3 border-r-2" style={{ borderColor: 'var(--color-border)' }}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="text-success" size={16} />
                                                    <span className="text-xs font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                                        YES POOL
                                                    </span>
                                                </div>
                                                <p className="text-lg font-brutal text-success">
                                                    {formatPoints(event.yesPool)}
                                                </p>
                                                <p className="text-xs font-mono-brutal mt-1" style={{ color: 'var(--color-text-body)' }}>
                                                    {yesPercent.toFixed(1)}%
                                                </p>
                                            </div>
                                            <div className="p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingDown className="text-danger" size={16} />
                                                    <span className="text-xs font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                                        NO POOL
                                                    </span>
                                                </div>
                                                <p className="text-lg font-brutal text-danger">
                                                    {formatPoints(event.noPool)}
                                                </p>
                                                <p className="text-xs font-mono-brutal mt-1" style={{ color: 'var(--color-text-body)' }}>
                                                    {noPercent.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full border-t-2 h-4 flex" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)' }}>
                                            <div
                                                className="h-full"
                                                style={{ width: `${yesPercent}%`, backgroundColor: 'var(--color-success)' }}
                                            />
                                            <div
                                                className="h-full"
                                                style={{ width: `${noPercent}%`, backgroundColor: 'var(--color-danger)' }}
                                            />
                                        </div>
                                    </div>

                                    {/* User Stake Info */}
                                    {userStake && (
                                        <div className="bg-primary/20 border border-primary p-3 mb-4">
                                            <p className="text-xs font-mono-brutal text-white mb-1">
                                                YOUR STAKE
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`font-brutal ${
                                                        userStake.stakeType === "yes"
                                                            ? "text-success"
                                                            : "text-danger"
                                                    }`}
                                                >
                                                    {userStake.stakeType.toUpperCase()}:{" "}
                                                    {formatPoints(userStake.amount)}
                                                </span>
                                                {event.status === "resolved" &&
                                                    event.winner !== null &&
                                                    userStake.stakeType ===
                                                        (event.winner ? "yes" : "no") && (
                                                        <span className="text-xs font-brutal text-success">
                                                            WINNER!
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {event.status === "open" ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleStake(event.eventId, "yes")
                                                    }
                                                    className="flex-1 btn-brutal flex items-center justify-center gap-2"
                                                >
                                                    <TrendingUp size={16} />
                                                    STAKE YES
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleStake(event.eventId, "no")
                                                    }
                                                    className="flex-1 btn-danger flex items-center justify-center gap-2"
                                                >
                                                    <TrendingDown size={16} />
                                                    STAKE NO
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {userStake &&
                                                    event.winner !== null &&
                                                    userStake.stakeType ===
                                                        (event.winner ? "yes" : "no") && (
                                                        <button
                                                            onClick={() =>
                                                                handleClaim(event.eventId)
                                                            }
                                                            className="flex-1 btn-brutal"
                                                        >
                                                            CLAIM REWARD
                                                        </button>
                                                    )}
                                                <div className="flex-1 bg-black border-2 border-white p-3 text-center">
                                                    <p className="text-xs font-mono-brutal text-white">
                                                        {userStake
                                                            ? userStake.stakeType ===
                                                              (event.winner ? "yes" : "no")
                                                                ? "CLAIM AVAILABLE"
                                                                : "YOU LOST"
                                                            : "NO STAKE"}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* ROI Info */}
                                    {event.status === "open" && totalPool > 0 && (
                                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                            <div className="border p-2" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)' }}>
                                                <p className="font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                                                    YES ROI
                                                </p>
                                                <p className="font-brutal text-success">
                                                    {calculateOdds(
                                                        event.yesPool,
                                                        event.noPool,
                                                        "yes"
                                                    )}
                                                </p>
                                            </div>
                                            <div className="border p-2" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)' }}>
                                                <p className="font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                                                    NO ROI
                                                </p>
                                                <p className="font-brutal text-danger">
                                                    {calculateOdds(
                                                        event.yesPool,
                                                        event.noPool,
                                                        "no"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="card-brutal text-center py-12">
                        <Target size={48} className="mx-auto mb-4 text-primary" />
                        <h3 className="text-lg font-brutal mb-2 text-primary">
                            NO EVENTS FOUND
                        </h3>
                        <p className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                            EVENTS WILL APPEAR HERE WHEN CREATED
                        </p>
                    </div>
                )}

                {/* Modals */}
                {selectedEvent && showStakeModal && (
                    <StakeModal
                        event={selectedEvent}
                        userPoints={userPoints}
                        existingStake={getUserStake(selectedEvent.eventId)}
                        onClose={() => {
                            setShowStakeModal(false);
                            setSelectedEvent(null);
                        }}
                        onStake={(amount, stakeType) => {
                            // TODO: Call contract stake function
                            console.log("Staking", amount, stakeType);
                            setShowStakeModal(false);
                            setSelectedEvent(null);
                        }}
                    />
                )}

                {selectedEvent && showClaimModal && (
                    <ClaimModal
                        event={selectedEvent}
                        userStake={getUserStake(selectedEvent.eventId)!}
                        onClose={() => {
                            setShowClaimModal(false);
                            setSelectedEvent(null);
                        }}
                        onClaim={() => {
                            // TODO: Call contract claim function
                            console.log("Claiming");
                            setShowClaimModal(false);
                            setSelectedEvent(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
