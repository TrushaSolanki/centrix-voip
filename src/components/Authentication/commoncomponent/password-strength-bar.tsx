import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

// Define the props for the PasswordStrengthBar component
interface PasswordStrengthBarProps {
  password: string;
  isVisible: boolean;
}

// Function to calculate password strength
const calculatePasswordStrength = (password: string): number => {
  // If password is empty, return 0 to avoid showing strength for empty input
  if (password.length === 0) return 0

  let strength = 0
  
  // Check password length
  if (password.length >= 8) strength += 25
  
  // Check for numbers
  if (/\d/.test(password)) strength += 25
  
  // Check for lowercase letters
  if (/[a-z]/.test(password)) strength += 25
  
  // Check for uppercase letters
  if (/[A-Z]/.test(password)) strength += 25
  
  return strength
}

// Function to get color based on strength
const getColorForStrength = (strength: number): string => {
  if (strength === 0) return "bg-gray-200" // No password entered
  if (strength < 50) return "bg-red-500"
  if (strength < 75) return "bg-yellow-500"
  return "bg-green-500"
}

// Function to get strength label
const getStrengthLabel = (strength: number): string => {
  if (strength === 0) return "Enter a password"
  if (strength < 50) return "Weak"
  if (strength < 75) return "Medium"
  return "Strong"
}

export function PasswordStrengthBar({ password, isVisible }: PasswordStrengthBarProps) {
  const [strength, setStrength] = useState(0)

  useEffect(() => {
    setStrength(calculatePasswordStrength(password))
  }, [password])

  if (!isVisible) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Progress 
        value={strength} 
        className={`h-2 ${getColorForStrength(strength)}`} 
        aria-label="Password strength"
      />
      <p className="text-sm text-muted-foreground">
        Password strength: {getStrengthLabel(strength)}
      </p>
    </div>
  )
}