import type { TrainingItemListDTO } from "./trainingitem"

export interface TrainingPlanListDTO {
  id: string
  marathonName: string
  startDate: string
  endDate: string
  status: string
  items: TrainingItemListDTO[]
}
