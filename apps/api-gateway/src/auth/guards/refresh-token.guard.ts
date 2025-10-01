import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// A guarda usa a estratégia que nomeamos como 'jwt-refresh' no passo anterior
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}
