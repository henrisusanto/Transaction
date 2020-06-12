import { TransactionRepositoryInterface } from '../RepositoryInterface/transaction.repositoryinterface'
import { MemberRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/member.repositoryinterface'
import { TrxReport } from '../Entity/transaction.entity'

export class ClientGetTransactionUsecase {

    protected trxRepo: TransactionRepositoryInterface
    protected memberRepo: MemberRepositoryInterface

    constructor (trxRepo: TransactionRepositoryInterface, memberRepo: MemberRepositoryInterface) {
        this.trxRepo = trxRepo
        this.memberRepo = memberRepo
    }

    public async execute (Id: number):Promise <TrxReport> {
        try {
            let transaction = await this.trxRepo.findById (Id)
            let member = await this.memberRepo.findOne (transaction.getMember ())
            return transaction.toReport ([member])
        } catch (e) {
            throw new Error (e)
        }
    }
}