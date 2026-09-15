import { Controller, Post, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { OnboardBvnDto } from './dto/onboard-bvn.dto';
import { OnboardNinDto } from './dto/onboard-nin.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('onboard/bvn')
  async onboardWithBvn(@Request() req, @Body() onboardBvnDto: OnboardBvnDto) {
    return await this.customersService.onboardWithBvn(req.user.id, onboardBvnDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboard/nin')
  async onboardWithNin(@Request() req, @Body() onboardNinDto: OnboardNinDto) {
    return await this.customersService.onboardWithNin(req.user.id, onboardNinDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.customersService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateCustomerDto: UpdateCustomerDto) {
    return await this.customersService.updateProfile(req.user.id, updateCustomerDto);
  }
}
