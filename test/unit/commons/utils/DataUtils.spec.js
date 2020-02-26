'use strict';

const TestBase = require('../../TestBase');
const TemplateModel = require('../../../../src/models/Template.model');

class DataUtilsTest extends TestBase {
  constructor() {
    super('../../src/commons/utils/DataUtils');
  }

  test() {
    it('should format data with type Date', () => {
      const data = '2020-02-26T12:58:25.085-03:00';
      expect(this.controller.format(data, 'Date')).toEqual(data);
    });

    it('should format data with type Date without format', () => {
      const data = '22/12/2020 12-12';
      expect(this.controller.format(data, 'Date')).toEqual(data);
    });

    it('should format data with type Number', () => {
      const data = 1;
      expect(this.controller.format(data, 'Number')).toEqual(data);
    });

    it('should format data with type Number without format', () => {
      const data = '22/';
      expect(this.controller.format(data, 'Number')).toEqual(data);
    });

    it('should get fields from Model', () => {
      expect(this.controller.getFieldsOfSchema(TemplateModel)).toContainEqual({ key: 'name', type: 'string' });
    });

    it('should get date format YYYY-MM-DD[T]HH:mm:ss.SSS[Z]', () => {
      expect(this.controller.getDateFormat('2020-02-26T12:58:25.085Z')).toEqual('YYYY-MM-DD[T]HH:mm:ss.SSSZZ');
    });

    it('should get date format YYYY-MM-DD', () => {
      expect(this.controller.getDateFormat('2020-02-26')).toEqual('YYYY-MM-DD');
    });

    it('should get date format YYYY-MM-DD[T]HH:mm:ss', () => {
      expect(this.controller.getDateFormat('2020-02-26T12:58:25')).toEqual('YYYY-MM-DD[T]HH:mm:ss');
    });

    it('should get date format DD/MM/YYYY HH:mm:ss', () => {
      expect(this.controller.getDateFormat('26/12/2020 12:58:25')).toEqual('DD/MM/YYYY HH:mm:ss');
    });

    it('should get date format DD/MM/YYYY HH:mm', () => {
      expect(this.controller.getDateFormat('26/12/2020 12:58')).toEqual('DD/MM/YYYY HH:mm');
    });

    it('should get date format YYYY-MM-DD[T]HH:mm', () => {
      expect(this.controller.getDateFormat('2020-02-26T12:58')).toEqual('YYYY-MM-DD[T]HH:mm');
    });

    it('should get date format DD/MM/YYYY', () => {
      expect(this.controller.getDateFormat('26/12/2020')).toEqual('DD/MM/YYYY');
    });
  }
}

new DataUtilsTest().run();
