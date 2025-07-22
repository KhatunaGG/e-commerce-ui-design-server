import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { Model, Types } from 'mongoose';
import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productService: Model<Product>,
    private s3Service: AwsS3Service,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      for (const [key, value] of Object.entries(createProductDto)) {
        if (value === undefined || value === null || value === '') {
          throw new Error(`Field '${key}' should not be empty.`);
        }
      }
      const newProduct = await this.productService.create(createProductDto);
      return newProduct;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findNewArrivals() {
    try {
      const allNewArrivals = await this.productService.find({ new: true });
      if (!allNewArrivals.length) return [];

      const updatedProducts = await Promise.all(
        allNewArrivals.map(async (pr) => {
          const url = await this.s3Service.getPresignedUrl(pr.filePath);
          return {
            productName: pr.productName,
            category: pr.category,
            pages: pr.pages,
            components: pr.components,
            new: pr.new,
            discount: pr.discount,
            rate: pr.rate,
            price: pr.price,
            colors: pr.colors,
            reviews: pr.reviews,
            questions: pr.questions,
            stock: pr.stock,
            wishlist: pr.wishlist,
            measurements: pr.measurements,
            details: pr.details,
            discountTill: pr.discountTill,
            presignedUrl: url,
            _id: pr._id,
          };
        }),
      );
      return updatedProducts;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  //before filter snd sort
  // async findAllByQueryParams(queryParams: QueryParamsDto) {
  //   try {
  //     const { take = 12, page = 1 } = queryParams;
  //     if (page <= 0 || take <= 0 || take >= 100) {
  //       throw new BadRequestException('Invalid pagination parameters');
  //     }
  //     const skip = (page - 1) * take;
  //     const allProducts = await this.productService.find();
  //     const products = await this.productService.find().skip(skip).limit(take);
  //     if (!products.length) return [];
  //     const updatedProducts = await Promise.all(
  //       products.map(async (pr) => {
  //         const url = await this.s3Service.getPresignedUrl(pr.filePath);
  //         return {
  //           productName: pr.productName,
  //           category: pr.category,
  //           pages: pr.pages,
  //           components: pr.components,
  //           new: pr.new,
  //           discount: pr.discount,
  //           rate: pr.rate,
  //           price: pr.price,
  //           colors: pr.colors,
  //           reviews: pr.reviews,
  //           questions: pr.questions,
  //           stock: pr.stock,
  //           wishlist: pr.wishlist,
  //           measurements: pr.measurements,
  //           details: pr.details,
  //           discountTill: pr.discountTill,
  //           presignedUrl: url,
  //           _id: pr._id,
  //         };
  //       }),
  //     );
  //     return { data: updatedProducts, productsDataLength: allProducts.length };
  //   } catch (e) {
  //     console.log(e);
  //     throw e;
  //   }
  // }

  async findAllWishList(queryParams: QueryParamsDto) {
    try {
      const { take = 6, page = 1 } = queryParams;

      if (page <= 0 || take <= 0 || take > 100) {
        throw new BadRequestException('Invalid pagination parameters');
      }

      const skip = (page - 1) * take;
      const products = (await this.productService.find()).filter(
        (item) => item.wishlist === true,
      );

      const allProducts = await this.productService
        .find({ wishlist: true })
        .skip(skip)
        .limit(take);
      if (!allProducts.length) return [];
      const updatedProducts = await Promise.all(
        allProducts.map(async (pr) => {
          const url = await this.s3Service.getPresignedUrl(pr.filePath);
          return {
            productName: pr.productName,
            category: pr.category,
            pages: pr.pages,
            components: pr.components,
            new: pr.new,
            discount: pr.discount,
            rate: pr.rate,
            price: pr.price,
            colors: pr.colors,
            reviews: pr.reviews,
            questions: pr.questions,
            stock: pr.stock,
            wishlist: pr.wishlist,
            measurements: pr.measurements,
            details: pr.details,
            discountTill: pr.discountTill,
            presignedUrl: url,
            _id: pr._id,
          };
        }),
      );
      return { data: updatedProducts, productsDataLength: products.length };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async findOne(id: Types.ObjectId | string) {
    if (!id) throw new BadRequestException('Product ID is required');

    try {
      const product = await this.productService.findOne({ _id: id });
      if (!product)
        throw new NotFoundException(`Product with ID ${id} not found`);
      const url = await this.s3Service.getPresignedUrl(product.filePath);
      const newProduct = { ...product.toObject(), presignedUrl: url };
      return newProduct;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async update(
    id: Types.ObjectId | string,
    updateProductDto: UpdateProductDto,
  ) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }

    const existingProduct = await this.productService.findById(id);

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const shouldToggleWishlist =
      updateProductDto.wishlist === undefined ||
      updateProductDto.wishlist === null;

    const updatedWishlistStatus = shouldToggleWishlist
      ? !existingProduct.wishlist
      : updateProductDto.wishlist;

    const updatedProduct = await this.productService.findByIdAndUpdate(
      id,
      {
        ...updateProductDto,
        wishlist: updatedWishlistStatus,
      },
      { new: true },
    );

    console.log(updatedProduct, 'updatedProduct');
    return updatedProduct;
  }

  //AFTER FILTERS and before SORT
  // async findAllByQueryParams(queryParams: QueryParamsDto) {
  //   const query: any = {};
  //   let sort: Record<string, 1 | -1> = {};
  //   const sortValue = queryParams.sortBy?.toLowerCase();
  //   switch (sortValue) {
  //     case 'latest':
  //       sort = { createdAt: -1 };
  //       break;
  //     case 'oldest':
  //       sort = { createdAt: 1 };
  //       break;
  //     case 'a to z':
  //     case 'a-z':
  //       sort = { productName: 1 };
  //       break;
  //     case 'z to a':
  //     case 'z-a':
  //       sort = { productName: -1 };
  //       break;
  //     case 'highest':
  //       sort = { price: -1 };
  //       break;
  //     case 'lowest':
  //       sort = { price: 1 };
  //       break;
  //        default:

  //     break;
  //   }

  //   if (queryParams.category) {
  //     query.category = { $in: [queryParams.category.toLowerCase()] };
  //   }

  //   if (queryParams.priceRange) {
  //     const [min, max] = queryParams.priceRange.split('-').map(Number);
  //     if (max) {
  //       query.price = { $gte: min, $lte: max };
  //     } else {
  //       query.price = { $gte: min };
  //     }
  //   }

  //   try {
  //     const { take = 12, page = 1 } = queryParams;
  //     if (page <= 0 || take <= 0 || take >= 100) {
  //       throw new BadRequestException('Invalid pagination parameters');
  //     }

  //     const skip = (page - 1) * take;
  //     const allProducts = await this.productService.find();
  //     const allFilteredProducts = await this.productService.find(query);
  //     const products = await this.productService
  //       .find(query)
  //       // .collation({ locale: "en", strength: 1 })
  //       .sort(sort)
  //       .skip(skip)
  //       .limit(take);

  //     if (!products.length) return [];

  //     const updatedProducts = await Promise.all(
  //       products.map(async (pr) => {
  //         const url = await this.s3Service.getPresignedUrl(pr.filePath);
  //         return {
  //           productName: pr.productName,
  //           category: pr.category,
  //           pages: pr.pages,
  //           components: pr.components,
  //           new: pr.new,
  //           discount: pr.discount,
  //           rate: pr.rate,
  //           price: pr.price,
  //           colors: pr.colors,
  //           reviews: pr.reviews,
  //           questions: pr.questions,
  //           stock: pr.stock,
  //           wishlist: pr.wishlist,
  //           measurements: pr.measurements,
  //           details: pr.details,
  //           discountTill: pr.discountTill,
  //           presignedUrl: url,
  //           _id: pr._id,
  //         };
  //       }),
  //     );

  //     // return {
  //     //   data: updatedProducts,
  //     //   productsDataLength: allProducts.length,
  //     // };
  //     return {
  //       data: updatedProducts,
  //       productsDataLength: allFilteredProducts.length,
  //       // totalProductsLength: allProducts.length,
  //     };
  //   } catch (e) {
  //     console.log(e);
  //     throw e;
  //   }
  // }


async findAllByQueryParams(queryParams: QueryParamsDto) {
  const query: any = {};
  let sort: Record<string, 1 | -1> = {};
  const sortValue = queryParams.sortBy?.toLowerCase();
  
  switch (sortValue) {
    case 'latest':
      sort = { createdAt: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    case 'a to z':
    case 'a-z':
      sort = { productName: 1 };
      break;
    case 'z to a':
    case 'z-a':
      sort = { productName: -1 };
      break;
    case 'highest':
      sort = { price: -1 };
      break;
    case 'lowest':
      sort = { price: 1 };
      break;
    default:
      break;
  }

  if (queryParams.category) {
    query.category = { $in: [queryParams.category.toLowerCase()] };
  }

  if (queryParams.priceRange) {
    const [min, max] = queryParams.priceRange.split('-').map(Number);
    if (max) {
      query.price = { $gte: min, $lte: max };
    } else {
      query.price = { $gte: min };
    }
  }

  try {
    const { take = 12, page = 1 } = queryParams;
    if (page <= 0 || take <= 0 || take >= 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const skip = (page - 1) * take;
    const allProducts = await this.productService.find();
    const allFilteredProducts = await this.productService.find(query);
    
    let productsQuery = this.productService.find(query);
    

    if (Object.keys(sort).length > 0) {
      if (sort.productName) {
        productsQuery = productsQuery.collation({ locale: "en", strength: 2 });
      }
      productsQuery = productsQuery.sort(sort);
    }
    
    const products = await productsQuery.skip(skip).limit(take);

    if (!products.length) return [];

    const updatedProducts = await Promise.all(
      products.map(async (pr) => {
        const url = await this.s3Service.getPresignedUrl(pr.filePath);
        return {
          productName: pr.productName,
          category: pr.category,
          pages: pr.pages,
          components: pr.components,
          new: pr.new,
          discount: pr.discount,
          rate: pr.rate,
          price: pr.price,
          colors: pr.colors,
          reviews: pr.reviews,
          questions: pr.questions,
          stock: pr.stock,
          wishlist: pr.wishlist,
          measurements: pr.measurements,
          details: pr.details,
          discountTill: pr.discountTill,
          presignedUrl: url,
          _id: pr._id,
        };
      }),
    );

    return {
      data: updatedProducts,
      productsDataLength: allFilteredProducts.length,
      totalProductsLength: allProducts.length,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}


async findById(id: Types.ObjectId | string){
  try{
  return await this.productService.findById(id);
  }catch(e) {
    console.log(e)
    throw e
  }
}



  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
