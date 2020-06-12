import { TransactionEntity } from '../Entity/transaction.entity'

export interface ReportParameters {
	Limit: number
	Offset: number
	Since: Date
	Until: Date,
	Sort: string,
	SortType: string
}

export interface TransactionRepositoryInterface {
	insert (data: TransactionEntity): Promise <number>
	update (data: TransactionEntity): Promise <number>
	delete (Id: number): Promise <boolean>
	findByMember (Member: number): Promise <TransactionEntity []>
	findById (Id: number): Promise <TransactionEntity>
	getReport (parameter: ReportParameters): Promise <{ TotalRecord: number, TotalSpending: number, Result: TransactionEntity [] }>
}