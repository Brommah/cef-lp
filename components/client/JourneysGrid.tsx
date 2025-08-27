"use client"

import { Gamepad2, Headphones, Globe2, Cpu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function JourneysGrid(): JSX.Element {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr"
    >
      {/* Gaming */}
      <div className="h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="relative h-52 bg-gray-100">
          <Image src="/gaming-dashboard-analytics.png" alt="Gaming dashboard" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
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
            <Link className="block w-full text-center rounded-xl border border-slate-300 py-3 text-slate-800 hover:bg-slate-50" href="#">View starter pack</Link>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="relative h-52 bg-gray-100">
          <Image src="/customer-support-dashboard.png" alt="Support dashboard" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
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
            <Link className="block w-full text-center rounded-xl border border-slate-300 py-3 text-slate-800 hover:bg-slate-50" href="#">View starter pack</Link>
          </div>
        </div>
      </div>

      {/* Communities */}
      <div className="h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="relative h-52 bg-gray-100">
          <Image src="/web3-community-dashboard.png" alt="Community dashboard" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
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
            <Link className="block w-full text-center rounded-xl border border-slate-300 py-3 text-slate-800 hover:bg-slate-50" href="#">View starter pack</Link>
          </div>
        </div>
      </div>

      {/* Computer Vision */}
      <div className="h-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="relative h-52 bg-gray-100">
          <Image src="/ai-customer-intelligence-dashboard.png" alt="Computer Vision" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
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
            <Link className="block w-full text-center rounded-xl border border-slate-300 py-3 text-slate-800 hover:bg-slate-50" href="#">View starter pack</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
