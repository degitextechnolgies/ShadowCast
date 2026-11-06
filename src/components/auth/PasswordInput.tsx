import { useState, forwardRef } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = 'Password', error, hint, className = '', id = 'password', ...props }, ref) => {
    const [show, setShow] = useState(false)

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <div className="flex items-center justify-between">
            <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {label}
            </label>
            {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
          </div>
        )}

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-400 transition-colors">
            <Lock size={16} />
          </div>

          <input
            {...props}
            ref={ref}
            id={id}
            type={show ? 'text' : 'password'}
            className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-900/70 border text-sm text-white placeholder-slate-500
              backdrop-blur-md transition-all duration-200 outline-none
              ${
                error
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-800/90 hover:border-slate-700 focus:border-purple-500/80 focus:ring-2 focus:ring-purple-500/20'
              } ${className}`}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <p className="text-[11px] text-red-400 font-medium tracking-wide flex items-center gap-1 animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

