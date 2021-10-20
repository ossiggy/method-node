import Resource, { IRequestConfig } from '../../resource';
import Configuration from '../../configuration';
import Verification from '../Verification';

export const AccountTypes = {
   ach: 'ach',
   liability: 'liability',
}

export type TAccountTypes =
  | 'ach'
  | 'liability';

export const AccountSubTypes = {
   savings: 'savings',
   checking: 'checking',
}

export type TAccountSubTypes =
  | 'savings'
  | 'checking';

export interface IAccountACH {
  routing: string;
  number: string;
  type: TAccountSubTypes;
}

export type IAccountLiability = {
  mch_id: string;
  mask: string;
};

export interface IAccount {
  id: string;
  holder_id: string;
  type: TAccountTypes;
  ach: IAccountACH | null;
  liability: IAccountLiability | null;
  created_at: string;
  updated_at: string;
  metadata: {} | null;
}

export interface IAccountCreateOpts {
  holder_id: string;
  metadata?: {};
}

export interface IACHCreateOpts extends IAccountCreateOpts {
  ach: IAccountACH
}

export interface ILiabilityCreateOpts extends IAccountCreateOpts {
  liability: {
    mch_id: string,
    account_number: string,
  }
}

export interface IAccountListOpts {
  holder_id?: string;
}

class AccountSubResources {
  verification: Verification;

  constructor(id: string, config: Configuration) {
    this.verification = new Verification(config.addPath(id));
  }
}

export default class Account extends Resource<AccountSubResources> {
  constructor(config: Configuration) {
    super(config.addPath('accounts'));
  }

  // @ts-ignore
  private _call(id): AccountSubResources {
    return new AccountSubResources(id, this.config);
  }

  async get(id: string) {
    return super._getWithId<IAccount>(id);
  }

  async list(opts?: IAccountListOpts) {
    return super._list<IAccount, IAccountListOpts>(opts);
  }

  async create(data: IACHCreateOpts | ILiabilityCreateOpts, requestConfig?: IRequestConfig) {
    return super._create<IAccount, IACHCreateOpts | ILiabilityCreateOpts>(data, requestConfig);
  }
}
