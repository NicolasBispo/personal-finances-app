import { Planner } from "@/types/planner"
import { createContext, useCallback, useContext, useState } from "react"

type PlannerContextType = {
    planner: Planner | null
    setPlanner: (planner: Planner) => void
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined)

export const PlannerProvider = ({ children }: { children: React.ReactNode }) => {
  const [planner, setPlannerState] = useState<Planner | null>(null)

  const setPlanner = useCallback((newPlanner: Planner) => {
    setPlannerState(newPlanner)
  }, [])

  return (
    <PlannerContext.Provider value={{ planner, setPlanner }}>
      {children}
    </PlannerContext.Provider>
  )
}

export const usePlanner = () => {
  const context = useContext(PlannerContext)
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider')
  }
  return context
}