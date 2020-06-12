import { TransactionRepositoryInterface } from '../RepositoryInterface/transaction.repositoryinterface'
import { TrxHistory } from '../Entity/transaction.entity'
import { Transaction } from 'typeorm'

export class ClientGetMemberTransactionHistoryUsecase {

    protected trxRepo: TransactionRepositoryInterface

    constructor (trxRepo: TransactionRepositoryInterface) {
        this.trxRepo = trxRepo
    }

    public async execute (Member: number):Promise <TrxHistory []> {
        try {
            let transactions = await this.trxRepo.findByMember (Member)
            return transactions.map (transaction => transaction.toHistory ())
        } catch (e) {
            throw new Error (e)
        }
    }
}