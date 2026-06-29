'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, X, Share, Plus, Check, MoreVertical } from 'lucide-react'
import { createPortal } from 'react-dom'

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

function isIOS(): boolean {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function isAndroid(): boolean {
  if (typeof window === 'undefined') return false
  return /Android/.test(navigator.userAgent)
}

function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

function InstallModal({ onClose, platform }: { onClose: () => void; platform: 'ios' | 'android' }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!mounted) return null

  const steps = platform === 'ios'
    ? [
        { num: 1, text: 'Tap the', icon: <Share className="size-4 text-gray-700" />, after: 'Share button at the bottom' },
        { num: 2, text: 'Scroll and tap', icon: <Plus className="size-3 text-gray-700" />, after: 'Add to Home Screen' },
        { num: 3, text: 'Tap', icon: <Check className="size-3 text-green-500" />, after: 'Add in the top right' },
      ]
    : [
        { num: 1, text: 'Tap the', icon: <MoreVertical className="size-4 text-gray-700" />, after: '3-dot menu in the top right' },
        { num: 2, text: 'Tap', icon: <Plus className="size-3 text-gray-700" />, after: 'Install app / Add to Home Screen' },
        { num: 3, text: 'Tap', icon: <Check className="size-3 text-green-500" />, after: 'Install to confirm' },
      ]

  return createPortal(
    <div className="fixed inset-0 flex items-end justify-center sm:items-center" style={{ zIndex: 99999 }} role="dialog" aria-modal="true" aria-label="Install app">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-3xl bg-white p-6 shadow-2xl" style={{ animation: 'slideUp 0.3s ease-out' }}>
        <button onClick={onClose} className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200" aria-label="Close">
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="grid size-10 place-items-center rounded-xl" style={{ background: 'linear-gradient(135deg, #FFB21D 0%, #FF8A00 100%)' }}>
            <Download className="size-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Install kalaiArangam</h3>
            <p className="text-xs text-gray-500">
              {platform === 'ios' ? 'Add to your Home Screen' : 'Install as an app'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.num} className="flex items-start gap-4">
              <div className="grid size-9 shrink-0 place-items-center rounded-full font-bold text-sm" style={{ background: 'rgba(255,178,29,0.1)', color: '#FFB21D' }}>
                {step.num}
              </div>
              <div className="flex items-center gap-2 pt-1.5 flex-wrap">
                <p className="text-sm font-medium text-gray-700">{step.text}</p>
                <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1">
                  {step.icon}
                  <span className="text-xs font-semibold text-gray-700">{step.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="mt-6 w-full h-12 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #FFB21D 0%, #FF8A00 100%)' }}>
          Got it
        </button>
      </div>
    </div>,
    document.body
  )
}

export function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleInstall = useCallback(async () => {
    if (isIOS()) {
      setPlatform('ios')
      setShowModal(true)
      return
    }

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') setCanInstall(false)
      } catch {
        setPlatform('android')
        setShowModal(true)
      }
      setDeferredPrompt(null)
      return
    }

    setPlatform('android')
    setShowModal(true)
  }, [deferredPrompt])

  useEffect(() => {
    if (!mounted) return
    if (isStandalone()) return

    if (isAndroid()) {
      const handler = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setCanInstall(true)
      }
      window.addEventListener('beforeinstallprompt', handler)

      const installedHandler = () => {
        setCanInstall(false)
        setDeferredPrompt(null)
      }
      window.addEventListener('appinstalled', installedHandler)

      const timer = setTimeout(() => {
        if (!canInstall) setCanInstall(true)
      }, 3000)

      return () => {
        window.removeEventListener('beforeinstallprompt', handler)
        window.removeEventListener('appinstalled', installedHandler)
        clearTimeout(timer)
      }
    }

    if (isIOS() && !isStandalone()) {
      setCanInstall(true)
    }
  }, [mounted])

  if (!mounted || !canInstall || isStandalone()) return null

  return (
    <>
      <button
        onClick={handleInstall}
        className="md:hidden inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white transition-all duration-200 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #FFB21D 0%, #FF8A00 100%)', boxShadow: '0 4px 14px rgba(255,138,0,0.3)' }}
        aria-label="Install app"
      >
        <Download className="size-3.5" />
        Install
      </button>

      {showModal && <InstallModal onClose={() => setShowModal(false)} platform={platform} />}
    </>
  )
}
