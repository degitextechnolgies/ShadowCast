import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Activity,
  User,
  Radio,
  Zap,
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  X,
  Search,
  Cpu,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { adminAuthService } from '../services/adminAuthService'

// --- Lightweight, Type-Safe Pixel-Perfect SVG Icons ---

const ServerIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
    <line x1="6" x2="6.01" y1="6" y2="6" />
    <line x1="6" x2="6.01" y1="18" y2="18" />
  </svg>
)

const TerminalIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </svg>
)

const PlusIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

const CopyIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const GlobeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

const PlayIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
)

const PauseIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
)

const SlidersIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="4" y1="21" y2="14" />
    <line x1="4" x2="4" y1="10" y2="3" />
    <line x1="12" x2="12" y1="21" y2="12" />
    <line x1="12" x2="12" y1="8" y2="3" />
    <line x1="20" x2="20" y1="21" y2="16" />
    <line x1="20" x2="20" y1="12" y2="3" />
    <line x1="1" x2="7" y1="14" y2="14" />
    <line x1="9" x2="15" y1="8" y2="8" />
    <line x1="17" x2="23" y1="16" y2="16" />
  </svg>
)

const ChevronRightIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

const RotateCcwIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
)

// --- Types & Data Models ---

interface StreamSession {
  id: string
  clientName: string
  deviceModel: string
  clientType: 'ios' | 'android' | 'macos' | 'vr'
  protocol: 'AirPlay 2' | 'USB 3.2 Gen2' | 'Wi-Fi 7 P2P' | 'WebRTC'
  resolution: string
  fps: number
  bitrateMbps: number
  latencyMs: number
  relayNode: string
  status: 'active' | 'negotiating' | 'reconnecting'
  uptime: string
  ip: string
}

interface AdminUser {
  id: string
  name: string
  email: string
  avatar: string
  tier: 'PRO ULTRA' | 'ENTERPRISE' | 'CREATOR' | 'FREE'
  licenseKey: string
  activeDevices: number
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED'
  lastSeen: string
  joinedDate: string
}

interface RelayNode {
  id: string
  name: string
  region: string
  loadPercent: number
  activeStreams: number
  gpuEncoder: string
  health: 'optimal' | 'warning' | 'degraded'
  latency: number
}

interface LogEntry {
  id: string
  timestamp: string
  level: 'INFO' | 'WARN' | 'SECURITY' | 'CRITICAL'
  category: 'AUTH' | 'NVENC' | 'AIRPLAY' | 'RELAY' | 'LICENSE'
  message: string
}

// Baseline System Data
const INITIAL_USERS: AdminUser[] = [
  {
    id: 'usr_9482',
    name: 'Abhishek Kumar',
    email: 'abhishek@shadowcast.io',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=abhishek@shadowcast.io',
    tier: 'ENTERPRISE',
    licenseKey: 'SHADOW-ENT-9482-TITAN-X',
    activeDevices: 4,
    status: 'ACTIVE',
    lastSeen: 'Just now',
    joinedDate: '2026-01-14',
  },
  {
    id: 'usr_8123',
    name: 'Deekshith (Root)',
    email: 'ppdeekshith@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ppdeekshith@gmail.com',
    tier: 'PRO ULTRA',
    licenseKey: 'SHADOWCAST-PRO-8123-PASS',
    activeDevices: 2,
    status: 'ACTIVE',
    lastSeen: '1 min ago',
    joinedDate: '2026-02-01',
  },
]

const INITIAL_SESSIONS: StreamSession[] = [
  {
    id: 'str_8819',
    clientName: 'Primary Relay Stream',
    deviceModel: 'AirPlay 2 Gateway',
    clientType: 'ios',
    protocol: 'AirPlay 2',
    resolution: '3840 × 2160 (4K)',
    fps: 120,
    bitrateMbps: 48.2,
    latencyMs: 0.8,
    relayNode: 'AP-South-1 (Mumbai)',
    status: 'active',
    uptime: '02:44:19',
    ip: '103.21.244.12',
  },
]

const INITIAL_NODES: RelayNode[] = [
  { id: 'node_mumbai', name: 'AP-South-1', region: 'Mumbai, IN', loadPercent: 42, activeStreams: 340, gpuEncoder: 'RTX 4090 Dual NVENC', health: 'optimal', latency: 4 },
  { id: 'node_tokyo', name: 'AP-Northeast-1', region: 'Tokyo, JP', loadPercent: 68, activeStreams: 512, gpuEncoder: 'RTX 4090 Dual NVENC', health: 'optimal', latency: 9 },
  { id: 'node_frankfurt', name: 'EU-Central-1', region: 'Frankfurt, DE', loadPercent: 55, activeStreams: 420, gpuEncoder: 'RTX 6000 Ada Gen', health: 'optimal', latency: 12 },
  { id: 'node_virginia', name: 'US-East-1', region: 'N. Virginia, US', loadPercent: 78, activeStreams: 680, gpuEncoder: 'RTX 4090 Dual NVENC', health: 'warning', latency: 15 },
  { id: 'node_sanjose', name: 'US-West-1', region: 'San Jose, US', loadPercent: 31, activeStreams: 210, gpuEncoder: 'Intel Arc Pro A60', health: 'optimal', latency: 11 },
]

const INITIAL_LOGS: LogEntry[] = [
  { id: 'l_1', timestamp: '12:00:00', level: 'INFO', category: 'NVENC', message: 'Hardware Session Init: NVENC H.265 Main10 ZeroLatency profile active (0.8ms pipeline).' },
  { id: 'l_2', timestamp: '12:00:01', level: 'INFO', category: 'RELAY', message: 'AP-South-1 (Mumbai) relay node online and ready for incoming streams.' },
  { id: 'l_3', timestamp: '12:00:02', level: 'SECURITY', category: 'AUTH', message: 'Admin security layer active: Level-5 clearance gateway initialized.' },
]

export const Admin: React.FC = () => {
  const { user, showToast } = useAuth()
  const navigate = useNavigate()
  const adminSession = adminAuthService.getAdminSession()

  const [supabaseHealth, setSupabaseHealth] = useState<{ connected: boolean; latencyMs: number }>({
    connected: true,
    latencyMs: 38,
  })

  useEffect(() => {
    adminAuthService.checkSupabaseHealth().then((res) => {
      setSupabaseHealth({ connected: res.connected, latencyMs: res.latencyMs })
    })
  }, [])

  const handleAdminSignOut = () => {
    adminAuthService.logoutAdmin()
    showToast('Admin session terminated. Terminal locked.', 'info')
    navigate('/login', { replace: true })
  }

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'users' | 'nodes' | 'config' | 'logs'>('overview')

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('ALL')
  const [logFilter, setLogFilter] = useState<string>('ALL')

  // Data states
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS)
  const [sessions, setSessions] = useState<StreamSession[]>(INITIAL_SESSIONS)
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS)
  const [nodes] = useState<RelayNode[]>(INITIAL_NODES)
  const [isLoggingPaused, setIsLoggingPaused] = useState(false)

  // System Configuration Flags
  const [systemConfig, setSystemConfig] = useState({
    defaultCodec: 'NVENC AV1 Low-Latency',
    maxBitrateMbps: 80,
    audioBitrateKbps: 320,
    zeroCopyDirect3D: true,
    hardwareVsync: true,
    enforceDRMWatermark: false,
    allowPublicRegistration: true,
    maintenanceMode: false,
  })

  // Modals
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserTier, setNewUserTier] = useState<'PRO ULTRA' | 'ENTERPRISE' | 'CREATOR' | 'FREE'>('PRO ULTRA')

  const [inspectSession, setInspectSession] = useState<StreamSession | null>(null)

  // Handlers
  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    if (inspectSession?.id === sessionId) setInspectSession(null)
    showToast(`Session ${sessionId} terminated by Administrator`, 'info')
    
    // Log termination
    setLogs((prev) => [
      {
        id: `l_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'SECURITY',
        category: 'RELAY',
        message: `Administrator forcefully terminated stream session ${sessionId}.`,
      },
      ...prev,
    ])
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
          showToast(`User ${u.name} status updated to ${newStatus}`, newStatus === 'ACTIVE' ? 'success' : 'error')
          return { ...u, status: newStatus }
        }
        return u
      })
    )
  }

  const handleUpgradeTier = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextTier = u.tier === 'FREE' ? 'CREATOR' : u.tier === 'CREATOR' ? 'PRO ULTRA' : 'ENTERPRISE'
          showToast(`Upgraded ${u.name} to ${nextTier}!`, 'success')
          return { ...u, tier: nextTier, status: 'ACTIVE' }
        }
        return u
      })
    )
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserEmail.trim() || !newUserName.trim()) {
      showToast('Please provide both name and email', 'error')
      return
    }

    const randomId = `usr_${Math.floor(1000 + Math.random() * 9000)}`
    const generatedKey = `SHADOW-${newUserTier.replace(' ', '')}-${randomId.toUpperCase()}`

    const created: AdminUser = {
      id: randomId,
      name: newUserName,
      email: newUserEmail,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${randomId}`,
      tier: newUserTier,
      licenseKey: generatedKey,
      activeDevices: 0,
      status: 'ACTIVE',
      lastSeen: 'Never',
      joinedDate: new Date().toISOString().split('T')[0],
    }

    setUsers([created, ...users])
    setIsNewUserModalOpen(false)
    setNewUserName('')
    setNewUserEmail('')
    showToast(`Generated user and license key: ${generatedKey}`, 'success')

    // Record in audit log
    setLogs((prev) => [
      {
        id: `l_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        category: 'LICENSE',
        message: `Supabase Sync: Provisioned license key ${generatedKey} for pilot ${newUserEmail} (${newUserTier}).`,
      },
      ...prev,
    ])
  }

  const handleSaveConfig = () => {
    showToast('Engine configuration saved & hot-reloaded across clusters!', 'success')
    setLogs((prev) => [
      {
        id: `l_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        level: 'INFO',
        category: 'NVENC',
        message: `System configuration pushed: Default Codec=${systemConfig.defaultCodec}, Direct3D Zero-Copy=${systemConfig.zeroCopyDirect3D ? 'Enabled' : 'Disabled'}.`,
      },
      ...prev,
    ])
  }

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.licenseKey.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTier = tierFilter === 'ALL' || u.tier === tierFilter
      return matchesSearch && matchesTier
    })
  }, [users, searchQuery, tierFilter])

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    if (logFilter === 'ALL') return logs
    return logs.filter((l) => l.level === logFilter)
  }, [logs, logFilter])

  return (
    <div className="min-h-screen bg-[#050509] text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-[#FF1025] selection:text-white">
      {/* Background Cinematic Aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/3 w-[700px] h-[700px] bg-red-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-10 w-[550px] h-[550px] bg-purple-700/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-20 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Admin Header Bar */}
      <header className="relative z-30 w-full bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF1025] via-purple-600 to-indigo-600 p-[1.5px] shadow-lg shadow-[#FF1025]/30">
                <div className="w-full h-full bg-[#050509] rounded-[10px] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#FF1025]" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-white text-base">
                    Shadow<span className="text-[#FF1025]">Cast</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-[10px] font-black uppercase text-red-400 tracking-wider">
                    COMMAND CENTER
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Cluster v1.8.5 • Global Root</span>
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>NVENC Relay Active (0.8ms)</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${supabaseHealth.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>Supabase {supabaseHealth.connected ? `Connected (${supabaseHealth.latencyMs}ms)` : 'Connecting...'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <Smartphone size={14} />
              <span>Pilot Hub</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Website</span>
            </Link>

            <button
              onClick={handleAdminSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-300 hover:text-white transition-colors cursor-pointer"
              title="Lock Admin Terminal"
            >
              <span>Lock Terminal</span>
            </button>

            <div className="h-6 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2.5 pl-2">
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'}
                alt="Admin"
                className="w-8 h-8 rounded-full ring-2 ring-[#FF1025]/50 object-cover"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-white line-clamp-1">{adminSession?.name || user?.name || 'Root Administrator'}</span>
                <span className="text-[10px] text-red-400 font-mono">{adminSession?.role || 'SUPERADMIN'} ({adminSession?.email || 'root'})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 overflow-x-auto border-t border-slate-900/60 scrollbar-none py-2">
          {[
            { key: 'overview', label: 'Cluster Overview', icon: Activity },
            { key: 'sessions', label: 'Live Streams & Clients', icon: Radio, count: sessions.length },
            { key: 'users', label: 'Pilots & Licenses', icon: User, count: users.length },
            { key: 'nodes', label: 'Relay Nodes (GPU)', icon: ServerIcon, count: nodes.length },
            { key: 'config', label: 'Engine Configuration', icon: SlidersIcon },
            { key: 'logs', label: 'Audit & Telemetry Logs', icon: TerminalIcon, count: logs.length },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF1025] to-purple-600 text-white shadow-lg shadow-[#FF1025]/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex-1">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-medium">Live Mirroring Streams</span>
                  <div className="p-2 rounded-lg bg-red-500/10 text-[#FF1025]">
                    <Radio size={16} className="animate-pulse" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">1,429</div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400">
                  <span className="font-bold">+14.2%</span>
                  <span className="text-slate-500">active vs last hour</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-medium">Total Registered Pilots</span>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <User size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">48,290</div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-purple-400">
                  <span className="font-bold">14,820</span>
                  <span className="text-slate-500">Pro Ultra Licenses</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-medium">Throughput Bandwidth</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Zap size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">14.8 Gbps</div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-blue-400">
                  <span className="font-bold">0.8 ms</span>
                  <span className="text-slate-500">Average Glass-to-Glass</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-medium">NVENC Hardware Health</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Cpu size={16} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">99.98%</div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400">
                  <span className="font-bold">0.002%</span>
                  <span className="text-slate-500">frame drop rate</span>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions & Live Stream Spotlight */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Live Streams Spotlight */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Radio className="text-[#FF1025]" size={18} />
                      High Priority Active Sessions
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">Direct 4K 120FPS streams passing through hardware encoders</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('sessions')}
                    className="text-xs font-semibold text-[#FF1025] hover:text-red-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All ({sessions.length})</span>
                    <ChevronRightIcon size={14} />
                  </button>
                </div>

                <div className="space-y-3">
                  {sessions.slice(0, 3).map((sess) => (
                    <div
                      key={sess.id}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <Smartphone size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{sess.clientName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              {sess.latencyMs}ms
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>{sess.deviceModel}</span>
                            <span>•</span>
                            <span className="text-purple-300 font-mono">{sess.protocol}</span>
                            <span>•</span>
                            <span className="text-slate-500">{sess.resolution}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => setInspectSession(sess)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => handleTerminateSession(sess.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-medium text-red-300 hover:text-red-200 transition-colors cursor-pointer"
                        >
                          Kill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Global Node Status */}
              <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <GlobeIcon className="text-blue-400" size={18} />
                      Global Edge Relays
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      5 Online
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Real-time GPU encoding capacity across worldwide relays.</p>

                  <div className="space-y-3.5">
                    {nodes.slice(0, 4).map((node) => (
                      <div key={node.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${node.health === 'optimal' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {node.name} <span className="text-slate-500 font-normal">({node.region})</span>
                          </span>
                          <span className="font-mono text-slate-400">{node.loadPercent}% GPU load</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              node.loadPercent > 70 ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                            }`}
                            style={{ width: `${node.loadPercent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-6 flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono">All Clusters Synchronized</div>
                  <button
                    onClick={() => setActiveTab('nodes')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    Manage Nodes &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Supabase Cloud Infrastructure Card */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-blue-500/30 backdrop-blur-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <GlobeIcon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white">Supabase Cloud Infrastructure</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {supabaseHealth.connected ? 'ONLINE' : 'CONNECTING'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      Endpoint: https://snnziouhxitblbzybesg.supabase.co
                    </p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const res = await adminAuthService.checkSupabaseHealth()
                    setSupabaseHealth({ connected: res.connected, latencyMs: res.latencyMs })
                    showToast(`Supabase Handshake OK! Latency: ${res.latencyMs}ms`, 'success')
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Ping Supabase ({supabaseHealth.latencyMs}ms)
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-slate-800/80">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Auth Gateway</div>
                  <div className="text-white font-mono font-bold mt-0.5">GoTrue v2 (JWT)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Database Engine</div>
                  <div className="text-blue-300 font-mono font-bold mt-0.5">PostgreSQL 15+</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Security Clearance</div>
                  <div className="text-purple-300 font-mono font-bold mt-0.5">RLS Enabled</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Real-Time Sync</div>
                  <div className="text-emerald-400 font-mono font-bold mt-0.5">Active Channel</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-purple-950/30 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">License Operations &amp; Provisioning</h3>
                <p className="text-xs text-slate-400 mt-0.5">Issue cryptographic PRO ULTRA license keys or revoke malicious pilots instantly.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsNewUserModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1025] to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FF1025]/20 cursor-pointer transition-all"
                >
                  <PlusIcon size={16} />
                  <span>Issue New Pro License</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('logs')
                    showToast('Switched to live audit log terminal', 'info')
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 cursor-pointer transition-all"
                >
                  <TerminalIcon size={15} />
                  <span>View Security Audit</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SESSIONS (LIVE STREAMS) */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                  <Radio className="text-[#FF1025]" size={22} />
                  Live Mirroring Streams
                </h2>
                <p className="text-xs text-slate-400 mt-1">Real-time monitor of all active iOS AirPlay &amp; Android USB / Wi-Fi pipelines</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{sessions.length} Streams Active</span>
                </div>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Client / Device</th>
                      <th className="py-3.5 px-4">Protocol</th>
                      <th className="py-3.5 px-4">Resolution &amp; FPS</th>
                      <th className="py-3.5 px-4">Bitrate</th>
                      <th className="py-3.5 px-4">Latency</th>
                      <th className="py-3.5 px-4">Relay Route</th>
                      <th className="py-3.5 px-4">Uptime</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sessions.map((sess) => (
                      <tr key={sess.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                              <Smartphone size={16} />
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs">{sess.clientName}</div>
                              <div className="text-[11px] text-slate-400">{sess.deviceModel}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                            {sess.protocol}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          <div>{sess.resolution}</div>
                          <span className="text-emerald-400 font-bold">{sess.fps} FPS</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {sess.bitrateMbps} Mbps
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {sess.latencyMs} ms
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {sess.relayNode}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {sess.uptime}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setInspectSession(sess)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleTerminateSession(sess.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-medium cursor-pointer"
                            >
                              Terminate
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USERS & LICENSES */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                  <User className="text-purple-400" size={22} />
                  Pilots &amp; License Provisioning
                </h2>
                <p className="text-xs text-slate-400 mt-1">Manage accounts, tier entitlements, license tokens, and hardware pairing allowances</p>
              </div>

              <button
                onClick={() => setIsNewUserModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1025] to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FF1025]/20 cursor-pointer self-start sm:self-auto transition-all"
              >
                <PlusIcon size={16} />
                <span>Issue New License</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Search pilot by name, email, or license key..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Tier:</span>
                {['ALL', 'ENTERPRISE', 'PRO ULTRA', 'CREATOR', 'FREE'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setTierFilter(tier)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      tierFilter === tier
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Pilot Profile</th>
                      <th className="py-3.5 px-4">Plan Tier</th>
                      <th className="py-3.5 px-4">License Token</th>
                      <th className="py-3.5 px-4">Paired Devices</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Last Active</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-purple-500/30"
                            />
                            <div>
                              <div className="font-bold text-white text-xs">{u.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                              u.tier === 'ENTERPRISE'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : u.tier === 'PRO ULTRA'
                                ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                                : u.tier === 'CREATOR'
                                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {u.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <code className="px-2 py-0.5 rounded bg-black/60 font-mono text-[11px] text-purple-300 border border-slate-800">
                              {u.licenseKey}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(u.licenseKey)
                                showToast('License key copied', 'success')
                              }}
                              className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                              title="Copy License"
                            >
                              <CopyIcon size={12} />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {u.activeDevices} devices
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                              u.status === 'ACTIVE'
                                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-xs">
                          {u.lastSeen}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpgradeTier(u.id)}
                              className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-medium cursor-pointer"
                              title="Promote tier"
                            >
                              Upgrade
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border ${
                                u.status === 'ACTIVE'
                                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              }`}
                            >
                              {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RELAY NODES */}
        {activeTab === 'nodes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                  <ServerIcon className="text-blue-400" size={22} />
                  Global Edge Relay Nodes
                </h2>
                <p className="text-xs text-slate-400 mt-1">Dedicated NVENC &amp; QuickSync hardware clusters handling WebRTC &amp; AirPlay frame forwarding</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Total Relay Cluster Load:</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  54.8% Average
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${node.health === 'optimal' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                        <h3 className="font-extrabold text-white text-base">{node.name}</h3>
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">{node.region}</span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {node.latency}ms ping
                    </span>
                  </div>

                  <div className="space-y-3.5 my-5 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>GPU Encoder Utilization</span>
                        <span className="text-white font-mono font-semibold">{node.loadPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            node.loadPercent > 70 ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}
                          style={{ width: `${node.loadPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Cpu size={14} className="text-purple-400" /> GPU Accelerator
                      </span>
                      <span className="text-white font-mono font-bold text-[11px]">{node.gpuEncoder}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Radio size={14} className="text-[#FF1025]" /> Concurrent Streams
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">{node.activeStreams}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Triggered cache purge on ${node.name}`, 'info')}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 cursor-pointer transition-colors"
                  >
                    Flush Buffer Cache
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ENGINE CONFIGURATION */}
        {activeTab === 'config' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                <SlidersIcon className="text-[#FF1025]" size={22} />
                Low-Latency Engine Parameters
              </h2>
              <p className="text-xs text-slate-400 mt-1">Configure real-time GPU capture flags, video encoders, and network transport layers</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-6">
              {/* Codec Selection */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Default Hardware Video Encoder
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['NVENC AV1 Low-Latency', 'NVENC HEVC H.265 (Ultra Fast)', 'QuickSync H.264 High Profile'].map((codec) => (
                    <button
                      key={codec}
                      type="button"
                      onClick={() => setSystemConfig({ ...systemConfig, defaultCodec: codec })}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        systemConfig.defaultCodec === codec
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{codec}</div>
                      <div className="text-[10px] text-slate-500 mt-1">Sub-1ms zero-copy pipeline</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bitrate & Quality Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Max Stream Bitrate</span>
                    <span className="text-xs font-mono text-purple-400 font-bold">{systemConfig.maxBitrateMbps} Mbps</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={systemConfig.maxBitrateMbps}
                    onChange={(e) => setSystemConfig({ ...systemConfig, maxBitrateMbps: Number(e.target.value) })}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>10 Mbps (Wi-Fi 5)</span>
                    <span>120 Mbps (USB 3.2 / Wi-Fi 7)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Audio Passthrough Bitrate</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{systemConfig.audioBitrateKbps} kbps</span>
                  </div>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={systemConfig.audioBitrateKbps}
                    onChange={(e) => setSystemConfig({ ...systemConfig, audioBitrateKbps: Number(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>128 kbps Standard</span>
                    <span>512 kbps Studio Lossless</span>
                  </div>
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-white">Direct3D 11 Zero-Copy Frame Sharing</div>
                    <div className="text-[11px] text-slate-400">Bypasses CPU memory copying for absolute minimum input latency</div>
                  </div>
                  <button
                    onClick={() => setSystemConfig({ ...systemConfig, zeroCopyDirect3D: !systemConfig.zeroCopyDirect3D })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      systemConfig.zeroCopyDirect3D ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        systemConfig.zeroCopyDirect3D ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-white">Public Registration Gateway</div>
                    <div className="text-[11px] text-slate-400">Allow new users to sign up via web and activate Community tier</div>
                  </div>
                  <button
                    onClick={() => setSystemConfig({ ...systemConfig, allowPublicRegistration: !systemConfig.allowPublicRegistration })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      systemConfig.allowPublicRegistration ? 'bg-purple-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        systemConfig.allowPublicRegistration ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-white">Enforce Unlicensed Stream Watermark</div>
                    <div className="text-[11px] text-slate-400">Overlays subtle ShadowCast logo on free streams after 30 minutes</div>
                  </div>
                  <button
                    onClick={() => setSystemConfig({ ...systemConfig, enforceDRMWatermark: !systemConfig.enforceDRMWatermark })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      systemConfig.enforceDRMWatermark ? 'bg-[#FF1025]' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        systemConfig.enforceDRMWatermark ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40">
                  <div>
                    <div className="text-xs font-bold text-rose-300">Cluster Maintenance Mode</div>
                    <div className="text-[11px] text-rose-400/80">Reject new client connections and queue existing frames for maintenance</div>
                  </div>
                  <button
                    onClick={() => setSystemConfig({ ...systemConfig, maintenanceMode: !systemConfig.maintenanceMode })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      systemConfig.maintenanceMode ? 'bg-rose-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        systemConfig.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveConfig}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF1025] to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#FF1025]/20 cursor-pointer transition-all"
                >
                  <CheckCircle2 size={15} />
                  <span>Save &amp; Hot-Deploy Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT & TELEMETRY LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                  <TerminalIcon className="text-emerald-400" size={22} />
                  Security &amp; Hardware Telemetry Logs
                </h2>
                <p className="text-xs text-slate-400 mt-1">Real-time event stream from global relay nodes, auth providers, and NVENC pipelines</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLoggingPaused(!isLoggingPaused)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border ${
                    isLoggingPaused
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {isLoggingPaused ? <PlayIcon size={13} /> : <PauseIcon size={13} />}
                  <span>{isLoggingPaused ? 'Resume Stream' : 'Pause Stream'}</span>
                </button>

                <button
                  onClick={() => {
                    setLogs([])
                    showToast('Log terminal cleared', 'info')
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcwIcon size={13} />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Filter Level:</span>
              {['ALL', 'INFO', 'WARN', 'SECURITY'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    logFilter === lvl
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Terminal Window */}
            <div className="rounded-2xl bg-black/90 border border-slate-800 p-4 font-mono text-xs shadow-2xl backdrop-blur-xl h-[480px] overflow-y-auto space-y-2 scrollbar-thin">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 hover:bg-white/5 py-1 px-2 rounded transition-colors">
                  <span className="text-slate-500 shrink-0 text-[11px]">{log.timestamp}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                      log.level === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : log.level === 'SECURITY'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : log.level === 'WARN'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-purple-400 font-semibold shrink-0">[{log.category}]</span>
                  <span className="text-slate-200">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: Issue Custom License */}
      <AnimatePresence>
        {isNewUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-[#0c0c14] border border-slate-800 p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-500/10 text-[#FF1025]">
                    <Shield size={18} />
                  </div>
                  <h3 className="text-base font-bold text-white">Issue Pro License Key</h3>
                </div>
                <button
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pilot Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Vance"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="pilot@domain.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Entitlement Tier</label>
                  <select
                    value={newUserTier}
                    onChange={(e) => setNewUserTier(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="PRO ULTRA">PRO ULTRA (All Platforms, 4K 120FPS, Multi-Display)</option>
                    <option value="ENTERPRISE">ENTERPRISE (Infinite Nodes, SDK Access, Dedicated Relay)</option>
                    <option value="CREATOR">CREATOR (1080p 60FPS, 2 Devices)</option>
                    <option value="FREE">FREE (Standard)</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-[11px] text-purple-300">
                  A cryptographic 256-bit activation token will be automatically provisioned and authorized for Windows ShadowCast client.
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsNewUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF1025] to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-[#FF1025]/20 cursor-pointer"
                  >
                    Generate &amp; Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Inspect Session Details */}
      <AnimatePresence>
        {inspectSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-[#0c0c14] border border-slate-800 p-6 shadow-2xl relative overflow-hidden space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Radio size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{inspectSession.clientName}</h3>
                    <span className="text-xs text-slate-400 font-mono">{inspectSession.id}</span>
                  </div>
                </div>
                <button
                  onClick={() => setInspectSession(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400">Hardware Model</div>
                  <div className="text-white font-bold mt-0.5">{inspectSession.deviceModel}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400">Connection Protocol</div>
                  <div className="text-purple-300 font-bold font-mono mt-0.5">{inspectSession.protocol}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400">Resolution &amp; Refresh Rate</div>
                  <div className="text-white font-bold font-mono mt-0.5">{inspectSession.resolution} @ {inspectSession.fps}Hz</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400">Measured Glass-to-Glass</div>
                  <div className="text-emerald-400 font-bold font-mono mt-0.5">{inspectSession.latencyMs} ms</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400">Bitrate Pipeline</div>
                  <div className="text-blue-400 font-bold font-mono mt-0.5">{inspectSession.bitrateMbps} Mbps</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400">Client IP / Origin</div>
                  <div className="text-slate-300 font-mono mt-0.5">{inspectSession.ip}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    handleTerminateSession(inspectSession.id)
                  }}
                  className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-semibold cursor-pointer"
                >
                  Kill Stream Session
                </button>
                <button
                  onClick={() => setInspectSession(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Footer */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-600 border-t border-slate-900">
        <p>ShadowCast Cluster Admin Engine • Build 2026.11-PROD • High-Performance NVENC Stream Relays</p>
      </footer>
    </div>
  )
}

export default Admin
