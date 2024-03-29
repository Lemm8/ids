"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cliente_1 = __importDefault(require("../routes/cliente"));
const usuario_1 = __importDefault(require("../routes/usuario"));
const tecnico_1 = __importDefault(require("../routes/tecnico"));
const servicio_1 = __importDefault(require("../routes/servicio"));
const pedido_1 = __importDefault(require("../routes/pedido"));
const auth_1 = __importDefault(require("../routes/auth"));
const refresh_1 = __importDefault(require("../routes/refresh"));
const email_1 = __importDefault(require("../routes/email"));
const connection_1 = __importDefault(require("../db/connection"));
require("../db/relations");
const credentials_1 = __importDefault(require("../middlewares/credentials"));
const corsOptions_1 = __importDefault(require("../middlewares/corsOptions"));
class Server {
    constructor() {
        this.apiPaths = {
            usuarios: '/api/usuarios',
            clientes: '/api/clientes',
            tecnicos: '/api/tecnicos',
            servicios: '/api/servicios',
            pedidos: '/api/pedidos',
            auth: '/api/auth',
            refresh: '/api/refresh',
            email: '/api/email',
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT;
        // this.port = process.env.PORT || '3301';
        // CONECTAR CON LA BASE DE DATOS
        this.dbConnection();
        // DEFINIR MIDDLEWARES
        this.middlewares();
        // DEINFIR RUTAS
        this.routes();
    }
    dbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log('Database online');
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    middlewares() {
        // HANLDE OPTIONS CREDENTIALS BEFORE CORS
        this.app.use(credentials_1.default);
        // CORS
        // this.app.options( '*', cors( corsOptions ) );
        this.app.use((0, cors_1.default)(corsOptions_1.default));
        // LECTURA DEL BODY
        this.app.use(express_1.default.json());
        // COOKIE PARSER
        this.app.use((0, cookie_parser_1.default)());
        // CARPETA PÚBLICA    
        this.app.use(express_1.default.static('public'));
    }
    routes() {
        this.app.use(this.apiPaths.usuarios, usuario_1.default);
        this.app.use(this.apiPaths.clientes, cliente_1.default);
        this.app.use(this.apiPaths.tecnicos, tecnico_1.default);
        this.app.use(this.apiPaths.servicios, servicio_1.default);
        this.app.use(this.apiPaths.pedidos, pedido_1.default);
        this.app.use(this.apiPaths.auth, auth_1.default);
        this.app.use(this.apiPaths.refresh, refresh_1.default);
        this.app.use(this.apiPaths.email, email_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ' + this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map