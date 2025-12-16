"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, ShieldCheck, ShieldX } from "lucide-react"

export function AgeVerificationDialog() {
  const [showDialog, setShowDialog] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const verified = localStorage.getItem("age_verified")
    if (verified === "true") {
      setIsVerified(true)
    } else {
      setShowDialog(true)
    }
  }, [])

  const handleAbove18 = () => {
    localStorage.setItem("age_verified", "true")
    setIsVerified(true)
    setShowDialog(false)
  }

  const handleBelow18 = () => {
    window.close()
    window.location.href = "https://www.google.com"
  }

  if (isVerified && !showDialog) return null
  if (!showDialog) return null

  return (
    <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Pornhub Logo */}
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl font-extrabold text-white tracking-tight">Porn</span>
          <span className="text-3xl font-extrabold bg-[#FF9000] text-black px-2 py-0.5 rounded-md ml-0.5 tracking-tight">hub</span>
        </div>

        {/* Warning Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FF9000]/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-[#FF9000]" />
        </div>

        {/* 18+ Badge */}
        <div className="inline-flex items-center justify-center bg-[#FF9000] text-black font-bold text-3xl px-6 py-3 rounded-xl mb-6">
          18+
        </div>

        {/* Title */}
        <h2 className="text-white text-xl font-bold mb-3">Age Verification Required</h2>

        {/* Message */}
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          This website contains adult content intended for viewers who are 18 years of age or older.
          By entering, you confirm that you are at least 18 years old.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAbove18}
            className="w-full py-4 bg-[#FF9000] hover:bg-[#FFa020] text-black font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            I am 18 or Older
          </button>
          <button
            onClick={handleBelow18}
            className="w-full py-4 bg-transparent border border-[#3a3a3a] hover:border-red-500/50 hover:bg-red-500/10 text-gray-400 hover:text-red-400 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ShieldX className="w-5 h-5" />
            I am Under 18
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-gray-600 text-xs mt-6 leading-relaxed">
          By clicking "I am 18 or Older", you agree to our terms of service and confirm that you meet the minimum age requirements.
        </p>
      </div>
    </div>
  )
}
