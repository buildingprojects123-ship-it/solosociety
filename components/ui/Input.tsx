import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  as?: 'input' | 'textarea'
  rows?: number
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, error, helperText, className, as = 'input', rows, ...props }, ref) => {
    const Component = as === 'textarea' ? 'textarea' : 'input'
    
    return (
      <div className="w-full">
        {label && (
          <label className="label">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <Component
          ref={ref as any}
          className={cn(
            'input',
            as === 'textarea' && 'resize-none',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          rows={as === 'textarea' ? rows : undefined}
          {...(props as any)}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600 animate-fade-in">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

