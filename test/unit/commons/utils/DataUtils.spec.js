'use strict';

const TestBase = require('test/unit/TestBase');
const UserModel = require('src/api/modules/users/models/User.model');

class DataUtilsTest extends TestBase {
  constructor() {
    super('src/commons/utils/DataUtils');
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
      expect(this.controller.getFieldsOfSchema(UserModel)).toContainEqual({ key: 'name', type: 'string' });
    });

    const formats = [
      {
        format: 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ',
        date: '2020-02-26T12:58:25.085Z'
      },
      {
        format: 'YYYY-MM-DD',
        date: '2020-02-26'
      },
      {
        format: 'YYYY-MM-DD[T]HH:mm:ss',
        date: '2020-02-26T12:58:25'
      },
      {
        format: 'DD/MM/YYYY HH:mm:ss',
        date: '26/12/2020 12:58:25'
      },
      {
        format: 'DD/MM/YYYY HH:mm',
        date: '26/12/2020 12:58'
      },
      {
        format: 'YYYY-MM-DD[T]HH:mm',
        date: '2020-02-26T12:58'
      },
      {
        format: 'DD/MM/YYYY',
        date: '26/12/2020'
      }
    ];

    for (const format of formats) {
      it(`should get date format ${format.format}`, () => {
        expect(this.controller.getDateFormat(format.date)).toEqual(format.format);
      });
    }
  }
}

new DataUtilsTest().run();
