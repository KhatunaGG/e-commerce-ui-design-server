import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OrderItem, Purchase } from './schema/purchase.schema';
import { Model } from 'mongoose';
import { ProductService } from 'src/product/product.service';
import { AuthService } from 'src/auth/auth.service';
import { it } from 'node:test';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name) private purchaseService: Model<Purchase>,
    private readonly productsService: ProductService,
    private readonly authService: AuthService,
  ) {}

  // async create(userId, role, createPurchaseDto) {
  //   console.log(userId, 'userId');
  //   console.log(role, 'role');
  //   if (!userId) throw new UnauthorizedException();
  //   try {
  //     const newOrder = await Promise.all(
  //       createPurchaseDto.order.map(async (item) => {
  //         const product = await this.productsService.findById(item._id);
  //         return {
  //           ...item,
  //           filePath: product?.filePath || ""
  //         };
  //       }),
  //     );

  //     const newPurchase = await this.purchaseService.create({
  //     ...createPurchaseDto,
  //     order: newOrder,
  //     userId,
  //   });
  //     console.log(newPurchase, "newPurchase")
  //   return newPurchase;
  //   } catch (e) {
  //     console.log(e);
  //     throw e;
  //   }
  // }

  async create(userId, role, createPurchaseDto) {
    if (!userId) throw new UnauthorizedException();
    try {
      const newOrder = await Promise.all(
        createPurchaseDto.order.map(async (item) => {
          const product = await this.productsService.findById(item._id);
          return {
            ...item,
            filePath: product?.filePath || '',
          };
        }),
      );

      const newPurchase = await this.purchaseService.create({
        ...createPurchaseDto,
        order: newOrder,
        userId,
      });

      if (newPurchase) {
        const updateUsersOrderList = await this.authService.findUserAndUpdate(
          userId,
          newPurchase,
        );
        await Promise.all(
          (newPurchase.order as OrderItem[]).map(async (item) => {
            const product = await this.productsService.findById(item._id);
            if (product.stock < item.purchasedQty) {
              throw new BadRequestException(
                `Insufficient stock for ${product.productName}`,
              );
            }

            const newStock = product.stock - item.purchasedQty;
            await this.productsService.updateProductStock(item._id, newStock);
          }),
        );
      }

      return newPurchase;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // findAll() {
  //   return `This action returns all purchase`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} purchase`;
  // }

  // update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
  //   return `This action updates a #${id} purchase`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} purchase`;
  // }
}
