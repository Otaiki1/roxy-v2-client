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
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(11, 14, 20, 0.9)' }}
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
                                    <p className="text-xs font-mono-brutal" style={{ color: 'var(--color-text-body)' }}>
                                        CREATE YOUR ACCOUNT
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="transition-colors"
                                style={{ color: 'var(--color-text-body)' }}
                                disabled={isLoading}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Info Box */}
                        <div className="border p-4 mb-6" style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-primary)' }}>
                            <p className="text-sm font-mono-brutal mb-2" style={{ color: 'var(--color-text-body)' }}>
                                STARTING BONUS:
                            </p>
                            <p className="text-2xl font-brutal text-primary">
                                1,000 POINTS
                            </p>
                            <p className="text-xs font-mono-brutal mt-2" style={{ color: 'var(--color-text-body)' }}>
                                Free points to start predicting. Earn more by winning predictions.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-brutal mb-2" style={{ color: 'var(--color-text)' }}>
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
                                    className="w-full border-2 px-4 py-3 focus:outline-none focus:border-primary font-mono-brutal"
                                    style={{ backgroundColor: 'var(--color-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                                    disabled={isLoading}
                                    autoFocus
                                />
                                <p className="text-xs font-mono-brutal mt-2" style={{ color: 'var(--color-text-body)' }}>
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
                                    className="flex-1 py-3 px-4 btn-secondary disabled:opacity-50"
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

