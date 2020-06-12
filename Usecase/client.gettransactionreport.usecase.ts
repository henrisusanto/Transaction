import { TransactionRepositoryInterface, ReportParameters } from '../RepositoryInterface/transaction.repositoryinterface'
import { MemberRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/member.repositoryinterface'

export class ClientGetTransactionReportUsecase {

    protected trxRepo: TransactionRepositoryInterface
    protected memberRepo: MemberRepositoryInterface

    constructor (trxRepo: TransactionRepositoryInterface, memberRepo: MemberRepositoryInterface) {
        this.trxRepo = trxRepo
        this.memberRepo = memberRepo
    }

	public async execute (RecordPerPage: number, CurrentPage: number, Since: Date, Until: Date) {
        RecordPerPage = RecordPerPage || 5
        CurrentPage = CurrentPage || 1
        Until = Until || new Date ()
        const parameter: ReportParameters = {
          Limit: RecordPerPage,
          Offset: (CurrentPage - 1) * RecordPerPage,
          Since,
          Until,
          Sort: 'Time',
          SortType: 'ASC'
        }

        const { TotalRecord, TotalSpending, Result } = await this.trxRepo.getReport (parameter)

        let MemberIds: number[] = Result
            .map (transaction => transaction.getMember ())
            .filter((value, index, self) => self.indexOf(value) === index)
        let Members = await this.memberRepo.findByIDs (MemberIds)
        let MemberNames: string [] = []
        Members.forEach (member => {
            MemberNames[member.getId ()] = member.getFullName ()
        })

        let reportJSON = {
            Limit: parameter.Limit.toString (),
            Offset: parameter.Offset.toString (),
            TotalRecord,
            TotalSpending,
            Records: Result.map (transaction => {
                return transaction.toReport (MemberNames)
            })
        }
    
        return reportJSON
    }
}