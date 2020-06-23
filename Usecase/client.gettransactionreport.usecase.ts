import { TransactionRepositoryInterface, ReportParameters } from '../RepositoryInterface/transaction.repositoryinterface'
import { MemberRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/member.repositoryinterface'
import { PointRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/point.repositoryinterface'
import { PointTypeRepositoryInterface } from '../../LoyaltyCore/RepositoryInterface/pointtype.repositoryinterface'
import { TransactionService } from '../Service/transaction.service'

export class ClientGetTransactionReportUsecase {

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

        let Service = new TransactionService (this.memberRepo, this.pointRepo, this.pointTypeRepo, this.trxRepo)

        let reportJSON = {
            Limit: parameter.Limit.toString (),
            Offset: parameter.Offset.toString (),
            TotalRecord,
            TotalSpending,
            Records: await Service.report (Result)
        }
    
        return reportJSON
    }
}