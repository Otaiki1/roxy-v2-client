import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    Trophy,
    ArrowRight,
    Target,
    Coins,
    CheckCircle2,
    XCircle,
    Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/roxy-logo.png";
import { RegistrationModal } from "@/components/RegistrationModal";

// Mock contract data - replace with actual contract calls
interface UserData {
    username: string | null;
    points: number;
    earnedPoints: number;
    canSell: boolean;
    stats: {
        totalPredictions: number;
        wins: number;
        losses: number;
        totalPointsEarned: number;
        winRate: number; // 0-10000 (10000 = 100%)
    } | null;
}

interface ActiveStake {
    eventId: number;
    eventMetadata: string;
    stakeType: "yes" | "no";
    amount: number;
    status: "open" | "resolved";
}

export function Dashboard() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [activeStakes, setActiveStakes] = useState<ActiveStake[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Check registration status and load user data
    useEffect(() => {
        // TODO: Replace with actual contract calls
        // const checkRegistration = async () => {
        //     const user = await contract.getUserPoints(userAddress);
        //     if (user) {
        //         setIsRegistered(true);
        //         loadUserData();
        //     } else {
        //         setIsRegistered(false);
        //     }
        // };
        
        // Mock data for now
        setTimeout(() => {
            setIsRegistered(true);
            setUserData({
                username: "PREDICTOR_01",
                points: 15000,
                earnedPoints: 12000,
                canSell: true,
                stats: {
                    totalPredictions: 25,
                    wins: 15,
                    losses: 10,
                    totalPointsEarned: 12000,
                    winRate: 6000, // 60%
                },
            });
            setActiveStakes([
                {
                    eventId: 1,
                    eventMetadata: "Will Bitcoin reach $100k by 2025?",
                    stakeType: "yes",
                    amount: 500,
                    status: "open",
                },
                {
                    eventId: 2,
                    eventMetadata: "Will Ethereum hit $5000?",
                    stakeType: "no",
                    amount: 300,
                    status: "resolved",
                },
            ]);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleRegister = async (username: string) => {
        // TODO: Call contract register function
        // await contract.register(username);
        setIsRegistered(true);
        setUserData({
            username,
            points: 1000, // Starting points
            earnedPoints: 0,
            canSell: false,
            stats: null,
        });
    };

    const formatPoints = (points: number) => {
        return points.toLocaleString() + " PTS";
    };

    const formatWinRate = (rate: number) => {
        return (rate / 100).toFixed(1) + "%";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                    <p className="font-mono-brutal text-white">LOADING...</p>
                </div>
            </div>
        );
    }

    if (!isRegistered) {
        return (
            <>
                <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-2xl"
                    >
                        <div className="mb-8">
                            <img
                                src={logo}
                                alt="Roxy Logo"
                                className="w-24 h-24 mx-auto mb-6 object-contain"
                            />
                            <h1 className="text-5xl font-brutal text-primary mb-4">
                                WELCOME TO ROXY
                            </h1>
                            <p className="text-xl font-mono-brutal text-white mb-8">
                                REGISTER TO START PREDICTING
                            </p>
                        </div>

                        <div className="bg-card border-2 border-primary p-8 mb-8">
                            <h2 className="text-2xl font-brutal text-primary mb-4">
                                GET STARTED
                            </h2>
                            <ul className="text-left space-y-3 font-mono-brutal text-white mb-6">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="text-primary" size={20} />
                                    Receive 1,000 starting points
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="text-primary" size={20} />
                                    Start predicting on events
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="text-primary" size={20} />
                                    Earn points by winning predictions
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="text-primary" size={20} />
                                    Unlock marketplace at 10,000 earned points
                                </li>
                            </ul>
                            <button
                                onClick={() => setShowRegistration(true)}
                                className="btn-brutal w-full text-lg py-4"
                            >
                                REGISTER NOW
                            </button>
                        </div>
                    </motion.div>
                </div>
                <RegistrationModal
                    isOpen={showRegistration}
                    onClose={() => setShowRegistration(false)}
                    onRegister={handleRegister}
                />
            </>
        );
    }

    if (!userData) return null;

    const winRate = userData.stats
        ? formatWinRate(userData.stats.winRate)
        : "0%";

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-20 lg:pb-4">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto border-b-2 border-accent pb-4">
                <div className="flex items-center gap-4">
                    <img
                        src={logo}
                        alt="Roxy Logo"
                        className="w-16 h-16 object-contain"
                    />
                    <div>
                        <h1 className="text-xl font-brutal text-text">
                            {userData.username || "USER"}
                        </h1>
                        <p className="text-sm font-mono-brutal text-text-body">
                            {userData.stats
                                ? `${userData.stats.totalPredictions} PREDICTIONS • ${winRate} WIN RATE`
                                : "NO PREDICTIONS YET"}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-2xl font-brutal text-primary">
                        {formatPoints(userData.points)}
                    </p>
                    <p className="text-sm font-mono-brutal text-text-body">
                        POINT BALANCE
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto space-y-6 lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0">
                {/* Points Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-brutal lg:col-span-8 border-2 border-primary"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-brutal text-primary mb-2">
                            {formatPoints(userData.earnedPoints)}
                        </h2>
                        <p className="font-mono-brutal text-white mb-4">
                            EARNED POINTS
                        </p>

                        <div className="bg-black border border-primary p-4 mb-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-mono-brutal text-white mb-1">
                                        TOTAL POINTS
                                    </p>
                                    <p className="font-brutal text-primary text-lg">
                                        {formatPoints(userData.points)}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-mono-brutal text-white mb-1">
                                        CAN SELL
                                    </p>
                                    <p
                                        className={`font-brutal text-lg ${
                                            userData.canSell
                                                ? "text-success"
                                                : "text-danger"
                                        }`}
                                    >
                                        {userData.canSell ? "YES" : "NO"}
                                    </p>
                                    {!userData.canSell && (
                                        <p className="text-xs font-mono-brutal text-white mt-1">
                                            Need 10,000 earned points
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {userData.stats && (
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="font-mono-brutal text-white">
                                        WINS
                                    </p>
                                    <p className="font-brutal text-success text-lg">
                                        {userData.stats.wins}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-mono-brutal text-white">
                                        LOSSES
                                    </p>
                                    <p className="font-brutal text-danger text-lg">
                                        {userData.stats.losses}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-mono-brutal text-white">
                                        TOTAL EARNED
                                    </p>
                                    <p className="font-brutal text-primary text-lg">
                                        {formatPoints(
                                            userData.stats.totalPointsEarned
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Win Rate Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-brutal lg:col-span-4 border-2 border-accent"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-brutal text-accent">
                            WIN RATE
                        </h3>
                        <Trophy className="text-accent" size={24} />
                    </div>

                    {userData.stats ? (
                        <>
                            <div className="text-center mb-4">
                                <p className="text-4xl font-brutal text-accent">
                                    {winRate}
                                </p>
                                <p className="text-xs font-mono-brutal text-white mt-1">
                                    {userData.stats.wins} WINS /{" "}
                                    {userData.stats.totalPredictions} TOTAL
                                </p>
                            </div>

                            <div className="w-full bg-black border h-4">
                                <motion.div
                                    className="bg-accent h-full border border-accent"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${
                                            (userData.stats.winRate / 10000) *
                                            100
                                        }%`,
                                    }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <Target size={32} className="mx-auto mb-2 text-white" />
                            <p className="font-mono-brutal text-white text-sm">
                                NO STATS YET
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Active Stakes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="card-brutal lg:col-span-12 border-2"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-brutal text-primary flex items-center gap-2">
                            <Target className="text-primary" size={20} />
                            ACTIVE STAKES
                        </h3>
                        <Link
                            to="/app/markets"
                            className="text-accent hover:text-primary font-brutal transition-none text-sm flex items-center gap-1"
                        >
                            VIEW ALL
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {activeStakes.length > 0 ? (
                        <div className="space-y-3">
                            {activeStakes.map((stake, index) => (
                                <motion.div
                                    key={stake.eventId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="bg-black border-2 border-white p-4 flex items-center justify-between"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {stake.status === "open" ? (
                                                <Clock className="text-accent" size={20} />
                                            ) : stake.status === "resolved" ? (
                                                <CheckCircle2 className="text-success" size={20} />
                                            ) : (
                                                <XCircle className="text-danger" size={20} />
                                            )}
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
                                            <span
                                                className={`font-mono-brutal ${
                                                    stake.status === "open"
                                                        ? "text-accent"
                                                        : stake.status === "resolved"
                                                        ? "text-success"
                                                        : "text-danger"
                                                }`}
                                            >
                                                {stake.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    {stake.status === "resolved" && (
                                        <Link
                                            to={`/app/markets?event=${stake.eventId}`}
                                            className="btn-brutal px-4 py-2"
                                        >
                                            CLAIM
                                        </Link>
                                    )}
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
                                START STAKING ON EVENTS TO EARN REWARDS
                            </p>
                            <Link
                                to="/app/markets"
                                className="btn-brutal inline-flex items-center gap-2"
                            >
                                VIEW EVENTS
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="grid grid-cols-2 gap-4 lg:col-span-12"
                >
                    <Link
                        to="/app/markets"
                        className="card-brutal border-2 border-primary p-6 text-center hover:bg-primary hover:text-black transition-none group"
                    >
                        <Target className="text-primary group-hover:text-black mx-auto mb-3" size={32} />
                        <h4 className="font-brutal text-lg mb-2">PREDICT</h4>
                        <p className="text-xs font-mono-brutal">
                            STAKE ON EVENTS
                        </p>
                    </Link>

                    {userData.canSell && (
                        <Link
                            to="/app/marketplace"
                            className="card-brutal border-2 border-accent p-6 text-center hover:bg-accent hover:text-black transition-none group"
                        >
                            <Coins className="text-accent group-hover:text-black mx-auto mb-3" size={32} />
                            <h4 className="font-brutal text-lg mb-2">MARKETPLACE</h4>
                            <p className="text-xs font-mono-brutal">
                                SELL POINTS
                            </p>
                        </Link>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
