/* eslint-disable no-undef,no-unused-expressions */
// @flow
import chai from 'chai';
import { MethodClient, Environments } from '../../src';
import type { TPaymentResponse } from '../../src/lib/payments/types';
import type { TAccountResponse } from '../../src/lib/accounts/types';
import type { TEntityResponse } from '../../src/lib/entities/types';

chai.should();

const client = new MethodClient({ key: process.env.TEST_CLIENT_KEY, env: Environments.dev });

describe('Payments - core methods tests', () => {
  let holder_1_response: ?TEntityResponse = null;
  let source_1_response: ?TAccountResponse = null;
  let destination_1_response: ?TAccountResponse = null;

  let payments_create_response: ?TPaymentResponse = null;
  let payments_get_response: ?TPaymentResponse = null;
  let payments_list_response: ?Array<TPaymentResponse> = null;
  let payments_delete_response: ?TPaymentResponse = null;

  before(async () => {
    holder_1_response = await client.entities.create({
      type: 'individual',
      individual: {
        first_name: 'Kevin',
        last_name: 'Doyle',
        dob: '1930-03-11',
        email: 'kevin.doyle@gmail.com',
        phone: '+16505555555',
      },
    });
    source_1_response = await client.accounts.create({
      holder_id: holder_1_response.id,
      ach: {
        routing: '062103000',
        number: '123456789',
        type: 'checking',
      },
    });
    destination_1_response = await client.accounts.create({
      holder_id: holder_1_response.id,
      liability: {
        mch_id: 'mch_3',
        account_number: '123456789',
      },
    });
  });

  describe('payments.create', () => {
    it('should successfully create a payment.', async () => {
      payments_create_response = await client.payments.create({
        amount: 5000,
        source: source_1_response.id,
        destination: destination_1_response.id,
        description: 'MethodNode',
      }, { idempotency_key: Math.random().toString() });

      (payments_create_response !== null).should.be.true;
    });
  });

  describe('payments.get', () => {
    it('should successfully get a payment.', async () => {
      payments_get_response = await client.payments.get(payments_create_response.id);

      (payments_get_response !== null).should.be.true;
    });
  });

  describe('payments.list', () => {
    it('should successfully list payments.', async () => {
      payments_list_response = await client.payments.list();

      (payments_list_response !== null).should.be.true;
      Array.isArray(payments_list_response).should.be.true;
    });
  });

  describe('payments.delete', () => {
    it('should successfully delete a payment.', async () => {
      payments_delete_response = await client.payments.delete(payments_create_response.id);

      (payments_delete_response !== null).should.be.true;
    });
  });
});
