const request = require('supertest');
const express = require('express');
const app = require('./appController');  // Pointing to appController.js
const appService = require('../utils/appService'); // Correct path for service layer

// Mock implementation setup
beforeEach(() => {
    appService.testOracleConnection = jest.fn().mockResolvedValue(true);
});

describe('appController', () => {
    it('should respond with "connected" status', async () => {
        const res = await request(app).get('/api/check-db-connection');
        expect(res.text).toBe('connected');
        expect(res.statusCode).toBe(200);
    });

    it('should respond with error on connection failure', async () => {
        appService.testOracleConnection.mockRejectedValueOnce(new Error('Connection failed'));

        const res = await request(app).get('/api/check-db-connection');
        expect(res.text).toBe('DB connection error');
        expect(res.statusCode).toBe(500);
    });
});