import { Controller, Get, Req, Res, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async RenderIndex(@Req() req: Request, @Res() res: Response) {
    console.log('Index ejs is rendered !!!');
    // res.render('index', {});
  }

  @Get('/signup')
  @Render('signup')
  signup() {
    return;
  }
}
