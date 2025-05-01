export class JwtTokenDto {
    username: string;
    role: string;
    iat: number;
    exp: number;
}