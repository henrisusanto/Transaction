import { MemberRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/member.repositoryinterface'
import { PointRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/point.repositoryinterface'
import { PointTypeRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/pointtype.repositoryinterface'
import { TransactionRepositoryInterface } from '../RepositoryInterface/transaction.repositoryinterface'
import { TransactionService } from '../Service/transaction.service'
import { TransactionEntity } from '../Entity/transaction.entity'

export class ClientCancelTransactionUsecase {

    protected memberRepo: MemberRepositoryInterface
    protected pointRepo: PointRepositoryInterface
    protected rateRepo: PointTypeRepositoryInterface
    protected trxRepo: TransactionRepositoryInterface

    constructor (
        memberRepo: MemberRepositoryInterface,
        pointRepo: PointRepositoryInterface,
        rateRepo: PointTypeRepositoryInterface,
        trxRepo: TransactionRepositoryInterface
    ) {
        this.memberRepo = memberRepo
        this.pointRepo = pointRepo
        this.rateRepo = rateRepo
        this.trxRepo = trxRepo
    }

    public async execute (Id: number):Promise <number> {
        try {
            let service = new TransactionService (this.memberRepo, this.pointRepo, this.rateRepo, this.trxRepo)
            let trxToCancel = await this.trxRepo.findById (Id)
            await service.cancel (trxToCancel)
            return Id
        } catch (e) {
            throw new Error (e)
        }  
    }
}