jest.mock('../things');

import * as thingsService from '../things';
const mockedThingsService = thingsService as jest.Mocked<typeof thingsService>;

import { getHandler } from './areas';

describe('areas routes', () => {

    describe('get method', () => {
        it('should fetch areas from things service', () => {
            getHandler();
            expect(mockedThingsService.getAreas).toHaveBeenCalled();
        });

        it('should return fetched areas as an array of ThingsAreas', async () => {
            mockedThingsService.getAreas.mockResolvedValueOnce([{
                uuid: '0123456789',
                title: 'area title'
            }])

            const result = await getHandler();
            expect(result).toEqual([{
                uuid: '0123456789',
                title: 'area title'
            }]);
        });
    });
    
});