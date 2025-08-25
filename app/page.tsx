"use client"

import { useState, useEffect } from "react"
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
  Cpu,
  Eye,
  Play,
  Pause,
  Database,
  GitBranch,
  Gamepad2,
  Headphones,
  Globe2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [highlightedJourney, setHighlightedJourney] = useState<number | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedJourney, setSelectedJourney] = useState<number | null>(null)

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
    const journeyIndex = industry === "Gaming" ? 0 : industry === "Support" ? 1 : 2

    // Scroll to journeys section
    const journeysSection = document.getElementById("journeys")
    if (journeysSection) {
      journeysSection.scrollIntoView({ behavior: "smooth" })
    }

    // Highlight the specific journey card
    setHighlightedJourney(journeyIndex)

    // Remove highlight after 3 seconds
    setTimeout(() => {
      setHighlightedJourney(null)
    }, 3000)
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

  const rotatingContent = [
    {
      headline: "Real-time Community Management",
      description: "Agents proactively analyzing sentiment shifts and escalating in real-time.",
      cta: "Learn how for Communities",
      industry: "Communities",
      icon: <Globe2 className="size-4 text-white" />,
      gradient: "from-sky-500 to-purple-500",
    },
    {
      headline: "Assisting Customer Support",
      description:
        "No more need for user Surveys! Join calls to learn how customer needs are being met and escalate before frustration builds.",
      cta: "Learn how for Support",
      industry: "Support",
      icon: <Headphones className="size-4 text-white" />,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      headline: "Personalized Gaming Experiences",
      description:
        "Dedicated AI concierge agents customized for every player, adapting to the best game experience in real time.",
      cta: "Learn how for Gaming",
      industry: "Gaming",
      icon: <Gamepad2 className="size-4 text-white" />,
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
            <Button asChild className="rounded-full glass-depth magnetic-hover font-semibold">
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
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden relative">
          <motion.div className="absolute inset-0 -z-10 hero-mesh" style={{ y: heroY, opacity: heroOpacity }} />
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="ai-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}

          <div className="absolute inset-0 overflow-hidden">
            <div className="neural-line top-1/4 left-0 w-1/3 animate-neural-pulse" />
            <div className="neural-line top-1/2 right-0 w-1/4 animate-neural-pulse delay-1000" />
            <div className="neural-line bottom-1/3 left-1/4 w-1/2 animate-neural-pulse delay-2000" />
          </div>

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
                <div className="relative overflow-visible flex items-center whitespace-nowrap" aria-live="polite" aria-atomic="true">
                  <span className="text-muted-foreground mr-2">for</span>
                  <div className="relative">
                    <motion.div
                      key={currentProfile}
                      className="text-gradient-dynamic inline-block whitespace-nowrap leading-none"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      {rotatingContent[currentProfile].headline}
                    </motion.div>
                    <motion.span
                      key={`underline-${currentProfile}`}
                      className="absolute left-0 -bottom-1 h-1 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"
                      initial={{ width: 0, opacity: 0.6 }}
                      animate={prefersReducedMotion || isRotatingPaused ? { width: 0 } : { width: "100%" }}
                      transition={{ duration: ROTATION_MS / 1000, ease: "linear" }}
                    />
                  </div>
                </div>
              </motion.h1>

              <motion.h3
                key={`desc-${currentProfile}`}
                className="text-lg text-muted-foreground mb-8 font-semibold leading-relaxed md:text-xl whitespace-nowrap"
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
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Button
                  asChild
                  size="lg"
                  className={`relative rounded-full h-14 px-10 text-lg font-semibold overflow-hidden transition-all duration-300 magnetic-hover bg-gradient-to-r ${
                    rotatingContent[currentProfile].gradient
                  } hover:shadow-2xl hover:scale-105`}
                >
                  <Link href="#journeys" className="flex items-center justify-center text-white">
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                      <motion.div
                        key={`progress-${currentProfile}`}
                        initial={{ width: 0 }}
                        animate={prefersReducedMotion || isRotatingPaused ? { width: 0 } : { width: "100%" }}
                        transition={{ duration: ROTATION_MS / 1000, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"
                      />
                    </div>
                    <motion.span
                      key={`cta-text-${currentProfile}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {rotatingContent[currentProfile].cta}
                    </motion.span>
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 px-10 text-lg font-medium glass-card bg-transparent magnetic-hover"
                >
                  <Link href="https://app.lemcal.com/@fredjin/30-minutes">Book a demo</Link>
                </Button>
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsRotatingPaused((v) => !v)}
                  aria-label={isRotatingPaused ? "Resume hero rotation" : "Pause hero rotation"}
                >
                  {isRotatingPaused ? <Play className="size-[18px]" /> : <Pause className="size-[18px]" />}
                </Button>
              </motion.div>

              {/* Redesigned Feature Showcase List */}
              <motion.div
                className="space-y-4 mt-8"
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
                {[
                  {
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
                    regularText: "— on-prem or hybrid.",
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

        <section className="w-full py-20 md:py-32 relative overflow-hidden bg-gray-50 dark:bg-gray-900 -mt-32 pt-40">
          <div className="container px-4 md:px-6 relative">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Problem Panel - Dark "Shadow" Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="bg-[#1A1D23] border border-[#333740] rounded-2xl p-8 space-y-6"
              >
                <Badge
                  className="rounded-full px-4 py-2 text-sm font-bold bg-red-500/10 text-red-400 border-red-500/20"
                  variant="outline"
                >
                  The Gap (Today)
                </Badge>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                  Today's AI Tools Flaws
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      text: "Generic models miss your user and operational context",
                      icon: "❓",
                    },
                    {
                      text: "Black-box AI → no control or accountability",
                      icon: "🔒",
                    },
                    {
                      text: "Analytics queues → insights after outcomes",
                      icon: "⏰",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-400 text-sm">{item.icon}</span>
                      </div>
                      <p className="text-gray-300 font-medium leading-relaxed">{item.text}</p>
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
                className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6 shadow-lg"
              >
                <Badge
                  className="rounded-full px-4 py-2 text-sm font-bold bg-gray-100 text-gray-700 border-gray-200"
                  variant="outline"
                >
                  Our Bridge (The Core)
                </Badge>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
                  <span className="text-gradient-dynamic underline decoration-2 underline-offset-8">Secure</span> Multi-Agent Solution
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      text: "Custom, Open-source models that evolve",
                      icon: "🔄",
                    },
                    {
                      text: "Full Control, Privacy & Transparency",
                      icon: "🛡️",
                    },
                    {
                      text: "Easy, fast with Zero leakage",
                      icon: "⚡",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-sm">{item.icon}</span>
                      </div>
                      <p className="text-gray-700 font-medium leading-relaxed">{item.text}</p>
                    </motion.div>
                  ))}
                </div>


              </motion.div>
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
                  Book a demo
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Platform Section - Integrated Process */}
        <section
          id="platform"
          className="w-full py-20 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30 relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center space-y-6 text-center mb-20"
            >
              <Badge className="rounded-full px-8 py-3 text-sm font-bold glass-depth shadow-xl border-blue-400/30 bg-blue-500/10 magnetic-hover">
                <span className="text-blue-600 dark:text-blue-400 font-display">The Core</span>
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display-bold tracking-tight">
                <span className="text-gradient-dynamic">Perceive → Reason → Act</span>
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
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full opacity-20 hidden lg:block transform -translate-y-1/2 z-0"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
                  {[
                    {
                      step: "1",
                      title: "Perceive",
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
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                  Book a demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display-bold tracking-tight text-gradient-dynamic">
                Outcome-first starter packs
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl font-medium leading-relaxed">
                Outcome-first starter packs on the same core: Perceive (CISGD) → Reason → Act → Govern.
              </p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-3 mb-16">
              {[
                {
                  title: "Gaming: Player Retention & Trust/Safety",
                  heroHeadline: "Personalized Game Experiences",
                  heroDescription:
                    "A dedicated AI concierge for every player, turning real-time behavior into adaptive gameplay.",
                  image:
                    "https://cdn.ddcdragon.com/1229/baear4ihc4nevss365lzjv4vqvsknwjapkvghhsx3meto4i6rz7b5aktqny/gaming.png?source=developer-console",
                  triggers:
                    "Rage-quit patterns, loss streaks, toxic chat spikes, cohort churn risk, social/Discord sentiment",
                  items: ["Frustration Detector", "T&S Sentinel", "Matchmaking Concierge"],
                  kpis: [
                    { name: "Churn delta", color: "bg-purple-100 text-purple-700" },
                    { name: "Session recovery", color: "bg-blue-100 text-blue-700" },
                    { name: "Abuse reports", color: "bg-red-100 text-red-700" },
                    { name: "CSAT after session", color: "bg-green-100 text-green-700" },
                  ],
                  icon: "🎮",
                  index: 0,
                  overview:
                    "Transform player experiences with AI agents that detect frustration patterns in real-time and adapt gameplay to maintain engagement. Our gaming starter pack prevents churn by identifying at-risk players before they quit and automatically adjusting difficulty, matchmaking, and social interactions to keep them engaged.",
                  applicability: [
                    "Multiplayer games with high churn rates",
                    "Competitive gaming platforms",
                    "Social gaming communities",
                    "Free-to-play mobile games",
                  ],
                },
                {
                  title: "Support: Conversation Intelligence",
                  heroHeadline: "Proactive Customer Support",
                  heroDescription: "Understand user needs so well, you'll never send a satisfaction survey again.",
                  image:
                    "https://cdn.ddcdragon.com/1229/baear4ihc4nevss365lzjv4vqvsknwjapkvghhsx3meto4i6rz7b5aktqny/communitcation.png?source=developer-console",
                  triggers:
                    "Inbound call/chat, long handle time, repeat contacts, VIP risk, compliance terms mentioned",
                  items: [
                    "Live Transcriber",
                    "Intent & Compliance Classifier",
                    "Coach/QA Summarizer",
                    "Next-Best-Action Router",
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
                    "Revolutionize customer support with AI agents that understand context, intent, and sentiment in real-time. Our support starter pack reduces handle times while improving satisfaction by providing agents with intelligent recommendations and automating routine tasks.",
                  applicability: [
                    "Customer service centers",
                    "SaaS support teams",
                    "E-commerce help desks",
                    "Financial services support",
                  ],
                },
                {
                  title: "Communities & Web3: Health & Growth",
                  heroHeadline: "Real-time Community Sentiment",
                  heroDescription: "Instantly detect sentiment shifts and prevent toxic behavior before it spreads.",
                  image:
                    "https://cdn.ddcdragon.com/1229/baear4ifceuftmm225vm6xz4em7pmfaz6gctvyc5ifnxs4aizemyxfvdmma/community.png?source=developer-console",
                  triggers:
                    "Topic surge, whale wallet activity, campaign execution, governance proposal, concern clusters",
                  items: ["Topic Surge Monitor", "Cohort Growth Planner", "Risk Router"],
                  kpis: [
                    { name: "Engagement", color: "bg-purple-100 text-purple-700" },
                    { name: "Cohort retention", color: "bg-blue-100 text-blue-700" },
                    { name: "Campaign conversion", color: "bg-green-100 text-green-700" },
                    { name: "Mod workload", color: "bg-orange-100 text-orange-700" },
                  ],
                  icon: "🌐",
                  index: 2,
                  overview:
                    "Maintain healthy, growing communities with AI agents that monitor sentiment, detect emerging issues, and facilitate positive engagement. Our community starter pack prevents toxic behavior while fostering organic growth and meaningful interactions.",
                  applicability: [
                    "Discord/Slack communities",
                    "Web3 and DeFi projects",
                    "Online forums and platforms",
                    "Social media communities",
                  ],
                },
              ].map((journey, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="lg:col-span-1"
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

        <section
          id="replay"
          className="w-full py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.3),transparent_50%)]"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
            >
              <Badge className="rounded-full px-8 py-3 text-sm font-bold glass-depth shadow-xl border-purple-400/30 bg-purple-500/10 magnetic-hover">
                <span className="text-purple-600 dark:text-purple-400 font-display">Trust Every Decision</span>
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
                How It Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl font-medium leading-relaxed">
                From setup to production in three simple steps.
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-900">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        step: "1",
                        title: "Connect",
                        description: "Attach streams and systems. No migrations.",
                        badge: "Zero migration",
                      },
                      {
                        step: "2",
                        title: "Deploy",
                        description: "Choose a starter pack; tune prompts, policies, alerts.",
                        badge: "Configurable",
                      },
                      {
                        step: "3",
                        title: "Go live",
                        description: "Canary first; iterate via replay and versioned runs.",
                        badge: "Safe rollout",
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
                        <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                        <Badge variant="outline">{item.badge}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                  Book a demo
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

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
                See how teams are using CEF to transform their operations and deliver measurable results.
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
          <div className="absolute inset-0 bg-gradient-radial from-blue-50/50 via-purple-50/30 to-transparent"></div>

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
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100/50 to-purple-100/50 flex items-center justify-center">
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
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 mb-4">
                    <Play className="w-6 h-6 text-purple-600" />
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
                {/* Lines connecting center to each quadrant */}
                <line x1="400" y1="300" x2="200" y2="150" stroke="url(#dots)" strokeWidth="1" opacity="0.6" />
                <line x1="400" y1="300" x2="600" y2="150" stroke="url(#dots)" strokeWidth="1" opacity="0.6" />
                <line x1="400" y1="300" x2="200" y2="450" stroke="url(#dots)" strokeWidth="1" opacity="0.6" />
                <line x1="400" y1="300" x2="600" y2="450" stroke="url(#dots)" strokeWidth="1" opacity="0.6" />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mt-16"
            >
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                  Book a demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
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
                See a live decision replay on your data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button asChild size="lg" className="rounded-full h-12 px-8 text-base font-semibold glass shadow-xl">
                  <Link href="https://app.lemcal.com/@fredjin/30-minutes">
                    See Your Data in Action
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
                <span className="text-sm text-muted-foreground">Sovereign Agents</span>
              </motion.div>
              <p className="text-sm text-muted-foreground max-w-md font-medium leading-relaxed">
                Deploy event-driven agents in your cloud that perceive, decide, and act on live signals—with full
                replay, lineage/RBAC, and cost/compute transparency.
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
