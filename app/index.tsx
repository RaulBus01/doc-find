import { Redirect } from "expo-router"
import { useAuth } from "@/hooks/useAuth"

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return null
  }
  
  console.log("Index component rendered, isAuthenticated:", isAuthenticated)
 
  return isAuthenticated ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/login" />
  )
}