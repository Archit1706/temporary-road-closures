import { describe, it, expect, vi, afterEach } from 'vitest';
import axios from 'axios';
import { ValhallaAPI, ValhallaResponse, ValhallaRequest } from '../services/valhallaApi';

describe('getRoute', () => {
    const api = new ValhallaAPI();

    const request: ValhallaRequest = {
        locations: [
            { lat: 52, lon: 13, type: 'break' },
            { lat: 52.5, lon: 13.4, type: 'break' }
        ],
        costing: 'auto'
    };

    afterEach(() => {
        vi.clearAllMocks(); // Reset mocks between tests
    });

    it('returns data when axios.post resolves', async () => {
        // Mock response
        const mockValhallaResponse: ValhallaResponse = {
            trip: {
                locations: [],
                legs: [],
                summary: {
                    has_time_restrictions: false,
                    has_toll: false,
                    has_highway: false,
                    has_ferry: false,
                    min_lat: 0,
                    min_lon: 0,
                    max_lat: 0,
                    max_lon: 0,
                    time: 0,
                    length: 0,
                    cost: 0
                },
                status: 0,
                status_message: 'OK',
                units: 'kilometers'
            }
        };

        // Mock axios.post
        (axios.post as any) = vi.fn().mockResolvedValue({ data: mockValhallaResponse });

        const result = await api.getRoute(request);

        expect(result).toEqual(mockValhallaResponse);
    });

    it('throws a timeout error when axios times out', async () => {
        (axios.post as any) = vi.fn().mockRejectedValue({ 
            isAxiosError: true,
            code: 'ECONNABORTED' 
        });

        await expect(api.getRoute(request)).rejects.toThrow('Routing request timed out. Please try again.');
    });

    it('throws correct error message according to response code', async () => {
        (axios.post as any) = vi.fn().mockRejectedValue({
            isAxiosError: true,
            response: { status: 400 }
        });

        const request: ValhallaRequest = {
            locations: [],
            costing: 'auto'
        };

        await expect(api.getRoute(request)).rejects.toThrow('Invalid routing request. Please check your selected points.');
    });
});