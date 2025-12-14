import type {FC, PropsWithChildren } from 'react'

interface ButtonProps extends PropsWithChildren {
    active: boolean
    onClick: () => void
}

const Button: FC<ButtonProps> = ({ active, onClick, children}) => {
  return (
    <button className={active ? 'button-active' : ''}
        onClick={onClick}>
        {children}
    </button>
  )
}

export default Button