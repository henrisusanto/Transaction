import { MemberRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/member.repositoryinterface'
import { PointRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/point.repositoryinterface'
import { PointTypeRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/pointtype.repositoryinterface'
import { TransactionRepositoryInterface } from '../RepositoryInterface/transaction.repositoryinterface'

import { TransactionEntity } from '../Entity/transaction.entity'
import { PointService } from '../../LoyaltyCore/Service/point.service'

export class TransactionService {

	protected MemberRepo: MemberRepositoryInterface
	protected PointRepo: PointRepositoryInterface
	protected PointTypeRepo: PointTypeRepositoryInterface
	protected TrxRepo: TransactionRepositoryInterface

	constructor (
		MemberRepo: MemberRepositoryInterface,
		PointRepo: PointRepositoryInterface,
		PointTypeRepo: PointTypeRepositoryInterface,
		TrxRepo: TransactionRepositoryInterface
	) {
		this.MemberRepo = MemberRepo
		this.PointRepo = PointRepo
		this.PointTypeRepo = PointTypeRepo
		this.TrxRepo = TrxRepo
	}

	public async submit (trx: TransactionEntity): Promise <number> {
		try {
			let MidTrxId = await this.TrxRepo.insert (trx)

			let Member = await this.MemberRepo.findOne (trx.getMember ())
			Member.submitTransaction (trx)
			await this.MemberRepo.save (Member)
	
			let point = new PointService (this.MemberRepo, this.PointRepo, this.PointTypeRepo)
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
	
			let Point = new PointService (this.MemberRepo, this.PointRepo, this.PointTypeRepo)
			await Point.cancel ({Reference: trx.getId (), Activity: 'TRANSACTION'})
	
			let Member = await this.MemberRepo.findOne (trx.getMember ())
			Member.cancelTransaction (Canceler)
			await this.MemberRepo.save (Member)
	
			await this.TrxRepo.delete (trx.getId ())
			return true
		} catch (e) {
			throw new Error (e)
		}
	}

	public async report (transactions: TransactionEntity[]): Promise <{}[]> {
		let trxIDs = transactions.map (trx => trx.getId ())

		let memberIDs = transactions
			.map (transaction => transaction.getMember ())
			.filter((value, index, self) => self.indexOf(value) === index)
		var members = await this.MemberRepo.findByIDs (memberIDs)

		var points = await this.PointRepo.findByReferences ({References: trxIDs, Activity: 'TRANSACTION'})

		let trxPointIDs = points.map (point => point.getId ())
		let childs = await this.PointRepo.findByParents (trxPointIDs)
		points = points.concat (childs)
		let pointTypeCodes = points
			.map (point => point.getActivity ())
			.filter((value, index, self) => self.indexOf(value) === index)
		var pointTypes = await this.PointTypeRepo.findByCodes (pointTypeCodes)

		return transactions.map (trx => {
			let member = members.filter (member => member.getId () === trx.getMember ())
			let report = trx.toReport (member[0])
			report.Points = points
				.filter (point => trx.getId () === point.getReference ())
				.map (point => {
					let trxPoint = point.toTransaction ()
					let Activities = pointTypes.filter (ptype => ptype.getCode () === point.getActivity ())
					trxPoint.Activity = Activities[0].getDescription ()
					return trxPoint
				})
			return report
		})

	}
}