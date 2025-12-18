import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    XCircle,
    Clock,
    Target,
} from "lucide-react";
import { Link } from "react-router-dom";

interface UserStake {
    eventId: number;
    eventMetadata: string;
    stakeType: "yes" | "no";
    amount: number;
    status: "open" | "resolved";
    winner: boolean | null;
    reward?: number;
}

interface UserListing {
    listingId: number;
    points: number;
    priceStx: number;
    active: boolean;
}

export function Portfolio() {
    const [userPoints, setUserPoints] = useState(0);
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [userStakes, setUserStakes] = useState<UserStake[]>([]);
    const [userListings, setUserListings] = useState<UserListing[]>([]);
    const [userStats, setUserStats] = useState({
        totalPredictions: 0,
        wins: 0,
        losses: 0,
        totalPointsEarned: 0,
        winRate: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual contract calls
        // const loadData = async () => {
        //     const points = await contract.getUserPoints(userAddress);
        //     const earned = await contract.getEarnedPoints(userAddress);
        //     const stakes = await contract.getUserStakes(userAddress);
        //     const listings = await contract.getUserListings(userAddress);
        //     const stats = await contract.getUserStats(userAddress);
        // };

        // Mock data
        setTimeout(() => {
            setUserPoints(15000);
            setEarnedPoints(12000);
            setUserStakes([
                {
                    eventId: 1,
                    eventMetadata: "Will Bitcoin reach $100k by 2025?",
                    stakeType: "yes",
                    amount: 500,
                    status: "open",
                    winner: null,
                },
                {
                    eventId: 2,
                    eventMetadata: "Will Ethereum hit $5000?",
                    stakeType: "no",
                    amount: 300,
                    status: "resolved",
                    winner: false,
                    reward: 600,
                },
                {
                    eventId: 3,
                    eventMetadata: "Will Solana reach $200?",
                    stakeType: "yes",
                    amount: 200,
                    status: "resolved",
                    winner: true,
                    reward: 350,
                },
            ]);
            setUserListings([
                {
                    listingId: 1,
                    points: 5000,
                    priceStx: 5000000,
                    active: true,
                },
            ]);
            setUserStats({
                totalPredictions: 25,
                wins: 15,
                losses: 10,
                totalPointsEarned: 12000,
                winRate: 6000, // 60%
            });
            setIsLoading(false);
        }, 500);
    }, []);

    const formatPoints = (points: number) => {
        return points.toLocaleString() + " PTS";
    };

    const formatStx = (microStx: number) => {
        return (microStx / 1000000).toFixed(2) + " STX";
    };

    const formatWinRate = (rate: number) => {
        return (rate / 100).toFixed(1) + "%";
    };

    const totalProfit = userStats.totalPointsEarned;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                    <p className="font-mono-brutal text-white">LOADING PORTFOLIO...</p>
                </div>
            </div>
        );
    }

    const openStakes = userStakes.filter((s) => s.status === "open");
    const resolvedStakes = userStakes.filter((s) => s.status === "resolved");
    const wonStakes = resolvedStakes.filter(
        (s) => s.winner !== null && s.stakeType === (s.winner ? "yes" : "no")
    );
    const lostStakes = resolvedStakes.filter(
        (s) => s.winner !== null && s.stakeType !== (s.winner ? "yes" : "no")
    );

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-20 lg:pb-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-brutal text-primary mb-2">
                        PORTFOLIO
                    </h1>
                    <p className="font-mono-brutal text-white">
                        YOUR PREDICTIONS, STAKES, AND LISTINGS
                    </p>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-6">
                    {/* Portfolio Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-brutal mb-6 lg:col-span-4 border-2 border-primary"
                    >
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-brutal text-primary mb-2">
                                {formatPoints(totalProfit)}
                            </h2>
                            <p className="font-mono-brutal text-white mb-4">
                                TOTAL POINTS EARNED
                            </p>

                            <div className="bg-black border-2 border-white p-4 mb-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono-brutal text-white">
                                            CURRENT BALANCE
                                        </span>
                                        <span className="font-brutal text-primary">
                                            {formatPoints(userPoints)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono-brutal text-white">
                                            EARNED POINTS
                                        </span>
                                        <span className="font-brutal text-accent">
                                            {formatPoints(earnedPoints)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {userStats.totalPredictions > 0 && (
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="font-mono-brutal text-white">
                                            WINS
                                        </p>
                                        <p className="font-brutal text-success text-lg">
                                            {userStats.wins}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-mono-brutal text-white">
                                            LOSSES
                                        </p>
                                        <p className="font-brutal text-danger text-lg">
                                            {userStats.losses}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-mono-brutal text-white">
                                            WIN RATE
                                        </p>
                                        <p className="font-brutal text-primary text-lg">
                                            {formatWinRate(userStats.winRate)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Active Stakes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card-brutal mb-6 lg:col-span-8 border-2"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-brutal text-primary flex items-center gap-2">
                                <Target className="text-primary" size={20} />
                                ACTIVE STAKES
                            </h3>
                            <Link
                                to="/app/markets"
                                className="text-accent hover:text-primary font-brutal transition-none text-sm"
                            >
                                VIEW ALL EVENTS
                            </Link>
                        </div>

                        {openStakes.length > 0 ? (
                            <div className="space-y-3">
                                {openStakes.map((stake, index) => (
                                    <motion.div
                                        key={stake.eventId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 + index * 0.1 }}
                                        className="bg-black border-2 border-white p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Clock className="text-accent" size={20} />
                                                    <h4 className="font-brutal text-primary">
                                                        {stake.eventMetadata}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span
                                                        className={`font-brutal px-2 py-1 border ${
                                                            stake.stakeType === "yes"
                                                                ? "bg-success/20 border-success text-success"
                                                                : "bg-danger/20 border-danger text-danger"
                                                        }`}
                                                    >
                                                        {stake.stakeType.toUpperCase()}
                                                    </span>
                                                    <span className="font-mono-brutal text-white">
                                                        {formatPoints(stake.amount)} STAKED
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-white">
                                <Target size={48} className="mx-auto mb-4 text-primary" />
                                <h3 className="text-lg font-brutal mb-2 text-primary">
                                    NO ACTIVE STAKES
                                </h3>
                                <p className="font-mono-brutal mb-4">
                                    START STAKING ON EVENTS TO BUILD YOUR PORTFOLIO
                                </p>
                                <Link
                                    to="/app/markets"
                                    className="btn-brutal inline-flex items-center gap-2"
                                >
                                    VIEW EVENTS
                                </Link>
                            </div>
                        )}
                    </motion.div>

                    {/* Resolved Stakes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-brutal mb-6 lg:col-span-12 border-2"
                    >
                        <h3 className="text-lg font-brutal text-primary mb-4">
                            RESOLVED PREDICTIONS
                        </h3>

                        {resolvedStakes.length > 0 ? (
                            <div className="space-y-3">
                                {resolvedStakes.map((stake, index) => {
                                    const isWinner =
                                        stake.winner !== null &&
                                        stake.stakeType === (stake.winner ? "yes" : "no");

                                    return (
                                        <motion.div
                                            key={stake.eventId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.25 + index * 0.1 }}
                                            className={`p-4 border-2 ${
                                                isWinner
                                                    ? "bg-success/10 border-success"
                                                    : "bg-danger/10 border-danger"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    {isWinner ? (
                                                        <CheckCircle2 className="text-success" size={20} />
                                                    ) : (
                                                        <XCircle className="text-danger" size={20} />
                                                    )}
                                                    <div>
                                                        <h4 className="font-brutal text-primary">
                                                            {stake.eventMetadata}
                                                        </h4>
                                                        <div className="flex items-center gap-4 text-sm mt-1">
                                                            <span
                                                                className={`font-brutal ${
                                                                    stake.stakeType === "yes"
                                                                        ? "text-success"
                                                                        : "text-danger"
                                                                }`}
                                                            >
                                                                {stake.stakeType.toUpperCase()}
                                                            </span>
                                                            <span className="font-mono-brutal text-white">
                                                                {formatPoints(stake.amount)} STAKED
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {isWinner && stake.reward ? (
                                                        <>
                                                            <p className="font-brutal text-success text-lg">
                                                                +{formatPoints(stake.reward)}
                                                            </p>
                                                            <p className="text-xs font-mono-brutal text-white">
                                                                REWARD
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="font-brutal text-danger text-lg">
                                                                -{formatPoints(stake.amount)}
                                                            </p>
                                                            <p className="text-xs font-mono-brutal text-white">
                                                                LOST
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-white">
                                <p className="font-mono-brutal">
                                    NO RESOLVED PREDICTIONS YET
                                </p>
                            </div>
                        )}
                    </motion.div>

                    {/* User Listings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card-brutal lg:col-span-12 border-2"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-brutal text-primary flex items-center gap-2">
                                <Target className="text-primary" size={20} />
                                YOUR LISTINGS
                            </h3>
                            <Link
                                to="/app/marketplace"
                                className="text-accent hover:text-primary font-brutal transition-none text-sm"
                            >
                                VIEW MARKETPLACE
                            </Link>
                        </div>

                        {userListings.length > 0 ? (
                            <div className="space-y-3">
                                {userListings.map((listing, index) => (
                                    <motion.div
                                        key={listing.listingId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.35 + index * 0.1 }}
                                        className="bg-black border-2 border-white p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-brutal text-primary">
                                                    LISTING #{listing.listingId}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm mt-1">
                                                    <span className="font-mono-brutal text-white">
                                                        {formatPoints(listing.points)} POINTS
                                                    </span>
                                                    <span className="font-brutal text-accent">
                                                        {formatStx(listing.priceStx)}
                                                    </span>
                                                    <span
                                                        className={`font-brutal px-2 py-1 border ${
                                                            listing.active
                                                                ? "bg-success/20 border-success text-success"
                                                                : "bg-gray-600 border-gray-600 text-gray-400"
                                                        }`}
                                                    >
                                                        {listing.active ? "ACTIVE" : "INACTIVE"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-white">
                                <p className="font-mono-brutal mb-4">
                                    NO LISTINGS YET
                                </p>
                                <Link
                                    to="/app/marketplace"
                                    className="btn-brutal inline-flex items-center gap-2"
                                >
                                    CREATE LISTING
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
