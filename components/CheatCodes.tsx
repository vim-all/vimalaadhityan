"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CheatCodes() {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ code: string; status: 'ACTIVATED' | 'DEACTIVATED' } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key.length === 1) {
        const newInput = (input + key).slice(-10);
        setInput(newInput);

        if (newInput.endsWith("GOD")) {
          triggerCode("GOD");
        } else if (newInput.endsWith("ZEN")) {
          triggerCode("ZEN");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  const triggerCode = (code: string) => {
    setInput("");
    
    if (code === "GOD") {
      document.documentElement.classList.add("animate-breach-overload");
      setFeedback({ code, status: 'ACTIVATED' });
      setTimeout(() => {
        document.documentElement.classList.remove("animate-breach-overload");
        setFeedback({ code, status: 'DEACTIVATED' });
        setTimeout(() => setFeedback(null), 2000);
      }, 5000);
    } else if (code === "ZEN") {
      const isZen = document.documentElement.classList.toggle("zen-mode");
      setFeedback({ code, status: isZen ? 'ACTIVATED' : 'DEACTIVATED' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none"
        >
          <div className="relative overflow-hidden bg-foreground text-background px-10 py-4 rounded-xl font-mono font-black border border-accent/20 group">
             <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] tracking-widest opacity-40">SYSTEM_OVERRIDE_LOG</span>
                <span className="text-xl tracking-[0.5em]">{feedback.code}_{feedback.status}</span>
             </div>
             
             {/* Progress Bar for GOD mode timeout */}
             {feedback.code === "GOD" && feedback.status === 'ACTIVATED' && (
               <motion.div 
                 initial={{ width: "100%" }}
                 animate={{ width: "0%" }}
                 transition={{ duration: 5, ease: "linear" }}
                 className="absolute bottom-0 left-0 h-1 bg-accent"
               />
             )}
             
             {/* Decorative Corners */}
             <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-accent" />
             <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-accent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
