export type Vehicle = {
  id: string
  user_id: string
  registration: string
  brand: string
  model: string
  year: number | null
  mileage: number
  purchase_price: number
  purchase_date: string | null
  status: 'available' | 'rented' | 'maintenance' | 'inactive'
  notes: string | null
  created_at: string
  updated_at: string
}

export type Maintenance = {
  id: string
  user_id: string
  vehicle_id: string
  title: string
  description: string | null
  due_date: string | null
  due_mileage: number | null
  completed_at: string | null
  cost: number
  notify_days_before: number
  created_at: string
  vehicles?: Pick<Vehicle, 'brand'|'model'|'registration'|'mileage'> | null
}
