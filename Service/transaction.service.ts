import { MemberRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/member.repositoryinterface'
import { PointRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/point.repositoryinterface'
import { PointTypeRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/pointtype.repositoryinterface'
import { TransactionRepositoryInterface } from '../RepositoryInterface/transaction.repositoryinterface'

import { TransactionEntity } from '../Entity/transaction.entity'
import { PointService } from '../../LoyaltyCore/Service/point.service'

export class TransactionService {

	protected MemberRepo: MemberRepositoryInterface
	protected PointRepo: PointRepositoryInterface
	protected RateRepo: PointTypeRepositoryInterface
	protected TrxRepo: TransactionRepositoryInterface

	constructor (
		MemberRepo: MemberRepositoryInterface,
		PointRepo: PointRepositoryInterface,
		RateRepo: PointTypeRepositoryInterface,
		TrxRepo: TransactionRepositoryInterface
	) {
		this.MemberRepo = MemberRepo
		this.PointRepo = PointRepo
		this.RateRepo = RateRepo
		this.TrxRepo = TrxRepo
	}

	public async submit (trx: TransactionEntity): Promise <number> {
		try {
			let MidTrxId = await this.TrxRepo.insert (trx)

			let Member = await this.MemberRepo.findOne (trx.getMember ())
			Member.submitSpending (trx)
			await this.MemberRepo.save (Member)
	
			let point = new PointService (this.MemberRepo, this.PointRepo, this.RateRepo)
			await point.earn ({
				Member: trx.getMember (),
				RawAmount: trx.getSpending (),
				ActivityCode: 'TRANSACTION',
				Reference: MidTrxId,
			})
	
			return MidTrxId
		} catch (e) {
			throw new Error (e)
		}
	}

	public async cancel (trx: TransactionEntity): Promise <boolean> {
		try {
			let Canceler = new TransactionEntity ()
			Canceler.createCanceler (trx)
	
			let Point = new PointService (this.MemberRepo, this.PointRepo, this.RateRepo)
			await Point.cancel ({Reference: trx.getId (), Activity: 'TRANSACTION'})
	
			let Member = await this.MemberRepo.findOne (trx.getMember ())
			Member.submitSpending (Canceler)
			await this.MemberRepo.save (Member)
	
			await this.TrxRepo.delete (trx.getId ())
			return true
		} catch (e) {
			throw new Error (e)
		}
	}

}