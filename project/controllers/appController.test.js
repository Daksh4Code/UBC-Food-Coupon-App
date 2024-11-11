const request = require('supertest');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const appService = {
    testOracleConnection: jest.fn().mockResolvedValue(true),
    fetchDemotableFromDb: jest.fn().mockResolvedValue([]),
    initiateDemotable: jest.fn().mockResolvedValue(true),
    initializeSQLTables: jest.fn().mockResolvedValue(true),
    withOracleDB: jest.fn((callback) => callback({
        execute: jest.fn().mockResolvedValue({ rows: [{ id: 1 }] })
    }))
};

const router = express.Router();

router.get('/check-db-connection', async (req, res) => {
    try {
        const isConnect = await appService.testOracleConnection();
        res.send(isConnect ? 'connected' : 'unable to connect');
    } catch (error) {
        console.error('DB connection error:', error);
        res.status(500).send('DB connection error');
    }
});

app.use('/api', router);

describe('appController', () => {
    it('should respond with connected status', async () => {
        const res = await request(app).get('/api/check-db-connection');
        expect(res.text).toBe('connected');
        expect(res.statusCode).toBe(200);
    });

});

describe('appController', () => {
    it('should respond with connected status', async () => {
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