export interface TrainingItemListDTO {
  date: string

  targetDistance: number | null
  actualDistance: number | null

  targetTime: string | null
  actualTime: string | null

  status: string
  id: string;
}
