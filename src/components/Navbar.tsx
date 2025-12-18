import { Link, useLocation } from "react-router-dom";
import {
    Home,
    TrendingUp,
    Briefcase,
    Trophy,
    Users,
    User,
    Coins,
} from "lucide-react";
import { cn } from "@/utils/cn";
import logo from "@/assets/roxy-logo.png";

const navItems = [
    { path: "/app", icon: Home, label: "Dashboard" },
    { path: "/app/markets", icon: TrendingUp, label: "Events" },
    { path: "/app/marketplace", icon: Coins, label: "Marketplace" },
    { path: "/app/portfolio", icon: Briefcase, label: "Portfolio" },
    { path: "/app/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/app/guilds", icon: Users, label: "Guilds" },
];

export function Navbar() {
    const location = useLocation();

    return (
        <>
            {/* Mobile Navigation - Bottom */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brutal lg:hidden" style={{ backgroundColor: 'var(--color-background)' }}>
                <div className="flex justify-around items-center py-2 px-4">
                    {navItems.map(({ path, icon: Icon, label }) => {
                        const isActive = location.pathname === path;

                        return (
                            <Link
                                key={path}
                                to={path}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-3 transition-colors",
                                    isActive
                                        ? "text-primary"
                                        : "text-text-body hover:text-text"
                                )}
                            >
                                <Icon size={20} />
                                <span className="text-xs font-brutal">
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Desktop Navigation - Sidebar */}
            <nav className="hidden lg:block fixed left-0 top-0 h-full w-64 z-50 border-r border-brutal" style={{ backgroundColor: 'var(--color-background)' }}>
                <div className="flex flex-col h-full">
                    {/* Logo/Brand */}
                    <div className="p-6 border-b border-brutal">
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={logo}
                                alt="Roxy Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <div>
                                <h1 className="text-xl font-brutal" style={{ color: 'var(--color-text)' }}>
                                    ROXY
                                </h1>
                                <p className="text-xs font-mono-brutal" style={{ color: 'var(--color-text-muted)' }}>
                                    PREDICTION MARKET
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 py-6">
                        <div className="space-y-0 px-4">
                            {navItems.map(({ path, icon: Icon, label }) => {
                                const isActive = location.pathname === path;

                                return (
                                    <Link
                                        key={path}
                                        to={path}
                                        className={cn(
                                            "flex items-center gap-3 p-3 transition-colors relative",
                                            isActive
                                                ? "text-primary"
                                                : "text-text-body hover:text-text"
                                        )}
                                        style={isActive ? {
                                            backgroundColor: 'var(--color-card)',
                                            borderLeft: '2px solid var(--color-primary)'
                                        } : {}}
                                    >
                                        <Icon size={20} style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                                        <span className="font-brutal">
                                            {label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-t border-brutal">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border border-brutal flex items-center justify-center" style={{ backgroundColor: 'var(--color-card)' }}>
                                <User size={16} style={{ color: 'var(--color-text-muted)' }} />
                            </div>
                            <div>
                                <p className="text-sm font-brutal" style={{ color: 'var(--color-text)' }}>
                                    USER
                                </p>
                                <p className="text-xs font-mono-brutal" style={{ color: 'var(--color-text-muted)' }}>
                                    PREDICTOR
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
