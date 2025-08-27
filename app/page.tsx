"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import {
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Zap,
  Shield,
  ShieldCheck,
  Cpu,
  Eye,
  Play,
  Database,
  GitBranch,
  Gamepad2,
  Headphones,
  Globe2,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
  CheckCircle2,
  Cog,
  ArrowUpRight,
  CalendarClock,
  RotateCcw,
  History,
  Check,
  Trophy,
  Lightbulb,
  Rocket,
  Package,
  Compass,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { useIsMobile } from "@/hooks/use-mobile"

const HeroTorus = dynamic(() => import("@/components/HeroTorus"), { ssr: false })

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [highlightedJourney, setHighlightedJourney] = useState<number | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedJourney, setSelectedJourney] = useState<number | null>(null)

  // Mobile journeys scroller state
  const mobileUsecaseScrollRef = useRef<HTMLDivElement | null>(null)
  const [mobileActiveJourney, setMobileActiveJourney] = useState(0)

  const scrollToJourney = (index: number) => {
    const container = mobileUsecaseScrollRef.current
    if (!container) return
    const slides = Array.from(
      container.querySelectorAll('[data-journey-slide]')
    ) as HTMLElement[]
    const target = slides[index]
    if (target) {
      container.scrollTo({ left: target.offsetLeft, behavior: "smooth" })
    }
  }

  const handleMobileScroll = () => {
    const container = mobileUsecaseScrollRef.current
    if (!container) return
    const slides = Array.from(
      container.querySelectorAll('[data-journey-slide]')
    ) as HTMLElement[]
    let closestIndex = 0
    let minDist = Number.POSITIVE_INFINITY
    const left = container.scrollLeft || 0
    slides.forEach((el, idx) => {
      const dist = Math.abs(left - el.offsetLeft)
      if (dist < minDist) {
        minDist = dist
        closestIndex = idx
      }
    })
    setMobileActiveJourney(closestIndex)
  }

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleJourneyNavigation = (industry: string) => {
    const journeyIndex =
      industry === "Gaming"
        ? 0
        : industry === "Support"
        ? 1
        : industry === "Vision"
        ? 3
        : 2

    // Scroll to the target journey card and center it
    const container = mobileUsecaseScrollRef.current || document
    const slides = Array.from(
      (container as Document | HTMLElement).querySelectorAll('[data-journey-slide]')
    ) as HTMLElement[]
    const target = slides[journeyIndex]
    if (target) {
      const targetLeft = target.offsetLeft + target.offsetWidth / 2
      const viewportCenter = (mobileUsecaseScrollRef.current?.clientWidth || window.innerWidth) / 2
      const newScrollLeft = targetLeft - viewportCenter
      if (mobileUsecaseScrollRef.current) {
        mobileUsecaseScrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })
      } else {
        const journeysSection = document.getElementById("journeys")
        journeysSection?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    } else {
      // Fallback to section center
      const journeysSection = document.getElementById("journeys")
      journeysSection?.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    // Highlight the specific journey card briefly
    setHighlightedJourney(journeyIndex)
    setTimeout(() => setHighlightedJourney(null), 3000)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const [currentProfile, setCurrentProfile] = useState(0)
  const [isRotatingPaused, setIsRotatingPaused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const ROTATION_MS = 6000
  const TRACER_MS = Math.max(1000, ROTATION_MS - 1000)

  // Responsive tracer geometry: keep rim visible near bottom on mobile
  const isMobile = useIsMobile()
  const rimCx = isMobile ? 78 : 82
  const rimCy = isMobile ? 52 : 40

  // Path definitions (viewBox 100x60). Mobile path is more vertical toward the bottom.
  const trackToRimD = isMobile
    ? `M8 12 C 24 28, 50 40, ${rimCx} ${rimCy}`
    : "M2 22 C 26 8, 54 6, 82 40"
  const trackFullD = isMobile
    ? `${trackToRimD} C ${rimCx + 6} ${rimCy + 6}, ${rimCx + 12} ${rimCy + 18}, ${rimCx + 16} ${rimCy + 34}`
    : `${trackToRimD} C 92 52, 98 62, 102 74`

  // Measure when tracer reaches rim as a fraction of total path length
  const fullPathRef = useRef<SVGPathElement | null>(null)
  const toRimPathRef = useRef<SVGPathElement | null>(null)
  const [goalFraction, setGoalFraction] = useState(0.75)
  const [goalHold, setGoalHold] = useState(0.749)
  const [goalOn, setGoalOn] = useState(0.751)
  const [goalHalfway, setGoalHalfway] = useState(0.375)

  useEffect(() => {
    try {
      const full = fullPathRef.current?.getTotalLength?.() ?? 0
      const toRim = toRimPathRef.current?.getTotalLength?.() ?? 0
      if (full > 0 && toRim > 0) {
        const frac = Math.max(0.1, Math.min(0.9, toRim / full)) // clamp to avoid edge cases
        const eps = 0.001
        setGoalFraction(frac)
        setGoalOn(frac)
        setGoalHalfway(Math.max(0, frac * 0.5)) // Start appearing at 50% of the way to the goal
      }
    } catch {}
    // measure once on mount
  }, [])

  // Versions scrollytelling emphasis (use window scroll when section is hidden)
  const versionsRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress: versionsProgress } = useScroll()
  const v4Scale = useTransform(versionsProgress, [0, 0.15, 0.3], [1.03, 1.0, 0.97])
  const v4Opacity = useTransform(versionsProgress, [0, 0.15, 0.3], [1, 0.9, 0.75])
  const v5Scale = useTransform(versionsProgress, [0.25, 0.5, 0.65], [1.0, 1.05, 1.0])
  const v5Opacity = useTransform(versionsProgress, [0.25, 0.5, 0.65], [0.9, 1.0, 0.9])
  const v6Scale = useTransform(versionsProgress, [0.6, 0.8, 1], [1.0, 1.05, 1.06])
  const v6Opacity = useTransform(versionsProgress, [0.6, 0.8, 1], [0.85, 1.0, 1.0])
  const v6Glow = useTransform(versionsProgress, [0.8, 1], ["0 0 0 rgba(251,191,36,0)", "0 0 24px rgba(251,191,36,0.35)"])

  const rotatingContent = [
    {
      headline: "Real-time Community Management",
      description: "Agents proactively analyzing sentiment shifts and escalating in real-time.",
      cta: "More on Groups",
      industry: "Communities",
      icon: <Globe2 className="size-4 text-white" />,
      gradient: "from-blue-500 to-indigo-500 to blue-500",
    },
    {
      headline: "Proactive Customer Support",
      description:
        "No more need for user Surveys. Meet customer needs and escalate before frustration builds.",
      cta: "More on Support",
      industry: "Support",
      icon: <Headphones className="size-4 text-white" />,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      headline: "Personalized Gaming Experiences",
      description:
        "Evolving AI concierge agents tuned for every player, adapting for personalized live experiences.",
      cta: "More on Gaming",
      industry: "Gaming",
      icon: <Gamepad2 className="size-4 text-white" />,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      headline: "Computer Vision Ops",
      description: "Automate monitoring to free up human operators for critical events",
      cta: "More on Vision",
      industry: "Vision",
      icon: <Cpu className="size-4 text-white" />,
      gradient: "from-blue-500 to-indigo-500",
    },
  ]

  useEffect(() => {
    if (prefersReducedMotion || isRotatingPaused) return
    const interval = setInterval(() => {
      setCurrentProfile((prev) => (prev + 1) % rotatingContent.length)
    }, ROTATION_MS)
    return () => clearInterval(interval)
  }, [prefersReducedMotion, isRotatingPaused])

  const openJourneyModal = (journeyIndex: number) => {
    setSelectedJourney(journeyIndex)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedJourney(null)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 w-full glass-header transition-all duration-500 ${
          isScrolled ? "shadow-2xl backdrop-blur-2xl py-2" : "py-4"
        }`}
      >
        <div className="container flex h-12 items-center justify-between">
          <motion.div
            className="flex items-center gap-2 font-bold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <img
              src="https://cdn.prod.website-files.com/674765a62fb62fecf4da7696/674765a62fb62fecf4da7836_Logo%20Nav.svg"
              alt="CEF Logo"
              className="h-8 w-auto"
            />
          </motion.div>
          <nav className="hidden md:flex gap-8">{/* Navigation items removed as requested */}</nav>
          <div className="hidden md:flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full magnetic-hover">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button asChild className="rounded-full h-12 px-8 text-base font-semibold glass-depth shadow-xl bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                Book a demo
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 glass-depth border-b"
          >
            <div className="flex flex-col space-y-4 px-4 py-6">
              {/* Mobile navigation items removed as requested */}
            </div>
          </motion.div>
        )}
      </motion.header>

      <main className="flex-1">
        <div className="h-svh">
          <section className="w-full pt-24 md:pt-32 lg:pt-40 pb-0 overflow-hidden relative h-full flex flex-col justify-center">
          <motion.div className="absolute inset-0 -z-10 hero-mesh" style={{ y: heroY, opacity: heroOpacity }} />
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

            {/* --- NEW: Agent Constellation Background --- */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
              {/* Starfield */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:3px_3px] opacity-10 animate-[pulse_8s_linear_infinite]" />

              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.05)_95%)] bg-[size:100%_2px] opacity-5" />

              {/* SVG edge graph with neon gradient */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" style={{ mixBlendMode: "screen" }}>
                {/* removed static branch lines */}

                {/* animated active path */}
                <defs>
                  <linearGradient id="edgeNeon" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#00aaff" stopOpacity="0.35" />
                  </linearGradient>
                  <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.6" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* dotted track path - subtle start, brighter end, continues out of frame */}
                <motion.path
                  key={`track-${currentProfile}`}
                  d={trackFullD}
                  stroke="url(#edgeNeon)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="0.01 7"
                  ref={fullPathRef as any}
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={
                    prefersReducedMotion || isRotatingPaused
                      ? { pathLength: 0, opacity: 1 }
                      : { pathLength: 1, opacity: [1, 1, 0] }
                  }
                  transition={{
                    duration: TRACER_MS / 1000,
                    ease: "linear",
                    opacity: { duration: ROTATION_MS / 1000, ease: "linear", times: [0, goalOn, 1] },
                  }}
                />
                {/* Hidden helper path: start -> rim */} 
                <path d={trackToRimD} stroke="transparent" fill="none" style={{ opacity: 0, pointerEvents: "none" }} ref={toRimPathRef as any} />

                {/* Rim highlight lights up on hit then slowly depulses until rotation */}
                <motion.circle
                  key={`goal-${currentProfile}`}
                  cx={rimCx as any}
                  cy={rimCy as any}
                  r="7"
                  fill="none"
                  stroke="url(#edgeNeon)"
                  strokeWidth="2.6"
                  initial={{ opacity: 0, scale: 0.92, filter: "url(#neonGlow)" }}
                  animate={
                    prefersReducedMotion || isRotatingPaused
                      ? { opacity: 0 }
                      : {
                          opacity: [0, 0, 1, 0],
                          scale: [0.92, 0.95, 1.05, 0.98],
                          strokeWidth: [2.6, 2.6, 3.5, 2.8],
                        }
                  }
                  transition={{
                    duration: ROTATION_MS / 1000,
                    ease: "easeInOut",
                    times: [0, goalHalfway, goalOn, 1],
                  }}
                />
                {/* Shockwave on hit */}
                <motion.circle
                  key={`shockwave-${currentProfile}`}
                  cx={rimCx as any}
                  cy={rimCy as any}
                  r="7"
                  fill="none"
                  stroke="url(#edgeNeon)"
                  initial={{ opacity: 0, scale: 1, strokeWidth: 4 }}
                  animate={
                    prefersReducedMotion || isRotatingPaused
                      ? { opacity: 0 }
                      : { opacity: [0, 0.5, 0], scale: [1, 1.8, 1.8], strokeWidth: [4, 0, 0] }
                  }
              transition={{
                    duration: 800 / 1000,
                    ease: "easeOut",
                    delay: (ROTATION_MS / 1000) * goalOn,
                  }}
                />
              </svg>

              {/* Removed node dots for cleaner minimal aesthetic */}
          </div>
            {/* --- END Agent Constellation --- */}

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left mb-12"
              >
            <motion.div
                  key={`audience-pill-${currentProfile}`}
                  initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-3 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl bg-white/70 dark:bg-white/10"
                >
                  <span
                    className={`w-6 h-6 rounded-full text-white flex items-center justify-center bg-gradient-to-r ${rotatingContent[currentProfile].gradient}`}
                  >
                    {rotatingContent[currentProfile].icon}
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase text-gray-900 dark:text-white">
                    for {rotatingContent[currentProfile].industry}
                  </span>
                </motion.div>
              <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight mb-6 leading-[1.15] pb-1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                  <div className="text-foreground">Multi-agent Solutions</div>
                  <div className="relative overflow-visible flex flex-col md:flex-row md:flex-wrap md:items-center min-h-[3.6rem] md:min-h-[3rem]" aria-live="polite" aria-atomic="true">
                    <span className="text-muted-foreground block w-full md:inline md:w-auto md:mr-2">for</span>
                    <div className="relative w-full md:flex-1 md:min-w-0">
                  <motion.div
                    key={currentProfile}
                        className="text-gradient-dynamic block leading-tight whitespace-normal break-words"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {rotatingContent[currentProfile].headline}
                  </motion.div>
                      {/* underline tracer removed as requested */}
                    </div>
                </div>
              </motion.h1>

                <motion.h3
                key={`desc-${currentProfile}`}
                  className="text-lg text-muted-foreground mb-8 font-semibold leading-relaxed md:text-xl"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {rotatingContent[currentProfile].description}
                </motion.h3>

              <motion.div
                  className="flex flex-col sm:flex-row gap-4 mb-20 md:mb-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Button
                    asChild
                  size="lg"
                    className={`relative rounded-full h-14 px-10 py-0 text-lg font-semibold overflow-hidden transition-all duration-300 magnetic-hover bg-gradient-to-r ${
                      rotatingContent[currentProfile].gradient
                    } hover:shadow-2xl hover:scale-105`}
                  >
                    <Link
                      href="#journeys"
                      onClick={() => handleJourneyNavigation(rotatingContent[currentProfile].industry)}
                      className="flex items-center justify-center text-white h-14"
                    >
                      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                        <motion.div
                          key={`progress-${currentProfile}`}
                          initial={{ width: 0 }}
                          animate={prefersReducedMotion || isRotatingPaused ? { width: 0 } : { width: "100%" }}
                          transition={{ duration: TRACER_MS / 1000, ease: "linear" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        />
                      </div>
                  <motion.span
                    key={`cta-text-${currentProfile}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                      className="leading-none text-center whitespace-nowrap"
                  >
                    {rotatingContent[currentProfile].cta}
                  </motion.span>
                    <ArrowRight className="ml-2 size-5 flex-shrink-0" />
                    </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                    className="rounded-full h-14 px-10 py-0 text-lg font-medium glass-card bg-transparent magnetic-hover"
                >
                    <Link href="https://app.lemcal.com/@fredjin/30-minutes" className="h-14 flex items-center">Book a demo</Link>
                </Button>
              </motion.div>

                {/* Redesigned Feature Showcase List */}
                <motion.div
                  className="space-y-4 mt-16 md:mt-20"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.2,
                        delayChildren: 0.8,
                      },
                    },
                  }}
                >
                  {[{
                      icon: <Cpu className="size-5 text-white" />,
                      gradient: "from-blue-500 to-cyan-500",
                      boldText: "A New Data Compute Platform",
                      regularText: "built from the ground up for multi-agents.",
                    },
                    {
                      icon: <Shield className="size-5 text-white" />,
                      gradient: "from-blue-500 to-cyan-500",
                      boldText: "Secure, owned and customized models",
                      regularText: "that evolve with your business.",
                    },
                    {
                      icon: <Zap className="size-5 text-white" />,
                      gradient: "from-blue-500 to-cyan-500",
                      boldText: "Production ready on 100% sovereign data infrastructure",
                      regularText: "(on‑prem or hybrid).",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-4"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                      }}
                    >
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center flex-shrink-0`}
                      >
                        {item.icon}
                      </div>
                      <p className="text-base text-gray-800 dark:text-gray-200">
                        <span className="font-semibold text-gray-900 dark:text-white">{item.boldText}</span>{" "}
                        <span className="text-muted-foreground">{item.regularText}</span>
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
            </motion.div>
          </div>
        </section>
        </div>

        <section className="w-full py-20 md:py-32 relative overflow-hidden bg-gray-50 dark:bg-gray-900 pt-40">
          <div className="container px-4 md:px-6 relative">
            {/* Section hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight text-gradient-dynamic">
                
              </h2>
            </motion.div>
            <div className="relative max-w-6xl mx-auto px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-14 rounded-3xl shadow-2xl gradient-border">
              {/* Split contrast backgrounds (desktop only) */}
              <div className="hidden md:block absolute inset-0 pointer-events-none rounded-3xl" aria-hidden>
                <div className="absolute inset-y-0 left-0 right-1/2 rounded-l-3xl rounded-r-none bg-slate-900/85"></div>
                <div className="absolute inset-y-0 left-1/2 right-0 rounded-r-3xl rounded-l-none bg-white/90 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/50"></div>
                <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-slate-400/30 dark:via-white/10 to-transparent"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 relative z-10">
              {/* Problem Panel - Dark "Shadow" Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative md:bg-transparent bg-slate-900/90 border-none md:rounded-none rounded-2xl md:p-0 p-6 md:pl-8 space-y-8 md:border-l-4 border-l-0 border-red-300/60 dark:md:border-red-500/40 text-white shadow-xl md:shadow-none"
              >
                <Badge
                  className="rounded-full px-4 py-2 text-sm font-bold bg-red-500/10 text-red-400 border-red-500/20"
                  variant="outline"
                >
                  The Gap
                </Badge>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                  AI Adoption Challenges
                </h2>

                <div className="space-y-5">
                  {[
                    {
                      text: "Black-box AI → No control, accountability, or transparency. Lacks auditability and oversight.",
                      icon: "🔒",
                    },
                    {
                      text: "Data Privacy & Security → Exposing sensitive data to third-party models you don’t own creates major risks.",
                      icon: "🔐",
                    },
                    {
                      text: "Risky Integrations → Complex, fragile, and costly to stitch together siloed, outdated systems into a functional AI data flow.",
                      icon: "⚠️",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-5"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-400 text-sm">{item.icon}</span>
                      </div>
                      <p className="text-slate-200 font-medium [text-wrap:balance] leading-7 md:leading-8 text-[clamp(12px,2.8vw,16px)] md:text-[clamp(14px,1.05vw,16px)]">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Solution Panel - Bright "Clarity" Side */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
                className="relative md:bg-transparent bg-white border-none md:rounded-none rounded-2xl md:p-0 p-6 md:pl-8 space-y-8 md:border-l-4 border-l-0 border-green-300/60 dark:md:border-green-500/40 shadow-xl md:shadow-none"
              >
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-full h-10 px-6 text-sm font-medium glass-card bg-transparent magnetic-hover"
                >
                  <Link href="#contact">CEF Solution</Link>
                </Button>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
                  Own the Entire Stack
                </h2>

                <div className="space-y-5">
                  {[
                    {
                      text: "Sovereign by Design → Your infrastructure, your controls, your models.",
                      icon: "🛡️",
                    },
                    {
                      text: "Agents You Own → Fully auditable, personalized agents that evolve with your data.",
                      icon: "🔄",
                    },
                    {
                      text: "Dedicated Data Infra → Optimized for speed and cost, on-prem, edge, or hybrid.",
                      icon: "🗄️",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-5"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-sm">{item.icon}</span>
                      </div>
                      <p className="text-gray-700 font-medium [text-wrap:balance] leading-7 md:leading-8 text-[clamp(12px,2.8vw,16px)] md:text-[clamp(14px,1.05vw,16px)]">{item.text}</p>
                    </motion.div>
                  ))}
                </div>


            </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Versions Section - Ship Better Versions */}
        {false && (
        <section className="w-full py-20 md:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative">
                <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 md:mb-20 ml-0 w-full max-w-4xl"
            >
              <div className="mb-4">
                <div className="inline-flex items-center gap-2" aria-label="CEF logo">
                  <img
                    src="https://cdn.prod.website-files.com/674765a62fb62fecf4da7696/674765a62fb62fecf4da7836_Logo%20Nav.svg"
                    alt="CEF logo"
                    className="h-6 w-auto"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
              <h2 className="text-left text-4xl md:text-6xl font-display-bold tracking-tight leading-[1.1] text-slate-900 dark:text-white [text-wrap:balance]">
                Ship AI Like Software.
                <br />
                <span className="text-slate-700 dark:text-slate-300 text-3xl md:text-4xl block mt-2">With the same safety, speed, and control.</span>
              </h2>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground font-medium text-left">
                Test, version, and ship multi‑agent AI on your dedicated stack, with replays, KPI gates, and instant rollback. Open‑source models only; no data leaves your infra. <span className="font-semibold">
                </span>
              </p>
              <div className="mt-6">
                <Button asChild size="lg" className="rounded-full h-12 px-8 text-base font-semibold glass-depth shadow-xl bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                    Book a demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
                </motion.div>

            {/* Neat SVG - floating cards (no background cover) */}
            {false && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative max-w-5xl mx-auto overflow-visible"
            >
              <svg viewBox="0 0 1200 420" className="w-full h-auto block">
                <defs>
                  <linearGradient id="gBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                  <linearGradient id="cardLight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
                    <stop offset="100%" stopColor="#F6FAFF" stopOpacity="0.94" />
                  </linearGradient>
                  <radialGradient id="halo" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.25" />
                    <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                  </radialGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="14" stdDeviation="14" floodOpacity="0.18" />
                  </filter>
                  <linearGradient id="railGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#CBD5E1" />
                    <stop offset="50%" stopColor="#93C5FD" />
                    <stop offset="100%" stopColor="#A7F3D0" />
                  </linearGradient>
                  <style>{`
                    .v6-details{opacity:0;transition:opacity .25s ease}
                    .v6:hover + .v6-details{opacity:1}
                    @keyframes promoteMove{0%{transform:translateX(0)}50%{transform:translateX(40px)}100%{transform:translateX(0)}}
                    .v6:hover + .v6-details .promote{animation:promoteMove 1.2s linear infinite}
                  `}</style>
                </defs>

                {/* Halo behind center */}
                <g transform="translate(600,210)">
                  <ellipse cx="0" cy="0" rx="240" ry="120" fill="url(#halo)" />
                </g>

                {/* Left card (prior) */}
                <g transform="translate(130,90)" filter="url(#cardShadow)" opacity="0.96">
                  <rect rx="26" ry="26" width="320" height="250" fill="url(#cardLight)" stroke="#E2E8F0" />
                  <text x="24" y="44" fill="#0F172A" fontSize="26" fontFamily="Inter, system-ui" fontWeight="800">Version 4 (Previous)</text>
                  <text x="24" y="92" fill="#0F172A" fontSize="17" fontFamily="Inter" opacity="0.9">
                    <tspan x="24" dy="0">Streams: 3 connected,</tspan>
                    <tspan x="24" dy="28">Policy Pass: ✓,</tspan>
                    <tspan x="24" dy="28">Impact: −18% handle time,</tspan>
                    <tspan x="24" dy="28">Time‑to‑Promote: 4h 23m,</tspan>
                    <tspan x="24" dy="28">Replay: Available</tspan>
                  </text>
                </g>

                {/* Middle card (current, highlighted) */}
                <g transform="translate(430,60)" filter="url(#cardShadow)">
                  <rect rx="32" ry="32" width="340" height="290" fill="url(#cardLight)" stroke="url(#gBlue)" strokeWidth="2" filter="url(#glow)" />
                  <text x="28" y="54" fill="#0F172A" fontSize="28" fontFamily="Inter, system-ui" fontWeight="900">Version 5 (Current)</text>
                  <text x="28" y="102" fill="#0F172A" fontSize="17" fontFamily="Inter" opacity="0.92">
                    <tspan x="28" dy="0">Streams: 5 connected,</tspan>
                    <tspan x="28" dy="28">Policy Pass: ✓,</tspan>
                    <tspan x="28" dy="28">Impact: +8.2% retention,</tspan>
                    <tspan x="28" dy="28">Time‑to‑Promote: 3h 12m,</tspan>
                    <tspan x="28" dy="28">Replay: Available</tspan>
                  </text>
                </g>

                {/* Right card (candidate) */}
                <g className="v6" transform="translate(740,90)" filter="url(#cardShadow)" opacity="0.98">
                  <rect rx="26" ry="26" width="320" height="250" fill="url(#cardLight)" stroke="#E2E8F0" />
                  <text x="24" y="44" fill="#0F172A" fontSize="26" fontFamily="Inter, system-ui" fontWeight="800">Version 6 (Candidate)</text>
                  <text x="24" y="92" fill="#0F172A" fontSize="17" fontFamily="Inter" opacity="0.9">
                    <tspan x="24" dy="0">Streams: 5 connected,</tspan>
                    <tspan x="24" dy="28">Policy Check: Running…,</tspan>
                    <tspan x="24" dy="28">Impact: +6.1% CTR (p&lt;0.05),</tspan>
                    <tspan x="24" dy="28">Time‑to‑Promote: 2h 47m,</tspan>
                    <tspan x="24" dy="28">Status: Promoting</tspan>
                  </text>
                </g>
                {/* V6 hover details */}
                <g className="v6-details" transform="translate(740,90)">
                  <rect x="340" y="20" rx="16" ry="16" width="260" height="140" fill="#FFFFFF" opacity="0.96" stroke="#BFDBFE" />
                  <text x="360" y="56" fill="#0F172A" fontSize="16" fontFamily="Inter" fontWeight="700">Policy</text>
                  <text x="360" y="82" fill="#0F172A" fontSize="14" fontFamily="Inter">PII compliance ✓</text>
                  <text x="360" y="104" fill="#0F172A" fontSize="14" fontFamily="Inter">Cost cap ✓</text>
                  <text x="360" y="126" fill="#0F172A" fontSize="14" fontFamily="Inter">Eval metrics ✓</text>
                  {/* promote animation */}
                  <line x1="360" y1="148" x2="580" y2="148" stroke="url(#gBlue)" strokeWidth="3" strokeLinecap="round" />
                  <circle className="promote" cx="360" cy="148" r="6" fill="#3B82F6" />
                </g>

                {/* Rail */}
                <line x1="120" y1="370" x2="1080" y2="370" stroke="url(#railGrad)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="600" cy="370" r="16" fill="#FFFFFF" stroke="url(#gBlue)" strokeWidth="2" />
                <path d="M600 362 a8 8 0 1 0 0 16" fill="none" stroke="#3B82F6" strokeWidth="2" />
                <path d="M606 368 l4 -4 v8 z" fill="#3B82F6" />
              </svg>
              </motion.div>
            )}

            {/* Polished HTML cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full"
              ref={versionsRef}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <motion.div style={{ scale: v4Scale, opacity: v4Opacity }}
                  initial={{ scale: 1, opacity: 0.98 }}
                  whileInView={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  viewport={{ once: false, amount: 0.4 }}
                  className="hidden md:block group rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/70 dark:border-slate-700/60 shadow-xl p-6 transition-transform"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display-bold text-lg text-slate-900 dark:text-white">Version 5 (Previous)</h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">Legacy</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2"><Cog className="size-4 text-slate-600" /><span><span className="font-semibold">What We Built:</span> AI agent suite with <strong>2</strong> real‑time data streams (community feedback + customer activity).</span></div>
                    <div className="flex items-center gap-2"><Shield className="size-4 text-emerald-600" /><span><span className="font-semibold">Infrastructure:</span> Secured on dedicated infrastructure with full audit trail before any changes go live.</span></div>
                    <div className="flex items-center gap-2"><ArrowUpRight className="size-4 text-brand-accent" /><span className="font-semibold"><span className="font-semibold">Proven Results:</span> <span className="bg-brand-accent/10 text-brand-accent font-semibold tabular-nums px-1.5 rounded">+8.2%</span> lift in customer engagement across all users.</span></div>
                    <div className="flex items-center gap-2"><Check className="size-4 text-emerald-600" /><span><span className="font-semibold">Status:</span> Successfully scaled into production in <span className="font-semibold">Q2 2025</span>.</span></div>
                    <p className="text-xs text-muted-foreground mt-3 italic">Proof that AI streaming could safely scale into production.</p>
                  </div>
                </motion.div>

                <motion.div style={{ scale: v5Scale, opacity: v5Opacity }}
                  initial={{ scale: 1, opacity: 0.98 }}
                  whileInView={{ scale: 1.06, opacity: 1 }}
                  viewport={{ once: false, amount: 0.4 }}
                  whileHover={{ scale: 1.07 }}
                  className="group relative rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-amber-300/60 dark:border-amber-400/40 shadow-2xl p-8 md:p-10 transition-transform gradient-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display-bold text-lg text-slate-900 dark:text-white">Version 6 (Current)</h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 ring-1 ring-brand-accent/40">Live in Production</span>
                  </div>
                  <div className="space-y-3 text-sm text-slate-800 dark:text-slate-200">
                    <div className="flex items-start gap-2"><Cog className="size-4 mt-1 text-slate-700" /><span><span className="font-semibold">What's Working:</span> Optimized multi‑agent workflows on dedicated clusters—powered by live signals.</span></div>
                    <div className="flex items-start gap-2"><Shield className="size-4 mt-1 text-cyan-600" /><span><span className="font-semibold">Governance:</span> Performance‑gated promotions with instant rollback. Replay and audit for every decision.</span></div>
                    <div className="group flex items-start gap-2 pl-3 border-l-2 border-brand-accent/40">
                      <ArrowUpRight className="size-4 mt-0.5 text-brand-accent transition-transform group-hover:translate-x-0.5" />
                      <span className="font-semibold"><span className="font-semibold">Proven Impact:</span> <span className="bg-brand-accent/10 text-brand-accent font-semibold tabular-nums px-1.5 rounded">+6.1%</span> conversion uplift (from onboarding funnel test).</span>
                    </div>
                    <div className="group flex items-start gap-2 pl-3 border-l-2 border-brand-accent/40">
                      <Trophy className="size-4 mt-0.5 text-brand-accent" />
                      <span className="font-semibold">Confirmed business impact: <span className="bg-brand-accent/10 text-brand-accent font-semibold tabular-nums px-1.5 rounded">+$1.2M</span> in ARR directly attributed.</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-2 rounded-md px-2 py-1 bg-brand-accent/10 text-slate-800 dark:text-slate-200 border border-brand-accent/20 hover:bg-brand-accent/15 transition">
                              <RotateCcw className="size-4" />
                              Replay
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Re-run any decision path with identical inputs/outputs for verification.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-2 rounded-md px-2 py-1 bg-brand-accent/10 text-slate-800 dark:text-slate-200 border border-brand-accent/20 hover:bg-brand-accent/15 transition">
                              <History className="size-4" />
                              Audit
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Immutable, step‑level logs provide a complete chain of custody.</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Results validated before rollout, not after.</p>
                  </div>
                </motion.div>

                <motion.div style={{ scale: v6Scale, opacity: v6Opacity }}
                  initial={{ scale: 1, opacity: 0.98 }}
                  whileInView={{ scale: 1.03, opacity: 1 }}
                  viewport={{ once: false, amount: 0.4 }}
                  whileHover={{ scale: 1.04 }}
                  className="group relative rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-md border border-slate-200/70 dark:border-slate-700/60 shadow-xl p-6 transition-transform"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display-bold text-lg text-slate-900 dark:text-white">Version 7 (Candidate)</h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">In A/B Test</span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2"><Lightbulb className="size-4 text-yellow-500" /><span><span className="font-semibold">What's New:</span> Real‑time user sentiment analysis + computer vision (CV) triggers for precision response routing.</span></div>
                    <div className="flex items-center gap-2"><ArrowUpRight className="size-4 text-brand-accent" /><span className="font-semibold"><span className="font-semibold">Efficiency:</span> ~<span className="bg-brand-accent/10 text-brand-accent font-semibold tabular-nums px-1.5 rounded">15%</span> lower infrastructure costs from runtime tuning and GPU pooling.</span></div>
                    <div className="flex items-center gap-2"><ArrowUpRight className="size-4 text-brand-accent" /><span className="font-semibold"><span className="font-semibold">Early Results:</span> ~<span className="bg-brand-accent/10 text-brand-accent font-semibold tabular-nums px-1.5 rounded">20%</span> fewer customers abandon in high‑risk situations (thanks to precise routing).</span></div>
                    <div className="flex items-center gap-2"><Rocket className="size-4 text-slate-700" /><span><span className="font-semibold">Deployment:</span> Auto‑rolling deploy with guardrails; <span className="bg-brand-accent/10 text-brand-accent font-semibold tabular-nums px-1.5 rounded">5%</span> traffic coverage to start.</span></div>
                    <p className="text-xs text-muted-foreground mt-2 italic">Lower infra costs and fewer customer drop‑offs, with risk‑limited rollout.</p>
                  </div>
                </motion.div>
              </div>

              {/* bottom rail removed */}
            </motion.div>

            {/* Proof stripe removed per request */}

            {/* Unboxed features removed; merged into How It Works above */}
            
            {/* Starter Packs Section */}
            {false && (
            <section className="w-full py-20 md:py-28 bg-white dark:bg-gray-950">
               <div className="container px-4 md:px-6">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.6 }}
                   className="text-center mb-16"
                 >
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50 mb-6">
                     <span className="text-sm font-bold">Pick a Journey</span>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-display-bold tracking-tight mb-4 text-slate-900 dark:text-white">
                     <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Outcome-first starter packs</span>
                   </h2>
                   <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                     Outcome-first starter packs on the same core: Onboard → Reason → Act → Govern.
                   </p>
                 </motion.div>
                
                 {/* 2x2 Grid of Equal Cards */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.6, delay: 0.1 }}
                   className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr"
                 >
                   {/* Gaming */}
                   <div className="h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                     <div className="relative h-52 bg-gray-100">
                       <img src="/gaming-dashboard-analytics.png" alt="Gaming dashboard" className="w-full h-full object-cover" />
                       <div className="absolute bottom-4 left-4 bg-black/80 text-white rounded-xl px-4 py-2 flex items-center gap-2">
                         <Gamepad2 className="w-4 h-4" />
                         <span className="text-sm font-semibold">Gaming: Player Retention & Trust/Safety</span>
                       </div>
                     </div>
                     <div className="p-6 flex-1 flex flex-col">
                       <div className="border-l-4 border-slate-300 pl-4 mb-6">
                         <h3 className="text-2xl font-display-bold text-slate-900 mb-2">Personalized Game Experiences</h3>
                         <p className="text-slate-600 text-base">A dedicated AI concierge for every player, turning real‑time behavior into adaptive gameplay.</p>
                       </div>
 
                       <div className="border-l-4 border-blue-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">Triggers:</h4>
                         <p className="text-slate-600 text-base">Rage‑quit patterns, loss streaks, toxic chat spikes, cohort churn risk, social/Discord sentiment</p>
                       </div>
 
                       <div className="border-l-4 border-green-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">What's inside:</h4>
                         <ul className="space-y-2 text-slate-700">
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Frustration Detector</li>
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>T&S Sentinel</li>
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Matchmaking Concierge</li>
                         </ul>
                       </div>
 
                       <div className="border-l-4 border-purple-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">KPIs:</h4>
                         <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Churn delta</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Session recovery</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Abuse reports</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">CSAT after session</span>
                         </div>
                       </div>
 
                       <div className="mt-auto">
                         <a className="block w-full text-center rounded-xl border border-slate-300 py-3 text-slate-800 hover:bg-slate-50" href="#">View starter pack</a>
                       </div>
                     </div>
                   </div>
 
                   {/* Support */}
                   <div className="h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                     <div className="relative h-52 bg-gray-100">
                       <img src="/customer-support-dashboard.png" alt="Support dashboard" className="w-full h-full object-cover" />
                       <div className="absolute bottom-4 left-4 bg-black/80 text-white rounded-xl px-4 py-2 flex items-center gap-2">
                         <Headphones className="w-4 h-4" />
                         <span className="text-sm font-semibold">Support: Conversation Intelligence</span>
                       </div>
                     </div>
                     <div className="p-6 flex-1 flex flex-col">
                       <div className="border-l-4 border-slate-300 pl-4 mb-6">
                         <h3 className="text-2xl font-display-bold text-slate-900 mb-2">Proactive Customer Support</h3>
                         <p className="text-slate-600 text-base">Understand user needs so well, you'll never send a satisfaction survey again.</p>
                       </div>
 
                       <div className="border-l-4 border-blue-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">Triggers:</h4>
                         <p className="text-slate-600 text-base">Inbound call/chat, long handle time, repeat contacts, VIP risk, compliance terms mentioned</p>
                       </div>
 
                       <div className="border-l-4 border-green-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">What's inside:</h4>
                         <ul className="space-y-2 text-slate-700">
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Live Transcriber</li>
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Intent & Compliance Classifier</li>
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Coach/QA Summarizer</li>
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Next‑Best‑Action Router</li>
                         </ul>
                       </div>
 
                       <div className="border-l-4 border-purple-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">KPIs:</h4>
                         <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">AHT</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">FCR</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">QA pass rate</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Deflected escalations</span>
                         </div>
                       </div>
 
                       <div className="mt-auto">
                         <a className="block w-full text-center rounded-xl border border-slate-300 py-3 text-slate-800 hover:bg-slate-50" href="#">View starter pack</a>
                       </div>
                     </div>
                   </div>
 
                   {/* Communities */}
                   <div className="h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                     <div className="relative h-52 bg-gray-100">
                       <img src="/web3-community-dashboard.png" alt="Community dashboard" className="w-full h-full object-cover" />
                       <div className="absolute bottom-4 left-4 bg-black/80 text-white rounded-xl px-4 py-2 flex items-center gap-2">
                         <Globe2 className="w-4 h-4" />
                         <span className="text-sm font-semibold">Communities & Web3: Health & Growth</span>
                       </div>
                     </div>
                     <div className="p-6 flex-1 flex flex-col">
                       <div className="border-l-4 border-slate-300 pl-4 mb-6">
                         <h3 className="text-2xl font-display-bold text-slate-900 mb-2">Real‑time Community Sentiment</h3>
                         <p className="text-slate-600 text-base">Instantly detect sentiment shifts and prevent toxic behavior before it spreads.</p>
                       </div>
 
                       <div className="border-l-4 border-blue-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">Triggers:</h4>
                         <p className="text-slate-600 text-base">Topic surge, purchase activity, campaign execution, concern clusters, etc.</p>
                       </div>
 
                       <div className="border-l-4 border-green-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">What's inside:</h4>
                         <ul className="space-y-2 text-slate-700">
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Topic Surge Monitor</li>
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Cohort Growth Planner</li>
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Risk Router</li>
                         </ul>
                       </div>
 
                       <div className="border-l-4 border-purple-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">KPIs:</h4>
                         <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Engagement</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Cohort retention</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Campaign conversion</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Mod workload</span>
                         </div>
                       </div>
 
                       <div className="mt-auto">
                         <a className="block w-full text-center rounded-xl border border-slate-300 py-3 text-slate-800 hover:bg-slate-50" href="#">View starter pack</a>
                       </div>
                     </div>
                   </div>
 
                   {/* Computer Vision */}
                   <div className="h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                     <div className="relative h-52 bg-gray-100">
                       <img src="/ai-customer-intelligence-dashboard.png" alt="Computer Vision" className="w-full h-full object-cover" />
                       <div className="absolute bottom-4 left-4 bg-black/80 text-white rounded-xl px-4 py-2 flex items-center gap-2">
                         <Cpu className="w-4 h-4" />
                         <span className="text-sm font-semibold">Computer Vision: Real‑time Anomaly Detection</span>
                       </div>
                     </div>
                     <div className="p-6 flex-1 flex flex-col">
                       <div className="border-l-4 border-slate-300 pl-4 mb-6">
                         <h3 className="text-2xl font-display-bold text-slate-900 mb-2">Computer Vision Ops: From Anomalies to Robotics</h3>
                         <p className="text-slate-600 text-base">Ingest video, detect anomalies, and trigger real-time fleet or robotics responses.</p>
                       </div>
 
                       <div className="border-l-4 border-blue-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">What's inside:</h4>
                         <ul className="space-y-2 text-slate-700">
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Secure on‑prem processing</li>
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Fleet dashboards & mission control</li>
                           <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>CV agents for industrial safety monitoring</li>
                         </ul>
                       </div>
 
                       <div className="border-l-4 border-green-500 pl-4 mb-6">
                         <h4 className="font-semibold text-slate-900 mb-2">KPIs:</h4>
                         <div className="flex flex-wrap gap-2">
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Detection accuracy</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Response time</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">False positive rate</span>
                           <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Fleet uptime / mission safety</span>
                         </div>
                       </div>
 
                       <div className="mt-auto">
                         <a className="block w-full text-center rounded-xl border border-slate-300 py-3 text-slate-800 hover:bg-slate-50" href="#">View starter pack</a>
                       </div>
                     </div>
                   </div>
            </motion.div>
               </div>
            </section>
            )}

          </div>
        </section>
        )}

        {/* Platform Section - Integrated Process */}
        {false && (
        <section
          id="platform"
          className="w-full py-20 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-6 text-center mb-20"
            >
              <Badge className="rounded-full px-8 py-3 text-sm font-bold glass-depth shadow-xl border-blue-400/30 bg-blue-500/10 magnetic-hover">
                <span className="text-blue-600 dark:text-blue-400 font-display">The CEF Solution</span>
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight">
                <span className="text-gradient-dynamic">Onboard → Reason → Act</span>
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl font-medium leading-relaxed">
                Private, versioned core loop that ships outcomes fast.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-7xl mx-auto mb-20"
            >
              {/* Main Process Flow with Enhanced Visual Connections */}
              <div className="relative">
                {/* Connecting Flow Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-cyan-500 rounded-full opacity-20 hidden lg:block transform -translate-y-1/2 z-0"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
                  {[
                    {
                      step: "1",
                      title: "Onboard",
                      feature: "Stream Ingest & Context",
                      description:
                        "Plug SDKs/connectors into your data (events, chats, gameplay). Normalize and tag what matters (who, when, why).",
                      bullets: [
                        "Plug SDKs/connectors into your data (events, chats, gameplay).",
                        "Normalize and tag what matters (who, when, why).",
                      ],
                      icon: <Database className="size-10" />,
                      color: "from-sky-400 to-sky-600",
                      bgColor: "bg-sky-50",
                      borderColor: "border-sky-200",
                      iconBg: "bg-sky-100",
                    },
                    {
                      step: "2",
                      title: "Reason",
                      feature: "Agent Orchestration",
                      description:
                        "Agents read the latest accepted tree version and produce what execs care about: topics users care about and who looks like whom. Safe by default: policies, canary, rollback.",
                      bullets: [
                        "Agents read the latest accepted tree version.",
                        "Produce the two things execs care about: topics users care about and who looks like whom.",
                        "Safe by default: policies, canary, rollback.",
                      ],
                      icon: <GitBranch className="size-10" />,
                      color: "from-blue-400 to-blue-600",
                      bgColor: "bg-blue-50",
                      borderColor: "border-blue-200",
                      iconBg: "bg-blue-100",
                    },
                    {
                      step: "3",
                      title: "Act",
                      feature: "Execution & Response",
                      description:
                        "Push routes, updates, tickets, or incentives into your tools. Every action ties back to a tree version so results are explainable.",
                      bullets: [
                        "Push routes, updates, tickets, or incentives into your tools.",
                        "Every action ties back to a tree version so results are explainable.",
                      ],
                      icon: <Zap className="size-10" />,
                      color: "from-cyan-400 to-cyan-600",
                      bgColor: "bg-cyan-50",
                      borderColor: "border-cyan-200",
                      iconBg: "bg-cyan-100",
                    },
                  ].map((node, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.15 }}
                      className="relative group"
                    >
                      {/* Step Number Badge */}
                      <div
                        className={`absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br ${node.color} text-white font-bold flex items-center justify-center text-lg shadow-lg z-20 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {node.step}
                      </div>

                      {/* Main Card */}
                      <div
                        className={`${node.bgColor} ${node.borderColor} border-2 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden`}
                      >
                        {/* Gradient Overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${node.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
                        ></div>

                        {/* Content */}
                        <div className="relative z-10">
                          {/* Icon */}
                          <div
                            className={`w-20 h-20 ${node.iconBg} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                          >
                            <div className="text-gray-700">{node.icon}</div>
                          </div>

                          {/* Title & Feature */}
                          <div className="text-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{node.title}</h3>
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                              {node.feature}
                            </p>
                          </div>

                          {/* Description / Bullets */}
                          {node.bullets ? (
                            <ul className="text-sm text-gray-600 leading-relaxed text-left list-disc pl-5 space-y-2">
                              {node.bullets.map((b, j) => (
                                <li key={j}>{b}</li>
                              ))}
                            </ul>
                          ) : (
                          <p className="text-sm text-gray-600 leading-relaxed text-center">{node.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Flow Arrow */}
                      {i < 2 && (
                        <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-30">
                          <div className="w-12 h-12 rounded-full bg-white shadow-lg border-2 border-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <ArrowRight className="size-5 text-gray-500" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Governance Layer - Enhanced Integration */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-16 relative"
              >
                <div className="absolute -top-12 left-0 right-0 hidden lg:block">
                  <div className="max-w-7xl mx-auto relative">
                    <div className="flex justify-between items-center px-8">
                      {[1, 2, 3].map((num, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-px h-8 border-l-2 border-dashed border-orange-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Governance Card - Full Width */}
                <div className="w-full">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10 max-w-4xl mx-auto">
                      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                        {/* Icon */}
                        <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          <Eye className="size-10 text-gray-700" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center lg:text-left">
                          {/* Title & Feature */}
                          <div className="mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">Govern</h3>
                            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide"></p>
                            <Badge className="rounded-full px-4 py-1 text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 mt-2 inline-block">
                              Overarching Layer
                            </Badge>
                          </div>

                          {/* Description */}
                          <ul className="text-sm text-gray-600 leading-relaxed mb-6 list-disc pl-5 space-y-2">
                            <li>Versioned trees, execution logs, replay, RBAC, and per-run cost.</li>
                            <li>One source of truth from signal → decision → action.</li>
                          </ul>

                          <div className="flex justify-center lg:justify-start"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-16"
            >
              <Button asChild size="lg" className="rounded-full h-12 px-8 text-base font-semibold glass-depth shadow-xl bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                  Book a demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
        )}

        <section id="journeys" className="w-full py-20 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
            >
              <Badge className="rounded-full px-6 py-2 text-sm font-bold bg-blue-50 text-blue-700 border-blue-200">
                Pick a Journey
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Outcome-first <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Starter Packs</span>
              </h2>
              
            </motion.div>

            {/* Mobile emoji timeline (shows only on small screens) */}
            <div className="md:hidden mb-6">
              <div className="flex items-center justify-center gap-4">
                {[
                  { icon: "🎥", label: "Vision" },
                  { icon: "🎮", label: "Gaming" },
                  { icon: "🎧", label: "Support" },
                  { icon: "🌐", label: "Community" },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToJourney(i) }}
                    className={`relative flex flex-col items-center text-xs font-medium transition-transform ${mobileActiveJourney === i ? "scale-110" : "opacity-70"}`}
                    aria-label={`Go to ${item.label}`}
                  >
                    <span className={`text-2xl ${mobileActiveJourney === i ? "drop-shadow-[0_2px_6px_rgba(59,130,246,0.6)]" : ""}`}>{item.icon}</span>
                    <span className="mt-1">{item.label}</span>
                    <span
                      className={`absolute -bottom-2 h-1 rounded-full transition-all duration-300 ${
                        mobileActiveJourney === i ? "w-6 bg-blue-500" : "w-2 bg-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Bento-like starter packs grid */}
            <div
              ref={mobileUsecaseScrollRef}
              onScroll={handleMobileScroll}
              className="flex md:grid gap-4 md:gap-8 md:grid-cols-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-2 [-ms-overflow-style:none] [scrollbar-width:none] mb-16"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {[
                {
                  title: "Computer Vision: Real‑time Anomaly Detection ",
                  heroHeadline: "Computer Vision Ops: From Anomalies to Robotics",
                  heroDescription:
                    "Ingest video, detect anomalies, and trigger real-time fleet or robotics responses.",
                  image: "/placeholder.jpg",
                  triggers:
                    "Frame ingest, illegal parking, rail‑yard events, object/zone breaches, battery/signal degradations",
                  items: [
                    "Streaming ingest with edge processing",
                    "CV Detection Agent (96.8% manifest accuracy)",
                    "Mission dashboards with real‑time alerts",
                    "On‑prem nodes for sovereign, leak‑free compute",
                  ],
                  kpis: [
                    { name: "Detection accuracy", color: "bg-green-100 text-green-700" },
                    { name: "Time‑to‑alert", color: "bg-blue-100 text-blue-700" },
                    { name: "False positive rate", color: "bg-red-100 text-red-700" },
                    { name: "Infra uptime", color: "bg-purple-100 text-purple-700" },
                  ],
                  icon: "🎥",
                  index: 3,
                  span: "md:col-span-3",
                  overview:
                    "Edge‑first CV agents that perceive, decide, act on live video—on your dedicated stack.",
                  applicability: [
                    "Drone/CCTV monitoring",
                    "Industrial/robotics ops",
                    "Facilities & logistics",
                    "Smart city feeds",
                  ],
                },
                {
                  title: "Gaming: Player Retention & Trust/Safety ",
                  heroHeadline: "A Concierge Agent for Every Player",
                  heroDescription:
                    "Adaptive gameplay from live signals, not after‑the‑fact reports.",
                  image:
                    "https://cdn.ddcdragon.com/1229/baear4ihc4nevss365lzjv4vqvsknwjapkvghhsx3meto4i6rz7b5aktqny/gaming.png?source=developer-console",
                  triggers:
                    "Rage‑quit streaks, loss spirals, toxic chat spikes, churn‑risk cohorts, Discord/social sentiment",
                  items: [
                    "Frustration Detector",
                    "T&S Sentinel",
                    "Matchmaking Concierge",
                    "Dedicated, sovereign runtime",
                  ],
                  kpis: [
                    { name: "Churn delta", color: "bg-purple-100 text-purple-700" },
                    { name: "Session recovery rate", color: "bg-blue-100 text-blue-700" },
                    { name: "Abuse reports", color: "bg-red-100 text-red-700" },
                    { name: "Post‑session CSAT", color: "bg-green-100 text-green-700" },
                  ],
                  icon: "🎮",
                  index: 0,
                  overview:
                    "A concierge agent for every player—keeps them engaged and prevents churn with in‑session adaptation.",
                  applicability: [
                    "Multiplayer platforms",
                    "Competitive gaming",
                    "Social gaming communities",
                    "Free‑to‑play mobile",
                  ],
                  span: "md:col-span-3",
                },
                {
                  title: "Support: Conversation Intelligence",
                  heroHeadline: "Proactive Support",
                  heroDescription: "Know intent in real time so you never send a survey again.",
                  image:
                    "https://cdn.ddcdragon.com/1229/baear4ihc4nevss365lzjv4vqvsknwjapkvghhsx3meto4i6rz7b5aktqny/communitcation.png?source=developer-console",
                  triggers:
                    "New call/chat, long handle time, repeat contacts, VIP risk, compliance terms detected",
                  items: [
                    "Live Transcriber",
                    "Intent & Compliance Classifier",
                    "Coach/QA Summarizer",
                    "Next‑Best‑Action Router—running on your sovereign stack",
                  ],
                  kpis: [
                    { name: "AHT", color: "bg-purple-100 text-purple-700" },
                    { name: "FCR", color: "bg-blue-100 text-blue-700" },
                    { name: "QA pass rate", color: "bg-green-100 text-green-700" },
                    { name: "Deflected escalations", color: "bg-orange-100 text-orange-700" },
                  ],
                  icon: "🎧",
                  index: 1,
                  overview:
                    "Proactive support agents that reduce handle time and improve outcomes—without surveys.",
                  applicability: [
                    "Customer service centers",
                    "SaaS support teams",
                    "E‑commerce help desks",
                    "Financial services",
                  ],
                  span: "md:col-span-3",
                },
                {
                  title: "Communities & Web3: Health & Growth ",
                  heroHeadline: "Real‑time Sentiment and Action",
                  heroDescription: "Stop toxicity before it spreads; grow cohorts with precision.",
                  image:
                    "https://cdn.ddcdragon.com/1229/baear4ifceuftmm225vm6xz4em7pmfaz6gctvyc5ifnxs4aizemyxfvdmma/community.png?source=developer-console",
                  triggers:
                    "Topic surges, whale wallet movements, campaign execution, governance proposals, concern clusters",
                  items: [
                    "Topic Surge Monitor",
                    "Cohort Growth Planner",
                    "Risk Router",
                    "Dedicated data cluster with open‑source models only",
                  ],
                  kpis: [
                    { name: "Engagement lift", color: "bg-purple-100 text-purple-700" },
                    { name: "Cohort retention", color: "bg-blue-100 text-blue-700" },
                    { name: "Campaign conversion", color: "bg-green-100 text-green-700" },
                    { name: "Moderator workload", color: "bg-orange-100 text-orange-700" },
                  ],
                  icon: "🌐",
                  index: 2,
                  overview:
                    "Real‑time sentiment and action to maintain healthy communities and growth.",
                  applicability: [
                    "Discord/Slack communities",
                    "Web3 & DeFi projects",
                    "Online forums/platforms",
                    "Social media communities",
                  ],
                  span: "md:col-span-3",
                },
              ].map((journey, i) => (
                <motion.div
                  data-journey-slide
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`snap-center ${journey.span ? `${journey.span}` : "md:col-span-2"} min-w-[85%] md:min-w-0`}
                >
                  <Card
                    className={`h-full border transition-all duration-500 hover:shadow-lg hover:scale-[1.02] bg-white dark:bg-gray-900 overflow-hidden ${
                      highlightedJourney === i
                        ? "border-blue-500 shadow-2xl shadow-blue-500/25 ring-2 ring-blue-500/50"
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    {/* Dashboard Image */}
                    <div className="relative h-48 bg-gray-900 overflow-hidden">
                      <img
                        src={journey.image || "/placeholder.svg"}
                        alt={`${journey.title} Dashboard`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/80 rounded-lg px-3 py-2">
                        <span className="text-xl">{journey.icon}</span>
                        <span className="text-white font-semibold text-sm">{journey.title}</span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="border-l-4 border-gradient-to-b from-blue-500 to-purple-500 pl-4 mb-6">
                          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                            {journey.heroHeadline}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            {journey.heroDescription}
                          </p>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Triggers:</h4>
                          <p className="text-sm text-muted-foreground">{journey.triggers}</p>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">What's inside:</h4>
                          <ul className="space-y-1">
                            {journey.items.map((item, j) => (
                              <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">KPIs:</h4>
                          <div className="flex flex-wrap gap-2">
                            {journey.kpis.map((kpi, j) => (
                              <Badge key={j} className={`text-xs ${kpi.color} border-0`}>
                                {kpi.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4 bg-transparent"
                          onClick={() => openJourneyModal(i)}
                        >
                          View starter pack
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-12"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full h-12 px-8 text-base font-semibold glass-depth shadow-xl"
              >
                <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                  Book a demo
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {modalOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl h-[60vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedJourney !== null && (
                  <div className="h-full flex flex-col">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {
                            [
                              { title: "Gaming: Player Retention & Trust/Safety", icon: "🎮" },
                              { title: "Support: Conversation Intelligence", icon: "🎧" },
                              { title: "Communities & Web3: Health & Growth", icon: "🌐" },
                            ][selectedJourney].icon
                          }
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {
                            [
                              { title: "Gaming: Player Retention & Trust/Safety" },
                              { title: "Support: Conversation Intelligence" },
                              { title: "Communities & Web3: Health & Growth" },
                            ][selectedJourney].title
                          }
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </Button>
                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Overview</h4>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {
                              [
                                {
                                  overview:
                                    "Transform player experiences with AI agents that detect frustration patterns in real-time and adapt gameplay to maintain engagement. Our gaming starter pack prevents churn by identifying at-risk players before they quit and automatically adjusting difficulty, matchmaking, and social interactions to keep them engaged.",
                                },
                                {
                                  overview:
                                    "Revolutionize customer support with AI agents that understand context, intent, and sentiment in real-time. Our support starter pack reduces handle times while improving satisfaction by providing agents with intelligent recommendations and automating routine tasks.",
                                },
                                {
                                  overview:
                                    "Maintain healthy, growing communities with AI agents that monitor sentiment, detect emerging issues, and facilitate positive engagement. Our community starter pack prevents toxic behavior while fostering organic growth and meaningful interactions.",
                                },
                              ][selectedJourney].overview
                            }
                          </p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Best Suited For</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              {
                                applicability: [
                                  "Multiplayer games with high churn rates",
                                  "Competitive gaming platforms",
                                  "Social gaming communities",
                                  "Free-to-play mobile games",
                                ],
                              },
                              {
                                applicability: [
                                  "Customer service centers",
                                  "SaaS support teams",
                                  "E-commerce help desks",
                                  "Financial services support",
                                ],
                              },
                              {
                                applicability: [
                                  "Discord/Slack communities",
                                  "Web3 and DeFi projects",
                                  "Online forums and platforms",
                                  "Social media communities",
                                ],
                              },
                            ][selectedJourney].applicability.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                              >
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-center">
                        <Button asChild size="lg" className="rounded-full h-12 px-8 text-base font-semibold">
                          <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                            Request Demo
                            <ArrowRight className="ml-2 size-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </section>

        {false && (
        <section
          id="replay"
          className="w-full py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.2),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.2),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(14,165,233,0.3),transparent_50%)]"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
            >
              <Badge className="rounded-full px-8 py-3 text-sm font-bold glass-depth shadow-xl border-blue-400/30 bg-blue-500/10 magnetic-hover">
                <span className="text-blue-600 dark:text-blue-400 font-display">Trust Every Decision</span>
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight text-gradient-dynamic">
                Replay any decision
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl font-medium leading-relaxed">
                Step through any agent decision with full context, reasoning, and outcome tracking.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Play className="size-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Play replay</h3>
                    <p className="text-sm text-muted-foreground">No production data shown in demos</p>
                    <Badge variant="secondary" className="mt-4">
                      Full transparency
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            
          </div>
        </section>
        )}

        {false && (
        <section id="how-it-works" className="w-full py-20 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
            >
              <Badge className="rounded-full px-8 py-3 text-sm font-bold glass-depth shadow-xl border-green-400/30 bg-green-500/10 magnetic-hover">
                <span className="text-green-600 dark:text-green-400 font-display">Results in Days</span>
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight text-gradient-dynamic">
                Get Started in Hours, not Weeks
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl font-medium leading-relaxed">
                Go from setup to intelligent automation in three simple steps.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        step: "1",
                        title: "Connect Your Sovereign Data",
                        description:
                          "Securely attach your real-time data streams, from Kafka to Discord, on your dedicated infrastructure. Zero migration, 100% data ownership, open-source models only.",
                      },
                      {
                        step: "2",
                        title: "Deploy Multi-Agent Intelligence",
                        description:
                          "Custom agents tuned to your data that perceive, decide, and act on live signals. Native multi-agent workflows with secure compute: no data leaks, everything on-premise.",
                      },
                      {
                        step: "3",
                        title: "Launch with Full Governance",
                        description:
                          "Deploy as candidate versions with performance-gated promotions. Measure against baseline, auto-rollback on KPI misses, complete audit trail for every decision.",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className="text-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-xl">
                          {item.step}
                        </div>
                        <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Removed: How We Make It Happen (per request) */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full h-12 px-8 text-base font-semibold glass-depth shadow-xl"
              >
                <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                  Book a demo
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
        )}

        <section className="w-full py-20 md:py-32 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
            >
              <Badge className="rounded-full px-8 py-3 text-sm font-bold glass-depth shadow-xl border-blue-400/30 bg-blue-500/10 magnetic-hover">
                <span className="text-blue-600 dark:text-blue-400 font-display">Customer Success</span>
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight text-gradient-dynamic">
                Trusted by Industry Leaders
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl font-medium leading-relaxed">
                See how teams are using CEF to transform their operations by maximizing their <b>AI Agility</b>.
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    quote:
                      "CEF reduced our player churn by 35% in the first month. The real-time insights into player behavior patterns were game-changing.",
                    author: "Sarah Chen",
                    role: "Head of Player Experience",
                    company: "GameStudio Pro",
                    avatar: "/professional-woman-avatar.png",
                  },
                  {
                    quote:
                      "Our support team's handle time dropped by 40% while customer satisfaction scores increased. The conversation intelligence is incredible.",
                    author: "Marcus Rodriguez",
                    role: "VP of Customer Success",
                    company: "TechFlow Solutions",
                    avatar: "/professional-man-avatar.png",
                  },
                  {
                    quote:
                      "Community health metrics improved dramatically. We can now prevent toxic behavior before it spreads, maintaining a positive environment.",
                    author: "Alex Kim",
                    role: "Community Director",
                    company: "Web3 Collective",
                    avatar: "/professional-avatar.png",
                  },
                ].map((testimonial, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900 h-full">
                      <CardContent className="p-6">
                        <div className="flex flex-col h-full">
                          <div className="mb-4">
                            <svg
                              className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                            </svg>
                            <p className="text-muted-foreground leading-relaxed mb-6">"{testimonial.quote}"</p>
                          </div>
                          <div className="flex items-center mt-auto">
                            <img
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.author}
                              className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                              <p className="font-semibold text-sm">{testimonial.author}</p>
                              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {testimonial.company}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full h-12 px-8 text-base font-semibold glass-depth shadow-xl"
              >
                <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                  Join these leaders
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Governance Hub Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-blue-50/50 via-cyan-50/30 to-transparent"></div>

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <Badge variant="outline" className="mb-6 text-blue-600 border-blue-200 bg-blue-50">
                Built for sovereignty and audit
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Governed by design</h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl font-medium leading-relaxed">
                Full sovereignty, complete auditability, and transparent cost tracking built into every decision.
              </p>
            </motion.div>

            <div className="relative max-w-6xl mx-auto">
              {/* Central Hub Graphic */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 rounded-full border-2 border-dashed border-blue-200/40 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100/50 to-cyan-100/50 flex items-center justify-center">
                    <Shield className="w-16 h-16 text-blue-400/60" strokeWidth={1} />
                  </div>
                </div>
              </div>

              {/* Four Feature Blocks in 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 relative z-10">
                {/* Top Left - Sovereign by design */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-center md:text-right md:pr-8"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Sovereign by design</h3>
                  <p className="text-muted-foreground mb-4">Your infrastructure, your controls, your models</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    {["On-prem", "VPC", "Cloud", "Hybrid ready"].map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700 border-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>

                {/* Top Right - Lineage & RBAC */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center md:text-left md:pl-8"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 mb-4">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Lineage & RBAC</h3>
                  <p className="text-muted-foreground">Full traceability; policy-aware access and audit trails</p>
                </motion.div>

                {/* Bottom Left - Replay sandbox */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center md:text-right md:pr-8"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 mb-4">
                    <Play className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Replay sandbox</h3>
                  <p className="text-muted-foreground">Test new logic on real data safely</p>
                </motion.div>

                {/* Bottom Right - Cost/compute transparency */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center md:text-left md:pl-8"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 mb-4">
                    <Cpu className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">Cost/compute transparency</h3>
                  <p className="text-muted-foreground">Per-run usage and attribution</p>
                </motion.div>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600">
                <defs>
                  <pattern id="dots" patternUnits="userSpaceOnUse" width="4" height="4">
                    <circle cx="2" cy="2" r="1" fill="#C7D2FE" opacity="0.5" />
                  </pattern>
                </defs>
                {/* Decorative connector lines removed */}
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mt-16"
            >
            
            </motion.div>
          </div>
        </section>

        <section id="contact" className="w-full py-20 md:py-32 bg-white dark:bg-gray-950">
          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display-bold tracking-tight text-gradient-dynamic">
                Own your AI. Replace the black box.
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-medium leading-relaxed">
               
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button asChild size="lg" className="rounded-full h-12 px-8 text-base font-semibold glass shadow-xl">
                  <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                    See CEF in Action
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base font-medium bg-transparent"
                >
                  <Link href="#journeys">Explore starter packs</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t glass-header">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <div className="space-y-4 md:col-span-2">
              <motion.div
                className="flex items-center gap-2 font-bold"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <img
                  src="https://cdn.prod.website-files.com/674765a62fb62fecf4da7696/674765a62fb62fecf4da7836_Logo%20Nav.svg"
                  alt="CEF Logo"
                  className="h-6 w-auto"
                />
                <span className="text-sm text-muted-foreground">Ship AI Like Software</span>
              </motion.div>
              <p className="text-sm text-muted-foreground max-w-md font-medium leading-relaxed">
                Test, version, and ship multi‑agent AI on your dedicated stack. Replays, KPI‑gated promotions,
                instant rollback, and full audit—open‑source models only, no data leaves your infra.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#journeys" className="text-muted-foreground hover:text-foreground transition-colors">
                    Journeys
                  </Link>
                </li>
                <li>
                  <Link href="#replay" className="text-muted-foreground hover:text-foreground transition-colors">
                    Replay
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="#governance" className="text-muted-foreground hover:text-foreground transition-colors">
                    Governance
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Starter Packs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="https://app.lemcal.com/@fredjin/30-minutes"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Book a demo
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Talk to an engineer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground font-medium">&copy; 2024 CEF • Privacy • Terms</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
