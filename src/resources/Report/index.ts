import Resource, { IRequestConfig } from '../../resource';
import Configuration from '../../configuration';

export const ReportTypes = {
  payments_created_current: 'payments.created.current',
  payments_created_previous: 'payments.created.previous',
  payments_updated_current: 'payments.updated.current',
  payments_updated_previous: 'payments.updated.previous',
  ach_pull_upcoming: 'ach.pull.upcoming',
  ach_pull_previous: 'ach.pull.previous',
  ach_pull_nightly: 'ach.pull.nightly',
  ach_reversals_nightly: 'ach.reversals.nightly',
};

export type TReportTypes =
  | 'payments.created.current'
  | 'payments.created.previous'
  | 'payments.updated.current'
  | 'payments.updated.previous'
  | 'ach.pull.upcoming'
  | 'ach.pull.previous'
  | 'ach.pull.nightly'
  | 'ach.reversals.nightly';

export const ReportStatuses = {
   completed: 'completed',
}

export type TReportStatuses =
  | 'completed';

export interface IReport {
  id: string;
  team_id: string;
  type: TReportTypes;
  url: string;
  status: TReportStatuses;
  metadata: {} | null;
  created_at: string;
  updated_at: string;
}

export interface IReportCreateOpts {
  team_id: string,
  type: TReportTypes;
  metadata?: {};
}

export default class Report extends Resource {
  constructor(config: Configuration) {
    super(config.addPath('reports'));
  }

  async get(id: string) {
    return super._getWithId<IReport>(id);
  }

  async create(opts: IReportCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IReport, IReportCreateOpts>(opts, requestConfig);
  }

  async download(id: string) {
    return super._download<string>(id);
  }
};
