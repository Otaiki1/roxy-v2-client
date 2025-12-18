import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (username: string) => Promise<void>;
    isLoading?: boolean;
}

export function RegistrationModal({
    isOpen,
    onClose,
    onRegister,
    isLoading = false,
}: RegistrationModalProps) {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim()) {
            setError("USERNAME REQUIRED");
            return;
        }

        if (username.length > 50) {
            setError("USERNAME TOO LONG (MAX 50 CHARACTERS)");
            return;
        }

        try {
            await onRegister(username.trim());
            setUsername("");
            onClose();
        } catch (err: any) {
            setError(err.message || "REGISTRATION FAILED");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary border-2 border-primary flex items-center justify-center">
                                    <User className="text-black" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-brutal text-primary">
                                        REGISTER
                                    </h3>
                                    <p className="text-xs font-mono-brutal text-white">
                                        CREATE YOUR ACCOUNT
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-accent transition-none"
                                disabled={isLoading}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Info Box */}
                        <div className="bg-black border border-primary p-4 mb-6">
                            <p className="text-sm font-mono-brutal text-white mb-2">
                                STARTING BONUS:
                            </p>
                            <p className="text-2xl font-brutal text-primary">
                                1,000 POINTS
                            </p>
                            <p className="text-xs font-mono-brutal text-white mt-2">
                                Free points to start predicting. Earn more by winning predictions.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-brutal text-white mb-2">
                                    USERNAME
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="ENTER USERNAME"
                                    maxLength={50}
                                    className="w-full bg-black border-2 border-white px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary font-mono-brutal"
                                    disabled={isLoading}
                                    autoFocus
                                />
                                <p className="text-xs font-mono-brutal text-white mt-2">
                                    Must be unique. Max 50 characters.
                                </p>
                                {error && (
                                    <p className="text-sm font-brutal text-danger mt-2">
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 py-3 px-4 bg-black text-white border-2 border-white font-brutal hover:bg-white hover:text-black transition-none disabled:opacity-50"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !username.trim()}
                                    className="flex-1 py-3 px-4 btn-brutal disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "REGISTERING..." : "REGISTER"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

