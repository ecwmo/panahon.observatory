export {}

declare global {
  interface ButtonProps {
    val: number | string
    text: string
  }

  interface CardProps {
    title: string
    label1?: string
    value1: string
    label2?: string
    value2?: string
    iconName: string
    iconName2?: string
  }
}
