import { Redirect } from "expo-router"
import { useAuth } from "@/hooks/useAuth"

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth()

  
  
  if (isLoading) {
    return null
  }
  

 
  return isAuthenticated ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/onboarding" />
  )
}