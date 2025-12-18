import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Coins,
    Plus,
    X,
    ShoppingCart,
} from "lucide-react";
import { CreateListingModal } from "@/components/CreateListingModal";
import { BuyListingModal } from "@/components/BuyListingModal";

interface Listing {
    listingId: number;
    seller: string;
    points: number;
    priceStx: number; // in micro-STX
    active: boolean;
}

export function Marketplace() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [userPoints, setUserPoints] = useState(0);
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [canSell, setCanSell] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual contract calls
        // const loadData = async () => {
        //     const listings = await contract.getActiveListings();
        //     const points = await contract.getUserPoints(userAddress);
        //     const earned = await contract.getEarnedPoints(userAddress);
        //     const canSell = await contract.canSell(userAddress);
        //     setListings(listings);
        //     setUserPoints(points);
        //     setEarnedPoints(earned);
        //     setCanSell(canSell);
        // };

        // Mock data
        setTimeout(() => {
            setListings([
                {
                    listingId: 1,
                    seller: "SELLER_01",
                    points: 5000,
                    priceStx: 5000000, // 5 STX
                    active: true,
                },
                {
                    listingId: 2,
                    seller: "SELLER_02",
                    points: 3000,
                    priceStx: 3000000, // 3 STX
                    active: true,
                },
                {
                    listingId: 3,
                    seller: "SELLER_03",
                    points: 10000,
                    priceStx: 10000000, // 10 STX
                    active: true,
                },
            ]);
            setUserPoints(15000);
            setEarnedPoints(12000);
            setCanSell(true);
            setIsLoading(false);
        }, 500);
    }, []);

    const formatPoints = (points: number) => {
        return points.toLocaleString() + " PTS";
    };

    const formatStx = (microStx: number) => {
        return (microStx / 1000000).toFixed(2) + " STX";
    };

    const formatPricePerPoint = (microStx: number, points: number) => {
        return (microStx / points / 1000).toFixed(3) + " mSTX/pt";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
                    <p className="font-mono-brutal" style={{ color: 'var(--color-text)' }}>LOADING MARKETPLACE...</p>
                </div>
            </div>
        );
    }

    const activeListings = listings.filter((l) => l.active);

    return (
        <div className="min-h-screen p-4 pb-20 lg:pb-4" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-brutal text-primary mb-2">
                            POINT MARKETPLACE
                        </h1>
                    <p className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                        BUY AND SELL POINTS WITH OTHER PLAYERS
                    </p>
                </div>
                {canSell && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 btn-brutal"
                    >
                        <Plus size={16} />
                        CREATE LISTING
                    </button>
                )}
            </div>

            {/* User Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-brutal-primary mb-6"
                style={{ borderColor: 'var(--color-primary)' }}
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                            YOUR POINTS
                        </p>
                        <p className="text-xl font-brutal text-primary">
                            {formatPoints(userPoints)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                            EARNED POINTS
                        </p>
                        <p className="text-xl font-brutal" style={{ color: 'var(--color-text)' }}>
                            {formatPoints(earnedPoints)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                            CAN SELL
                        </p>
                        <p
                            className={`text-xl font-brutal ${
                                canSell ? "text-success" : "text-danger"
                            }`}
                        >
                            {canSell ? "YES" : "NO"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-mono-brutal mb-1" style={{ color: 'var(--color-text-body)' }}>
                            LISTING FEE
                        </p>
                        <p className="text-xl font-brutal" style={{ color: 'var(--color-text)' }}>
                            10 STX
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Requirements Info */}
            {!canSell && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-brutal mb-6"
                    style={{ borderColor: 'var(--color-danger)' }}
                >
                    <p className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                        <span className="font-brutal" style={{ color: 'var(--color-danger)' }}>
                            SELLING REQUIREMENT:
                        </span>{" "}
                        You need 10,000+ earned points to create listings. You
                        currently have {formatPoints(earnedPoints)} earned points.
                        Win more predictions to unlock selling!
                    </p>
                </motion.div>
            )}

                {/* Listings */}
                {activeListings.length > 0 ? (
                    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                        {activeListings.map((listing, index) => (
                            <motion.div
                                key={listing.listingId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card-brutal border-2 border-primary"
                            >
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                                LISTING #{listing.listingId}
                                            </span>
                                            <span className="text-xs font-brutal px-2 py-1 border text-success" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-success)' }}>
                                                ACTIVE
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-brutal text-primary mb-2">
                                            {formatPoints(listing.points)}
                                        </h3>
                                        <p className="text-sm font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                            Seller: {listing.seller}
                                        </p>
                                    </div>

                                    <div className="border-2 p-4 mb-4" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)' }}>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                                    PRICE
                                                </span>
                                                <span className="text-xl font-brutal text-primary">
                                                    {formatStx(listing.priceStx)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                                    PRICE PER POINT
                                                </span>
                                                <span className="font-brutal" style={{ color: 'var(--color-accent)' }}>
                                                    {formatPricePerPoint(
                                                        listing.priceStx,
                                                        listing.points
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                <button
                                    onClick={() => {
                                        setSelectedListing(listing);
                                        setShowBuyModal(true);
                                    }}
                                    className="w-full btn-brutal flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={16} />
                                    BUY POINTS
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="card-brutal text-center py-12">
                        <Coins size={48} className="mx-auto mb-4 text-primary" />
                        <h3 className="text-lg font-brutal mb-2 text-primary">
                            NO LISTINGS AVAILABLE
                        </h3>
                        <p className="font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                            {canSell
                                ? "CREATE THE FIRST LISTING TO GET STARTED"
                                : "LISTINGS WILL APPEAR HERE WHEN CREATED"}
                        </p>
                    </div>
                )}

                {/* Modals */}
                {showCreateModal && (
                    <CreateListingModal
                        userPoints={userPoints}
                        earnedPoints={earnedPoints}
                        onClose={() => setShowCreateModal(false)}
                        onCreate={(points, priceStx) => {
                            // TODO: Call contract create-listing function
                            console.log("Creating listing", points, priceStx);
                            setShowCreateModal(false);
                        }}
                    />
                )}

                {selectedListing && showBuyModal && (
                    <BuyListingModal
                        listing={selectedListing}
                        userPoints={userPoints}
                        onClose={() => {
                            setShowBuyModal(false);
                            setSelectedListing(null);
                        }}
                        onBuy={(pointsToBuy) => {
                            // TODO: Call contract buy-listing function
                            console.log("Buying", pointsToBuy);
                            setShowBuyModal(false);
                            setSelectedListing(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

