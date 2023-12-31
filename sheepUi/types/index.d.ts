import { SetStateAction } from 'react'

export type SheepData = {
	id: number
	level: number
}

export type SheepProps = {
	data: SheepData
	active: boolean
	removeSheep: (id: number, action: 'right' | 'left') => void
	tapCard: (id: number) => void
	shipCard: (id: number) => void
}

export type SwipeButtonProps = {
	exit: (value: SetStateAction<number>) => void
	removeSheep: (id: number, action: 'right' | 'left') => void
	id: number
}

export type MintProps = {
	sheep: SheepData[]
	setSheep: (value: SetStateAction<SheepData[]>) => void
}
