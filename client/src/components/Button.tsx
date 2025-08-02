import type { ReactElement } from "react"

export interface ButtonProps{
  variant:"primary" | "secondary"
  text:string
  size:"sm" | "md" | "lg"
  startIcon?:ReactElement
  endIcon?:ReactElement
  onclick?:()=>void
}

const variantClasses={
  primary:"bg-blue-600 text-white",
  secondary:"bg-blue-300 text-blue-600"
}

const constant={
  sm:"px-2 py-2 text-sm",
  md:"px-4 py-2 text-md",
  lg:"px-6 py-2 text-lg"
}

const defaultVariant = "flex items-center rounded-lg"


export const Button=(props:ButtonProps)=>{
  return (
    <button className={`${defaultVariant} ${constant[props.size]} ${variantClasses[props.variant]}`}>
     {props.startIcon?<div className="pr-2">{props.startIcon}</div>:""}
     {props.text}
     {props.endIcon?<div className="pl-2">{props.endIcon}</div>:""}
    </button>
  )
}