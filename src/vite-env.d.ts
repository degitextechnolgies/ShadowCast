/// <reference types="vite/client" />

declare module 'lucide-react' {
  import type { ComponentType, SVGProps } from 'react'

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    color?: string
    strokeWidth?: string | number
    absoluteStrokeWidth?: boolean
  }

  export type LucideIcon = ComponentType<LucideProps>

  export const Activity: LucideIcon
  export const AlertCircle: LucideIcon
  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const Cable: LucideIcon
  export const CheckCircle: LucideIcon
  export const CheckCircle2: LucideIcon
  export const ChevronDown: LucideIcon
  export const Cpu: LucideIcon
  export const Download: LucideIcon
  export const Eye: LucideIcon
  export const EyeOff: LucideIcon
  export const FileCheck: LucideIcon
  export const Gamepad2: LucideIcon
  export const HardDrive: LucideIcon
  export const HelpCircle: LucideIcon
  export const Info: LucideIcon
  export const Layers: LucideIcon
  export const LayoutDashboard: LucideIcon
  export const Link2: LucideIcon
  export const Lock: LucideIcon
  export const LogIn: LucideIcon
  export const LogOut: LucideIcon
  export const Mail: LucideIcon
  export const Menu: LucideIcon
  export const Monitor: LucideIcon
  export const MonitorPlay: LucideIcon
  export const Radio: LucideIcon
  export const RefreshCw: LucideIcon
  export const Search: LucideIcon
  export const Settings: LucideIcon
  export const Shield: LucideIcon
  export const ShieldAlert: LucideIcon
  export const ShieldCheck: LucideIcon
  export const Sliders: LucideIcon
  export const SlidersHorizontal: LucideIcon
  export const Smartphone: LucideIcon
  export const Sparkles: LucideIcon
  export const Tablet: LucideIcon
  export const User: LucideIcon
  export const Video: LucideIcon
  export const Wifi: LucideIcon
  export const Wrench: LucideIcon
  export const X: LucideIcon
  export const Zap: LucideIcon

  const anyIcon: LucideIcon
  export default anyIcon
}

declare module '*.svg' {
  const content: string
  export default content
}
