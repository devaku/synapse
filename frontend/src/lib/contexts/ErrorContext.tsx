import { createContext, useContext, useState, type ReactNode } from "react";

type ErrorContextType = {
    error: Error | null;
    reportError: (error: Error) => void;
    clearError: () => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
    const [error, setError] = useState<Error | null>(null)

    const reportError = (error: Error) => {
        setError(error)
    }

    const clearError = () => {
        setError(null)
    }

    return (
        <ErrorContext value={{ error, reportError, clearError }}>
            {children}
        </ErrorContext>
    )
}

export function useError(): ErrorContextType {
    const context = useContext(ErrorContext);

    if (context === undefined) {
        throw new Error("useError must be used within an ErrorProvider");
    }

    return context;
}