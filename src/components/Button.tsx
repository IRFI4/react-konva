import type {FC, PropsWithChildren } from 'react'

interface ButtonProps extends PropsWithChildren {
    active?: boolean
    onClick: () => void
    className?: string
}

const Button: FC<ButtonProps> = ({ active, onClick, className, children}) => {
  return (
    <button className={active ? `button-active ${className}` : `${className}`}
        onClick={onClick}>
        {children}
    </button>
  )
}

export default Button