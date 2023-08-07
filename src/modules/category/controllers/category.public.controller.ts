import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('modules.public.category')
@Controller({ version: '1', path: '/category' })
export class CategoryPublicController {
    // @UserPublicSignUpDoc()
    // @Response('user.signUp')
    // @Transactional()
    // @Post('/sign-up')
    // async signUp(
    //     @Body()
    //     payload: UserSignUpDTO
    // ): Promise<void> {
    //     const { email, mobileNumber, username, ...body } = payload;
    //     const promises: Promise<any>[] = [this.userService.existByEmail(email)];
    //     if (mobileNumber) {
    //         promises.push(this.userService.existByMobileNumber(mobileNumber));
    //     }
    //     if (username) {
    //         promises.push(this.userService.existByUsername(username));
    //     }
    //     const [emailExist, mobileNumberExist, usernameExist] =
    //         await Promise.all(promises);
    //     if (emailExist) {
    //         throw new ConflictException({
    //             statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
    //             message: 'user.error.emailExist',
    //         });
    //     } else if (mobileNumberExist) {
    //         throw new ConflictException({
    //             statusCode:
    //                 ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
    //             message: 'user.error.mobileNumberExist',
    //         });
    //     } else if (usernameExist) {
    //         throw new ConflictException({
    //             statusCode:
    //                 ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
    //             message: 'user.error.usernameExist',
    //         });
    //     }
    //     const password = await this.authService.createPassword(body.password);
    //     const activeKey = randomBytes(32).toString('hex');
    //     await this.userService.create(
    //         {
    //             username,
    //             email,
    //             mobileNumber,
    //             signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
    //             activeKey,
    //             ...body,
    //         },
    //         password
    //     );
    //     const appProtocol = this.configService.get<string>('app.protocol');
    //     const httpHost = this.configService.get<string>('app.http.host');
    //     const httpPort = this.configService.get<string>('app.http.port');
    //     const activationLink = `${appProtocol}://${httpHost}:${httpPort}/confirm-account?username=${payload.username}&key=${payload.activeKey}`;
    //     this.mailService.sendAccountActivation({
    //         activationLink,
    //         name: `${payload.firstName} ${payload.lastName}`,
    //     });
    //     // const result = await this.twilioService.initPhoneNumberVerification(
    //     //     payload.mobileNumber
    //     // );
    //     // console.log(result);
    // }
}
