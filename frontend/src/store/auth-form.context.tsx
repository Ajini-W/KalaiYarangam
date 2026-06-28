"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthFormState {
  passwordLength: number;
  isPasswordVisible: boolean;
  isTyping: boolean;
  setPasswordLength: (v: number) => void;
  setIsPasswordVisible: (v: boolean) => void;
  setIsTyping: (v: boolean) => void;
}

const AuthFormContext = createContext<AuthFormState | undefined>(undefined);

export function AuthFormProvider({ children }: { children: ReactNode }) {
  const [passwordLength, setPasswordLength] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <AuthFormContext.Provider
      value={{ passwordLength, isPasswordVisible, isTyping, setPasswordLength, setIsPasswordVisible, setIsTyping }}
    >
      {children}
    </AuthFormContext.Provider>
  );
}

export function useAuthForm() {
  const ctx = useContext(AuthFormContext);
  if (!ctx) throw new Error("useAuthForm must be used within AuthFormProvider");
  return ctx;
}
