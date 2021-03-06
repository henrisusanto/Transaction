import { MemberRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/member.repositoryinterface'
import { PointRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/point.repositoryinterface'
import { PointTypeRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/pointtype.repositoryinterface'
import { TransactionRepositoryInterface } from '../RepositoryInterface/transaction.repositoryinterface'
import { TransactionService } from '../Service/transaction.service'
import { TransactionEntity } from '../Entity/transaction.entity'

export class ClientSubmitTransactionUsecase {

    protected memberRepo: MemberRepositoryInterface
    protected pointRepo: PointRepositoryInterface
    protected pointTypeRepo: PointTypeRepositoryInterface
    protected trxRepo: TransactionRepositoryInterface

    constructor (
        memberRepo: MemberRepositoryInterface,
        pointRepo: PointRepositoryInterface,
        pointTypeRepo: PointTypeRepositoryInterface,
        trxRepo: TransactionRepositoryInterface
    ) {
        this.memberRepo = memberRepo
        this.pointRepo = pointRepo
        this.pointTypeRepo = pointTypeRepo
        this.trxRepo = trxRepo
    }

    public async execute (Member: number, TrxId: string, Spending: number):Promise <number> {
        try {
            let service = new TransactionService (this.memberRepo, this.pointRepo, this.pointTypeRepo, this.trxRepo)
            let transaction = new TransactionEntity ()
            transaction.create ({
                Member,
                TrxId,
                Spending
            })
            return await service.submit (transaction)
        } catch (e) {
            throw new Error (e)
        }  
    }
}