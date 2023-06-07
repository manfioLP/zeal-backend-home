import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import { computeHandler } from "./controllers/quest";

class App {
    public app: Express;
    private port: number;
    private connection: Server | undefined;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.routes();
        this.start();
    }

    private routes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('backend-take-home-test');
        });

        this.app.get('/health', (req: Request, res: Response) => {
            return res.json({status: 'ok', success: true})
        });

        this.app.post('/compute', computeHandler)
    }

    private start(): void {
        this.connection = this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    public close(): void {
        if (this.connection) {
            this.connection.close();
            console.log("Application stopped");
        }
    }
}

export default App;