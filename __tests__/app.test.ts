import request from 'supertest';
import App from '../app';

describe('App tests', () => {
    let app: App;

    beforeAll(() => {
        const port = 3000;
        app = new App(port);
    })

    afterAll(() => {
        app.close();
    })

    test('GET / should return "Healthy"', async () => {
        const response = await request(app.app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('backend-take-home-test');
        return;
    });

    test('GET /health should return status ok and success true', async () => {
        const res = await request(app.app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true, status: 'ok' });
        return;
    });

});
