import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, VerificationStatus } from './entities/customer.entity';
import { OnboardBvnDto } from './dto/onboard-bvn.dto';
import { OnboardNinDto } from './dto/onboard-nin.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { NibssService } from '../integrations/nibss/nibss.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    private nibssService: NibssService,
  ) {}

  async onboardWithBvn(userId: string, onboardBvnDto: OnboardBvnDto) {
    const { bvn } = onboardBvnDto;

    // Check if customer already exists
    let customer = await this.customersRepository.findOne({
      where: { userId },
    });

    if (customer && customer.verificationStatus === VerificationStatus.VERIFIED) {
      throw new ConflictException('Customer already verified');
    }

    // Verify BVN with Nibss
    const nibssResponse = await this.nibssService.verifyBvn(bvn);

    if (!nibssResponse.success) {
      throw new BadRequestException('BVN verification failed: ' + nibssResponse.message);
    }

    // Create or update customer
    if (!customer) {
      customer = this.customersRepository.create({
        userId,
        bvn,
        email: nibssResponse.email,
        firstName: nibssResponse.firstName,
        lastName: nibssResponse.lastName,
        verificationStatus: VerificationStatus.VERIFIED,
        nibssVerificationId: nibssResponse.verificationId,
      });
    } else {
      customer.bvn = bvn;
      customer.verificationStatus = VerificationStatus.VERIFIED;
      customer.nibssVerificationId = nibssResponse.verificationId;
    }

    await this.customersRepository.save(customer);

    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      verificationStatus: customer.verificationStatus,
      message: 'BVN verification successful. You can now create an account.',
    };
  }

  async onboardWithNin(userId: string, onboardNinDto: OnboardNinDto) {
    const { nin } = onboardNinDto;

    // Check if customer already exists
    let customer = await this.customersRepository.findOne({
      where: { userId },
    });

    if (customer && customer.verificationStatus === VerificationStatus.VERIFIED) {
      throw new ConflictException('Customer already verified');
    }

    // Verify NIN with Nibss
    const nibssResponse = await this.nibssService.verifyNin(nin);

    if (!nibssResponse.success) {
      throw new BadRequestException('NIN verification failed: ' + nibssResponse.message);
    }

    // Create or update customer
    if (!customer) {
      customer = this.customersRepository.create({
        userId,
        nin,
        email: nibssResponse.email,
        firstName: nibssResponse.firstName,
        lastName: nibssResponse.lastName,
        verificationStatus: VerificationStatus.VERIFIED,
        nibssVerificationId: nibssResponse.verificationId,
      });
    } else {
      customer.nin = nin;
      customer.verificationStatus = VerificationStatus.VERIFIED;
      customer.nibssVerificationId = nibssResponse.verificationId;
    }

    await this.customersRepository.save(customer);

    return {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      verificationStatus: customer.verificationStatus,
      message: 'NIN verification successful. You can now create an account.',
    };
  }

  async getProfile(userId: string) {
    const customer = await this.customersRepository.findOne({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    return customer;
  }

  async updateProfile(userId: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customersRepository.findOne({
      where: { userId },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    Object.assign(customer, updateCustomerDto);
    await this.customersRepository.save(customer);

    return customer;
  }

  async getCustomerByUserId(userId: string) {
    return await this.customersRepository.findOne({
      where: { userId },
    });
  }
}
