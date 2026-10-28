export const money = (value:number) => `${new Intl.NumberFormat('fr-DZ',{maximumFractionDigits:2}).format(Number(value)||0)} DA`
// Plaque algérienne standard: numéro de série (1 à 6 chiffres), 3 chiffres type/année, wilaya (2 chiffres).
export const normalizePlate = (value:string) => value.replace(/\D/g,'').slice(0,11)
export const validPlate = (value:string) => /^[0-9]{1,6}[0-9]{3}(0[1-9]|[1-4][0-9]|5[0-8])$/.test(normalizePlate(value))
export const nicePlate = (value:string) => {const s=normalizePlate(value);return s.length>=6?`${s.slice(0,-5)} ${s.slice(-5,-2)} ${s.slice(-2)}`:s}
export const today = () => new Date().toLocaleDateString('en-CA')
