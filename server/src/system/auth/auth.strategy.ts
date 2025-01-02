import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, Injectable } from '@nestjs/common';

import { AuthService } from './auth.service';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  /**
   * 这里的构造函数向父类传递了授权时必要的参数，在实例化时，父类会得知授权时，客户端的请求必须使用 Authorization 作为请求头，
   * 而这个请求头的内容前缀也必须为 Bearer，在解码授权令牌时，使用秘钥 secretOrKey: 'secretKey' 来将授权令牌解码为创建令牌时的 payload。
   */
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.secretkey'),
    });
  }

  /**
   * validate 메서드는 상위 클래스의 추상적 메서드를 구현합니다. 인증 토큰 복호화에 성공한 후, 즉, 본 요청의 인증 토큰은 만료되지 않았습니다.
   * 이때 복호화된 payload는 매개 변수로 validate 메서드에 전달되는데, 이 메서드는 특정 위임 논리가 필요한데, 예를 들어 여기에서 사용자 이름을 통해 사용자의 존재를 찾는 데 사용했습니다.
   * 사용자가 존재하지 않을 경우 토큰이 잘못되어 위조되었을 수 있음을 의미하며, 이때 UnauthorizedException 승인되지 않은 예외를 선언해야 합니다.
   * 사용자가 존재할 때 user 개체를 req에 추가하고 이후 req 개체에서는 req를 사용할 수 있습니다. user는 현재 로그인한 사용자를 가져옵니다.
   */
  async validate(payload: { id: string }) {
    const user = await this.authService.validateUser(payload);
    // 사용자 정보를 사용하면 토큰이 만료되지 않았음을 의미하며, 없으면 토큰이 만료됩니다.
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
