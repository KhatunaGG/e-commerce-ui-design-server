import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = await this.getToken(req.headers);
      if (!token) throw new UnauthorizedException();
      const payload = await this.jwtService.verifyAsync(token);
      req.userId = payload.sub;
      req.role = payload.role as Role;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }

  getToken(header: string) {
    if (!header['authorization']) return;
    const [type, token] = header['authorization'].split(' ');
    return type === 'Bearer' ? token : null;
  }
}
