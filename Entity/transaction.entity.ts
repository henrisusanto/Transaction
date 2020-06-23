interface TrxJSON {
	Id?: number
	Member: number
	TrxId: string
	Time: Date
	Spending: number
}

interface TrxFactory {
	Member: number
	TrxId: string
	Spending: number
}

export interface TrxReport {
	Id?: number,
	TrxId: string,
	Time: Date,
	Member: string,
	Spending: number,
	Points: []
}

export interface TrxHistory {
	Id?: number,
	TrxId: string,
	Time: Date,
	Spending: number
}

export class TransactionEntity {
	protected Id?: number
	protected Member: number
	protected TrxId: string
	protected Time: Date
	protected Spending: number

	public create (data: TrxFactory): void {
		this.Member = data.Member
		this.TrxId = data.TrxId
		this.Time = new Date ()
		this.Spending = data.Spending
	}

	public createCanceler (trxToCancel): void {
		this.Member = trxToCancel.getMember ()
		this.Time = new Date ()
		this.Spending = trxToCancel.getSpending () * -1
	}

	public toReport (Member): TrxReport {
		return {
			Id: this.Id,
			TrxId: this.TrxId,
			Time: this.Time,
			Member: Member.getFullName (),
			Spending: this.Spending,
			Points: []
		}
	}

	public toHistory (): TrxHistory {
		return {
			Id: this.Id,
			TrxId: this.TrxId,
			Time: this.Time,
			Spending: this.Spending
		}
	}

	public getId (): number {
		return this.Id || 0
	}

	public getSpending (): number {
		return this.Spending
	}

	public getMember (): number {
		return this.Member
	}

	public fromJSON (json: TrxJSON): void {
		this.Id = json.Id
		this.Member = json.Member
		this.TrxId = json.TrxId
		this.Time = json.Time
		this.Spending = json.Spending
	}

	public toJSON (): TrxJSON {
		return {
			Id: this.Id,
			Member: this.Member,
			TrxId: this.TrxId,
			Time: this.Time,
			Spending: this.Spending,
		}
	}

}